"""
Phase 3 preprocessing pipeline for AI-2 (emotions_boltuix dataset).

Pipeline order (matches Section 17 exactly, and matters — see Phase 3
discussion on data leakage):

    Raw -> Validation -> Deduplication -> Train/Val/Test Split -> Save

Note: "Preprocessing" (the minimal_clean step) is applied to each row
independently BEFORE the split here, which is safe (no leakage) because
it doesn't learn anything from the dataset. Any FUTURE step that learns
from the data (e.g. a fitted TF-IDF vectorizer in Phase 5) must be fit
AFTER this split, on the train file only.

Usage:
    python scripts/preprocess_emotions.py
"""

import sys
from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from src.preprocessing.text_cleaning import minimal_clean

RAW_PATH = Path(__file__).resolve().parent.parent / "data" / "raw" / "emotions_boltuix" / "train.csv"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "data" / "processed" / "emotions_boltuix"

RANDOM_SEED = 42  # fixed seed = reproducible split across runs/teammates


def load_and_validate(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)

    before = len(df)
    # Validation: drop rows with missing/empty text or missing label.
    df = df.dropna(subset=["Sentence", "Label"])
    df = df[df["Sentence"].str.strip().str.len() > 0]
    after = len(df)
    print(f"Validation: dropped {before - after} rows with missing/empty text or label "
          f"({before} -> {after})")

    return df


def deduplicate(df: pd.DataFrame) -> pd.DataFrame:
    before = len(df)
    df = df.drop_duplicates(subset=["Sentence"])
    after = len(df)
    print(f"Deduplication: dropped {before - after} exact-duplicate rows "
          f"({before} -> {after})")
    return df


def clean_text_column(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["Sentence"] = df["Sentence"].apply(minimal_clean)
    # Re-drop anything that became empty after cleaning (e.g. a row that was JUST a URL)
    before = len(df)
    df = df[df["Sentence"].str.len() > 0]
    after = len(df)
    if before != after:
        print(f"Post-clean validation: dropped {before - after} rows that became empty after cleaning")
    return df


def split(df: pd.DataFrame):
    """
    70/15/15 train/val/test split, STRATIFIED by label.

    Stratified = each split gets roughly the same proportion of each
    emotion class as the full dataset. Without this, a random split could
    (by bad luck) put almost none of the rare classes (e.g. "desire",
    only 2483 rows total) into the validation or test set, making those
    metrics meaningless for that class.
    """
    train_df, temp_df = train_test_split(
        df, test_size=0.30, stratify=df["Label"], random_state=RANDOM_SEED
    )
    val_df, test_df = train_test_split(
        temp_df, test_size=0.50, stratify=temp_df["Label"], random_state=RANDOM_SEED
    )
    return train_df, val_df, test_df


def main():
    print(f"Loading raw data from {RAW_PATH}")
    df = load_and_validate(RAW_PATH)
    df = deduplicate(df)
    df = clean_text_column(df)

    train_df, val_df, test_df = split(df)
    print(f"\nSplit sizes: train={len(train_df)}, val={len(val_df)}, test={len(test_df)}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    train_df.to_csv(OUTPUT_DIR / "train.csv", index=False)
    val_df.to_csv(OUTPUT_DIR / "val.csv", index=False)
    test_df.to_csv(OUTPUT_DIR / "test.csv", index=False)
    print(f"Saved processed splits to {OUTPUT_DIR}")

    print("\nLabel distribution check (train split):")
    print(train_df["Label"].value_counts(normalize=True).round(3))


if __name__ == "__main__":
    main()
