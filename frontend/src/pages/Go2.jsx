import { useEffect, useState } from "react";
import DashboardLayout from "./Dashboard";

import TelemetryPanel from "../components/TelemetryPanel";
import BatteryPanel from "../components/BatteryPanel";
import MotorHeatmap from "../components/MotorHeatmap";
import IMUPanel from "../components/IMUPanel";
import FootPressurePanel from "../components/FootPressurePanel";
import PressureGauge from "../components/PressureGauge";
import SensorBarChart from "../components/SensorBarChart";
import GaugeImage from "../components/GaugeImage";
import CameraFeed, { ZENSTREAM_HLS_URL } from "../components/CameraFeed";

export default function Go2() {

  const [readings, setReadings] = useState([]);
  const [connected, setConnected] = useState(true);
  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {
    fetch("/pressure_data.json")
      .then(res => res.json())
      .then(data => setReadings(data.readings || []))
      .catch(() => setConnected(false));
  }, []);

  const latestReading =
    readings.length > 0 ? readings[readings.length - 1] : null;

  return (
    <DashboardLayout>

      {/* ROW 1 */}
      <div className="dashboard-grid">
        <TelemetryPanel title="BATTERY SYSTEM">
          <BatteryPanel />
        </TelemetryPanel>

        <TelemetryPanel title="MOTOR TEMPERATURE">
          <MotorHeatmap />
          <div className="metric-small" style={{ marginTop: 50 }}>
            <div className="motor-legend" style={{ gap: 16 }}>
              <span className="dot gray" /> Off
              <span className="dot green" /> Working
              <span className="dot red" /> Hot
            </div>
          </div>
        </TelemetryPanel>
      </div>

      {/* 3D VIEW */}
      <TelemetryPanel title="3D ROBOT VIEW">
        <div style={{ height: "500px" }}>
          <iframe
            src="https://arc-robot-viewer.vercel.app/?robot=go2"
            title="GO2 3D Viewer"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "10px",
            }}
          />
        </div>
      </TelemetryPanel>

      {/* CAMERA VIEW */}
      <TelemetryPanel title="">
        {/* header acting as dropdown toggle */}
        <div
          onClick={() => setCameraOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            color: "var(--accent)",
            marginBottom: "12px",
            fontSize: "13px",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              transform: cameraOpen ? "rotate(90deg)" : "none",
              display: "inline-block",
              transition: "transform 0.2s",
            }}
          >
            ▶
          </span>
          CAMERA FEED
        </div>

        {cameraOpen && (
          <div style={{ height: "500px" }}>
            {/* replace src with actual stream URL when available */}
            <CameraFeed src={ZENSTREAM_HLS_URL} />
          </div>
        )}
      </TelemetryPanel>

      {/* ROW 2 */}
      <div className="dashboard-row-split">
        <div className="left-stack">
          <TelemetryPanel title="IMU STATUS">
            <IMUPanel />
          </TelemetryPanel>

          <TelemetryPanel title="FOOT PRESSURE">
            <FootPressurePanel />
          </TelemetryPanel>
        </div>

        <TelemetryPanel title="PRESSURE MONITOR">
          <PressureGauge latest={latestReading} />
        </TelemetryPanel>
      </div>

      {/* ROW 3 */}
      <div className="dashboard-grid">
        <TelemetryPanel title="HISTORICAL SENSOR DATA">
          <SensorBarChart readings={readings} />
        </TelemetryPanel>

        <TelemetryPanel title="VISUAL FEEDBACK">
          <GaugeImage />
        </TelemetryPanel>
      </div>

    </DashboardLayout>
  );
}
