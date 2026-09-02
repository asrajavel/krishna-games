#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="$(mktemp -d)"
PACKAGE="$WORK/krishna-games"
OUTPUT="$ROOT/krishna-games.zip"
trap 'rm -rf "$WORK"' EXIT

cd "$ROOT"
npm run build

mkdir -p "$PACKAGE"
cp -R dist "$PACKAGE/dist"

# The build is a plain static bundle, so Chrome can open it straight off disk.
# file:// blocks ES module scripts unless --allow-file-access-from-files is set,
# which is safe here: our own offline page in a throwaway browser profile.
CHROME_FLAGS='--no-first-run --disable-default-apps --allow-file-access-from-files --kiosk'

# cmd.exe wants CRLF, hence awk.
awk '{ printf "%s\r\n", $0 }' > "$PACKAGE/Start Krishna Games (Windows).bat" <<EOF
@echo off
cd /d "%~dp0"
set "DIR=%~dp0"
set "DIR=%DIR:\=/%"
for %%C in (
  "%ProgramFiles%\Google\Chrome\Application\chrome.exe"
  "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
  "%LocalAppData%\Google\Chrome\Application\chrome.exe"
  "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
  "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
) do if exist %%C (
  start "" %%C --user-data-dir="%~dp0.chrome-profile" $CHROME_FLAGS --app="file:///%DIR%dist/index.html"
  exit /b
)
echo Chrome or Edge was not found. Please install Google Chrome.
pause
EOF

cat > "$PACKAGE/Start Krishna Games (Mac).command" <<EOF
#!/bin/bash
cd "\$(dirname "\$0")"
# Downloaded archives are quarantined by Gatekeeper; clearing it avoids the
# "unidentified developer" block.
xattr -dr com.apple.quarantine . 2>/dev/null || true
for browser in \\
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \\
  "\$HOME/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \\
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
do
  [ -x "\$browser" ] && exec "\$browser" --user-data-dir="\$PWD/.chrome-profile" $CHROME_FLAGS --app="file://\$PWD/dist/index.html"
done
echo "Chrome or Edge was not found. Please install Google Chrome."
read -r -p "Press Return to close."
EOF
chmod +x "$PACKAGE/Start Krishna Games (Mac).command"

cat > "$PACKAGE/READ ME FIRST.txt" <<'EOF'
Krishna Games

WINDOWS:
  Double-click "Start Krishna Games (Windows).bat".

MAC - FIRST TIME ONLY:
  Right-click "Start Krishna Games (Mac).command", choose Open, then click
  Open in the warning dialog.

  A plain double-click will not work the first time. macOS blocks scripts
  from downloaded archives until you approve them once this way.
  Double-clicking works every time after that.

The game opens full-screen in Chrome. Press Alt+F4 (Windows) or Cmd+Q (Mac)
to quit.

If macOS still refuses to open it, open Terminal, type "xattr -dr
com.apple.quarantine " (with the trailing space), drag this folder into the
Terminal window, and press Return. Then try again.
EOF

rm -f "$OUTPUT"
(cd "$WORK" && zip -qr "$OUTPUT" krishna-games)
echo "Ready: $OUTPUT"
