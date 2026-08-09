# MindTrack AI Service (Stub — v0.1.0)

Status: **STUB mode.** No trained models yet — endpoints return fixed,
correctly-shaped fake responses so the frontend/backend team can integrate
against the real contract today.

## Run it

```bash
cd ai
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8001
```

Then visit `http://localhost:8001/docs` for interactive API docs
(auto-generated from the schemas in `src/schemas.py` — this is the live,
always-accurate contract, treat it as the source of truth over this README).

## Endpoints

### `GET /health`
Liveness check.

### `POST /ai/chat`
Request:
```json
{
  "conversation_id": "abc123",
  "message": "I feel stressed about exams",
  "recent_wellness": {"stress": 8, "sleep": 3, "energy": 4, "anxiety": null},
  "conversation_history": []
}
```
Response:
```json
{
  "response": "...",
  "safety": {"level": "normal", "triggered_by": null},
  "metadata": {"model_version": "stub-0.1.0", "is_stub": true}
}
```

### `POST /ai/analyze-text`
Request:
```json
{"text": "I have been extremely stressed because of exams..."}
```
Response:
```json
{
  "stress": "unknown",
  "sleep_concern": false,
  "academic_pressure": false,
  "emotional_state": ["stub_placeholder"],
  "metadata": {"model_version": "stub-0.1.0", "is_stub": true}
}
```

## Notes for the Node integration

- `recent_wellness` and `conversation_history` are **passed in by Node**,
  not fetched by this service. This service does not touch the database.
- `safety.level` will be one of `"normal" | "elevated" | "high_risk"`. Node
  should be ready to branch on this even though the stub only ever returns
  `"normal"` right now.
- `metadata.is_stub` lets Node (and QA) tell at a glance whether they're
  hitting the real pipeline or the placeholder — useful for not confusing
  "the AI gave a weird answer" with "you're still on the stub."
- This contract may still evolve before Phase 9 (Conversational AI
  architecture) is fully built — treat `/docs` as the thing to re-check,
  not this README.