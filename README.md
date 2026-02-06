# Checkmark Hub (CST Core Shell)

Checkmark Hub is the operating shell for Checkmark Studio Tools. It launches apps, provides a consistent frame and navigation, and manages workspace context. The Hub coordinates apps through events and commands and does not do the work itself.

## What Hub Is / Is Not

**Is**
- A shell that hosts apps in isolated iframes.
- A context-aware workspace manager (Audio / School / Personal).
- A provider of shared system services (events, commands, storage, import/export).
- The system-of-record for app orchestration.

**Is Not**
- A dashboard that performs app work.
- A direct app-to-app communication channel.
- A networked web app or CDN-driven UI.

## Constraints (V0)

- Fully offline: open `hub/index.html` via `file://`.
- No CDNs, no external assets, no network calls.
- Vanilla HTML/CSS/JS only (no build steps, no frameworks).
- Apps run isolated in an iframe workspace viewport.
- Inter-app communication only via Hub bridge (`window.postMessage`).
- Storage: `localStorage` (V0), `IndexedDB` allowed when needed for app installs.
- Must work in Chromium browsers and Safari as best as possible under `file://`.

## Folder Structure

```
CST/
  hub/
    index.html
    hub.css
    hub.js
    registry.js
    bridge.js
    console.js
    app-manager.js
  shared/
    cst-ui.css
    cst-bridge-client.js
  apps/
    dummy/
      index.html
      app.js
    accountant/
      index.html
  README.md
```

## Hub ↔ App PostMessage Contract

All messages:

```json
{
  "cst": true,
  "kind": "CST_HELLO" | "CST_READY" | "CST_EVENT" | "CST_COMMAND" | "CST_COMMAND_RESULT",
  "data": { }
}
```

**CST_HELLO (Hub → App)**  
`data: { hubVersion, contextId }`

**CST_READY (App → Hub)**  
`data: { appId, appVersion }`

**CST_EVENT (App → Hub)**  
`data: { eventType, payload, ts? }`

**CST_COMMAND (Hub → App)**  
`data: { id, command, args }`

**CST_COMMAND_RESULT (App → Hub)**  
`data: { id, ok, result?, error? }`

## Manual Test Checklist (Phase 0)

- README describes what Hub is and is not.
- README lists offline and no-network constraints.
- README includes the required folder structure.
- README documents the postMessage contract.

