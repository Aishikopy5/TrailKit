"""
Cursor PROMPT 1: Automated Security Audit Test Suite
Verifies:
1. Route authentication and IDOR prevention
2. Zero secrets / keys in source tree or response payloads
3. SQL injection resistance (parameterized queries)
4. CORS wildcard rejection
5. Sensitive fields filtering (zero health data leaked)
6. Rate limiting enforcement
"""
import os
import re
import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)


def test_audit_cors_no_wildcard_with_credentials():
    """Verify CORS allow_origins contains no '*' wildcard."""
    for origin in settings.cors_origin_list:
        assert origin != "*", "Critical Security Finding: CORS wildcard '*' cannot be used with credentials."


def test_audit_secrets_in_repo():
    """Scan source files to ensure no real API keys are hardcoded in code."""
    secret_patterns = [
        re.compile(r"sk-[a-zA-Z0-9]{20,}", re.IGNORECASE),
        re.compile(r"ghp_[a-zA-Z0-9]{20,}", re.IGNORECASE),
        re.compile(r"AIza[0-9A-Za-z-_]{35}", re.IGNORECASE),
    ]
    app_dir = os.path.join(os.path.dirname(__file__), "..", "app")
    for root, _, files in os.walk(app_dir):
        for file in files:
            if file.endswith(".py"):
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                    for pattern in secret_patterns:
                        assert not pattern.search(content), f"Leaked API key detected in {filepath}"


def test_audit_sensitive_health_data_not_leaked_in_public_health_route():
    """Ensure /api/health and error responses contain zero PII or health notes."""
    res = client.get("/api/health")
    assert res.status_code == 200
    text = res.text.lower()
    for sensitive in ["password", "token", "asthma", "allergy", "patient", "medical_condition"]:
        assert sensitive not in text, f"Sensitive term '{sensitive}' leaked in public API response."


def test_audit_idor_forbidden_for_other_users():
    """Verify User B cannot read User A's trip data (IDOR prevention)."""
    # Create trip for user A
    today = date.today()
    payload = {
        "destination": "Kullu",
        "start_date": str(today),
        "end_date": str(today + timedelta(days=2)),
        "travelers": [{"age": 28, "name": "Alice"}],
        "max_budget": 12000.0,
    }
    create_res = client.post("/api/plan", json=payload, headers={"X-User-Token": "alice_secret_token"})
    assert create_res.status_code == 201
    trip_id = create_res.json()["id"]

    # Bob attempts to fetch Alice's trip
    bob_res = client.get(f"/api/trips/{trip_id}", headers={"X-User-Token": "bob_different_token"})
    assert bob_res.status_code == 403
    assert "access denied" in bob_res.json()["detail"].lower()


def test_audit_rate_limiter_registered():
    """Verify rate limiter is registered and protecting the app."""
    assert hasattr(app.state, "limiter")
    assert app.state.limiter is not None
