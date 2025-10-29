from datetime import datetime, timedelta, timezone
from random import Random
from typing import List


def build_mock_logs(skip: int = 0, limit: int = 100) -> List[dict]:
    rng = Random(1337)
    now = datetime.now(timezone.utc)
    regions = ["us-east-1", "eu-west-1", "ap-south-1"]
    projects = [
        {"name": "Website", "id": "proj_web"},
        {"name": "MobileApp", "id": "proj_mobile"},
        {"name": "Backend", "id": "proj_backend"},
    ]
    policies = ["Default", "Strict", "PII-Guard"]
    threat_pool = [
        "PII",
        "PromptInjection",
        "SecretsLeak",
        "Toxicity",
        "Jailbreak",
    ]
    items: List[dict] = []
    total = min(max(limit, 0), 500)
    start = max(skip, 0)
    count = total
    for i in range(start, start + count):
        ts = now - timedelta(minutes=i)
        project = projects[i % len(projects)]
        policy = policies[i % len(policies)]
        region = regions[i % len(regions)]
        latency = 80 + rng.randint(-30, 120)
        threat_count = 0 if rng.random() < 0.7 else 1 + rng.randint(0, 2)
        threats = [
            threat_pool[(i + j) % len(threat_pool)]
            for j in range(threat_count)
        ]
        content = "User requested operation with parameters id=%d" % (1000 + i)
        req_id = "req_%s_%05d" % (project["id"], i)
        items.append(
            {
                "id": "log_%05d" % i,
                "timestamp": ts,
                "project": project["name"],
                "threats_detected": threats,
                "content": content,
                "policy": policy,
                "request_id": req_id,
                "latency": max(latency, 1),
                "region": region,
                "log_entry_metadata": None,
            }
        )
    return items
