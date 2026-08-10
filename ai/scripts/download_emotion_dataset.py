"""
Download script for AI-2 (emotion/wellness-state classification) candidate dataset.

Dataset: boltuix/emotions-dataset (Hugging Face)
~131k short texts labeled across 13 emotions.

WHY a script instead of a manual download:
- Reproducible: anyone on the team (or a fresh machine) can regenerate
  data/raw/ from scratch by running this file.
- data/raw/ itself is .gitignore'd (raw third-party data shouldn't live in
  git) — the SCRIPT is what's version controlled, not the data blob.

Usage:
    pip install datasets
    python scripts/download_emotion_dataset.py
"""

from pathlib import Path
from datasets import load_dataset

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "data" / "raw" / "emotions_boltuix"


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Downloading boltuix/emotions-dataset from Hugging Face...")
    dataset = load_dataset("boltuix/emotions-dataset")

    for split_name, split_data in dataset.items():
        out_path = OUTPUT_DIR / f"{split_name}.csv"
        split_data.to_csv(out_path)
        print(f"  Saved split '{split_name}' ({len(split_data)} rows) -> {out_path}")

    print("\nDone. Next: inspect the data (Phase 4 EDA) before using it in preprocessing.")


if __name__ == "__main__":
    main()
