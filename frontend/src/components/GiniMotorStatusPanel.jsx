import { useState, useEffect } from "react";

export default function GiniMotorStatusPanel() {
  const [sections, setSections] = useState({});
  const [expanded, setExpanded] = useState({});

  const toggleSection = (name) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    const jointNames = [
      "Empty.001_link_joint",
      "Empty.002_link_joint",

      // Head
      "i01.head.eyeLeft.001_link_joint",
      "i01.head.eyeLeft_link_joint",
      "i01.head.eyeRight.001_link_joint",
      "i01.head.eyeRight_link_joint",
      "i01.head.jaw_link_joint",
      "i01.head.neck.001_link_joint",
      "i01.head.rollNeck_link_joint",
      "i01.head.rothead_link_joint",

      // Left Hand
      "i01.leftHand.index2_link_joint",
      "i01.leftHand.index3_link_joint",
      "i01.leftHand.index_link_joint",
      "i01.leftHand.majeure2_link_joint",
      "i01.leftHand.majeure3_link_joint",
      "i01.leftHand.majeure_link_joint",
      "i01.leftHand.pinky0_link_joint",
      "i01.leftHand.pinky2_link_joint",
      "i01.leftHand.pinky3_link_joint",
      "i01.leftHand.pinky_link_joint",
      "i01.leftHand.ringFinger_link_joint",
      "i01.leftHand.ringfinger0_link_joint",
      "i01.leftHand.ringfinger2_link_joint",
      "i01.leftHand.ringfinger3_link_joint",
      "i01.leftHand.thumb1_link_joint",
      "i01.leftHand.thumb3_link_joint",
      "i01.leftHand.thumb_link_joint",
      "i01.leftHand.wrist.001_link_joint",

      // Right Hand
      "i01.rightHand.index2_link_joint",
      "i01.rightHand.index3_link_joint",
      "i01.rightHand.index_link_joint",
      "i01.rightHand.majeure2_link_joint",
      "i01.rightHand.majeure3_link_joint",
      "i01.rightHand.majeure_link_joint",
      "i01.rightHand.pinky0_link_joint",
      "i01.rightHand.pinky2_link_joint",
      "i01.rightHand.pinky3_link_joint",
      "i01.rightHand.pinky_link_joint",
      "i01.rightHand.ringFinger_link_joint",
      "i01.rightHand.ringfinger0_link_joint",
      "i01.rightHand.ringfinger2_link_joint",
      "i01.rightHand.ringfinger3_link_joint",
      "i01.rightHand.thumb1_link_joint",
      "i01.rightHand.thumb3_link_joint",
      "i01.rightHand.thumb_link_joint",
      "i01.rightHand.wrist.001_link_joint",

      // Torso
      "i01.torso.midStom_link_joint",
      "i01.torso.topStom_link_joint",

      // Left Arm
      "left_elbow_x_link_joint",
      "left_shoulder_x_link_joint",
      "left_shoulder_y_link_joint",
      "left_shoulder_z_link_joint",
      "left_wrist_z_link_joint",

      // Right Arm
      "right_elbow_x_link_joint",
      "right_shoulder_x_link_joint",
      "right_shoulder_y_link_joint",
      "right_shoulder_z_link_joint",
      "right_wrist_z_link_joint"
    ];

    const grouped = {
      Head: [],
      "Left Hand": [],
      "Right Hand": [],
      Torso: [],
      "Left Arm": [],
      "Right Arm": [],
      Others: []
    };

    jointNames.forEach((name) => {
      const motor = { name, active: false }; // 🔥 all deactive

      if (name.includes("head")) grouped.Head.push(motor);
      else if (name.includes("leftHand")) grouped["Left Hand"].push(motor);
      else if (name.includes("rightHand")) grouped["Right Hand"].push(motor);
      else if (name.includes("torso")) grouped.Torso.push(motor);
      else if (name.startsWith("left_")) grouped["Left Arm"].push(motor);
      else if (name.startsWith("right_")) grouped["Right Arm"].push(motor);
      else grouped.Others.push(motor);
    });

    setSections(grouped);
    // only head expanded initially
    setExpanded(
      Object.keys(grouped).reduce((acc, k) => ({ ...acc, [k]: k === "Head" }), {})
    );
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {Object.entries(sections).map(([sectionName, motors]) => (
        <div key={sectionName}>
          
          {/* Section Title */}
          <h3
            onClick={() => toggleSection(sectionName)}
            style={{
              color: "#00e5ff",
              marginBottom: "15px",
              borderBottom: "1px solid #1f2937",
              paddingBottom: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ transform: expanded[sectionName] ? "rotate(90deg)" : "none", display: "inline-block", transition: "transform 0.2s" }}>
              ▶
            </span>
            {sectionName}
          </h3>

          {/* Motors Grid (collapsed if not expanded) */}
          {expanded[sectionName] && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "15px"
              }}
            >
              {motors.map((motor, index) => (
                <div
                  key={index}
                  style={{
                    padding: "15px",
                    borderRadius: "10px",
                    border: "2px solid #ff4444",
                    background: "#0f172a",
                    color: "#fff",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    {motor.name}
                  </div>

                  <div style={{
                    marginTop: "8px",
                    fontWeight: "bold",
                    color: "#ff4444"
                  }}>
                    ● Deactive
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      ))}
    </div>
  );
}
