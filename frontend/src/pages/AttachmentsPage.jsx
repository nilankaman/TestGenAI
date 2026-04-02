import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import s from "./AttachmentsPage.module.css";

const ALLOWED_TYPES = {
  "application/pdf": "pdf",
  "image/png": "image",
  "image/jpeg": "image",
  "image/jpg": "image",
  "image/gif": "image",
  "image/webp": "image",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "excel",
  "application/vnd.ms-excel": "excel",
  "text/csv": "excel",
  "text/plain": "other",
  "application/zip": "other",
  "application/x-zip-compressed": "other",
};

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".xlsx",
  ".xls",
  ".csv",
  ".txt",
  ".zip",
];

const ICON = { pdf: "📄", image: "🖼️", excel: "📊", other: "📎" };

const TYPE_COLOR = {
  pdf: "#f87171",
  image: "#22d3ee",
  excel: "#4ade80",
  other: "#fb923c",
};

const MOCK_FILES = [
  {
    id: 1,
    name: "login-test-report.pdf",
    size: "248 KB",
    type: "pdf",
    date: "2 days ago",
    shared: 3,
  },
  {
    id: 2,
    name: "checkout-screenshot.png",
    size: "1.2 MB",
    type: "image",
    date: "3 days ago",
    shared: 2,
  },
  {
    id: 3,
    name: "regression-results.xlsx",
    size: "96 KB",
    type: "excel",
    date: "1 week ago",
    shared: 5,
  },
];

function formatSize(bytes) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function getType(mimeType, fileName) {
  if (ALLOWED_TYPES[mimeType]) return ALLOWED_TYPES[mimeType];
  const ext = "." + fileName.split(".").pop().toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext)) return "image";
  if ([".xlsx", ".xls", ".csv"].includes(ext)) return "excel";
  if (ext === ".pdf") return "pdf";
  return "other";
}

