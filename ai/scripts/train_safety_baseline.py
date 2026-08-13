"""
Phase 5 baseline model for AI-3 (safety classification): TF-IDF + Logistic Regression.

Same pipeline shape as the emotion baseline, but evaluation is different
on purpose: for a safety classifier, the headline metric is NOT accuracy
or even macro F1 — it's RECALL on the "suicide" class specifically. A
missed high-risk case (false negative) is the critical failure mode here
(see Section 20 / Phase 0 safety architecture). We print the full
confusion matrix so false negatives are visible, not hidden inside an
aggregate score.

Usage:
    python scripts/train_safety_baseline.py
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, f1_score, confusion_matrix, recall_score

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "processed" / "suicide_watch_komati"
ARTIFACT_DIR = Path(__file__).resolve().parent.parent / "artifacts" / "safety_baseline" / "v0.1.0"
EXPERIMENT_LOG = Path(__file__).resolve().parent.parent / "experiments" / "safety_baseline_experiments.jsonl"

RANDOM_SEED = 42
POSITIVE_CLASS = "suicide"  # the class where recall matters most


def main():
    train_df = pd.read_csv(DATA_DIR / "train.csv")
    val_df = pd.read_csv(DATA_DIR / "val.csv")
    print(f"Loaded train={len(train_df)} rows, val={len(val_df)} rows")

    vectorizer = TfidfVectorizer(
        max_features=20000,
        ngram_range=(1, 2),
        min_df=2,
    )
    X_train = vectorizer.fit_transform(train_df["text"])
    X_val = vectorizer.transform(val_df["text"])  # transform only, never refit

    y_train = train_df["class"]
    y_val = val_df["class"]

    model = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",  # dataset is ~50/50 already, but keep this
                                   # as a deliberate safety margin, not an assumption
        random_state=RANDOM_SEED,
    )
    print("Training...")
    model.fit(X_train, y_train)

    preds = model.predict(X_val)

    macro_f1 = f1_score(y_val, preds, average="macro")
    suicide_recall = recall_score(y_val, preds, pos_label=POSITIVE_CLASS)
    suicide_precision = classification_report(
        y_val, preds, output_dict=True, zero_division=0
    )[POSITIVE_CLASS]["precision"]

    print(f"\nMacro F1 (val): {macro_f1:.4f}")
    print(f"*** Recall on '{POSITIVE_CLASS}' class (val): {suicide_recall:.4f} — THE key number ***")
    print(f"Precision on '{POSITIVE_CLASS}' class (val): {suicide_precision:.4f}")

    print("\nFull per-class report:")
    print(classification_report(y_val, preds, zero_division=0))

    # Confusion matrix, labeled explicitly so false negatives are unambiguous
    labels = sorted(y_val.unique())
    cm = confusion_matrix(y_val, preds, labels=labels)
    print("Confusion matrix (rows = actual, columns = predicted):")
    print(f"{'':15}" + "".join(f"{l:>15}" for l in labels))
    for i, row_label in enumerate(labels):
        print(f"{row_label:15}" + "".join(f"{cm[i][j]:>15}" for j in range(len(labels))))

    fn_index_actual = labels.index(POSITIVE_CLASS)
    fn_index_pred = labels.index([l for l in labels if l != POSITIVE_CLASS][0])
    false_negatives = cm[fn_index_actual][fn_index_pred]
    print(f"\n*** False negatives (actually '{POSITIVE_CLASS}', predicted otherwise): "
          f"{false_negatives} out of {cm[fn_index_actual].sum()} actual '{POSITIVE_CLASS}' cases ***")

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(vectorizer, ARTIFACT_DIR / "vectorizer.joblib")
    joblib.dump(model, ARTIFACT_DIR / "model.joblib")

    metadata = {
        "model_name": "safety_baseline_tfidf_logreg",
        "version": "v0.1.0",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "dataset": "suicide_watch_komati (Phase 3/4 processed)",
        "train_rows": len(train_df),
        "val_rows": len(val_df),
        "hyperparameters": {
            "vectorizer": "TfidfVectorizer",
            "max_features": 20000,
            "ngram_range": [1, 2],
            "min_df": 2,
            "model": "LogisticRegression",
            "class_weight": "balanced",
            "max_iter": 1000,
        },
        "metrics": {
            "macro_f1_val": round(macro_f1, 4),
            "suicide_recall_val": round(suicide_recall, 4),
            "suicide_precision_val": round(suicide_precision, 4),
            "false_negatives_val": int(false_negatives),
        },
    }
    with open(ARTIFACT_DIR / "metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"\nSaved model artifacts to {ARTIFACT_DIR}")

    EXPERIMENT_LOG.parent.mkdir(parents=True, exist_ok=True)
    with open(EXPERIMENT_LOG, "a") as f:
        f.write(json.dumps(metadata) + "\n")
    print(f"Logged experiment to {EXPERIMENT_LOG}")


if __name__ == "__main__":
    main()
