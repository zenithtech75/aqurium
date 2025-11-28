import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7du6Zwd0y6-DQQoiDdopCqKtWqUBbaT8",
  authDomain: "mitdht.firebaseapp.com",
  databaseURL: "https://mitdht-default-rtdb.firebaseio.com",
  projectId: "mitdht",
  storageBucket: "mitdht.firebasestorage.app",
  messagingSenderId: "994832787139",
  appId: "1:994832787139:web:f0f6f2ea177b1476af2476",
  measurementId: "G-EWMWECH4BZ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ------- RELAY BUTTONS -------
const r1 = document.getElementById("relay1");
const r2 = document.getElementById("relay2");
const r3 = document.getElementById("relay3");
const r4 = document.getElementById("relay4");

// Toggle relay helper
function toggleRelay(path, button) {
  // Live update
  onValue(ref(db, path), (snap) => {
    const state = snap.val();
    button.classList.toggle("active", state === 1);
  });

  // When clicked
  button.onclick = () => {
    const newState = button.classList.contains("active") ? 0 : 1;
    set(ref(db, path), newState);
  };
}

// Assign relays to Firebase paths
toggleRelay("relay1", r1);
toggleRelay("relay2", r2);
toggleRelay("relay3", r3);

// ------- TIMER -------
const timerText = document.getElementById("timerText");
const timerProgress = document.getElementById("timerProgress");

r4.onclick = () => {
  set(ref(db, "timer/start"), Date.now());
  set(ref(db, "timer/duration"), 30);   // 30 seconds timer
};

onValue(ref(db, "timer"), snap => {
  if (!snap.exists()) return;

  const data = snap.val();
  const start = data.start;
  const duration = data.duration;

  let remaining = duration - Math.floor((Date.now() - start) / 1000);
  if (remaining < 0) remaining = 0;

  timerText.innerText = `Timer: ${remaining} sec`;

  const percent = (remaining / duration) * 100;
  timerProgress.style.width = percent + "%";
});

// ------- SENSORS -------
onValue(ref(db, "sensors/temperature"), snap => {
  document.getElementById("temp").innerText = snap.val();
});

onValue(ref(db, "sensors/humidity"), snap => {
  document.getElementById("humi").innerText = snap.val();
});