function isAllowed(file) {
  if (ALLOWED_TYPES[file.type]) return true;
  const ext = "." + file.name.split(".").pop().toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

export default function AttachmentsPage() {
  const [files, setFiles] = useState(MOCK_FILES);
  const [staged, setStaged] = useState([]); // files waiting for review before upload
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("all");
  const inputRef = useRef(null);

  // Stage files for preview — don't upload yet
  function stageFiles(incoming) {
    const valid = [];
    const invalid = [];

    Array.from(incoming).forEach((f) => {
      if (!isAllowed(f)) {
        invalid.push(f.name);
      } else if (f.size > 20 * 1024 * 1024) {
        toast.error(`${f.name} is too large (max 20 MB)`);
      } else {
        valid.push({
          id: Date.now() + Math.random(),
          raw: f,
          name: f.name,
          size: formatSize(f.size),
          type: getType(f.type, f.name),
          preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
        });
      }
    });

    if (invalid.length > 0) {
      toast.error(`Unsupported file type: ${invalid.join(", ")}`);
    }

    if (valid.length > 0) {
      setStaged((prev) => [...prev, ...valid]);
    }
  }

  function removeStagedFile(id) {
    setStaged((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  }

  function clearStaged() {
    staged.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setStaged([]);
  }

  function submitFiles() {
    if (staged.length === 0) {
      toast.error("No files selected to upload.");
      return;
    }

    setUploading(true);

    // Simulate upload — in production this would be a real API call
    setTimeout(() => {
      const uploaded = staged.map((f) => ({
        id: Date.now() + Math.random(),
        name: f.name,
        size: f.size,
        type: f.type,
        date: "Just now",
        shared: 0,
      }));

      setFiles((prev) => [...uploaded, ...prev]);
      clearStaged();
      setUploading(false);
      toast.success(
        `${uploaded.length} file${uploaded.length > 1 ? "s" : ""} uploaded successfully!`,
      );
    }, 1400);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) stageFiles(e.dataTransfer.files);
  }

  function deleteFile(id) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast.success("File removed");
  }

  function shareFile(id) {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, shared: f.shared + 1 } : f)),
    );
    toast.success("Shared with team");
  }

  const filtered =
    filter === "all" ? files : files.filter((f) => f.type === filter);

  return (
    <div className={s.page}>
      <div className={s.header}>
        <h1 className={s.title}>Attachments</h1>
        <p className={s.sub}>
          Upload test reports, screenshots, and evidence files to share with
          your team.
        </p>
      </div>

      {/* Drop zone — staging only, no immediate upload */}
      <div
        className={`${s.dropZone} ${dragging ? s.dropZoneDragging : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_EXTENSIONS.join(",")}
          className={s.hiddenInput}
          onChange={(e) => {
            stageFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className={s.dropIcon}>{dragging ? "📂" : "📤"}</div>
        <p className={s.dropTitle}>
          {dragging ? "Drop to add to queue" : "Drag & drop files here"}
        </p>
        <p className={s.dropSub}>
          PDF, PNG, JPG, XLSX, CSV, TXT, ZIP · max 20 MB each
        </p>
        <button
          className={s.browseBtn}
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          Browse files
        </button>
      </div>

      {/* Staged files preview — shown before upload */}
      {staged.length > 0 && (
        <div className={s.stagingArea}>
          <div className={s.stagingHeader}>
            <div>
              <h3 className={s.stagingTitle}>Ready to upload</h3>
              <p className={s.stagingSub}>
                {staged.length} file{staged.length > 1 ? "s" : ""} queued —
                review before submitting
              </p>
            </div>
            <button className={s.clearBtn} onClick={clearStaged}>
              Clear all
            </button>
          </div>

          <div className={s.stagedList}>
            {staged.map((file) => (
              <div key={file.id} className={s.stagedRow}>
                <div className={s.stagedLeft}>
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className={s.previewThumb}
                    />
                  ) : (
                    <div
                      className={s.stagedIconWrap}
                      style={{
                        background: `${TYPE_COLOR[file.type]}18`,
                        color: TYPE_COLOR[file.type],
                      }}
                    >
                      {ICON[file.type]}
                    </div>
                  )}
                  <div className={s.stagedInfo}>
                    <p className={s.stagedName}>{file.name}</p>
                    <p className={s.stagedMeta}>
                      {file.size} · {file.type}
                    </p>
                  </div>
                </div>
                <button
                  className={s.removeStaged}
                  onClick={() => removeStagedFile(file.id)}
                  title="Remove from queue"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className={s.stagingActions}>
            <button
              className={s.cancelBtn}
              onClick={clearStaged}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              className={s.uploadBtn}
              onClick={submitFiles}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className={s.uploadSpinner} /> Uploading…
                </>
              ) : (
                `Upload ${staged.length} file${staged.length > 1 ? "s" : ""}`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className={s.filters}>
        {["all", "pdf", "image", "excel", "other"].map((f) => (
          <button
            key={f}
            className={`${s.filterBtn} ${filter === f ? s.filterBtnOn : ""}`}
            onClick={() => setFilter(f)}
          >
            {ICON[f] || "📋"} {f.charAt(0).toUpperCase() + f.slice(1)}
            {filter === f && (
              <span className={s.filterCount}>
                {f === "all"
                  ? files.length
                  : files.filter((x) => x.type === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Uploaded file list */}
      {filtered.length === 0 ? (
        <div className={s.empty}>
          <span>📭</span>
          <p>No files here. Upload something above.</p>
        </div>
      ) : (
        <div className={s.fileList}>
          {filtered.map((file) => (
            <div key={file.id} className={s.fileRow}>
              <div
                className={s.fileIcon}
                style={{
                  background: `${TYPE_COLOR[file.type]}18`,
                  color: TYPE_COLOR[file.type],
                }}
              >
                {ICON[file.type]}
              </div>
              <div className={s.fileInfo}>
                <p className={s.fileName}>{file.name}</p>
                <p className={s.fileMeta}>
                  {file.size} · {file.date}
                  {file.shared > 0 ? ` · shared ${file.shared}×` : ""}
                </p>
              </div>
              <div className={s.fileActions}>
                <button
                  className={s.shareFileBtn}
                  onClick={() => shareFile(file.id)}
                >
                  📤 Share
                </button>
                <button className={s.downloadBtn}>⬇ Download</button>
                <button
                  className={s.deleteBtn}
                  onClick={() => deleteFile(file.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
