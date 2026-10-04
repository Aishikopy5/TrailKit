/**
 * TrailKit API Client
 * Manages user session tokens for IDOR prevention (S10) and handles robust fallbacks.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || (
  typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8000/api"
    : "/api"
);

// Get or generate persistent random user token (S10)
export function getUserToken() {
  let token = localStorage.getItem("trailkit_user_token");
  if (!token) {
    token = "usr_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem("trailkit_user_token", token);
  }
  return token;
}

export async function createTripPlan(tripData) {
  const token = getUserToken();
  const res = await fetch(`${API_BASE}/plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Token": token,
    },
    body: JSON.stringify(tripData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `Failed to create trip (HTTP ${res.status})`);
  }
  return res.json();
}

export async function getTripPlan(tripId) {
  const token = getUserToken();
  const res = await fetch(`${API_BASE}/trips/${tripId}`, {
    headers: {
      "X-User-Token": token,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to load trip (HTTP ${res.status})`);
  }
  return res.json();
}

export async function toggleChecklistItem(tripId, itemId) {
  const token = getUserToken();
  const res = await fetch(`${API_BASE}/trips/${tripId}/checklist/${itemId}`, {
    method: "PATCH",
    headers: {
      "X-User-Token": token,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to toggle item");
  }
  return res.json();
}

export async function sendChatMessage(tripId, message, history = []) {
  const token = getUserToken();
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trip_id: tripId,
      user_token: token,
      message,
      history,
    }),
  });
  if (!res.ok) {
    throw new Error("Chat request failed");
  }
  return res.json();
}

export async function confirmChatAction(tripId, actionType, itemName, budgetChange) {
  const token = getUserToken();
  const res = await fetch(`${API_BASE}/chat/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trip_id: tripId,
      user_token: token,
      action_type: actionType,
      item_name: itemName,
      budget_change: budgetChange,
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to apply action");
  }
  return res.json();
}

export async function fetchVoiceBriefing(tripId) {
  const token = getUserToken();
  const res = await fetch(`${API_BASE}/voice/briefing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trip_id: tripId,
      user_token: token,
    }),
  });
  if (!res.ok) {
    throw new Error("Voice briefing failed");
  }
  return res.json();
}

export async function fetchDestinations() {
  const res = await fetch(`${API_BASE}/destinations`);
  if (!res.ok) {
    throw new Error("Failed to load destinations atlas");
  }
  return res.json();
}

export async function fetchPackages() {
  const res = await fetch(`${API_BASE}/packages`);
  if (!res.ok) {
    throw new Error("Failed to load expedition packages");
  }
  return res.json();
}

export async function fetchMyTrips(limit = 20, offset = 0) {
  const token = getUserToken();
  const res = await fetch(`${API_BASE}/trips?limit=${limit}&offset=${offset}`, {
    headers: {
      "X-User-Token": token,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to load saved trips");
  }
  return res.json();
}

export async function deleteTrip(tripId) {
  const token = getUserToken();
  const res = await fetch(`${API_BASE}/trips/${tripId}`, {
    method: "DELETE",
    headers: {
      "X-User-Token": token,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete trip");
  }
  return res.json();
}

export async function exportTrip(tripId) {
  const token = getUserToken();
  const res = await fetch(`${API_BASE}/trips/${tripId}/export`, {
    headers: {
      "X-User-Token": token,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to export trip emergency card");
  }
  return res.json();
}
