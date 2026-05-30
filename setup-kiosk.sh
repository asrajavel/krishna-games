#!/bin/bash
# Krishna Games Kiosk - Pi Zero 2 W setup
# Safe to re-run — skips steps that are already done.
set -e

echo "=== Krishna Games Kiosk Setup ==="

# 1. Add swap (1GB — Chromium needs it on 512MB Pi)
if [ ! -f /swapfile ]; then
  echo ">>> Creating 1GB swap file..."
  sudo dd if=/dev/zero of=/swapfile bs=1M count=1024 status=progress
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
elif [ "$(stat -c%s /swapfile 2>/dev/null)" -lt 1000000000 ]; then
  echo ">>> Upgrading swap to 1GB..."
  sudo swapoff /swapfile 2>/dev/null || true
  sudo dd if=/dev/zero of=/swapfile bs=1M count=1024 status=progress
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
else
  echo ">>> Swap already configured (1GB), skipping."
fi

# Enlarge /dev/shm for Chromium (default may be too small)
if ! grep -q '/dev/shm' /etc/fstab 2>/dev/null; then
  echo 'tmpfs /dev/shm tmpfs defaults,size=256M 0 0' | sudo tee -a /etc/fstab
  sudo mount -o remount /dev/shm 2>/dev/null || true
fi

# 2. Install packages
echo ">>> Installing packages..."
sudo apt update
sudo apt install -y --no-install-recommends xserver-xorg xinit x11-xserver-utils unclutter chromium git xdotool

# 3. Install Node.js if not already present
if ! command -v node &>/dev/null; then
  echo ">>> Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
  sudo apt install -y nodejs
else
  echo ">>> Node.js already installed ($(node -v)), skipping."
fi

# 4. Clone repo if not already cloned, then build
if [ ! -d ~/krishna-games/.git ]; then
  echo ">>> Cloning krishna-games..."
  git clone https://github.com/asrajavel/krishna-games.git ~/krishna-games
else
  echo ">>> Repo already cloned, pulling latest..."
  cd ~/krishna-games && git pull origin master --ff-only
fi

cd ~/krishna-games

if [ ! -d node_modules ]; then
  echo ">>> Installing npm dependencies..."
  npm install
else
  echo ">>> node_modules exists, skipping npm install."
fi

echo ">>> Building..."
npm run build

# 5. Enable auto-login on console
echo ">>> Enabling console auto-login..."
sudo raspi-config nonint do_boot_behaviour B2

# 6. Create boot script (pulls, rebuilds, generates xinitrc, launches)
cat > ~/start-kiosk.sh << 'BOOTEOF'
#!/bin/sh
cd ~/krishna-games

# Pull latest code if network available
if git pull origin master --ff-only 2>/dev/null | grep -v "Already up to date"; then
  npm install --production=false 2>/dev/null
  npm run build
fi

# Clear Chromium crash flags so "Restore pages?" never appears
PREFS="$HOME/.config/chromium/Default/Preferences"
if [ -f "$PREFS" ]; then
  sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' "$PREFS"
  sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' "$PREFS"
fi

# Generate xinitrc fresh each boot
cat > ~/.xinitrc << XEOF
#!/bin/sh
exec > /tmp/kiosk-debug.log 2>&1
echo "=== KIOSK DEBUG LOG ==="
date
echo "--- Memory before Chromium ---"
free -m
echo "--- /dev/shm ---"
df -h /dev/shm
echo "--- Screen info ---"
xrandr 2>/dev/null || echo "xrandr not available"
echo "=============================="

xset s off
xset -dpms
xset s noblank
unclutter -idle 0 &

# Kill any prior Chromium to free RAM
killall chromium 2>/dev/null || true
sleep 1

echo "--- Memory before launch ---"
free -m

chromium --disable-infobars --noerrdialogs \
  --start-fullscreen --start-maximized \
  --window-size=1920,1080 --window-position=0,0 \
  --disable-translate --no-first-run \
  --disable-session-crashed-bubble \
  --disable-gpu \
  --disable-dev-shm-usage \
  --disable-extensions \
  --disable-background-networking \
  --disable-sync \
  --disable-default-apps \
  --disable-component-update \
  --disable-domain-reliability \
  --no-sandbox \
  --single-process \
  --renderer-process-limit=1 \
  --disk-cache-dir=/dev/null --disk-cache-size=1 \
  --disable-pinch \
  file://$HOME/krishna-games/dist/test.html &

sleep 8

# Force Chromium window to cover full screen
WID=\$(xdotool search --onlyvisible --name "" | head -1)
if [ -n "\$WID" ]; then
  echo "Found window: \$WID — forcing fullscreen"
  xdotool windowactivate "\$WID"
  xdotool windowmove "\$WID" 0 0
  xdotool windowsize "\$WID" 1920 1080
  xdotool key F11
fi

sleep 2
echo "--- Memory after launch ---"
free -m
echo "--- Chromium processes ---"
ps aux | grep chromium
echo "--- Window info ---"
xdotool getactivewindow getwindowgeometry 2>/dev/null || echo "no active window"
xdotool key Tab Return 2>/dev/null
wait
XEOF

startx
BOOTEOF
chmod +x ~/start-kiosk.sh

# 7. Auto-start on boot (only on physical console, not SSH)
if ! grep -q "start-kiosk" ~/.bash_profile 2>/dev/null; then
  echo '[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && ~/start-kiosk.sh' >> ~/.bash_profile
else
  echo ">>> Auto-start already configured, skipping."
fi

echo ""
echo "=== Setup complete! ==="
echo "Rebooting into kiosk mode in 5 seconds..."
echo "Press Ctrl+C to cancel reboot."
sleep 5
sudo reboot
