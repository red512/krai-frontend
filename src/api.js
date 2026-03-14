const cfg = window.__CONFIG__ || {};
const API_BASE = cfg.API_URL || "http://localhost:8080";
const API_KEY = cfg.API_KEY || "demo-key-change-me";

function getHeaders(token) {
  const h = { "Content-Type": "application/json" };
  if (token) {
    h["Authorization"] = `Bearer ${token}`;
  } else {
    h["x-api-key"] = API_KEY;
  }
  return h;
}

export async function createExport({ dataset = "default", format = "csv", size_mb = 0.01 } = {}, token) {
  const res = await fetch(`${API_BASE}/api/v1/exports`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ dataset, format, size_mb }),
  });
  return res.json();
}

export async function createImport({ source = "default", dataset = "contacts" } = {}, token) {
  const res = await fetch(`${API_BASE}/api/v1/imports`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ source, dataset }),
  });
  return res.json();
}

export async function getJobStatus(jobId, token) {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}`, { headers: getHeaders(token) });
  return res.json();
}

export async function getJobResult(jobId, token) {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}/result`, { headers: getHeaders(token) });
  return res.json();
}
