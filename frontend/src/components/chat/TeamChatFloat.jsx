import React, { useState, useRef, useEffect } from "react";
import s from "./TeamChatFloat.module.css";

const TEAM = [
  { id: 1, name: "Priya S.", avatar: "👩", color: "#7c6cfa", online: true },
  { id: 2, name: "Ravi K.", avatar: "👨", color: "#22c98a", online: true },
  { id: 3, name: "Marco R.", avatar: "🧑", color: "#f59e0b", online: false },
];

const SEED_MSGS = [
  {
    id: 1,
    from: 1,
    text: "Hey — sprint review in 20 mins!",
    time: "9:01 AM",
    file: null,
  },
  {
    id: 2,
    from: 2,
    text: "On it, finishing the API tests now 🎉",
    time: "9:03 AM",
    file: null,
  },
];

const AUTO_REPLIES = [
  "On it 👍",
  "Agreed, let's discuss in standup.",
  "Good catch. Filing a ticket.",
  "LGTM! Merging now.",
  "Can you share the full report?",
  "Thanks for the update!",
  "Nice one! I'll update the test plan.",
];

const ALLOWED = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".xlsx",
  ".xls",
  ".csv",
];
const FILE_ICON = { pdf: "📄", image: "🖼️", excel: "📊", other: "📎" };

function getFileType(name) {
  if (!name) return "other";
  const ext = "." + name.split(".").pop().toLowerCase();
  if (ext === ".pdf") return "pdf";
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext)) return "image";
  if ([".xlsx", ".xls", ".csv"].includes(ext)) return "excel";
  return "other";
}

function isAllowed(file) {
  const ext = "." + file.name.split(".").pop().toLowerCase();
  return ALLOWED.includes(ext);
}

function formatSize(bytes) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TeamChatFloat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(SEED_MSGS);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(2);
  // staged file — user picked it but hasn't sent yet
  const [staged, setStaged] = useState(null);
  const [fileError, setFileError] = useState("");
  const endRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(
        () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
        60,
      );
    }
  }, [open, msgs]);

  function sendText() {
    const text = input.trim();
    if (!text) return;
    addMsg({ from: 0, text, file: null });
    setInput("");
  }

  function sendStagedFile() {
    if (!staged) return;
    addMsg({ from: 0, text: input.trim() || "", file: staged });
    setInput("");
    clearStaged();
  }

  function addMsg(msg) {
    setMsgs((prev) => [...prev, { id: Date.now(), time: now(), ...msg }]);
    scheduleReply();
  }

  function scheduleReply() {
    const member = TEAM[Math.floor(Math.random() * 2)];
    setTimeout(() => {
      setMsgs((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: member.id,
          text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
          time: now(),
          file: null,
        },
      ]);
    }, 1400);
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setFileError("");

    if (!isAllowed(file)) {
      setFileError(`Unsupported file type. Allowed: ${ALLOWED.join(", ")}`);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setFileError("File is too large (max 20 MB)");
      return;
    }

    const type = getFileType(file.name);
    setStaged({
      name: file.name,
      size: formatSize(file.size),
      type,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    });
  }

  function clearStaged() {
    if (staged?.preview) URL.revokeObjectURL(staged.preview);
    setStaged(null);
    setFileError("");
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (staged) sendStagedFile();
      else sendText();
    }
    if (e.key === "Escape" && staged) clearStaged();
  }

  const canSend = input.trim() || staged;

  return (
    <>
      <button
        className={s.fab}
        onClick={() => setOpen((v) => !v)}
        title="Team Chat"
      >
        👥
        {unread > 0 && !open && <span className={s.badge}>{unread}</span>}
      </button>

      {open && (
        <div className={s.panel}>
          <div className={s.head}>
            <span className={s.headIcon}>👥</span>
            <div>
              <p className={s.headTitle}>Team Chat</p>
              <p className={s.headSub}>
                {TEAM.filter((m) => m.online).length} online
              </p>
            </div>
            <div className={s.avatars}>
              {TEAM.map((m) => (
                <span
                  key={m.id}
                  className={s.teamAvatar}
                  style={{ background: m.color }}
                  title={m.name}
                >
                  {m.avatar}
                  {m.online && <span className={s.onlineDot} />}
                </span>
              ))}
            </div>
            <button className={s.close} onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className={s.msgs}>
            {msgs.map((m) => {
              const isMe = m.from === 0;
              const member = TEAM.find((t) => t.id === m.from);
              return (
                <div key={m.id} className={`${s.row} ${isMe ? s.rowMe : ""}`}>
                  {!isMe && (
                    <span
                      className={s.mAvatar}
                      style={{ background: member?.color }}
                    >
                      {member?.avatar}
                    </span>
                  )}
                  <div
                    className={`${s.bubble} ${isMe ? s.bubbleMe : s.bubbleThem}`}
                  >
                    {!isMe && <p className={s.sender}>{member?.name}</p>}
                    {m.file && (
                      <div className={s.fileAttach}>
                        {m.file.preview ? (
                          <img
                            src={m.file.preview}
                            alt={m.file.name}
                            className={s.fileThumb}
                          />
                        ) : (
                          <span className={s.fileAttachIcon}>
                            {FILE_ICON[m.file.type] || FILE_ICON.other}
                          </span>
                        )}
                        <div className={s.fileAttachInfo}>
                          <p className={s.fileAttachName}>{m.file.name}</p>
                          <p className={s.fileAttachSize}>{m.file.size}</p>
                        </div>
                        <button className={s.fileAttachDown}>⬇</button>
                      </div>
                    )}
                    {m.text && <p className={s.text}>{m.text}</p>}
                    <p className={s.time}>{m.time}</p>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {/* File preview before sending */}
          {staged && (
            <div className={s.stagedFile}>
              <div className={s.stagedFileLeft}>
                {staged.preview ? (
                  <img
                    src={staged.preview}
                    alt={staged.name}
                    className={s.stagedThumb}
                  />
                ) : (
                  <span className={s.stagedFileIcon}>
                    {FILE_ICON[staged.type] || FILE_ICON.other}
                  </span>
                )}
                <div className={s.stagedFileInfo}>
                  <p className={s.stagedFileName}>{staged.name}</p>
                  <p className={s.stagedFileMeta}>{staged.size}</p>
                </div>
              </div>
              <button
                className={s.stagedRemove}
                onClick={clearStaged}
                title="Remove"
              >
                ✕
              </button>
            </div>
          )}

          {fileError && <div className={s.fileError}>{fileError}</div>}

          <div className={s.inputWrap}>
            <input
              ref={fileRef}
              type="file"
              accept={ALLOWED.join(",")}
              style={{ display: "none" }}
              onChange={onFileChange}
            />
            <button
              className={s.attachBtn}
              onClick={() => fileRef.current?.click()}
              title="Attach file"
            >
              📎
            </button>
            <input
              className={s.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={
                staged ? "Add a message (optional)…" : "Message team…"
              }
            />
            <button
              className={`${s.send} ${canSend ? s.sendActive : ""}`}
              onClick={staged ? sendStagedFile : sendText}
              disabled={!canSend}
              title={staged ? "Send file" : "Send message"}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
