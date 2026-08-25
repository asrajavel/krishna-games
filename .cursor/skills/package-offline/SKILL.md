---
name: package-offline
description: Publishes Krishna Games as self-contained offline Windows and macOS ZIPs through the temple-latest GitHub Release. Use when the user asks to package, export, rebuild, publish, or prepare the game for the temple computer.
---

# Publish Offline Releases

The only supported distribution path is GitHub Releases:

1. Ensure the intended changes are committed and pushed to `master`.
2. `.github/workflows/release.yml` builds and replaces both
   `krishna-games-windows.zip` and `krishna-games-mac.zip` on the
   `temple-latest` release automatically.
3. Check the workflow result with `gh run list --workflow release.yml`.
4. Return the release URL from `gh release view temple-latest --json url -q .url`.

On the temple Mac, the first launch needs a right-click on
`Start Krishna Games.command` followed by Open — macOS refuses a plain
double-click on scripts extracted from a downloaded archive. `READ ME FIRST.txt`
inside the ZIP says so. Signing and notarizing would remove that step but needs
an Apple Developer account.

The macOS ZIP bundles the Apple Silicon (arm64) Node runtime. Build with
`bash .github/scripts/build-release.sh mac` if an Intel build is ever needed,
after switching the platform case to `osx-x64-tar` / `darwin-x64.tar.gz`.

Do not build or distribute local ZIPs. Do not commit or push unless the user
explicitly requests it.
