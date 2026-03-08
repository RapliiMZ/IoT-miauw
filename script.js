const MQTT_CONFIG = {
  // Pastikan host mendukung WSS (Websocket Secure)
  host: "iot.midragondev.my.id",
  // Gunakan port 9001 atau tanyakan admin broker port khusus SSL/WSS
  port: 9001, 
  user: "nexaryn",
  pass: "31750321",
  clientId: "WEB_READER_" + Math.random().toString(16).substr(2, 5),
};

const client = new Paho.MQTT.Client(
  MQTT_CONFIG.host, 
  Number(MQTT_CONFIG.port), 
  "/mqtt", // Tambahkan path jika broker memintanya, jika tidak biarkan kosong ""
  MQTT_CONFIG.clientId
);

function connectMQTT() {
  const options = {
    userName: MQTT_CONFIG.user,
    password: MQTT_CONFIG.pass,
    useSSL: true, // WAJIB bernilai true karena web Anda HTTPS
    timeout: 3,
    onSuccess: () => {
      console.log("Secure Connection Success!");
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
