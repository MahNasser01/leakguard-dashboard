from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ProjectBase(BaseModel):
    name: str
    project_id: str
    policy: str
    project_metadata: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class PolicyBase(BaseModel):
    name: str
    policy_id: str
    guardrails: List[str]
    sensitivity: str
    projects: Optional[str] = None

class PolicyCreate(PolicyBase):
    pass

class Policy(PolicyBase):
    id: str
    last_edited: datetime

    class Config:
        from_attributes = True

class ApiKeyBase(BaseModel):
    name: str
    key: str

class ApiKeyCreate(BaseModel):
    name: str

class ApiKey(ApiKeyBase):
    id: str
    created_at: datetime
    last_used: Optional[datetime] = None

    class Config:
        from_attributes = True

class LogEntryBase(BaseModel):
    project: str
    threats_detected: List[str]
    content: str
    policy: str
    request_id: str
    latency: int
    region: str
    log_entry_metadata: Optional[str] = None

class LogEntryCreate(LogEntryBase):
    pass

class LogEntry(LogEntryBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True
