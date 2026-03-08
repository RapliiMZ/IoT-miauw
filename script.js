const MQTT_CONFIG = {
  host: "iot.midragondev.my.id",
  port: 9001, // Pastikan port ini mendukung WSS
  user: "nexaryn",
  pass: "31750321",
  clientId: "WEB_READER_" + Math.random().toString(16).substr(2, 5),
};

// Tambahkan path "/mqtt" atau biarkan "" jika broker tidak membutuhkannya
const client = new Paho.MQTT.Client(
  MQTT_CONFIG.host, 
  Number(MQTT_CONFIG.port), 
  "/mqtt", 
  MQTT_CONFIG.clientId
);

function connectMQTT() {
  const options = {
    userName: MQTT_CONFIG.user,
    password: MQTT_CONFIG.pass,
    useSSL: true,         // WAJIB true untuk HTTPS
    timeout: 3,
    onSuccess: () => {
      console.log("Connected Securely!");
      updateNavStatus(true);
      client.subscribe("MIAUW/sensor/distance");
    },
    onFailure: (err) => {
      console.error("Connection Failed: ", err);
      updateNavStatus(false);
    }
  };

  client.connect(options);
}

// Menangani data yang masuk
client.onMessageArrived = (message) => {
  if (message.destinationName === "MIAUW/sensor/distance") {
    const val = message.payloadString;
    document.getElementById("distance-value").innerText = val;

    const statusText = document.getElementById("distance-status");
    const buzzerIndicator = document.getElementById("buzzer-indicator");
    const buzzerText = document.getElementById("buzzer-text");
    const dist = parseFloat(val);

    if (dist < 5) {
      statusText.innerText = "Objek Terlalu Dekat!";
      statusText.style.color = "#ef4444";

      // Update UI Buzzer Aktif
      buzzerIndicator.className = "buzzer-status active-alarm";
      buzzerText.innerText = "ON (ALARM)";
    } else {
      statusText.innerText = "Aman";
      statusText.style.color = "#22c55e";

      // Update UI Buzzer Mati
      buzzerIndicator.className = "buzzer-status inactive";
      buzzerText.innerText = "OFF";
    }
  }
};

function updateNavStatus(status) {
  const box = document.getElementById("connection-status");
  document.getElementById("status-text").innerText = status
    ? "Connected"
    : "Disconnected";
  box.className = status ? "status-box connected" : "status-box disconnected";
}

window.onload = connectMQTT;
