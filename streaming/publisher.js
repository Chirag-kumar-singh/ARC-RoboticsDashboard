/**
 * ZenStream RTMP Publisher
 * Captures the device webcam + mic and streams live to ZenStream.
 *
 * Requires: system ffmpeg with v4l2 + pulse support (/usr/bin/ffmpeg)
 *
 * Usage:
 *   node publisher.js
 *
 * Stop:
 *   Ctrl+C
 */

const ffmpeg = require("fluent-ffmpeg");

// ─── Use system ffmpeg (has v4l2 + alsa/pulse compiled in) ──────────────────
// Do NOT use ffmpeg-static — it is built without v4l2/alsa support on Linux.
ffmpeg.setFfmpegPath("/usr/bin/ffmpeg");

// ─── ZenStream Configuration ─────────────────────────────────────────────────
const RTMP_SERVER = "rtmp://live-ingest-01.vd0.co:1935/livestream";
const STREAM_KEY =
    "3aa77c0c3b8edee3c293c424edcb3dc37f801f2c68df03ab178140a15856fc5328aed0dec7b98c884bf563676ba92627";
const RTMP_URL = `${RTMP_SERVER}/${STREAM_KEY}`;

// ─── Device Configuration (Linux) ────────────────────────────────────────────
// Video: V4L2 webcam — run `v4l2-ctl --list-devices` to confirm your device
const VIDEO_DEVICE = "/dev/video0";

// Audio: PulseAudio source name
// Run `pactl list short sources` to list available sources.
// Use the full source name, e.g. "alsa_input.pci-0000_00_1f.3.analog-stereo"
const AUDIO_DEVICE = "alsa_input.pci-0000_00_1f.3.analog-stereo";
// Set to true to enable microphone. Set to false if you have no mic / don't need audio.
const ENABLE_AUDIO = true;

// ─── Stream Settings ──────────────────────────────────────────────────────────
const VIDEO_BITRATE = "1500k";
const AUDIO_BITRATE = "128k";
const FRAMERATE = 30;
const RESOLUTION = "1280x720";

// ─────────────────────────────────────────────────────────────────────────────

function startStream() {
    console.log("╔══════════════════════════════════════════╗");
    console.log("║       ZenStream RTMP Publisher           ║");
    console.log("╚══════════════════════════════════════════╝");
    console.log(`Video  : ${VIDEO_DEVICE} [v4l2]`);
    console.log(`Audio  : ${ENABLE_AUDIO ? AUDIO_DEVICE + " [pulse]" : "disabled"}`);
    console.log(`Target : ${RTMP_URL}\n`);

    const cmd = ffmpeg();

    // ── Video input (V4L2) ────────────────────────────────────────────────────
    cmd
        .input(VIDEO_DEVICE)
        .inputFormat("v4l2")
        .inputOptions([
            `-framerate ${FRAMERATE}`,
            "-thread_queue_size 512",
            "-use_wallclock_as_timestamps 1"
        ]);

    // ── Audio input (PulseAudio) ──────────────────────────────────────────────
    if (ENABLE_AUDIO) {
        cmd
            .input(AUDIO_DEVICE)
            .inputFormat("pulse")
            .inputOptions(["-ar 44100", "-ac 2"]);
    }

    // ── Video encoding ────────────────────────────────────────────────────────
    cmd
        .videoCodec("libx264")
        .videoBitrate(VIDEO_BITRATE)
        .size(RESOLUTION)
        .fps(FRAMERATE)
        .addOptions([
            "-preset veryfast",
            "-tune zerolatency",
            "-profile:v baseline",
            "-pix_fmt yuv420p",
            `-g ${FRAMERATE * 2}`, // keyframe every 2 seconds
        ]);

    // ── Audio encoding ────────────────────────────────────────────────────────
    if (ENABLE_AUDIO) {
        cmd.audioCodec("aac").audioBitrate(AUDIO_BITRATE).audioFrequency(44100).audioChannels(2);
    } else {
        cmd.noAudio();
    }

    // ── RTMP output ───────────────────────────────────────────────────────────
    cmd
        .outputFormat("flv")
        .output(RTMP_URL)
        // ── Event handlers ───────────────────────────────────────────────────────
        .on("start", (cmdLine) => {
            console.log("▶  Stream started!");
            console.log("   Press Ctrl+C to stop.\n");
            // Uncomment for full ffmpeg command debugging:
            // console.log("CMD:", cmdLine);
        })
        .on("progress", (progress) => {
            const time = progress.timemark || "00:00:00";
            const fps = (progress.currentFps || 0).toFixed(0);
            const kbps = (progress.currentKbps || 0).toFixed(0);
            process.stdout.write(`\r⏱  ${time}  |  ${fps} fps  |  ${kbps} kbps   `);
        })
        .on("error", (err, _stdout, stderr) => {
            console.error("\n\n✕  Stream error:", err.message);
            if (stderr) {
                // Show only the last few lines of stderr for readability
                const lastLines = stderr.trim().split("\n").slice(-6).join("\n");
                console.error("── FFmpeg output ──────────────────────────\n" + lastLines + "\n");
            }
            console.log("↻  Reconnecting in 5 seconds...\n");
            setTimeout(startStream, 5000);
        })
        .on("end", () => {
            console.log("\n⏹  Stream ended. Reconnecting in 5 seconds...");
            setTimeout(startStream, 5000);
        })
        .run();
}

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
process.on("SIGINT", () => {
    console.log("\n\n⏹  Stopped by user. Goodbye!");
    process.exit(0);
});

// ─── Start ────────────────────────────────────────────────────────────────────
startStream();
