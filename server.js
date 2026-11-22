const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const BUNDLE_DIR = path.join(__dirname, "bundle");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  const urlPath = (req.url || "/").split("?")[0];
  let filePath = path.join(BUNDLE_DIR, urlPath === "/" ? "index.html" : urlPath);

  if (!filePath.startsWith(BUNDLE_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const rootFallback = path.join(__dirname, urlPath.replace(/^\/+/, ""));
    if (rootFallback.startsWith(__dirname) && fs.existsSync(rootFallback) && !fs.statSync(rootFallback).isDirectory()) {
      filePath = rootFallback;
    } else {
      filePath = path.join(BUNDLE_DIR, "index.html");
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`english-game listening on ${PORT}`);
});
