import DashboardLayout from "./Dashboard";
import TelemetryPanel from "../components/TelemetryPanel";

export default function Cobot() {
  return (
    <DashboardLayout>
      <TelemetryPanel title="3D ROBOT VIEW">
        <div style={{ height: "1000px" }}>
          <iframe
            src="https://arc-robot-viewer.vercel.app/?robot=mycobot"
            title="COBOT 3D Viewer"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "10px",
            }}
          />
        </div>
      </TelemetryPanel>
    </DashboardLayout>
  );
}
