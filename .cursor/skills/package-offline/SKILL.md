---
name: package-offline
description: Publishes Krishna Games as a single offline Windows/macOS ZIP through the temple-latest GitHub Release. Use when the user asks to package, export, rebuild, publish, or prepare the game for the temple computer.
---

# Publish Offline Releases

The only supported distribution path is GitHub Releases:

1. Ensure the intended changes are committed and pushed to `master`.
2. `.github/workflows/release.yml` builds and replaces `krishna-games.zip` on
   the `temple-latest` release automatically. One ZIP serves both platforms —
   it holds `dist/` plus a `.bat` and a `.command` launcher.
3. Check the workflow result with `gh run list --workflow release.yml`.
4. Return the release URL from `gh release view temple-latest --json url -q .url`.

On the temple Mac, the first launch needs a right-click on
`Start Krishna Games (Mac).command` followed by Open — macOS refuses a plain
double-click on scripts extracted from a downloaded archive. `READ ME FIRST.txt`
inside the ZIP says so. Signing and notarizing would remove that step but needs
an Apple Developer account.

The launchers open `dist/index.html` over `file://` directly in kiosk Chrome,
so the package ships no runtime and no local server. This depends on
`--allow-file-access-from-files`, without which Chrome refuses to load the
bundle's ES module script off `file://`. The temple computer needs Chrome or
Edge installed; the launcher prints a message if neither is found.

Do not build or distribute local ZIPs. Do not commit or push unless the user
explicitly requests it.
