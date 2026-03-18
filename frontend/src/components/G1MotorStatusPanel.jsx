import { useState } from "react";

// G1 joints from g1_29dof.urdf — grouped by body region
// Only actuated/relevant joints (skipping sensor/IMU/logo joints)
const G1_JOINTS = {
    "Left Leg": [
        { id: "left_hip_pitch_joint", label: "Left Hip Pitch" },
        { id: "left_hip_roll_joint", label: "Left Hip Roll" },
        { id: "left_hip_yaw_joint", label: "Left Hip Yaw" },
        { id: "left_knee_joint", label: "Left Knee" },
        { id: "left_ankle_pitch_joint", label: "Left Ankle Pitch" },
        { id: "left_ankle_roll_joint", label: "Left Ankle Roll" },
    ],
    "Right Leg": [
        { id: "right_hip_pitch_joint", label: "Right Hip Pitch" },
        { id: "right_hip_roll_joint", label: "Right Hip Roll" },
        { id: "right_hip_yaw_joint", label: "Right Hip Yaw" },
        { id: "right_knee_joint", label: "Right Knee" },
        { id: "right_ankle_pitch_joint", label: "Right Ankle Pitch" },
        { id: "right_ankle_roll_joint", label: "Right Ankle Roll" },
    ],
    Torso: [
        { id: "waist_yaw_joint", label: "Waist Yaw" },
        { id: "waist_roll_joint", label: "Waist Roll" },
        { id: "waist_pitch_joint", label: "Waist Pitch" },
    ],
    Head: [
        { id: "head_joint", label: "Head" },
    ],
    "Left Arm": [
        { id: "left_shoulder_pitch_joint", label: "Left Shoulder Pitch" },
        { id: "left_shoulder_roll_joint", label: "Left Shoulder Roll" },
        { id: "left_shoulder_yaw_joint", label: "Left Shoulder Yaw" },
        { id: "left_elbow_joint", label: "Left Elbow" },
        { id: "left_wrist_roll_joint", label: "Left Wrist Roll" },
        { id: "left_wrist_pitch_joint", label: "Left Wrist Pitch" },
        { id: "left_wrist_yaw_joint", label: "Left Wrist Yaw" },
    ],
    "Right Arm": [
        { id: "right_shoulder_pitch_joint", label: "Right Shoulder Pitch" },
        { id: "right_shoulder_roll_joint", label: "Right Shoulder Roll" },
        { id: "right_shoulder_yaw_joint", label: "Right Shoulder Yaw" },
        { id: "right_elbow_joint", label: "Right Elbow" },
        { id: "right_wrist_roll_joint", label: "Right Wrist Roll" },
        { id: "right_wrist_pitch_joint", label: "Right Wrist Pitch" },
        { id: "right_wrist_yaw_joint", label: "Right Wrist Yaw" },
    ],
};

// Motor card — go2 style box with temperature placeholder
function MotorCard({ label, temp = 0 }) {
    // Placeholder logic since it's not connected to the database yet
    const isOnline = false;
    const isHot = false;

    let stateColor;
    if (!isOnline) stateColor = "#6b7280"; // Off
    else if (isHot) stateColor = "var(--red)"; // Hot
    else stateColor = "var(--green)"; // Working

    return (
        <div
            style={{
                padding: 10,
                borderRadius: 8,
                background: "#111827",
                border: `1px solid ${stateColor}`,
                textAlign: "center",
                transition: "border-color 0.2s",
            }}
        >
            <div style={{ fontSize: 12, color: "var(--text)", opacity: 0.9 }}>
                {label}
            </div>
            <div style={{ color: stateColor, fontSize: 18, marginTop: 4 }}>
                {isOnline ? temp : "--"}°C
            </div>
        </div>
    );
}

export default function G1MotorStatusPanel({ motorData = {} }) {
    const [expanded, setExpanded] = useState(
        Object.keys(G1_JOINTS).reduce(
            (acc, k) => ({ ...acc, [k]: k === "Left Leg" || k === "Right Leg" }),
            {}
        )
    );

    const toggle = (section) =>
        setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Legend */}
            <div className="motor-legend" style={{ marginTop: 0, marginBottom: 14 }}>
                <span className="dot gray" /> Off
                <span className="dot green" /> Working
                <span className="dot red" /> Hot
            </div>

            {Object.entries(G1_JOINTS).map(([section, joints]) => (
                <div key={section}>
                    {/* Section header */}
                    <h3
                        onClick={() => toggle(section)}
                        style={{
                            color: "var(--accent)",
                            marginBottom: "14px",
                            borderBottom: "1px solid var(--border)",
                            paddingBottom: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            userSelect: "none",
                        }}
                    >
                        <span
                            style={{
                                transform: expanded[section] ? "rotate(90deg)" : "none",
                                display: "inline-block",
                                transition: "transform 0.2s",
                                fontSize: "10px",
                            }}
                        >
                            ▶
                        </span>
                        {section}
                        <span
                            style={{
                                marginLeft: "auto",
                                fontSize: "11px",
                                color: "var(--textdim)",
                                fontWeight: 400,
                                letterSpacing: 0,
                                textTransform: "none",
                            }}
                        >
                            {joints.length} joints
                        </span>
                    </h3>

                    {/* Motor grid */}
                    {expanded[section] && (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                                gap: "12px",
                            }}
                        >
                            {joints.map((joint) => (
                                <MotorCard
                                    key={joint.id}
                                    label={joint.label}
                                    position={motorData[joint.id]}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
