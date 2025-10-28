from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import crud
from database import engine, get_db
from auth import verify_token

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
