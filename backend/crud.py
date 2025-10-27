from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
import secrets

def get_projects(db: Session, skip: int = 0, limit: int = 100) -> List[models.Project]:
    return db.query(models.Project).offset(skip).limit(limit).all()

def get_project(db: Session, project_id: str) -> Optional[models.Project]:
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def create_project(db: Session, project: schemas.ProjectCreate) -> models.Project:
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project_id: str, project: schemas.ProjectCreate) -> Optional[models.Project]:
    db_project = get_project(db, project_id)
    if db_project:
        for key, value in project.model_dump().items():
            setattr(db_project, key, value)
        db.commit()
        db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: str) -> bool:
    db_project = get_project(db, project_id)
    if db_project:
        db.delete(db_project)
        db.commit()
        return True
    return False

# Policies CRUD
def get_policies(db: Session, skip: int = 0, limit: int = 100) -> List[models.Policy]:
    return db.query(models.Policy).offset(skip).limit(limit).all()

def get_policy(db: Session, policy_id: str) -> Optional[models.Policy]:
    return db.query(models.Policy).filter(models.Policy.id == policy_id).first()

def create_policy(db: Session, policy: schemas.PolicyCreate) -> models.Policy:
    db_policy = models.Policy(**policy.model_dump())
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def update_policy(db: Session, policy_id: str, policy: schemas.PolicyCreate) -> Optional[models.Policy]:
    db_policy = get_policy(db, policy_id)
    if db_policy:
        for key, value in policy.model_dump().items():
            setattr(db_policy, key, value)
        db.commit()
        db.refresh(db_policy)
    return db_policy

def delete_policy(db: Session, policy_id: str) -> bool:
    db_policy = get_policy(db, policy_id)
    if db_policy:
        db.delete(db_policy)
        db.commit()
        return True
    return False

# API Keys CRUD
def get_api_keys(db: Session, skip: int = 0, limit: int = 100) -> List[models.ApiKey]:
    return db.query(models.ApiKey).offset(skip).limit(limit).all()

def get_api_key(db: Session, key_id: str) -> Optional[models.ApiKey]:
    return db.query(models.ApiKey).filter(models.ApiKey.id == key_id).first()

def create_api_key(db: Session, api_key: schemas.ApiKeyCreate) -> models.ApiKey:
    """Create an API key. Accepts optional project_id to link key to a project."""
    generated_key = f"lk_{secrets.token_urlsafe(32)}"
    db_api_key = models.ApiKey(name=api_key.name, key=generated_key, project_id=getattr(api_key, 'project_id', None))
    db.add(db_api_key)
    db.commit()
    db.refresh(db_api_key)
    return db_api_key

def delete_api_key(db: Session, key_id: str) -> bool:
    db_api_key = get_api_key(db, key_id)
    if db_api_key:
        db.delete(db_api_key)
        db.commit()
        return True
    return False

# Log Entries CRUD
def get_log_entries(db: Session, skip: int = 0, limit: int = 100) -> List[models.LogEntry]:
    return db.query(models.LogEntry).order_by(models.LogEntry.timestamp.desc()).offset(skip).limit(limit).all()

def get_log_entry(db: Session, log_id: str) -> Optional[models.LogEntry]:
    return db.query(models.LogEntry).filter(models.LogEntry.id == log_id).first()

def create_log_entry(db: Session, log_entry: schemas.LogEntryCreate) -> models.LogEntry:
    db_log_entry = models.LogEntry(**log_entry.model_dump())
    db.add(db_log_entry)
    db.commit()
    db.refresh(db_log_entry)
    return db_log_entry
