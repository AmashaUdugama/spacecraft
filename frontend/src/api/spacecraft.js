import client from "./client";

export async function registerUser({ email, password, full_name }) {
  const res = await client.post("/api/auth/register", { email, password, full_name });
  return res.data;
}

export async function loginUser({ email, password }) {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);
  const res = await client.post("/api/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data; // { access_token, token_type }
}

export async function getCurrentUser() {
  const res = await client.get("/api/auth/me");
  return res.data;
}

export async function uploadRoomImage({ file, budget, lifestyle, preferred_style }) {
  const formData = new FormData();
  formData.append("file", file);
  if (budget) formData.append("budget", budget);
  if (lifestyle) formData.append("lifestyle", lifestyle);
  if (preferred_style) formData.append("preferred_style", preferred_style);

  const res = await client.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function runPrediction(uploadId) {
  const res = await client.post(`/api/predict/${uploadId}`);
  return res.data;
}

export async function getRecommendations(predictionId) {
  const res = await client.get(`/api/recommend/${predictionId}`);
  return res.data;
}

export async function getHistory() {
  const res = await client.get("/api/dashboard/history");
  return res.data;
}

export async function getSummary() {
  const res = await client.get("/api/dashboard/summary");
  return res.data;
}
