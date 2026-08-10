"""
MindTrack AI Service — entrypoint.

Run locally:
    uvicorn src.main:app --reload --port 8001

Docs (auto-generated from the Pydantic schemas — this IS your live contract
doc for the Node team):
    http://localhost:8001/docs
"""

from fastapi import FastAPI
from src.routes import chat

app = FastAPI(
    title="MindTrack AI Service",
    description="AI/ML inference service for the MindTrack wellness platform. "
                 "Currently running in STUB mode — no real models loaded.",
    version="0.1.0",
)

app.include_router(chat.router)


@app.get("/health")
def health():
    """Basic liveness check — useful once this is deployed / containerized."""
    return {"status": "ok", "mode": "stub"}