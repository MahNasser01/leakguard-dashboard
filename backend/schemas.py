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
    is_user_added: bool = True

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
    project_id: Optional[str] = None


class ApiKey(ApiKeyBase):
    id: str
    created_at: datetime
    last_used: Optional[datetime] = None
    project_id: Optional[str] = None

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


class GuardResult(BaseModel):
    """Schema for the result of a single threat detection."""
    type: str
    confidence: str
    description: str
    detected: bool
    confidenceValue: int

class GuardRequest(BaseModel):
    """Schema for the input prompt."""
    prompt: str


class AnalyticsPoint(BaseModel):
    time: str
    flagged: int
    unflagged: int


class AnalyticsResponse(BaseModel):
    total_requests: int
    total_threats: int
    detection_rate: float
    timeseries: List[AnalyticsPoint]

