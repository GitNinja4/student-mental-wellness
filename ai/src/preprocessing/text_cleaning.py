"""
Shared, minimal text-cleaning utilities.

IMPORTANT DESIGN DECISION (see Phase 3 discussion):
These functions are intentionally LIGHT. They fix things that are almost
always noise (weird whitespace, encoding artifacts, URLs), but they do NOT
strip stopwords, punctuation, or lowercase everything by default — because
transformer models (Phase 6) use that information. A separate, heavier
cleaning path for the TF-IDF baseline (Phase 5) will be added later,
explicitly, rather than baked in here as a hidden default.
"""

import re
import unicodedata


def normalize_unicode(text: str) -> str:
    """
    Normalize unicode to a consistent form (NFC).

    Why: text scraped from the web can contain visually-identical characters
    encoded differently (e.g. accented letters as one combined codepoint vs.
    two separate codepoints). Without normalization, a model — or even a
    simple string match — can treat two "identical-looking" words as
    different tokens.
    """
    return unicodedata.normalize("NFC", text)


def strip_urls(text: str) -> str:
    """Remove http(s) URLs. URLs add noise and rarely carry wellness signal."""
    return re.sub(r"https?://\S+|www\.\S+", "", text)


def collapse_whitespace(text: str) -> str:
    """Collapse multiple spaces/tabs/newlines into a single space, then trim."""
    return re.sub(r"\s+", " ", text).strip()


def minimal_clean(text: str) -> str:
    """
    The shared minimal cleaning pipeline. Safe to apply before splitting,
    since none of these steps "learn" anything from the dataset as a whole —
    each row is cleaned independently. This is why doing this before the
    split does NOT cause data leakage (contrast with a fitted vectorizer,
    which DOES need to wait until after the split).
    """
    if not isinstance(text, str):
        return ""
    text = normalize_unicode(text)
    text = strip_urls(text)
    text = collapse_whitespace(text)
    return text
