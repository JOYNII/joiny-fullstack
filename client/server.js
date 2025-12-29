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
  const server = https.createServer(
    {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },
    (req, res) => {
      // API or Socket.IO requests go to Django (8000)
      if (req.url.startsWith("/api") || req.url.startsWith("/socket.io")) {
        return apiProxy(req, res);
      }
      return handle(req, res);
    }
  );

  server.on('upgrade', (req, socket, head) => {
    // Only upgrade socket.io requests to Django
    if (req.url.startsWith('/socket.io')) {
      apiProxy.upgrade(req, socket, head);
    }
    // _next/webpack-hmr is NOT handled here, so it stays with Next.js
  });

  server.listen(3000, "0.0.0.0", () => {
    console.log("✅ HTTPS Next.js dev server running (Socket -> Django:8000)");
    console.log("👉 https://localhost:3000");
  });
});
