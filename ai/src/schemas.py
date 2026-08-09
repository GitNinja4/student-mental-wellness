"""
Contract schemas for the MindTrack AI service.

These Pydantic models ARE the API contract between Node and Python.
Changing a field here is a breaking-change decision, not a casual edit —
treat this file like a shared interface, because it is one.
"""

from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


# ---------- /ai/chat ----------

class WellnessSnapshot(BaseModel):
    """Recent wellness check-in data, passed in by Node (not fetched by us)."""
    stress: Optional[int] = Field(None, description="0-10 scale")
    sleep: Optional[int] = Field(None, description="0-10 scale")
    energy: Optional[int] = Field(None, description="0-10 scale")
    anxiety: Optional[int] = Field(None, description="0-10 scale")


class ChatRequest(BaseModel):
    conversation_id: str
    message: str
    # Node assembles this context — Python never queries the DB directly.
    recent_wellness: Optional[WellnessSnapshot] = None
    conversation_history: Optional[list[str]] = Field(
        default_factory=list,
        description="Recent prior turns, most-recent-last. Kept short (Node truncates).",
    )


class SafetyInfo(BaseModel):
    level: str = Field(..., description="'normal' | 'elevated' | 'high_risk'")
    triggered_by: Optional[str] = Field(
        None, description="Which layer flagged it, for debugging/audit. Not shown to user."
    )


class ChatMetadata(BaseModel):
    # Pydantic v2 reserves the "model_" prefix for its own internals
    # (model_dump, model_validate, etc). We WANT the field named
    # model_version because that's the correct domain name, so we
    # explicitly opt out of that protection here rather than rename it.
    model_config = ConfigDict(protected_namespaces=())

    model_version: str
    is_stub: bool = True


class ChatResponse(BaseModel):
    response: str
    safety: SafetyInfo
    metadata: ChatMetadata


# ---------- /ai/analyze-text ----------

class AnalyzeTextRequest(BaseModel):
    text: str


class EmotionalState(BaseModel):
    stress: Optional[str] = None       # "low" | "moderate" | "high"
    anxiety: Optional[str] = None
    sadness: Optional[str] = None


class AnalyzeTextResponse(BaseModel):
    stress: Optional[str] = None
    sleep_concern: bool = False
    academic_pressure: bool = False
    emotional_state: list[str] = Field(default_factory=list)
    metadata: ChatMetadata