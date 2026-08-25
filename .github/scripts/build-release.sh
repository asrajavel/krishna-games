#!/usr/bin/env bash
set -euo pipefail

PLATFORM="${1:?usage: build-release.sh windows|mac}"
case "$PLATFORM" in
  windows)
    NODE_FILE="win-x64-zip"
    NODE_ARCHIVE_SUFFIX="win-x64.zip"
    ;;
  mac)
    NODE_FILE="osx-arm64-tar"
    NODE_ARCHIVE_SUFFIX="darwin-arm64.tar.gz"
    ;;
  *)
    echo "Unknown platform: $PLATFORM" >&2
    exit 1
    ;;
esac

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="$(mktemp -d)"
PACKAGE="$WORK/krishna-games-$PLATFORM"
OUTPUT="$ROOT/krishna-games-$PLATFORM.zip"
trap 'rm -rf "$WORK"' EXIT

cd "$ROOT"
npm run build

VERSION="$(
  curl -fsSL https://nodejs.org/dist/index.json |
    node -e 'let data=""; process.stdin.on("data", chunk => data += chunk); process.stdin.on("end", () => console.log(JSON.parse(data).find(release => release.lts && release.files.includes(process.argv[1])).version))' "$NODE_FILE"
)"
NODE_ARCHIVE="node-${VERSION}-${NODE_ARCHIVE_SUFFIX}"
curl --retry 3 -fL "https://nodejs.org/dist/$VERSION/$NODE_ARCHIVE" -o "$WORK/$NODE_ARCHIVE"

EXPECTED="$(
  curl -fsSL "https://nodejs.org/dist/$VERSION/SHASUMS256.txt" |
    awk -v archive="$NODE_ARCHIVE" '$2 == archive { print $1 }'
)"
ACTUAL="$(node -e 'const { createHash } = require("node:crypto"); const { readFileSync } = require("node:fs"); console.log(createHash("sha256").update(readFileSync(process.argv[1])).digest("hex"))' "$WORK/$NODE_ARCHIVE")"
[[ -n "$EXPECTED" && "$ACTUAL" == "$EXPECTED" ]] || {
  echo "Node.js download checksum verification failed." >&2
  exit 1
}

mkdir -p "$PACKAGE/runtime"
cp -R "$ROOT/dist" "$PACKAGE/dist"
if [[ "$PLATFORM" == windows ]]; then
  unzip -p "$WORK/$NODE_ARCHIVE" "node-${VERSION}-win-x64/node.exe" > "$PACKAGE/runtime/node.exe"
else
  tar -xzOf "$WORK/$NODE_ARCHIVE" "node-${VERSION}-darwin-arm64/bin/node" > "$PACKAGE/runtime/node"
  chmod +x "$PACKAGE/runtime/node"
fi

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

// 4174 rather than Vite's default 4173, so the packaged app and a local
// `npm run preview` can run side by side.
server.listen(4174, "127.0.0.1", () => {
  console.log("Krishna Games is running at http://localhost:4174");

  const candidate = (base, ...parts) => base && join(base, ...parts);
  const candidates = process.platform === "win32"
    ? [
      candidate(process.env.ProgramFiles, "Google", "Chrome", "Application", "chrome.exe"),
      candidate(process.env["ProgramFiles(x86)"], "Google", "Chrome", "Application", "chrome.exe"),
      candidate(process.env.LocalAppData, "Google", "Chrome", "Application", "chrome.exe"),
      candidate(process.env["ProgramFiles(x86)"], "Microsoft", "Edge", "Application", "msedge.exe"),
      candidate(process.env.ProgramFiles, "Microsoft", "Edge", "Application", "msedge.exe"),
    ]
    : [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      candidate(process.env.HOME, "Applications", "Google Chrome.app", "Contents", "MacOS", "Google Chrome"),
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ];
  const browser = candidates.find(path => path && existsSync(path));

  if (!browser) {
    console.error("Chrome or Edge was not found.");
    server.close();
    return;
  }

  const app = spawn(browser, [
    `--user-data-dir=${resolve(__dirname, ".chrome-profile")}`,
    "--no-first-run",
    "--disable-default-apps",
    "--app=http://localhost:4174",
    "--kiosk",
  ], { stdio: "ignore" });
  app.once("error", error => {
    console.error(`Could not open the browser: ${error.message}`);
    server.close();
  });
  app.once("exit", () => server.close());
});
EOF

if [[ "$PLATFORM" == windows ]]; then
  cat > "$PACKAGE/launcher.tmp" <<'EOF'
@echo off
cd /d "%~dp0"
start "Krishna Games Server" /min "%~dp0runtime\node.exe" "%~dp0server.cjs"
EOF
  awk '{ printf "%s\r\n", $0 }' "$PACKAGE/launcher.tmp" > "$PACKAGE/Start Krishna Games.bat"
  rm "$PACKAGE/launcher.tmp"
else
  cat > "$PACKAGE/Start Krishna Games.command" <<'EOF'
#!/bin/bash
cd "$(dirname "$0")"
# Downloaded binaries are quarantined by Gatekeeper; clearing it avoids the
# "unidentified developer" block on the bundled Node runtime.
xattr -dr com.apple.quarantine . 2>/dev/null || true
exec ./runtime/node ./server.cjs
EOF
  chmod +x "$PACKAGE/Start Krishna Games.command"
  cat > "$PACKAGE/READ ME FIRST.txt" <<'EOF'
Krishna Games - Mac

FIRST TIME ONLY:
  Right-click "Start Krishna Games.command", choose Open, then click Open
  in the warning dialog.

  A plain double-click will not work the first time. macOS blocks scripts
  from downloaded archives until you approve them once this way.

EVERY TIME AFTER THAT:
  Double-click "Start Krishna Games.command".

The game opens full-screen in Chrome. Press Cmd+Q to quit.

If macOS still refuses to open it, open Terminal, type "xattr -dr
com.apple.quarantine " (with the trailing space), drag this folder into the
Terminal window, and press Return. Then try again.
EOF
fi

rm -f "$OUTPUT"
(cd "$WORK" && zip -qr "$OUTPUT" "krishna-games-$PLATFORM")
echo "Ready: $OUTPUT"
