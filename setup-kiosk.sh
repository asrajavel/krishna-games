#!/bin/bash
# Krishna Games Kiosk - One-time Pi Zero 2 W setup
# Run this script once after flashing Pi OS Lite:
#   chmod +x setup-kiosk.sh && ./setup-kiosk.sh

set -e

echo "=== Krishna Games Kiosk Setup ==="

# 1. Install minimal display packages
echo ">>> Installing display packages..."
sudo apt update
sudo apt install -y --no-install-recommends xserver-xorg xinit x11-xserver-utils unclutter chromium

# 2. Install Node.js for building the app
echo ">>> Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# 3. Clone repo and build
echo ">>> Cloning and building krishna-games..."
git clone https://github.com/asrajavel/krishna-games.git ~/krishna-games
cd ~/krishna-games
npm install
npm run build

# 4. Create X startup config
echo ">>> Configuring kiosk display..."
cat > ~/.xinitrc << 'EOF'
#!/bin/sh
xset s off
xset -dpms
xset s noblank
unclutter -idle 0 &
chromium --kiosk --disable-infobars --noerrdialogs \
  --disable-translate --no-first-run --incognito \
  --disk-cache-dir=/dev/null --disable-pinch \
  file:///home/pi/krishna-games/dist/index.html
EOF

# 5. Create boot script (pulls + rebuilds if changed, then launches)
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

# 6. Auto-start on boot (only on physical console, not SSH)
if ! grep -q "start-kiosk" ~/.bash_profile 2>/dev/null; then
  echo '[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && ~/start-kiosk.sh' >> ~/.bash_profile
fi

echo ""
echo "=== Setup complete! ==="
echo "Rebooting into kiosk mode in 5 seconds..."
echo "Press Ctrl+C to cancel reboot."
sleep 5
sudo reboot
