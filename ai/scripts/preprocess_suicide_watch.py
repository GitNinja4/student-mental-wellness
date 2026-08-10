"""
Phase 3 preprocessing pipeline for AI-3 (suicide_watch_komati dataset).

Extra steps vs. the AI-2 pipeline (see Phase 3 discussion):
    1. Remove Reddit boilerplate ([removed]/[deleted] posts — no signal)
    2. Redact PII (emails, phone numbers, URLs)
    3. Strip source-leakage phrases (subreddit self-references) so the
       model can't "cheat" by detecting the data's origin instead of
       genuine risk signal
    4. Near-duplicate detection (normalized-text based), not just exact match

Pipeline order still matches Section 17:
    Raw -> Validation -> Boilerplate/PII/Leakage filtering -> Deduplication
    -> Train/Val/Test Split -> Save

Usage:
    python scripts/preprocess_suicide_watch.py
"""

import sys
from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from src.preprocessing.text_cleaning import minimal_clean
from src.preprocessing.privacy import (
    redact_pii,
    strip_source_leakage,
    is_boilerplate,
    normalize_for_dedup,
)

RAW_PATH = (
    Path(__file__).resolve().parent.parent
    / "data" / "raw" / "suicide_watch_komati" / "Suicide_Detection.csv"
)
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "data" / "processed" / "suicide_watch_komati"

RANDOM_SEED = 42


def load_and_validate(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    # Drop the unnamed index column from the original CSV — it's not data.
    df = df.drop(columns=[c for c in df.columns if c.startswith("Unnamed")], errors="ignore")

    before = len(df)
    df = df.dropna(subset=["text", "class"])
    df = df[df["text"].str.strip().str.len() > 0]
    after = len(df)
    print(f"Validation: dropped {before - after} rows with missing/empty text or label "
          f"({before} -> {after})")
    return df


def remove_boilerplate(df: pd.DataFrame) -> pd.DataFrame:
    before = len(df)
    df = df[~df["text"].apply(is_boilerplate)]
    after = len(df)
    print(f"Boilerplate removal: dropped {before - after} [removed]/[deleted] rows "
          f"({before} -> {after})")
    return df


def clean_and_filter_text(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["text"] = df["text"].apply(minimal_clean)
    df["text"] = df["text"].apply(redact_pii)
    df["text"] = df["text"].apply(strip_source_leakage)
    df["text"] = df["text"].apply(minimal_clean)  # re-collapse whitespace after redaction

    before = len(df)
    df = df[df["text"].str.len() > 0]
    after = len(df)
    if before != after:
        print(f"Post-clean validation: dropped {before - after} rows that became empty after cleaning")
    return df


def deduplicate(df: pd.DataFrame) -> pd.DataFrame:
    before = len(df)
    df = df.copy()
    df["_dedup_key"] = df["text"].apply(normalize_for_dedup)
    df = df.drop_duplicates(subset=["_dedup_key"])
    df = df.drop(columns=["_dedup_key"])
    after = len(df)
    print(f"Near-duplicate removal: dropped {before - after} rows "
          f"({before} -> {after})")
    return df


def split(df: pd.DataFrame):
    """
    70/15/15 split, stratified by class. Dataset is already near-perfectly
    balanced, but we stratify anyway so filtering steps above (which may
    have removed slightly more of one class than the other) don't quietly
    unbalance the splits.
    """
    train_df, temp_df = train_test_split(
        df, test_size=0.30, stratify=df["class"], random_state=RANDOM_SEED
    )
    val_df, test_df = train_test_split(
        temp_df, test_size=0.50, stratify=temp_df["class"], random_state=RANDOM_SEED
    )
    return train_df, val_df, test_df


def main():
    print(f"Loading raw data from {RAW_PATH}")
    df = load_and_validate(RAW_PATH)
    df = remove_boilerplate(df)
    df = clean_and_filter_text(df)
    df = deduplicate(df)

    train_df, val_df, test_df = split(df)
    print(f"\nSplit sizes: train={len(train_df)}, val={len(val_df)}, test={len(test_df)}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    train_df.to_csv(OUTPUT_DIR / "train.csv", index=False)
    val_df.to_csv(OUTPUT_DIR / "val.csv", index=False)
    test_df.to_csv(OUTPUT_DIR / "test.csv", index=False)
    print(f"Saved processed splits to {OUTPUT_DIR}")

    print("\nClass balance check (train split):")
    print(train_df["class"].value_counts(normalize=True).round(3))


if __name__ == "__main__":
    main()
