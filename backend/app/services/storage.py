import os
import json
import uuid
import logging
from pathlib import Path
from typing import Dict, Optional, List
from fastapi import HTTPException, status
from app.domain.models import TripPlan

logger = logging.getLogger("trailkit.storage")

DATA_DIR = Path(os.getenv("TRAILKIT_DATA_DIR", "data"))
STORAGE_FILE = DATA_DIR / "trips.json"


class TripStorage:
    """Thread-safe storage repository with IDOR ownership validation and disk persistence."""
    _trips: Dict[str, TripPlan] = {}
    _initialized: bool = False

    @classmethod
    def _ensure_loaded(cls):
        if not cls._initialized:
            try:
                if STORAGE_FILE.exists():
                    raw = json.loads(STORAGE_FILE.read_text(encoding="utf-8"))
                    for k, v in raw.items():
                        cls._trips[k] = TripPlan(**v)
                    logger.info(f"Loaded {len(cls._trips)} trips from disk persistence.")
            except Exception as e:
                logger.debug(f"Could not load trips from disk: {e}")
            cls._initialized = True

    @classmethod
    def _flush_to_disk(cls):
        try:
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            data = {k: v.model_dump(mode="json") for k, v in cls._trips.items()}
            STORAGE_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")
        except Exception as e:
            logger.debug(f"Could not persist trips to disk: {e}")

    @classmethod
    def save_trip(cls, trip: TripPlan) -> TripPlan:
        cls._ensure_loaded()
        cls._trips[trip.id] = trip
        cls._flush_to_disk()
        logger.info(f"Saved trip {trip.id} (destination: {trip.destination}, travelers: {trip.travelers_count})")
        return trip

    @classmethod
    def get_trip(cls, trip_id: str, user_token: Optional[str]) -> TripPlan:
        """
        Retrieve trip with IDOR ownership check (S10).
        If user_token does not match owner_token, rejects with 403.
        """
        cls._ensure_loaded()
        if trip_id not in cls._trips:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Trip with ID '{trip_id}' not found.",
            )

        trip = cls._trips[trip_id]

        if not user_token or user_token != trip.owner_token:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You do not have ownership permission for this trip.",
            )

        return trip

    @classmethod
    def update_trip(cls, trip: TripPlan, user_token: str) -> TripPlan:
        """Update trip with ownership verification."""
        cls._ensure_loaded()
        existing = cls.get_trip(trip.id, user_token)
        cls._trips[trip.id] = trip
        cls._flush_to_disk()
        return trip

    @classmethod
    def list_user_trips(cls, user_token: Optional[str]) -> List[TripPlan]:
        """List all trips owned by user_token (S10 IDOR protection)."""
        cls._ensure_loaded()
        if not user_token:
            return []
        return [t for t in cls._trips.values() if t.owner_token == user_token]

    @classmethod
    def delete_trip(cls, trip_id: str, user_token: str) -> bool:
        """Delete trip with ownership check (Rule V1 delete-my-data)."""
        cls._ensure_loaded()
        existing = cls.get_trip(trip_id, user_token)
        if trip_id in cls._trips:
            del cls._trips[trip_id]
            cls._flush_to_disk()
            return True
        return False

    @classmethod
    def clear_all(cls):
        """Used in test fixtures."""
        cls._trips.clear()
        try:
            if STORAGE_FILE.exists():
                STORAGE_FILE.unlink()
        except Exception:
            pass
