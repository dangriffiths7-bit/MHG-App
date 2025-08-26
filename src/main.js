import "./style.css";

// Basic UI
const app = document.getElementById("app");
app.innerHTML = `
  <main class="wrap">
    <h1>🚀 My Installable App</h1>
    <p>This is a Vite PWA you can install on your phone.</p>
    <button id="ping">Click me</button>
    <p id="out" class="muted"></p>
    <footer>
      <small>v1 • Built with Vite + PWA</small>
    </footer>
  </main>
`;

document.getElementById("ping").addEventListener("click", () => {
  const out = document.getElementById("out");
  out.textContent = "Button clicked. App is alive ✅";
});

// Register the service worker for install + offline
if ("serviceWorker" in navigator) {
  const swUrl = import.meta.env.BASE_URL + "sw.js"; // respects GitHub Pages subpath
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(swUrl)
      .then(() => console.log("SW registered:", swUrl))
      .catch((err) => console.error("SW registration failed:", err));
  });
}
