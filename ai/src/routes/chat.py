"""
Stub implementations of the conversational AI endpoints.

IMPORTANT: These are placeholders. No model runs here yet. The point of this
file, right now, is that the SHAPE of the response is final, even though the
CONTENT is fake. Node/frontend integration work can start today against this.
"""

from fastapi import APIRouter
from src.schemas import (
    ChatRequest,
    ChatResponse,
    SafetyInfo,
    ChatMetadata,
    AnalyzeTextRequest,
    AnalyzeTextResponse,
)

router = APIRouter(prefix="/ai", tags=["ai"])

STUB_MODEL_VERSION = "stub-0.1.0"


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    """
    Stub conversational endpoint.

    Real version (later phases) will run: safety pre-check -> wellness NLP ->
    context construction -> generation -> safety post-check.
    For now: fixed safe response, always "normal" safety level.
    """
    return ChatResponse(
        response=(
            "This is a placeholder response from the MindTrack AI stub. "
            "Once the real model is integrated, I'll respond based on what "
            f"you actually said: \"{request.message}\""
        ),
        safety=SafetyInfo(level="normal", triggered_by=None),
        metadata=ChatMetadata(model_version=STUB_MODEL_VERSION, is_stub=True),
    )


@router.post("/analyze-text", response_model=AnalyzeTextResponse)
def analyze_text(request: AnalyzeTextRequest) -> AnalyzeTextResponse:
    """
    Stub wellness text-understanding endpoint.

    Real version (Phase 5/6) will use a trained classifier. For now returns
    a fixed, obviously-fake structured output so callers can build against
    the real field names.
    """
    return AnalyzeTextResponse(
        stress="unknown",
        sleep_concern=False,
        academic_pressure=False,
        emotional_state=["stub_placeholder"],
        metadata=ChatMetadata(model_version=STUB_MODEL_VERSION, is_stub=True),
    )