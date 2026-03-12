import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

// ─── ZenStream HLS Playback URL ───────────────────────────────────────────────
// This URL is constructed from the ZenStream stream key.
// If the URL pattern differs, update ZENSTREAM_HLS_URL below.
export const ZENSTREAM_HLS_URL =
  "https://live-play.vd0.co/livestream/3aa77c0c3b8edee3c293c424edcb3dc37f801f2c68df03ab178140a15856fc5328aed0dec7b98c884bf563676ba92627/index.m3u8";
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CameraFeed component
 *
 * Props:
 *   src          {string}  HLS (.m3u8) URL or any video URL. Defaults to ZENSTREAM_HLS_URL.
 *   placeholder  {string}  Message shown when no src is provided.
 */
export default function CameraFeed() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#000" }}>
      <iframe
        src="https://player.vdocipher.com/live-v2?liveId=d4859d07385543fc96de6c5d6361e429"
        style={{
          border: 0,
          width: "100%",
          height: "100%",
          aspectRatio: "16/9",
        }}
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <div style={styles.liveBadge}>
      <span style={styles.liveDot} />
      LIVE
    </div>
  );
}

function Overlay({ children }) {
  return <div style={styles.overlay}>{children}</div>;
}

function Spinner() {
  return (
    <div style={styles.spinnerWrapper}>
      <div style={styles.spinner} />
    </div>
  );
}

function PlaceholderBox({ message }) {
  return (
    <div style={styles.placeholder}>
      <span style={{ fontSize: 40 }}>📷</span>
      <p style={{ color: "#888", fontStyle: "italic", marginTop: 8 }}>
        {message}
      </p>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    background: "#0a0a0a",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 0.4s ease",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    zIndex: 10,
  },
  overlayText: {
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    margin: 0,
  },
  overlaySubText: {
    color: "#aaa",
    fontSize: "12px",
    margin: 0,
    textAlign: "center",
    padding: "0 24px",
  },
  liveBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(0,0,0,0.55)",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    padding: "4px 10px",
    borderRadius: "4px",
    zIndex: 10,
  },
  liveDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#e74c3c",
    display: "inline-block",
    animation: "livePulse 1.4s infinite",
    boxShadow: "0 0 0 0 rgba(231,76,60,0.7)",
  },
  retryBtn: {
    marginTop: "8px",
    padding: "7px 20px",
    background: "var(--accent, #00b4d8)",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
  },
  placeholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  spinnerWrapper: {
    width: "42px",
    height: "42px",
    position: "relative",
  },
  spinner: {
    width: "42px",
    height: "42px",
    border: "3px solid rgba(255,255,255,0.15)",
    borderTop: "3px solid var(--accent, #00b4d8)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

// Inject keyframes once
if (typeof document !== "undefined") {
  const styleId = "camera-feed-keyframes";
  if (!document.getElementById(styleId)) {
    const tag = document.createElement("style");
    tag.id = styleId;
    tag.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes livePulse {
        0%   { box-shadow: 0 0 0 0 rgba(231,76,60,0.7); }
        70%  { box-shadow: 0 0 0 8px rgba(231,76,60,0); }
        100% { box-shadow: 0 0 0 0 rgba(231,76,60,0); }
      }
    `;
    document.head.appendChild(tag);
  }
}
