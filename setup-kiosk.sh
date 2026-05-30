#!/bin/bash
# Krishna Games Kiosk - Pi Zero 2 W setup
# Safe to re-run — skips steps that are already done.
#   chmod +x setup-kiosk.sh && ./setup-kiosk.sh

set -e

echo "=== Krishna Games Kiosk Setup ==="

# 1. Add swap if not present (Pi Zero 2 W has only 512MB RAM — Chromium warns below 1GB)
if [ ! -f /swapfile ]; then
  echo ">>> Creating 512MB swap file..."
  sudo fallocate -l 512M /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
else
  echo ">>> Swap already configured, skipping."
fi

# 2. Install minimal display packages (apt skips already-installed)
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

# 5. Enable auto-login on console (no keyboard needed at boot)
echo ">>> Enabling console auto-login..."
sudo raspi-config nonint do_boot_behaviour B2

# 6. Create X startup config
echo ">>> Configuring kiosk display..."
cat > ~/.xinitrc << EOF
#!/bin/sh
xset s off
xset -dpms
xset s noblank
unclutter -idle 0 &
chromium --kiosk --disable-infobars --noerrdialogs \
  --disable-translate --no-first-run --incognito \
  --disk-cache-dir=/dev/null --disable-pinch \
  file://$HOME/krishna-games/dist/index.html &
sleep 5
xdotool key Tab Return
wait
EOF

# 7. Create boot script (pulls + rebuilds if changed, then launches)
cat > ~/start-kiosk.sh << 'EOF'
#!/bin/sh
cd ~/krishna-games
if git pull origin master --ff-only 2>/dev/null | grep -v "Already up to date"; then
  npm install --production=false 2>/dev/null
  npm run build
fi
startx
EOF
chmod +x ~/start-kiosk.sh

# 8. Auto-start on boot (only on physical console, not SSH)
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
