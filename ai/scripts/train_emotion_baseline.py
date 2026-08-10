"""
Phase 5 baseline model for AI-2 (emotion classification): TF-IDF + Logistic Regression.

Pipeline:
    Load processed train/val (already split in Phase 3 — do NOT re-split here)
    -> Fit TfidfVectorizer on TRAIN TEXT ONLY
    -> Transform val text using that SAME fitted vectorizer (never refit)
    -> Train LogisticRegression on train features
    -> Evaluate on val (test set stays untouched until Phase 7)
    -> Save model + vectorizer + metadata (versioned)

Usage:
    python scripts/train_emotion_baseline.py
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, f1_score

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "processed" / "emotions_boltuix"
ARTIFACT_DIR = Path(__file__).resolve().parent.parent / "artifacts" / "emotion_baseline" / "v0.1.0"
EXPERIMENT_LOG = Path(__file__).resolve().parent.parent / "experiments" / "emotion_baseline_experiments.jsonl"

RANDOM_SEED = 42


def main():
    train_df = pd.read_csv(DATA_DIR / "train.csv")
    val_df = pd.read_csv(DATA_DIR / "val.csv")
    print(f"Loaded train={len(train_df)} rows, val={len(val_df)} rows")

    # ---- Feature extraction: fit ONLY on train, per the Phase 3 leakage rule ----
    vectorizer = TfidfVectorizer(
        max_features=20000,   # cap vocabulary size — keeps model small and fast
        ngram_range=(1, 2),   # unigrams + bigrams (e.g. "not stressed" as one unit
                               # partially recovers some of the word-order info
                               # plain TF-IDF otherwise loses)
        min_df=2,             # ignore words that appear in fewer than 2 documents (likely typos/noise)
    )
    X_train = vectorizer.fit_transform(train_df["Sentence"])
    X_val = vectorizer.transform(val_df["Sentence"])  # transform, NOT fit_transform — critical

    y_train = train_df["Label"]
    y_val = val_df["Label"]

    # ---- Model: class_weight="balanced" directly addresses the class
    # imbalance we found in Phase 4 EDA (happiness 24% vs desire 2%).
    # It automatically up-weights rare classes during training instead of
    # letting the model just learn to always predict "happiness". ----
    model = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        random_state=RANDOM_SEED,
    )
    print("Training...")
    model.fit(X_train, y_train)

    # ---- Evaluation on val (NOT test — test is reserved for Phase 7) ----
    preds = model.predict(X_val)
    macro_f1 = f1_score(y_val, preds, average="macro")
    weighted_f1 = f1_score(y_val, preds, average="weighted")

    print(f"\nMacro F1 (val): {macro_f1:.4f}")
    print(f"Weighted F1 (val): {weighted_f1:.4f}")
    print("\nPer-class report:")
    report = classification_report(y_val, preds, zero_division=0)
    print(report)

    # ---- Save versioned artifacts (Section 22: no random model.pkl files) ----
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(vectorizer, ARTIFACT_DIR / "vectorizer.joblib")
    joblib.dump(model, ARTIFACT_DIR / "model.joblib")

    metadata = {
        "model_name": "emotion_baseline_tfidf_logreg",
        "version": "v0.1.0",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "dataset": "emotions_boltuix (Phase 3/4 processed)",
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
            "weighted_f1_val": round(weighted_f1, 4),
        },
    }
    with open(ARTIFACT_DIR / "metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"\nSaved model artifacts to {ARTIFACT_DIR}")

    # ---- Experiment log (Section 23) — append, don't overwrite, so history accumulates ----
    EXPERIMENT_LOG.parent.mkdir(parents=True, exist_ok=True)
    with open(EXPERIMENT_LOG, "a") as f:
        f.write(json.dumps(metadata) + "\n")
    print(f"Logged experiment to {EXPERIMENT_LOG}")


if __name__ == "__main__":
    main()
