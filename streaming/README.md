# ZenStream Publisher

Captures your device webcam and publishes it live to ZenStream via RTMP.  
No OBS or system FFmpeg required — uses a bundled binary.

## Prerequisites

- Node.js v16 or higher
- A webcam connected to the machine

## Setup

```bash
cd streaming
npm install
```

## Run

```bash
npm start
# or
node publisher.js
```

You'll see a progress line like:
```
⏱  00:01:23  |  30 fps  |  1487 kbps
```

Press **Ctrl+C** to stop. The script auto-reconnects if the stream drops.

## Platform Notes

| Platform | Video Device          | Audio Device |
|----------|-----------------------|--------------|
| Linux    | `/dev/video0` (V4L2)  | `default` (ALSA) |
| macOS    | Device index `0` (AVFoundation) | Device index `0` |
| Windows  | `video=Integrated Camera` (DirectShow) | `audio=Microphone` |

> **Windows/macOS**: You may need to edit `videoInput` / `audioInput` near the top of `publisher.js` to match your device names.  
> On Linux, run `v4l2-ctl --list-devices` to list available cameras.

## ZenStream Config (in publisher.js)

```
RTMP_SERVER : rtmp://live-ingest-01.vd0.co:1935/livestream
STREAM_KEY  : 469e21e0...805fe728...
```

## Viewing the Stream

Once the publisher is running, open the **ARC Robotics Dashboard → Go2 → CAMERA FEED** section.  
The live stream is played via ZenStream's HLS endpoint embedded in `CameraFeed.jsx`.
