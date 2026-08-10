"""
One-off inspection: how much of the 'filler' occurrences are spam padding
vs. genuine use of the word? Run once, read the output, decide whether to
add a filter to preprocess_suicide_watch.py.
"""
import pandas as pd

df = pd.read_csv("data/processed/suicide_watch_komati/train.csv")
filler_rows = df[df["text"].str.contains(r"\bfiller\b", case=False, na=False, regex=True)]

print(f"{len(filler_rows)} rows contain 'filler' out of {len(df)} total\n")

# How many rows are MOSTLY the word filler repeated (i.e. >50% of words are "filler")?
def filler_ratio(text):
    words = text.lower().split()
    if not words:
        return 0
    return sum(1 for w in words if w == "filler") / len(words)

filler_rows = filler_rows.copy()
filler_rows["filler_ratio"] = filler_rows["text"].apply(filler_ratio)

mostly_filler = filler_rows[filler_rows["filler_ratio"] > 0.5]
print(f"Rows that are >50% the literal word 'filler': {len(mostly_filler)}")
print(f"By class:\n{mostly_filler['class'].value_counts()}")
