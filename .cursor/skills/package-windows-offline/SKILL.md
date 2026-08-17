---
name: package-windows-offline
description: Publishes Krishna Games as a self-contained offline Windows ZIP through the temple-latest GitHub Release. Use when the user asks to package, export, rebuild, publish, or prepare the game for the temple Windows computer.
---

# Publish Windows Offline Release

The only supported distribution path is GitHub Releases:

1. Ensure the intended changes are committed and pushed to `master`.
2. `.github/workflows/release-windows.yml` builds and replaces
   `krishna-games-windows.zip` on the `temple-latest` release automatically.
3. Check the workflow result with `gh run list --workflow release-windows.yml`.
4. Return the release URL from `gh release view temple-latest --json url -q .url`.

Do not build or distribute local ZIPs. Do not commit or push unless the user
explicitly requests it.
