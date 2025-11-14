from fastapi import FastAPI, Depends, HTTPException, Header
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import typing

import models
import schemas
import crud
from database import engine, get_db
from auth import verify_token
from analytics_mocks import build_mock_response

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="LeakGuard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "LeakGuard API is running"}


@app.post("/api/guard/run", response_model=List[schemas.GuardResult])
def run_guard_api(
    request: schemas.GuardRequest,
    # current_user: dict = Depends(verify_token) # Commented out for simple playground demo
):
    """
    Receives a prompt and calls the guard check logic from crud.py.
    """
    # Calls the logic function located in crud.py
    results = crud.run_leakguard_check(request.prompt)
    return results


# Public Guard v2 endpoint (API key auth)
@app.post("/v2/guard")
def guard_v2(
    payload: schemas.GuardV2Request,
    authorization: typing.Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.split(" ", 1)[1].strip()
    api_key = crud.get_api_key_by_value(db, token)
    if not api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")

    content_items = [m.content for m in payload.messages if m.role == "user" and m.content]
    content = content_items[0] if content_items else (payload.messages[0].content if payload.messages else "")

    project_name = api_key.project.name if getattr(api_key, "project", None) else "default"
    policy_name = api_key.project.policy if getattr(api_key, "project", None) else "default"
    request_id = str(uuid4())
    latency_ms = 50
    region = "us-east-1"

    log = schemas.LogEntryCreate(
        project=project_name,
        threats_detected=["PII", "PromptInjection", "SecretsLeak", "Toxicity", "Jailbreak"],
        content=content,
        policy=policy_name,
        request_id=request_id,
        latency=latency_ms,
        region=region,
    )
    created = crud.create_log_entry(db, log)
    crud.touch_api_key_last_used(db, api_key)

    return {
        "id": created.id,
        "created_at": created.timestamp,
        "request_id": request_id,
        "threats_detected": created.threats_detected,
    }


# Projects endpoints
@app.get("/api/projects", response_model=List[schemas.Project])
def list_projects(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    return crud.get_projects(db, skip=skip, limit=limit)


@app.get("/api/projects/{project_id}", response_model=schemas.Project)
def get_project(
    project_id: str, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    db_project = crud.get_project(db, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project


@app.post("/api/projects", response_model=schemas.Project)
def create_project(
    project: schemas.ProjectCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    return crud.create_project(db, project)


@app.put("/api/projects/{project_id}", response_model=schemas.Project)
def update_project(
    project_id: str, 
    project: schemas.ProjectCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    db_project = crud.update_project(db, project_id, project)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project


@app.delete("/api/projects/{project_id}")
def delete_project(
    project_id: str, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    if not crud.delete_project(db, project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}


# Policies endpoints
@app.get("/api/policies", response_model=List[schemas.Policy])
def list_policies(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    return crud.get_policies(db, skip=skip, limit=limit)


@app.get("/api/policies/{policy_id}", response_model=schemas.Policy)
def get_policy(
    policy_id: str, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    db_policy = crud.get_policy(db, policy_id)
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy


@app.post("/api/policies", response_model=schemas.Policy)
def create_policy(
    policy: schemas.PolicyCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    return crud.create_policy(db, policy)


@app.put("/api/policies/{policy_id}", response_model=schemas.Policy)
def update_policy(
    policy_id: str, 
    policy: schemas.PolicyCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    db_policy = crud.update_policy(db, policy_id, policy)
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy


@app.delete("/api/policies/{policy_id}")
def delete_policy(
    policy_id: str, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    if not crud.delete_policy(db, policy_id):
        raise HTTPException(status_code=404, detail="Policy not found")
    return {"message": "Policy deleted successfully"}


# API Keys endpoints
@app.get("/api/api-keys", response_model=List[schemas.ApiKey])
def list_api_keys(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    return crud.get_api_keys(db, skip=skip, limit=limit)


@app.post("/api/api-keys", response_model=schemas.ApiKey)
def create_api_key(
    api_key: schemas.ApiKeyCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    return crud.create_api_key(db, api_key)


@app.delete("/api/api-keys/{key_id}")
def delete_api_key(
    key_id: str, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    if not crud.delete_api_key(db, key_id):
        raise HTTPException(status_code=404, detail="API Key not found")
    return {"message": "API Key deleted successfully"}

# Log Entries endpoints
@app.get("/api/logs", response_model=List[schemas.LogEntry])
def list_log_entries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    return crud.get_log_entries(db, skip=skip, limit=limit)


@app.post("/api/logs", response_model=schemas.LogEntry)
def create_log_entry(
    log_entry: schemas.LogEntryCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    return crud.create_log_entry(db, log_entry)

@app.get("/api/analytics", response_model=schemas.AnalyticsResponse)
def get_analytics(
    current_user: dict = Depends(verify_token)
):
    return build_mock_response()


# Proxy endpoints
@app.put("/api/projects/{project_id}/proxy", response_model=schemas.Project)
def update_project_proxy(
    project_id: str,
    proxy_update: schemas.ProjectProxyUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Update proxy settings for a project (admin only)"""
    db_project = crud.update_project_proxy_settings(db, project_id, proxy_update)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project


@app.get("/api/proxy/{slug}", response_model=schemas.Project)
def get_public_proxy(
    slug: str,
    db: Session = Depends(get_db)
):
    """Get public proxy configuration by slug (no auth required)"""
    db_project = crud.get_project_by_slug(db, slug)
    if not db_project:
        raise HTTPException(status_code=404, detail="Proxy not found")
    if not db_project.is_public:
        raise HTTPException(status_code=403, detail="Proxy is not public")
    return db_project


@app.post("/api/proxy/{slug}/chat", response_model=schemas.LLMChatResponse)
def llm_chat(
    slug: str,
    request: schemas.LLMChatRequest,
    db: Session = Depends(get_db)
):
    """Mock LLM chat endpoint (no auth required, but project must be public)"""
    import random
    import uuid
    
    db_project = crud.get_project_by_slug(db, slug)
    if not db_project:
        raise HTTPException(status_code=404, detail="Proxy not found")
    if not db_project.is_public:
        raise HTTPException(status_code=403, detail="Proxy is not public")
    
    # Check if model is supported
    supported_models = db_project.supported_llms or []
    if request.model not in supported_models:
        raise HTTPException(
            status_code=400, 
            detail=f"Model {request.model} is not supported. Supported models: {', '.join(supported_models)}"
        )
    
    # Get the last user message
    user_messages = [msg for msg in request.messages if msg.role == "user"]
    if not user_messages:
        raise HTTPException(status_code=400, detail="No user message found")
    
    user_prompt = user_messages[-1].content
    
    # Generate mock response based on model
    mock_responses = {
        "gpt-4": [
            f"Based on your question about '{user_prompt[:50]}...', I can provide a comprehensive answer. This is a simulated GPT-4 response that demonstrates the capabilities of our platform.",
            f"Here's a thoughtful response to your query: {user_prompt[:30]}... The answer involves multiple considerations and factors that are important to understand.",
            f"As an AI assistant, I understand you're asking about '{user_prompt[:40]}...'. Let me break this down into key points for you."
        ],
        "gpt-3.5-turbo": [
            f"Sure! Regarding '{user_prompt[:50]}...', here's what I think: This is a GPT-3.5 Turbo style response that's concise and helpful.",
            f"I can help with that! Your question about '{user_prompt[:40]}...' is interesting. Here's a straightforward answer.",
            f"Thanks for asking about '{user_prompt[:30]}...'. This is a simulated response from GPT-3.5 Turbo."
        ],
        "gemini-pro": [
            f"Great question about '{user_prompt[:50]}...'! From a Gemini perspective, I'd like to explore this topic with you. Here's my analysis.",
            f"Regarding '{user_prompt[:40]}...', Gemini would approach this differently. Let me share some insights.",
            f"Your query about '{user_prompt[:30]}...' is fascinating. As Gemini, I'd like to provide a multi-faceted response."
        ],
        "claude-3-opus": [
            f"Thank you for your thoughtful question about '{user_prompt[:50]}...'. As Claude, I appreciate the nuance in your inquiry. Here's my perspective.",
            f"Regarding '{user_prompt[:40]}...', I'd like to think through this carefully. Claude's approach emphasizes clarity and thoroughness.",
            f"Your question about '{user_prompt[:30]}...' deserves a comprehensive answer. Let me provide Claude's characteristic detailed response."
        ]
    }
    
    # Get model-specific responses or use default
    model_responses = mock_responses.get(request.model, mock_responses["gpt-4"])
    response_content = random.choice(model_responses)
    
    # Simulate some randomness in token usage
    prompt_tokens = len(user_prompt.split()) * 1.3  # Rough estimate
    completion_tokens = len(response_content.split()) * 1.3
    total_tokens = int(prompt_tokens + completion_tokens)
    
    return {
        "id": f"chatcmpl-{uuid.uuid4().hex[:29]}",
        "model": request.model,
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": response_content
                },
                "finish_reason": "stop"
            }
        ],
        "usage": {
            "prompt_tokens": int(prompt_tokens),
            "completion_tokens": int(completion_tokens),
            "total_tokens": total_tokens
        }
    }
