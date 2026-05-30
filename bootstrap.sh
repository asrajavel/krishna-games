#!/bin/bash
# Run this one command on a fresh Pi to set up everything:
#   curl -fsSL https://raw.githubusercontent.com/asrajavel/krishna-games/master/bootstrap.sh | bash
curl -fsSL https://raw.githubusercontent.com/asrajavel/krishna-games/master/setup-kiosk.sh -o /tmp/setup-kiosk.sh
chmod +x /tmp/setup-kiosk.sh
/tmp/setup-kiosk.sh
