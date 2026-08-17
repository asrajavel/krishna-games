#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="$(mktemp -d)"
PACKAGE="$WORK/krishna-games-windows"
OUTPUT="$ROOT/krishna-games-windows.zip"
trap 'rm -rf "$WORK"' EXIT

cd "$ROOT"
npm run build

VERSION="$(
  curl -fsSL https://nodejs.org/dist/index.json |
    node -e 'let data=""; process.stdin.on("data", chunk => data += chunk); process.stdin.on("end", () => console.log(JSON.parse(data).find(release => release.lts && release.files.includes("win-x64-zip")).version))'
)"
NODE_ZIP="node-${VERSION}-win-x64.zip"
curl --retry 3 -fL "https://nodejs.org/dist/$VERSION/$NODE_ZIP" -o "$WORK/$NODE_ZIP"

EXPECTED="$(
  curl -fsSL "https://nodejs.org/dist/$VERSION/SHASUMS256.txt" |
    awk -v zip="$NODE_ZIP" '$2 == zip { print $1 }'
)"
ACTUAL="$(node -e 'const { createHash } = require("node:crypto"); const { readFileSync } = require("node:fs"); console.log(createHash("sha256").update(readFileSync(process.argv[1])).digest("hex"))' "$WORK/$NODE_ZIP")"
[[ -n "$EXPECTED" && "$ACTUAL" == "$EXPECTED" ]] || {
  echo "Node.js download checksum verification failed." >&2
  exit 1
}

mkdir -p "$PACKAGE/runtime"
cp -R "$ROOT/dist" "$PACKAGE/dist"
unzip -p "$WORK/$NODE_ZIP" "node-${VERSION}-win-x64/node.exe" > "$PACKAGE/runtime/node.exe"

cat > "$PACKAGE/server.cjs" <<'EOF'
const { spawn } = require("node:child_process");
const http = require("node:http");
const { createReadStream, existsSync, statSync } = require("node:fs");
const { extname, join, resolve, sep } = require("node:path");

const root = resolve(__dirname, "dist");
const types = {
  ".css": "text/css",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

const server = http.createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end();
      return;
    }
    try {
      if (!statSync(file).isFile()) file = resolve(root, "index.html");
    } catch {
      file = resolve(root, "index.html");
    }
    const stream = createReadStream(file);
    stream.on("error", () => response.destroy());
    response.writeHead(200, {
      "Content-Type": `${types[extname(file).toLowerCase()] || "application/octet-stream"}; charset=utf-8`,
      "Cache-Control": "no-cache",
    });
    stream.pipe(response);
  } catch {
    response.writeHead(400).end();
  }
});

server.listen(4173, "127.0.0.1", () => {
  console.log("Krishna Games is running at http://localhost:4173");
  if (process.platform !== "win32") return;

  const candidate = (base, ...parts) => base && join(base, ...parts);
  const browser = [
    candidate(process.env.ProgramFiles, "Google", "Chrome", "Application", "chrome.exe"),
    candidate(process.env["ProgramFiles(x86)"], "Google", "Chrome", "Application", "chrome.exe"),
    candidate(process.env.LocalAppData, "Google", "Chrome", "Application", "chrome.exe"),
    candidate(process.env["ProgramFiles(x86)"], "Microsoft", "Edge", "Application", "msedge.exe"),
    candidate(process.env.ProgramFiles, "Microsoft", "Edge", "Application", "msedge.exe"),
  ].find(path => path && existsSync(path));

  if (!browser) {
    console.error("Chrome or Edge was not found.");
    server.close();
    return;
  }

  const app = spawn(browser, [
    `--user-data-dir=${resolve(__dirname, ".chrome-profile")}`,
    "--no-first-run",
    "--disable-default-apps",
    "--app=http://localhost:4173",
    "--kiosk",
  ], { stdio: "ignore" });
  app.once("error", error => {
    console.error(`Could not open the browser: ${error.message}`);
    server.close();
  });
  app.once("exit", () => server.close());
});
EOF

cat > "$PACKAGE/Start Krishna Games.tmp" <<'EOF'
@echo off
cd /d "%~dp0"
start "Krishna Games Server" /min "%~dp0runtime\node.exe" "%~dp0server.cjs"
EOF
awk '{ printf "%s\r\n", $0 }' "$PACKAGE/Start Krishna Games.tmp" > "$PACKAGE/Start Krishna Games.bat"
rm "$PACKAGE/Start Krishna Games.tmp"

rm -f "$OUTPUT"
(cd "$WORK" && zip -qr "$OUTPUT" krishna-games-windows)
echo "Ready: $OUTPUT"
