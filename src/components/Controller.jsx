import React, { useEffect } from "react";
import nipplejs from "nipplejs";

const Controller = () => {
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
    // === Left Joystick (Forward/Backward) ===
    const leftZone = document.getElementById("joystick-left");
    const leftJoystick = nipplejs.create({
      zone: leftZone,
      mode: "static",
      position: { left: "50%", top: "50%" }, // center inside its zone
      color: "blue",
      size: 120,
    });

    leftJoystick.on("move", (evt, data) => {
      
      console.log("🎮 Left joystick raw data:", data);
      if (data.direction) {
        if (data.direction.angle === "up") {
          sendCommand("forward");
        } else if (data.direction.angle === "down") {
          sendCommand("backward");
        }
      }
    });

    leftJoystick.on("end", () => {
      sendCommand("stop");
    });

    // === Right Joystick (Left/Right Steering) ===
    const rightZone = document.getElementById("joystick-right");
    const rightJoystick = nipplejs.create({

      zone: rightZone,
      mode: "static",
      position: { left: "50%", top: "50%" },
      color: "red",
      size: 120,
    });

    rightJoystick.on("move", (evt, data) => {
      console.log("🎮 Right joystick raw data:", data);
      if (data.direction) {
        if (data.direction.angle === "left") {
          sendCommand("left");
        } else if (data.direction.angle === "right") {
          sendCommand("right");
        }
      }
    });

    rightJoystick.on("end", () => {
      sendCommand("straight");
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

      {/* Two Joysticks Side by Side */}
      <div className="flex justify-between w-full px-8 mt-12">
        {/* Left Joystick */}
        <div
          id="joystick-left"
          className="w-40 h-40 bg-gray-200 rounded-full relative shadow-inner"
        ></div>

        {/* Right Joystick */}
        <div
          id="joystick-right"
          className="w-40 h-40 bg-gray-200 rounded-full relative shadow-inner"
        ></div>
      </div>
    </div>
  );
};

export default Controller;
