const MQTT_CONFIG = {
  host: "iot.midragondev.my.id",
  port: 9001, 
  user: "nexaryn",
  pass: "31750321",
  clientId: "WEB_READER_" + Math.random().toString(16).substr(2, 5),
};

const client = new Paho.MQTT.Client(MQTT_CONFIG.host, Number(MQTT_CONFIG.port), MQTT_CONFIG.clientId);

function connectMQTT() {
  client.connect({
    userName: MQTT_CONFIG.user,
    password: MQTT_CONFIG.pass,
    useSSL: true, // Mengaktifkan koneksi aman (WSS)
    timeout: 3,
    onSuccess: () => {
      console.log("Connected Securely to Sensor Feed");
      updateNavStatus(true);
      client.subscribe("MIAUW/sensor/distance");
    },
    onFailure: (err) => {
      console.log("Secure Connection Failed: " + err.errorMessage);
      updateNavStatus(false);
    },
  });
}

client.onMessageArrived = (message) => {
  if (message.destinationName === "MIAUW/sensor/distance") {
    const val = message.payloadString;
    const dist = parseFloat(val);
    
    // Update angka jarak di UI
    document.getElementById("distance-value").innerText = val;
    
    const statusText = document.getElementById("distance-status");
    const buzzerIndicator = document.getElementById("buzzer-indicator");
    const buzzerText = document.getElementById("buzzer-text");

    // Logika sinkronisasi peringatan di Web
    if (dist < 10) {
      statusText.innerText = "Objek Terlalu Dekat!";
      statusText.style.color = "#ef4444";
      buzzerIndicator.className = "buzzer-status active-alarm";
      buzzerText.innerText = "ON (ALARM)";
    } else {
      statusText.innerText = "Aman";
      statusText.style.color = "#22c55e";
      buzzerIndicator.className = "buzzer-status inactive";
      buzzerText.innerText = "OFF";
    }
  }
};

function updateNavStatus(status) {
  const box = document.getElementById("connection-status");
  document.getElementById("status-text").innerText = status ? "Connected" : "Disconnected";
  box.className = status ? "status-box connected" : "status-box disconnected";
}

window.onload = connectMQTT;
