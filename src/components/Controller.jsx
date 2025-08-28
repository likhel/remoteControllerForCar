import React, { useEffect } from "react";
import nipplejs from "nipplejs";

const Controller = () => {
  const DEAD_ZONE = 20; // px distance threshold

  const connectToCar = () => {
    if (window.NchatBridge && window.NchatBridge.connectToCar) {
      window.NchatBridge.connectToCar();
      console.log("🔗 Requested native bridge to connect to car");
    } else {
      console.error("❌ NchatBridge not available");
    }
  };

  const sendCommand = (command) => {
    if (window.NchatBridge && window.NchatBridge.sendCommand) {
      window.NchatBridge.sendCommand(command);
      console.log(`📤 Sent command: ${command}`);
    } else {
      console.error("❌ NchatBridge not available");
    }
  };

  useEffect(() => {
    const zone = document.getElementById("joystick");
    const joystick = nipplejs.create({
      zone,
      mode: "static",
      position: { left: "50%", top: "50%" },
      color: "blue",
      size: 150,
    });

    joystick.on("move", (evt, data) => {
      if (!data.direction) return;

      // ✅ Apply dead zone
      if (data.distance < DEAD_ZONE) {
        sendCommand("stop");
        return;
      }

      const { angle } = data.direction;
      console.log("🎮 Joystick direction:", angle, "distance:", data.distance);

      switch (angle) {
        case "up":
          sendCommand("forward");
          break;
        case "down":
          sendCommand("backward");
          break;
        case "left":
          sendCommand("left");
          break;
        case "right":
          sendCommand("right");
          break;
        case "up-left":
          sendCommand("forward_left");
          break;
        case "up-right":
          sendCommand("forward_right");
          break;
        case "down-left":
          sendCommand("backward_left");
          break;
        case "down-right":
          sendCommand("backward_right");
          break;
        default:
          break;
      }
    });

    joystick.on("end", () => {
      sendCommand("stop");
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Connect Button */}
      <button
        onClick={connectToCar}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
      >
        🔗 Connect to Car
      </button>

      {/* Joystick */}
      <div className="mt-12 w-48 h-48 bg-gray-200 rounded-full relative shadow-inner">
        <div id="joystick" className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default Controller;
