"""
Phase 5 diagnostic: does the safety baseline rely on post LENGTH as a
shortcut instead of genuine content signal?

Hypothesis (from Phase 4 EDA): suicide posts are ~4x longer than
non-suicide posts on average. If the model partly "cheats" using length,
its false negatives (real suicide posts it misses) should skew SHORTER
than correctly-caught suicide posts — because short posts don't trigger
the length shortcut, forcing the model to rely on content it may not
understand as well.

This matters directly for your product: real chat messages will be much
shorter than these Reddit posts, so if false negatives already skew
short, that predicts worse real-world performance than the val score
suggests.

Usage:
    python scripts/inspect_safety_false_negatives.py
"""

import sys
from pathlib import Path

import joblib
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "processed" / "suicide_watch_komati"
ARTIFACT_DIR = Path(__file__).resolve().parent.parent / "artifacts" / "safety_baseline" / "v0.1.0"


def main():
    vectorizer = joblib.load(ARTIFACT_DIR / "vectorizer.joblib")
    model = joblib.load(ARTIFACT_DIR / "model.joblib")

    val_df = pd.read_csv(DATA_DIR / "val.csv")
    X_val = vectorizer.transform(val_df["text"])
    val_df = val_df.copy()
    val_df["pred"] = model.predict(X_val)
    val_df["word_count"] = val_df["text"].str.split().str.len()

    actual_suicide = val_df[val_df["class"] == "suicide"]
    false_negatives = actual_suicide[actual_suicide["pred"] == "non-suicide"]
    true_positives = actual_suicide[actual_suicide["pred"] == "suicide"]

    print(f"Actual 'suicide' rows in val: {len(actual_suicide)}")
    print(f"  Correctly caught (true positives): {len(true_positives)}")
    print(f"  Missed (false negatives): {len(false_negatives)}")

    print(f"\nWord count — CORRECTLY CAUGHT suicide posts: "
          f"median={true_positives['word_count'].median():.0f}, "
          f"mean={true_positives['word_count'].mean():.1f}")

    if len(false_negatives) == 0:
        print("\nNo false negatives in this val set — can't compare length "
              "distributions (nothing to compare against). This is a good "
              "sign on its own, but re-check on the larger real test set in Phase 7.")
        return

    print(f"Word count — MISSED (false negative) suicide posts: "
          f"median={false_negatives['word_count'].median():.0f}, "
          f"mean={false_negatives['word_count'].mean():.1f}")

    median_ratio = true_positives['word_count'].median() / max(false_negatives['word_count'].median(), 1)
    print(f"\nCaught posts are ~{median_ratio:.1f}x longer (median) than missed posts.")
    if median_ratio > 1.5:
        print("=> SUPPORTS the length-shortcut hypothesis: the model is missing "
              "disproportionately SHORT real crisis posts — exactly the length "
              "range closest to real chat messages. Take this seriously for Phase 6/7.")
    else:
        print("=> Does NOT strongly support the length-shortcut hypothesis — "
              "missed posts aren't dramatically shorter than caught ones.")

    # ---- The number that actually matters for your product: recall,
    # computed SEPARATELY for short vs. long posts. The aggregate 92.78%
    # blends both — this splits it apart so we see the truth for the
    # length range closest to real chat messages. ----
    SHORT_THRESHOLD = 50  # words — chosen as "closer to a chat message than an essay"
    short_actual = actual_suicide[actual_suicide["word_count"] <= SHORT_THRESHOLD]
    long_actual = actual_suicide[actual_suicide["word_count"] > SHORT_THRESHOLD]

    short_recall = (short_actual["pred"] == "suicide").mean() if len(short_actual) else float("nan")
    long_recall = (long_actual["pred"] == "suicide").mean() if len(long_actual) else float("nan")

    print(f"\n*** Recall on SHORT suicide posts (<= {SHORT_THRESHOLD} words, n={len(short_actual)}): "
          f"{short_recall:.4f} — closer to your real product's expected input ***")
    print(f"Recall on LONG suicide posts (> {SHORT_THRESHOLD} words, n={len(long_actual)}): {long_recall:.4f}")


if __name__ == "__main__":
    main()
