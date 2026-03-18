import { useState } from "react";

// Gini joints — grouped by body region with readable labels
const GINI_JOINTS = {
  Head: [
    { id: "i01.head.rothead_link_joint", label: "Head Rotate" },
    { id: "i01.head.rollNeck_link_joint", label: "Neck Roll" },
    { id: "i01.head.neck.001_link_joint", label: "Neck Pitch" },
    { id: "i01.head.jaw_link_joint", label: "Jaw" },
    { id: "i01.head.eyeLeft_link_joint", label: "Eye Left" },
    { id: "i01.head.eyeLeft.001_link_joint", label: "Eye Left (2)" },
    { id: "i01.head.eyeRight_link_joint", label: "Eye Right" },
    { id: "i01.head.eyeRight.001_link_joint", label: "Eye Right (2)" },
  ],
  Torso: [
    { id: "i01.torso.midStom_link_joint", label: "Mid Stomach" },
    { id: "i01.torso.topStom_link_joint", label: "Top Stomach" },
  ],
  "Left Arm": [
    { id: "left_shoulder_y_link_joint", label: "Left Shoulder Pitch" },
    { id: "left_shoulder_x_link_joint", label: "Left Shoulder Roll" },
    { id: "left_shoulder_z_link_joint", label: "Left Shoulder Yaw" },
    { id: "left_elbow_x_link_joint", label: "Left Elbow" },
    { id: "left_wrist_z_link_joint", label: "Left Wrist" },
  ],
  "Right Arm": [
    { id: "right_shoulder_y_link_joint", label: "Right Shoulder Pitch" },
    { id: "right_shoulder_x_link_joint", label: "Right Shoulder Roll" },
    { id: "right_shoulder_z_link_joint", label: "Right Shoulder Yaw" },
    { id: "right_elbow_x_link_joint", label: "Right Elbow" },
    { id: "right_wrist_z_link_joint", label: "Right Wrist" },
  ],
  "Left Hand": [
    { id: "i01.leftHand.thumb_link_joint", label: "L Thumb Base" },
    { id: "i01.leftHand.thumb1_link_joint", label: "L Thumb Mid" },
    { id: "i01.leftHand.thumb3_link_joint", label: "L Thumb Tip" },
    { id: "i01.leftHand.index_link_joint", label: "L Index Base" },
    { id: "i01.leftHand.index2_link_joint", label: "L Index Mid" },
    { id: "i01.leftHand.index3_link_joint", label: "L Index Tip" },
    { id: "i01.leftHand.majeure_link_joint", label: "L Middle Base" },
    { id: "i01.leftHand.majeure2_link_joint", label: "L Middle Mid" },
    { id: "i01.leftHand.majeure3_link_joint", label: "L Middle Tip" },
    { id: "i01.leftHand.ringFinger_link_joint", label: "L Ring Base" },
    { id: "i01.leftHand.ringfinger0_link_joint", label: "L Ring Knuckle" },
    { id: "i01.leftHand.ringfinger2_link_joint", label: "L Ring Mid" },
    { id: "i01.leftHand.ringfinger3_link_joint", label: "L Ring Tip" },
    { id: "i01.leftHand.pinky0_link_joint", label: "L Pinky Knuckle" },
    { id: "i01.leftHand.pinky_link_joint", label: "L Pinky Base" },
    { id: "i01.leftHand.pinky2_link_joint", label: "L Pinky Mid" },
    { id: "i01.leftHand.pinky3_link_joint", label: "L Pinky Tip" },
    { id: "i01.leftHand.wrist.001_link_joint", label: "L Wrist" },
  ],
  "Right Hand": [
    { id: "i01.rightHand.thumb_link_joint", label: "R Thumb Base" },
    { id: "i01.rightHand.thumb1_link_joint", label: "R Thumb Mid" },
    { id: "i01.rightHand.thumb3_link_joint", label: "R Thumb Tip" },
    { id: "i01.rightHand.index_link_joint", label: "R Index Base" },
    { id: "i01.rightHand.index2_link_joint", label: "R Index Mid" },
    { id: "i01.rightHand.index3_link_joint", label: "R Index Tip" },
    { id: "i01.rightHand.majeure_link_joint", label: "R Middle Base" },
    { id: "i01.rightHand.majeure2_link_joint", label: "R Middle Mid" },
    { id: "i01.rightHand.majeure3_link_joint", label: "R Middle Tip" },
    { id: "i01.rightHand.ringFinger_link_joint", label: "R Ring Base" },
    { id: "i01.rightHand.ringfinger0_link_joint", label: "R Ring Knuckle" },
    { id: "i01.rightHand.ringfinger2_link_joint", label: "R Ring Mid" },
    { id: "i01.rightHand.ringfinger3_link_joint", label: "R Ring Tip" },
    { id: "i01.rightHand.pinky0_link_joint", label: "R Pinky Knuckle" },
    { id: "i01.rightHand.pinky_link_joint", label: "R Pinky Base" },
    { id: "i01.rightHand.pinky2_link_joint", label: "R Pinky Mid" },
    { id: "i01.rightHand.pinky3_link_joint", label: "R Pinky Tip" },
    { id: "i01.rightHand.wrist.001_link_joint", label: "R Wrist" },
  ],
};

// Go2-style motor box design — NO temperature, just status border + label
function MotorCard({ label }) {
  // Placeholder since it's not connected to DB yet
  const isOnline = false;
  const stateColor = isOnline ? "var(--green)" : "#6b7280";

  return (
    <div
      style={{
        padding: 10,
        borderRadius: 8,
        background: "#111827",
        border: `1px solid ${stateColor}`,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "56px",
        transition: "border-color 0.2s",
      }}
    >
      <div style={{ fontSize: "12px", color: "var(--text)", opacity: 0.9 }}>
        {label}
      </div>
    </div>
  );
}

export default function GiniMotorStatusPanel({ motorData = {} }) {
  const [expanded, setExpanded] = useState(
    Object.keys(GINI_JOINTS).reduce(
      (acc, k) => ({ ...acc, [k]: k === "Head" || k === "Torso" }),
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
      </div>

      {Object.entries(GINI_JOINTS).map(([section, joints]) => (
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
                gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
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
