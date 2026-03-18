import DashboardLayout from "./Dashboard";
import TelemetryPanel from "../components/TelemetryPanel";
import G1MotorStatusPanel from "../components/G1MotorStatusPanel";

export default function G1() {
  return (
    <DashboardLayout>

      {/* 3D ROBOT VIEW */}
      <TelemetryPanel title="3D ROBOT VIEW">
        <div style={{ height: "600px" }}>
          <iframe
            src="https://arc-robot-viewer.vercel.app/?robot=g1"
            title="G1 3D Viewer"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "10px",
            }}
          />
        </div>
      </TelemetryPanel>

      {/* MOTOR STATUS */}
      <TelemetryPanel title="MOTOR STATUS">
        <G1MotorStatusPanel />
      </TelemetryPanel>

    </DashboardLayout>
  );
}
