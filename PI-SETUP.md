# Pi Zero 2 W Kiosk Setup

## Requirements

- Raspberry Pi Zero 2 W
- microSD card (8GB+)
- Micro-USB OTG adapter (for keyboard during setup)
- Monitor (HDMI via mini-HDMI adapter)
- USB keyboard (for initial setup)
- Wi-Fi access (for initial setup + pulling updates)

## 1. Flash the SD Card (on your Mac)

Use [Raspberry Pi Imager](https://www.raspberrypi.com/software/):

- Choose **Raspberry Pi OS Lite (32-bit)** — no desktop
- Click the gear icon and configure:
  - Hostname: `krishna`
  - Enable SSH (use password auth)
  - Set username/password
  - Configure Wi-Fi (SSID + password)

## 2. One-Time SSH Setup

SSH in (or plug in a keyboard and do this directly):

```bash
ssh pi@krishna.local
```

Run the full setup:

```bash
# Install packages
sudo apt update
sudo apt install -y chromium-browser xserver-xorg xinit x11-xserver-utils unclutter

# Install Node.js (for building the app on the Pi)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# Clone the repo and build
git clone https://github.com/asrajavel/krishna-games.git ~/krishna-games
cd ~/krishna-games
npm install
npm run build

# Create X startup config
cat > ~/.xinitrc << 'XEOF'
#!/bin/sh
xset s off
xset -dpms
xset s noblank
unclutter -idle 0 &
chromium-browser --kiosk --disable-infobars --noerrdialogs \
  --disable-translate --no-first-run --incognito \
  --disk-cache-dir=/dev/null --disable-pinch \
  file:///home/pi/krishna-games/dist/index.html
XEOF

# Create boot script (pulls latest + rebuilds if changed)
cat > ~/start-kiosk.sh << 'SEOF'
#!/bin/sh
cd ~/krishna-games
if git pull origin master --ff-only 2>/dev/null | grep -v "Already up to date"; then
  npm install --production=false 2>/dev/null
  npm run build
fi
startx
SEOF
chmod +x ~/start-kiosk.sh

# Auto-start on boot (only on physical console, not SSH)
echo '[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && ~/start-kiosk.sh' >> ~/.bash_profile

# Reboot into kiosk mode
sudo reboot
```

## 3. Day-to-Day Workflow

On your Mac:

```bash
# Make code changes
npm run dev          # test locally
npm run build        # verify build works
git add -A && git commit -m "update"
git push origin master
```

On the Pi:

- **Just reboot it.** It will pull the latest from GitHub, rebuild if there are changes, and launch the game.
- If Wi-Fi is unavailable, it skips the pull and runs the last successful build.

## 4. Troubleshooting

### Get back to terminal from kiosk mode
- Plug in a keyboard and press `Ctrl+Alt+F2` to switch to TTY2
- Login and make changes
- `sudo reboot` to restart kiosk

### Force a fresh build
```bash
cd ~/krishna-games
git pull origin master
npm install
npm run build
sudo reboot
```

### Check if Chromium is running
```bash
ps aux | grep chromium
```

### Pi not connecting to Wi-Fi
```bash
sudo raspi-config
# Navigate to: System Options > Wireless LAN
```
