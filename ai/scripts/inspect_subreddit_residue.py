"""
One-off inspection: show real examples of rows still matching the
subreddit/source-leakage regex, so we can judge whether it's genuine
leakage or the regex over-triggering on unrelated words (e.g. "sub" inside
"substitute", "subway", "sub-par").

Run this, then READ the output yourself. For the suicide_watch examples:
describe what you see in your own words when reporting back — don't paste
the raw excerpts.
"""
import re
import pandas as pd

SUBREDDIT_RE = re.compile(r"\br/\w+|\bsuicidewatch\b|\bsub(?:reddit)?\b", re.IGNORECASE)


def show_matches(path: str, text_col: str, label: str, n: int = 15):
    df = pd.read_csv(path)
    matches = df[df[text_col].str.contains(SUBREDDIT_RE, regex=True, na=False)]
    print(f"\n=== {label}: {len(matches)} matching rows (showing up to {n}) ===")
    for text in matches[text_col].head(n):
        # Show only a short window around the matched word, not the whole
        # post, to minimize how much raw sensitive text gets printed.
        m = SUBREDDIT_RE.search(text)
        start = max(0, m.start() - 40)
        end = min(len(text), m.end() + 40)
        print(f"  ...{text[start:end]}...")


if __name__ == "__main__":
    show_matches("data/processed/emotions_boltuix/train.csv", "Sentence", "AI-2 emotions")
    show_matches("data/processed/suicide_watch_komati/train.csv", "text", "AI-3 suicide_watch")
