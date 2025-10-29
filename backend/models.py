from sqlalchemy import Column, String, DateTime, Integer, Text, JSON, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import uuid

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    project_id = Column(String, unique=True, nullable=False)
    policy = Column(String, nullable=False)
    project_metadata = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    policy_id = Column(String, unique=True, nullable=False)
    guardrails = Column(JSON, nullable=False)
    sensitivity = Column(String, nullable=False)
    projects = Column(String)
    is_user_added = Column(Boolean, nullable=False, default=True)
    last_edited = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    key = Column(String, unique=True, nullable=False)
    # optional link to a Project
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    project = relationship("Project", backref="api_keys")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_used = Column(DateTime(timezone=True), nullable=True)

class LogEntry(Base):
    __tablename__ = "log_entries"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    project = Column(String, nullable=False)
    threats_detected = Column(JSON, nullable=False)
    content = Column(Text, nullable=False)
    policy = Column(String, nullable=False)
    request_id = Column(String, nullable=False)
    latency = Column(Integer, nullable=False)
    region = Column(String, nullable=False)
    log_entry_metadata = Column(String)
