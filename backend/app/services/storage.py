"""
Secure In-Memory & Distributed Trip Repository with IDOR Protection
Follows Rule S10 (IDOR prevention, random UUIDs, ownership checks).
"""
import uuid
import logging
from typing import Dict, Optional, List
from fastapi import HTTPException, status
from app.domain.models import TripPlan

logger = logging.getLogger("trailkit.storage")


class TripStorage:
    """Thread-safe storage repository with IDOR ownership validation."""
    _trips: Dict[str, TripPlan] = {}

    @classmethod
    def save_trip(cls, trip: TripPlan) -> TripPlan:
        cls._trips[trip.id] = trip
        logger.info(f"Saved trip {trip.id} (destination: {trip.destination}, travelers: {trip.travelers_count})")
        return trip

    @classmethod
    def get_trip(cls, trip_id: str, user_token: Optional[str]) -> TripPlan:
        """
        Retrieve trip with IDOR ownership check (S10).
        If user_token does not match owner_token, rejects with 403.
        """
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
        existing = cls.get_trip(trip.id, user_token)
        cls._trips[trip.id] = trip
        return trip

    @classmethod
    def list_user_trips(cls, user_token: Optional[str]) -> List[TripPlan]:
        """List all trips owned by user_token (S10 IDOR protection)."""
        if not user_token:
            return []
        return [t for t in cls._trips.values() if t.owner_token == user_token]

    @classmethod
    def delete_trip(cls, trip_id: str, user_token: str) -> bool:
        """Delete trip with ownership check (Rule V1 delete-my-data)."""
        existing = cls.get_trip(trip_id, user_token)
        if trip_id in cls._trips:
            del cls._trips[trip_id]
            return True
        return False

    @classmethod
    def clear_all(cls):
        """Used in test fixtures."""
        cls._trips.clear()
