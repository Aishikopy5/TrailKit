"""
Automated tests for Destination routes, Package routes, Offline Export, and Trip Deletion
"""
from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_destinations_catalog():
    """Verify /api/destinations returns structured atlas with elevation & oxygen %."""
    res = client.get("/api/destinations")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5
    dest_names = [d["name"] for d in data]
    assert any("Ladakh" in name for name in dest_names)
    assert any("Spiti" in name for name in dest_names)

    leh = next(d for d in data if "Ladakh" in d["name"])
    assert leh["elevation_m"] >= 3500
    assert leh["oxygen_level_pct"] < 70.0
    assert len(leh["emergency_contacts"]) > 0


def test_packages_catalog():
    """Verify /api/packages returns trail packages."""
    res = client.get("/api/packages")
    assert res.status_code == 200
    packages = res.json()
    assert len(packages) >= 4
    for p in packages:
        assert "id" in p
        assert "title" in p
        assert "destination" in p
        assert p["duration_days"] > 0
        assert p["estimated_cost_inr"] > 0


def test_export_and_delete_with_idor():
    """Verify offline export and secure deletion with IDOR enforcement."""
    today = date.today()
    payload = {
        "destination": "Spiti Valley",
        "start_date": str(today),
        "end_date": str(today + timedelta(days=4)),
        "travelers": [{"age": 30, "name": "Charlie"}],
        "max_budget": 850.0,
        "budget_currency": "USD",
    }
    owner_token = "token_charlie_123"
    create_res = client.post("/api/plan", json=payload, headers={"X-User-Token": owner_token})
    assert create_res.status_code == 201
    trip_id = create_res.json()["id"]

    # 1. Export offline card
    export_res = client.get(f"/api/trips/{trip_id}/export", headers={"X-User-Token": owner_token})
    assert export_res.status_code == 200
    export_data = export_res.json()
    assert "markdown" in export_data
    assert "SPITI VALLEY" in export_data["markdown"]
    assert "CRITICAL SAFETY RULES" in export_data["markdown"]

    # 2. Bob tries to export Charlie's trip (IDOR)
    bob_export = client.get(f"/api/trips/{trip_id}/export", headers={"X-User-Token": "token_bob"})
    assert bob_export.status_code == 403

    # 3. Bob tries to delete Charlie's trip (IDOR)
    bob_delete = client.delete(f"/api/trips/{trip_id}", headers={"X-User-Token": "token_bob"})
    assert bob_delete.status_code == 403

    # 4. Charlie lists his trips
    list_res = client.get("/api/trips", headers={"X-User-Token": owner_token})
    assert list_res.status_code == 200
    charlie_trips = list_res.json()
    assert any(t["id"] == trip_id for t in charlie_trips)

    # 5. Charlie deletes his trip
    del_res = client.delete(f"/api/trips/{trip_id}", headers={"X-User-Token": owner_token})
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "deleted"

    # 6. Subsequent GET returns 404
    get_res = client.get(f"/api/trips/{trip_id}", headers={"X-User-Token": owner_token})
    assert get_res.status_code == 404
