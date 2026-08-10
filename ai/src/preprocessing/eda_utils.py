"""
Shared EDA utilities — read-only inspection helpers. Nothing here
transforms data; everything here just measures and reports.
"""

import re
from collections import Counter

import pandas as pd

# Same residue checks as Phase 3's privacy filters, run AGAINST THE OUTPUT
# to verify those filters actually worked, not just trust that they did.
EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_RE = re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b")
SUBREDDIT_RE = re.compile(r"\br/\w+|\bsuicidewatch\b|\bsub(?:reddit)?\b", re.IGNORECASE)

# Minimal stopword list for word-frequency analysis only (NOT used anywhere
# in the actual training pipeline — see Phase 3 note on not stripping
# stopwords for transformer models. This is purely to make EDA output
# readable to a human.)
STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "to",
    "of", "in", "on", "for", "it", "i", "my", "me", "you", "your", "im",
    "this", "that", "with", "at", "as", "be", "have", "has", "had", "not",
    "just", "so", "if", "do", "did", "no", "dont", "im", "its", "am",
}


def length_stats(df: pd.DataFrame, text_col: str, group_col: str = None):
    """Word-count distribution, optionally broken down by class/label."""
    lengths = df[text_col].str.split().str.len()
    print(f"Overall word-count stats: min={lengths.min()}, "
          f"25%={lengths.quantile(.25):.0f}, median={lengths.median():.0f}, "
          f"75%={lengths.quantile(.75):.0f}, max={lengths.max()}, mean={lengths.mean():.1f}")

    if group_col:
        print(f"\nBy {group_col}:")
        for group_val, sub in df.groupby(group_col):
            sub_lengths = sub[text_col].str.split().str.len()
            print(f"  {group_val}: median={sub_lengths.median():.0f}, "
                  f"mean={sub_lengths.mean():.1f}, n={len(sub)}")


def residue_check(df: pd.DataFrame, text_col: str):
    """Check whether Phase 3's PII/leakage filtering actually caught everything."""
    email_hits = df[text_col].str.contains(EMAIL_RE, regex=True, na=False).sum()
    phone_hits = df[text_col].str.contains(PHONE_RE, regex=True, na=False).sum()
    subreddit_hits = df[text_col].str.contains(SUBREDDIT_RE, regex=True, na=False).sum()

    print(f"Residual email-like patterns: {email_hits}")
    print(f"Residual phone-like patterns: {phone_hits} "
          f"(NOTE: this regex is loose and may false-positive on any 3+ digit "
          f"number sequence, e.g. a date or age — inspect examples, don't trust the count alone)")
    print(f"Residual subreddit/source-leakage patterns: {subreddit_hits}")

    return email_hits, phone_hits, subreddit_hits


def top_words_by_group(df: pd.DataFrame, text_col: str, group_col: str, top_n: int = 20):
    """Most common non-stopword tokens per class — helps sanity-check the signal is real."""
    for group_val, sub in df.groupby(group_col):
        words = []
        for text in sub[text_col].dropna():
            tokens = re.findall(r"[a-zA-Z']+", text.lower())
            words.extend(t for t in tokens if t not in STOPWORDS and len(t) > 2)
        counts = Counter(words).most_common(top_n)
        print(f"\nTop words for '{group_val}':")
        print(", ".join(f"{w}({c})" for w, c in counts))


def print_samples(df: pd.DataFrame, text_col: str, group_col: str = None, n: int = 5, seed: int = 42):
    """Print a few random real rows for manual human review."""
    if group_col:
        for group_val, sub in df.groupby(group_col):
            print(f"\n--- Sample rows for '{group_val}' ---")
            for _, row in sub.sample(min(n, len(sub)), random_state=seed).iterrows():
                print(f"  [{row[group_col]}] {row[text_col][:200]}")
    else:
        for _, row in df.sample(min(n, len(df)), random_state=seed).iterrows():
            print(f"  {row[text_col][:200]}")
