# Dataset Card: suicide_watch_komati

**Used for:** AI-3 — Safety / risk classification
**Status:** Candidate (pending EDA verification in Phase 4)

## Source
- Name: `nikhileswarkomati/suicide-watch` ("Suicide and Depression Detection")
- Platform: Kaggle
- URL: https://www.kaggle.com/datasets/nikhileswarkomati/suicide-watch
- Downloaded via: `kaggle datasets download -d nikhileswarkomati/suicide-watch`
- Download date: <fill in today's date>

## License
- CC BY-SA 4.0 (Attribution + ShareAlike). Attribution: Nikhileswar Komati,
  "Suicide and Depression Detection," Kaggle. Note: ShareAlike applies to
  redistributing the dataset itself, not to training a private model on it —
  we are not redistributing this data anywhere, so we're clear, but do not
  publish this CSV or a derivative of it publicly without re-checking this.

## Size
- 232,074 rows, 3 columns (`Unnamed: 0` = index, `text`, `class`)
- Perfectly balanced: 116,037 "suicide" / 116,037 "non-suicide"

## Labels
- Binary: `suicide`, `non-suicide`

## Collection methodology
- Posts scraped from the Reddit "SuicideWatch" and "depression" subreddits,
  plus non-suicide posts from r/teenagers, using the Pushshift API.
  Originally published for academic research (Suicide Ideation Detection
  in Social Media Forums).

## Mapping to our schema
Our target: `safety.level` = "normal" | "elevated" | "high_risk"

This dataset is binary (suicide / non-suicide), not 3-class — so mapping
is NOT 1:1:
- "non-suicide" -> maps toward "normal" (though not guaranteed safe —
  needs review, since "non-suicide" just means not from that subreddit,
  not necessarily zero risk)
- "suicide" -> maps toward "high_risk"
- We have NO labeled data yet for "elevated" (a middle tier) — this is a
  real gap to solve in Phase 3, likely via a rule-based heuristic layer
  rather than assuming the classifier alone can produce 3 clean tiers.

## Known limitations
- Domain: Reddit posts, not chat-app or journal-entry text — some
  domain mismatch with MindTrack's actual usage context expected.
- No severity gradation within "suicide" class.
- "non-suicide" class alone is not equivalent to "definitely safe."

## Privacy / ethical considerations
- **IMPORTANT**: This dataset contains real people's authentic posts made
  in genuine moments of crisis, scraped from public subreddits without
  individual consent for this specific downstream use. Not traditionally
  "PII" (no names), but ethically sensitive.
- Used strictly for offline model training/evaluation only.
- Raw text from this dataset must NEVER be reproduced in the product UI,
  demos, logs, slides, or shared outside the training pipeline.
- Kept local only — excluded from git via `ai/data/raw/` gitignore rule.
- Flagged to team/supervisor per Section 16 governance requirement.

## Commercial/academic use
- Permitted under CC BY-SA 4.0 with attribution — fine for this academic
  project.