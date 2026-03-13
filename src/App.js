import React, { useState } from "react";
import { createExport, createImport, getJobStatus, getJobResult } from "./api";
import JobCard from "./JobCard";
import "./App.css";

export default function App() {
  const [jobs, setJobs] = useState([]);

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
        const status = await getJobStatus(jobId);
        updateJob(jobId, status);

        if (status.status === "COMPLETED") {
          clearInterval(poll);
          const result = await getJobResult(jobId);
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
    const data = await createExport({ dataset: "users", format: "csv", size_mb: 0.01 });
    addJob(data);
    pollJob(data.job_id);
  };

  const handleImport = async () => {
    const data = await createImport({ source: "salesforce", dataset: "contacts" });
    addJob(data);
    pollJob(data.job_id);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>krai</h1>
        <p>Export / Import Dashboard</p>
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



