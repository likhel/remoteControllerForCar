
import React, { useEffect,useRef } from "react";
import nipplejs from "nipplejs";

const Controller = () => {
  const deviceRef = useRef(null);
  const serverRef = useRef(null);
  const characteristicRef = useRef(null);

  // Replace with your RC car's UUIDs
  const SERVICE_UUID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"; // Car's main service
  const CHARACTERISTIC_UUID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"; // Command characteristic

  // Connect to RC car
  const connectToCar = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [SERVICE_UUID],
      });
      deviceRef.current = device;

      const server = await device.gatt.connect();
      serverRef.current = server;

      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
      characteristicRef.current = characteristic;

      console.log("✅ Connected to RC Car!");
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  };

  // Function to send commands via BLE
  const sendCommand = async (command) => {
    if (!characteristicRef.current) {
      console.warn("⚠️ Not connected to a characteristic yet.");
      return;
    }
    try {
      const data = new TextEncoder().encode(command);
      await characteristicRef.current.writeValue(data);
      console.log(`📤 Sent command: ${command}`);
    } catch (err) {
      console.error("❌ Failed to send command:", err);
    }
  };

  // Setup joystick on mount
  useEffect(() => {
    const joystickZone = document.getElementById("joystick");

    const joystick = nipplejs.create({
      zone: joystickZone,
      mode: "static",
      position: { left: "50%", top: "50%" },
      color: "blue",
    });

    joystick.on("move", (evt, data) => {
      if (data.direction) {
        let command = data.direction.angle; // "up", "down", "left", "right"
        console.log("🎮 Joystick:", command);
        sendCommand(command); // Send BLE command
      }
    });

    joystick.on("end", () => {
      console.log("🛑 Stop");
      sendCommand("stop");
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">RC Car Controller</h1>

      <button
        onClick={connectToCar}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
      >
        🔗 Connect to Car
      </button>

      <div
        id="joystick"
        className="mt-8 w-48 h-48 bg-gray-300 rounded-full flex items-center justify-center shadow-inner"
      ></div>
    </div>
  );
};

export default Controller;
