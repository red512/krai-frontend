const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
const API_KEY = process.env.REACT_APP_API_KEY || "demo-key-change-me";

const headers = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

export async function createExport({ dataset = "default", format = "csv", size_mb = 0.01 } = {}) {
  const res = await fetch(`${API_BASE}/api/v1/exports`, {
    method: "POST",
    headers,
    body: JSON.stringify({ dataset, format, size_mb }),
  });
  return res.json();
}

export async function createImport({ source = "default", dataset = "contacts" } = {}) {
  const res = await fetch(`${API_BASE}/api/v1/imports`, {
    method: "POST",
    headers,
    body: JSON.stringify({ source, dataset }),
  });
  return res.json();
}

export async function getJobStatus(jobId) {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}`, { headers });
  return res.json();
}

export async function getJobResult(jobId) {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}/result`, { headers });
  return res.json();
}
