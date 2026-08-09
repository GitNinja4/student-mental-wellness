# Dataset Card: emotions_boltuix

**Used for:** AI-2 — Emotion / wellness-state classification
**Status:** Candidate (pending EDA verification in Phase 4)

## Source
- Name: `boltuix/emotions-dataset`
- Platform: Hugging Face
- URL: https://huggingface.co/datasets/boltuix/emotions-dataset
- Downloaded via: `ai/scripts/download_emotion_dataset.py`
- Download date: <FILL IN when you actually run it>

## License
- MIT License

## Size
- 131,306 rows, single "train" split

## Labels
- 13 emotion classes: happiness (31205), sadness (17809), neutral (15733),
  anger (13341), love (10512), fear (8795), disgust (8407), confusion (8209),
  surprise (4560), shame (4248), guilt (3470), sarcasm (2534), desire (2483)

## Language
- English (assumed — confirm during EDA, Phase 4)

## Collection methodology
- Per dataset authors: curated collection for emotion classification /
  sentiment analysis / NLP tasks. <FILL IN more detail if the HF dataset
  card specifies exact collection method — scraped, crowdsourced, etc.>

## Mapping to our schema
Our target fields: `emotional_state` (list), and indirectly `stress`,
`anxiety` as severity levels.

This dataset provides **discrete emotion labels**, not severity levels —
so the mapping is NOT 1:1. Plan (to be finalized in Phase 3):
- Map dataset's fine-grained emotions -> our `emotional_state` list values
  (e.g., "fear" -> may contribute to "anxiety" being present)
- Severity (`high`/`moderate`/`low`) is NOT directly derivable from this
  dataset alone — will likely need either (a) treating label presence as
  binary only, or (b) a secondary heuristic/rule, or (c) supplementing
  with data that has severity annotations. Decide in Phase 3, don't guess now.

## Known limitations
- Significant class imbalance: happiness has ~12.5x more examples than
  the smallest class (desire). Will need attention during training
  (e.g. class weighting) in Phase 5/6.

## Privacy considerations
- Not sourced from real identifiable individuals in a sensitive context
  (general emotion-labeled text, not clinical/crisis data) — lower privacy
  risk than the AI-3 safety dataset.
- Still: do not commit raw data files to git. `data/raw/` is gitignored;
  only this card and the download script are version controlled.

## Commercial/academic use
- <FILL IN from license — confirm before assuming either is fine>
