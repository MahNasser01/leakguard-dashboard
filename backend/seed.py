"""Seed script to populate the database with mock data for development.

Run with:
    DISABLE_AUTH=true python seed.py

It will create sample policies, projects, api keys and a few logs.
"""
from database import SessionLocal, engine
import models
import crud
import schemas
from sqlalchemy.orm import Session
import datetime


def seed(db: Session):
    models.Base.metadata.create_all(bind=engine)

    # Policies
    policies = [
        {
            "name": "LeakGuard Default Policy",
            "policy_id": "policy-LeakGuard-default",
            "guardrails": ["prompt-injection", "pii", "topics", "secrets"],
            "sensitivity": "L4",
            "projects": "First Project",
        },
        {
            "name": "Public-facing Application",
            "policy_id": "policy-LeakGuard-public",
            "guardrails": ["prompt-injection", "pii"],
            "sensitivity": "L2",
            "projects": "-",
        },
    ]

    created_policies = []
    for p in policies:
        pc = schemas.PolicyCreate(**p)
        created_policies.append(crud.create_policy(db, pc))

    # Projects
    projects = [
        {
            "name": "First Project",
            "project_id": "project-3043777887",
            "policy": created_policies[0].name,
            "project_metadata": "-",
        }
    ]

    created_projects = []
    for pr in projects:
        proj = schemas.ProjectCreate(**pr)
        created_projects.append(crud.create_project(db, proj))

    # API Keys (link to first project)
    api_key_payload = schemas.ApiKeyCreate(name="First Project Key", project_id=created_projects[0].id)
    created_key = crud.create_api_key(db, api_key_payload)

    # Sample log entry
    log = schemas.LogEntryCreate(
        project=created_projects[0].name,
        threats_detected=["prompt-injection"],
        content="User input containing potential prompt injection",
        policy=created_policies[0].name,
        request_id="req-12345",
        latency=123,
        region="us-east-1",
        log_entry_metadata="{}",
    )
    crud.create_log_entry(db, log)

    print("Seeded DB with:")
    print(f"  policies: {len(created_policies)}")
    print(f"  projects: {len(created_projects)}")
    print(f"  api_key: {created_key.key} (store this safely)")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()
