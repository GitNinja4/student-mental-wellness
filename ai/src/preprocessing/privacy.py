"""
Privacy redaction + label-leakage filtering utilities.

Split into its own module (separate from text_cleaning.py) because these
are conceptually different concerns:
- text_cleaning.py: makes text easier for a model to learn from
- privacy.py: makes text SAFE to store/use at all, and removes shortcuts
  that would let a model "cheat" instead of learning real signal
"""

import re

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_RE = re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b")
URL_RE = re.compile(r"https?://\S+|www\.\S+")


def redact_pii(text: str) -> str:
    """Replace emails/phone-like numbers/URLs with placeholder tokens."""
    text = EMAIL_RE.sub("[EMAIL]", text)
    text = URL_RE.sub("[URL]", text)
    text = PHONE_RE.sub("[PHONE]", text)
    return text


# Explicit subreddit/source self-references. These would let a model
# "cheat" by detecting the source label instead of genuine risk signal
# (see Phase 3 discussion on label leakage). Matched case-insensitively.
SOURCE_LEAKAGE_PATTERNS = [
    re.compile(r"\br/\s*suicidewatch\b", re.IGNORECASE),
    re.compile(r"\br/\s*depression\b", re.IGNORECASE),
    re.compile(r"\br/\s*teenagers\b", re.IGNORECASE),
    re.compile(r"\bsuicidewatch\b", re.IGNORECASE),
    re.compile(r"\bcross[- ]?post(ed|ing)?\b", re.IGNORECASE),
    re.compile(r"\b(depression|suicide|suicidewatch)\s+sub(reddit)?\b", re.IGNORECASE),
    re.compile(r"\bon\s+this\s+sub(reddit)?\b", re.IGNORECASE),
    re.compile(r"\bthis\s+sub(reddit)?\b", re.IGNORECASE),
]


def strip_source_leakage(text: str) -> str:
    """Remove explicit subreddit self-references that would leak the label."""
    for pattern in SOURCE_LEAKAGE_PATTERNS:
        text = pattern.sub("", text)
    return text


# Reddit boilerplate that carries no real content.
BOILERPLATE_VALUES = {"[removed]", "[deleted]", "removed", "deleted"}


def is_boilerplate(text: str) -> bool:
    return text.strip().lower() in BOILERPLATE_VALUES


def normalize_for_dedup(text: str) -> str:
    """
    Aggressively normalized version of text, used ONLY for near-duplicate
    comparison — never used as the actual training text itself.
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text
