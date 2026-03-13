import React from "react";

export default function JobCard({ job }) {
  const isCompleted = job.status === "COMPLETED";
  const isProcessing = job.status === "PROCESSING";
  const progress = job.progress || 0;

  return (
    <div className={`job-card ${job.status?.toLowerCase()}`}>
      <div className="job-header">
        <span className="job-type">{job.type?.toUpperCase()}</span>
        <span className={`job-status status-${job.status?.toLowerCase()}`}>
          {job.status}
        </span>
      </div>

      <div className="job-id">{job.job_id}</div>

      {(isProcessing || isCompleted) && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {isCompleted && job.type === "export" && job.download_url && (
        <a href={job.download_url} className="btn btn-download" target="_blank" rel="noreferrer">
          Download ({((job.file_size_bytes || 0) / 1024).toFixed(1)} KB)
        </a>
      )}

      {isCompleted && job.type === "import" && (
        <div className="job-result">
          Records processed: <strong>{job.records_processed}</strong>
        </div>
      )}
    </div>
  );
}
