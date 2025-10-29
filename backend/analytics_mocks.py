from datetime import datetime, timedelta, timezone
from random import Random


def build_mock_response():
    rng = Random(42)
    now = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
    hours = [now - timedelta(hours=i) for i in range(23, -1, -1)]
    series = []
    total_requests = 0
    total_threats = 0
    for h in hours:
        base = 800 + rng.randint(-200, 400)
        flagged = max(0, int(base * (0.02 + (rng.random() * 0.05))))
        unflagged = max(0, base - flagged)
        label = h.strftime("%I%p").lstrip("0")
        point = {"time": label, "flagged": flagged, "unflagged": unflagged}
        series.append(point)
        total_requests += flagged + unflagged
        total_threats += flagged
    ratio = (total_threats / total_requests) if total_requests else 0.0
    detection_rate = round(ratio, 4)
    return {
        "total_requests": total_requests,
        "total_threats": total_threats,
        "detection_rate": detection_rate,
        "timeseries": series,
    }
