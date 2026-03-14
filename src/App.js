import React, { useState, useEffect, useRef } from "react";
import { createExport, createImport, getJobStatus, getJobResult } from "./api";
import { useAuth } from "./AuthContext";
import JobCard from "./JobCard";
import "./App.css";

export default function App() {
  const { user, logout, oauthEnabled } = useAuth();
  const [jobs, setJobs] = useState([]);
  const signInRef = useRef(null);

  const token = user?.token || null;

  useEffect(() => {
    if (oauthEnabled && !user && signInRef.current && window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(signInRef.current, {
        theme: "outline",
        size: "large",
      });
    }
  }, [oauthEnabled, user]);

  const addJob = (job) => {
    setJobs((prev) => [job, ...prev]);
  };

  const updateJob = (jobId, fields) => {
    setJobs((prev) =>
      prev.map((j) => (j.job_id === jobId ? { ...j, ...fields } : j))
    );
  };

  const pollJob = async (jobId) => {
    const poll = setInterval(async () => {
      try {
        const status = await getJobStatus(jobId, token);
        updateJob(jobId, status);

        if (status.status === "COMPLETED") {
          clearInterval(poll);
          const result = await getJobResult(jobId, token);
          updateJob(jobId, result);
        } else if (status.status === "FAILED") {
          clearInterval(poll);
        }
      } catch {
        clearInterval(poll);
      }
    }, 2000);
  };

  const handleExport = async () => {
    const data = await createExport({ dataset: "users", format: "csv", size_mb: 0.01 }, token);
    addJob(data);
    pollJob(data.job_id);
  };

  const handleImport = async () => {
    const data = await createImport({ source: "salesforce", dataset: "contacts" }, token);
    addJob(data);
    pollJob(data.job_id);
  };

  // If OAuth is enabled but user is not logged in, show sign-in
  if (oauthEnabled && !user) {
    return (
      <div className="app">
        <header className="header">
          <h1>krai</h1>
          <p>Export / Import Dashboard</p>
        </header>
        <div className="actions" style={{ justifyContent: "center" }}>
          <div ref={signInRef}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>krai</h1>
        <p>Export / Import Dashboard</p>
        {user && (
          <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
            <span>{user.email}</span>
            {" "}
            <button onClick={logout} className="btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.8rem" }}>
              Sign out
            </button>
          </div>
        )}
      </header>

      <div className="actions">
        <button onClick={handleExport} className="btn btn-export">
          New Export
        </button>
        <button onClick={handleImport} className="btn btn-import">
          New Import
        </button>
      </div>

      <div className="jobs">
        {jobs.length === 0 && (
          <p className="empty">No jobs yet. Create an export or import to get started.</p>
        )}
        {jobs.map((job) => (
          <JobCard key={job.job_id} job={job} />
        ))}
      </div>
    </div>
  );
}
