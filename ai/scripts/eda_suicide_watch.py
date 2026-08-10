"""
Phase 4 EDA for AI-3 (suicide_watch_komati), run against the PROCESSED train split.

IMPORTANT: this script prints short excerpts (200 chars) of real posts from
a sensitive dataset directly to your terminal for manual review. That is
expected and necessary for this phase — but do NOT screenshot, copy/paste,
or share this terminal output anywhere outside your own local review
(not in chat, not in a demo, not in a commit message). See the dataset
card's privacy/ethical considerations section.

Usage:
    python scripts/eda_suicide_watch.py
"""

import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from src.preprocessing.eda_utils import length_stats, residue_check, top_words_by_group, print_samples

TRAIN_PATH = Path(__file__).resolve().parent.parent / "data" / "processed" / "suicide_watch_komati" / "train.csv"


def main():
    df = pd.read_csv(TRAIN_PATH)
    val_df = pd.read_csv(TRAIN_PATH.parent / "val.csv")
    test_df = pd.read_csv(TRAIN_PATH.parent / "test.csv")
    full_df = pd.concat([df, val_df, test_df])

    print(f"Loaded {len(df)} train rows ({len(full_df)} total across all splits) from {TRAIN_PATH.parent}\n")

    print("=" * 60)
    print("TEXT LENGTH DISTRIBUTION")
    print("=" * 60)
    length_stats(df, text_col="text", group_col="class")

    print("\n" + "=" * 60)
    print("RESIDUE CHECK — run against ALL splits combined, not just train")
    print("(a leftover pattern could land in val/test and be missed if we only checked train)")
    print("=" * 60)
    email_hits, phone_hits, subreddit_hits = residue_check(full_df, text_col="text")

    print("\n" + "=" * 60)
    print("TOP WORDS PER CLASS (sanity check: does the signal look real?)")
    print("=" * 60)
    top_words_by_group(df, text_col="text", group_col="class", top_n=15)

    print("\n" + "=" * 60)
    print("RANDOM SAMPLES PER CLASS (read these yourself — see privacy note above)")
    print("=" * 60)
    print_samples(df, text_col="text", group_col="class", n=3)

    if subreddit_hits > 0:
        print(f"\n[ACTION NEEDED] {subreddit_hits} rows still contain subreddit/source "
              f"references. Go back to src/preprocessing/privacy.py and inspect what "
              f"pattern is slipping through, then re-run preprocessing.")


if __name__ == "__main__":
    main()
