/**
 * TrailKit API Client
 * Manages user session tokens for IDOR prevention (S10) and handles robust fallbacks.
 */

const API_BASE = "http://localhost:8000/api";

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
