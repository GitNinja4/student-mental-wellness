"""
Phase 4 EDA for AI-2 (emotions_boltuix), run against the PROCESSED train split.

This does not transform anything — it's read-only inspection to sanity-check
Phase 3's output before we build on top of it in Phase 5.

Usage:
    python scripts/eda_emotions.py
"""

import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from src.preprocessing.eda_utils import length_stats, residue_check, top_words_by_group, print_samples

TRAIN_PATH = Path(__file__).resolve().parent.parent / "data" / "processed" / "emotions_boltuix" / "train.csv"


def main():
    df = pd.read_csv(TRAIN_PATH)
    print(f"Loaded {len(df)} rows from {TRAIN_PATH}\n")

    print("=" * 60)
    print("TEXT LENGTH DISTRIBUTION")
    print("=" * 60)
    length_stats(df, text_col="Sentence", group_col="Label")

    print("\n" + "=" * 60)
    print("RESIDUE CHECK (should be near-zero — Phase 3 already cleaned this)")
    print("=" * 60)
    residue_check(df, text_col="Sentence")

    print("\n" + "=" * 60)
    print("TOP WORDS PER LABEL (sanity check: does the signal look real?)")
    print("=" * 60)
    top_words_by_group(df, text_col="Sentence", group_col="Label", top_n=15)

    print("\n" + "=" * 60)
    print("RANDOM SAMPLES PER LABEL (read these yourself)")
    print("=" * 60)
    print_samples(df, text_col="Sentence", group_col="Label", n=3)


if __name__ == "__main__":
    main()
