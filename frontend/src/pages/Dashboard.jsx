import InfosysLogo from "../components/InfosysLogo";
import StatusPill from "../components/StatusPill";
import TelemetryPanel from "../components/TelemetryPanel";


export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">

      {/* HEADER */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <InfosysLogo width={140} />
          <h1>Robotics Command Center</h1>
        </div>
        <StatusPill connected={true} />
      </div>

      <div className="dashboard-body">

        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
          <TelemetryPanel title="ROBOT STATUS">
            <div className="metric-medium">ONLINE</div>
            <div className="metric-small">Mode: AUTONOMOUS</div>
          </TelemetryPanel>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dashboard-main">
          {children}
        </main>

      </div>
    </div>
  );
}
