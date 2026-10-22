# Copilot App field lab

A 30-minute hands-on workshop for experienced forward-deployed engineers and solution engineers who already use GitHub and HVE. Supervise two independent agent sessions, inspect their work in Browser canvas, and decide whether each result meets its acceptance criteria.

The sample is a synthetic field-service issue board. Its baseline supports ticket selection, status changes, summary counts, and reset. **Status filtering and priority sorting are learner exercises, not completed features.** No Squad, external services, credentials, accounts for the sample, database, or cloud deployment is needed.

## Mandatory pre-work

Complete this before the 30-minute session. Budget 10-15 minutes; resolve access and installation problems beforehand.

1. Install and sign in to GitHub Copilot App with access to an agent model. Install Git and **Node.js 24 or later**. Confirm `git --version`, `node --version`, and `npm --version` work in the terminal the App uses. The sample has no package dependencies: **do not run `npm install`**.
2. Clone this repository and add that checkout as a project in Copilot App. Use a **local, worktree-backed** project, not cloud execution or two sessions sharing a branch checkout. On a supported local execution host, the Browser canvas must be able to reach the loopback URL.
3. Review `.github/github-app.yml` before accepting the App's repository configuration. Its two manual scripts run `npm start` and `npm test`; there are no automatic setup, copy, publish, or deployment scripts.
4. In the registered checkout, create `.env` from `.env.example` **only if `.env` does not already exist**. POSIX shell: `test -e .env || cp .env.example .env`. PowerShell: `if (-not (Test-Path .env)) { Copy-Item .env.example .env }`. Review an existing file yourself; use a dedicated training checkout containing synthetic values only. Never point the exercise at real credentials.
5. Run `npm test`, then `npm start`. Open the printed `Local: http://127.0.0.1:<port>` URL in Browser canvas. Confirm six tickets, a synthetic-data banner, and workspace/branch/instance/port identity. Select a ticket, change its status, then use **Reset demo**. Stop the server with Ctrl+C.
6. Complete the [configuration provisioning preflight](docs/workshop.md#configuration-provisioning-preflight) using a disposable App-created worktree session. This is essential: native `.worktreeinclude` behavior has not been established for every App build. Record whether native provisioning was observed or the explicit manual fallback was needed.
7. Check that your team's expected HVE skills or agents are visible in the App if you intend to use them. HVE is familiar context for this audience, not a runtime dependency of this exercise; no particular HVE agent or installation is required.

**Ready means:** the baseline runs, tests pass, Browser canvas opens the app, you can create isolated worktree sessions, and you know how `.env` will arrive in each one. Do not spend the timed workshop installing tools.

## Run and inspect

```sh
npm start
```

The OS assigns an available port on `127.0.0.1`; each server prints its own URL. There is no fixed port and the server does not use `COPILOT_PORT` (that variable is the App's WebSocket port). The App's **Run training app** script can detect this URL and open its integrated browser after configuration trust. If automatic opening is unavailable, ask the agent to open the exact printed URL in the existing Browser canvas.

Use the visible workspace, branch, short server-instance ID, and port to distinguish sessions. The server reads `.env` on startup. Restart it after config or server changes, and use the newly printed URL; reload the page after client edits by restarting as well, since the server snapshots static assets at startup.

Board changes live only in the browser tab. Reloading or resetting restores the six fictional records. Nothing controls equipment, calls an external API, or persists user input.

## Local configuration contract

| File or field | Purpose |
| --- | --- |
| `.env.example` | Tracked, fully populated synthetic starter values. |
| `.env` | Ignored local configuration. Required to start; never commit it. |
| `.worktreeinclude` | Tracked candidate provisioning list containing the literal `.env` entry. Native App behavior must be checked separately. |
| `WORKSHOP_TITLE` | Required public title, 1-64 characters. |
| `WORKSHOP_ACCENT` | Required public palette: `teal`, `blue`, or `violet`. |
| `WORKSHOP_BANNER` | Required public banner, 1-140 characters. Keep it explicitly synthetic. |

`config.mjs` explicitly reads the current working directory's `.env` using Node's dotenv parser. Required values must be non-empty and single-line; unknown fields are ignored. Values are not taken from shell environment variables. Only `{ title, accent, banner }` is sent as configuration to the browser, and visible strings are rendered as text. The server also sends the synthetic tickets and a limited identity object, never the whole process environment or an absolute checkout path.

**Provisioning is not loading.** `.worktreeinclude` neither loads dotenv values into this Node app nor establishes browser exposure. Those are separate responsibilities. No custom script in this repository implements or emulates `.worktreeinclude`.

Native `.worktreeinclude` semantics are **unverified as of 2026-10-22**: the primary App pages linked below do not specify copying versus linking, source-checkout selection, updates to existing sessions, or cloud support. The workshop includes an observation protocol and an explicitly labelled manual fallback, not a claim that these behaviors are supported.

## Workshop and code map

Follow the [30-minute workshop guide and exact prompts](docs/workshop.md).

| Path | Responsibility |
| --- | --- |
| `server.mjs` | Loopback HTTP server, dynamic port, workspace identity, fixed public routes. |
| `config.mjs` | Required local configuration validation and public allowlist. |
| `public/board.mjs` | Synthetic fixtures and status/summary behavior. |
| `public/app.mjs` | Ticket UI and per-tab state. |
| `public/styles.css` | Responsive layout and three controlled accent palettes. |
| `test/*.test.mjs` | Built-in Node tests for config, board behavior, HTTP exposure, and concurrent servers. |
| `.github/github-app.yml` | Reviewed App instructions, manual scripts, and URL detection. |

Run all automated checks with `npm test`. There is no separate build or lint toolchain. Browser acceptance checks are in the workshop guide. The tests exercise concurrent independent server roots; they are **not** evidence of native App provisioning.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| `Missing .env` | Check the active workspace, complete the provisioning preflight, or use its manual fallback. Do not remove the startup check. |
| Invalid config | Correct the named field in your own training `.env`; values are intentionally omitted from errors. |
| Wrong title, branch, or board | Check the canvas URL against that session's terminal and on-page identity. |
| Server stopped or restarted | Start it again and open its newly printed URL. |
| Client changes not visible | Restart this session's server, then open the new URL. Static assets are read at startup. |
| Automatic preview did not open | Review/accept repository configuration, run its manual script, or open the exact URL in Browser canvas manually. |
| One session's change appears in another | Verify separate worktree paths and branch names; do not use a shared mutable checkout. Each browser tab also has independent board state. |

## Primary references

- [Copilot App agent sessions](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions)
- [Repository configuration and script environment](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/repository-configuration)
- [Working with canvases](https://docs.github.com/en/copilot/how-tos/github-copilot-app/working-with-canvas-extensions)
- [Customizing Copilot App](https://docs.github.com/en/copilot/how-tos/github-copilot-app/customize-github-copilot-app)

This training sample and guide were developed with AI assistance. Review agent changes before publishing or merging them.
