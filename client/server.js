const https = require("https");
const fs = require("fs");
const path = require("path");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = next({ dev: true });
const handle = app.getRequestHandler();

// 프로젝트 루트 기준 절대경로 직접 지정
const projectRoot = __dirname; // 여기가 문제를 해결하는 핵심
const certDir = path.join(projectRoot, "cert");
const certPath = path.join(certDir, "localhost.pem");
const keyPath = path.join(certDir, "localhost-key.pem");

const apiProxy = createProxyMiddleware({
  target: "http://127.0.0.1:8000",
  changeOrigin: true,
  ws: true,
});

app.prepare().then(() => {
  https
    .createServer(
      {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      },
      (req, res) => {
        if (req.url.startsWith("/api") || req.url.startsWith("/socket.io")) {
          return apiProxy(req, res);
        }
        return handle(req, res);
      }
    )
    .on('upgrade', apiProxy.upgrade) // Handle WebSocket upgrades
    .listen(3000, "0.0.0.0", () => {
      console.log("✅ HTTPS Next.js dev server running");
      console.log("👉 https://localhost:3000");
    });
});
