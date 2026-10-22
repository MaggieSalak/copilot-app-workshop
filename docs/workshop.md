# Supervise two sessions in 30 minutes

## Outcome

Each participant supervises two independent Copilot App sessions from the same baseline: **Session A adds status filtering; Session B adds priority sorting.** They inspect both apps in Browser canvas, review each diff and its evidence, and explain the boundary between worktree provisioning, dotenv loading, and public configuration.

The workshop is about supervision, not prompt speed. Participants already know GitHub and HVE. Use ordinary App sessions; no Squad, agent-team framework, custom canvas extension, or automated merge workflow is involved.

## Configuration provisioning preflight

Do this during [mandatory pre-work](../README.md#mandatory-pre-work), before the workshop timer starts. The facilitator should rehearse it on the same App build and local execution mode as participants.

1. In a dedicated training checkout registered with the App, confirm `.worktreeinclude` is tracked and contains `.env`, and that `.env` is ignored (`git check-ignore .env`). Use the synthetic example only. Give its title a recognizable synthetic marker such as `Field Lab / Practice Amber` before creating a session. This is a chosen probe location, **not a claim about which source the App reads**.
2. Through the App, create a disposable **worktree-backed project session** from the published baseline branch. Do not use a terminal-created `git worktree` as a substitute. Record the App version, execution location, baseline revision, registered checkout location, and resulting worktree location locally.
3. Before the agent or any command creates or copies a config file, inspect only this training `.env` in the resulting worktree. Check whether it exists and whether its title matches the marker. Record absent/present and whether it is a symlink; do not infer copy versus hard link from a regular-file result. Never print an entire environment or inspect unrelated `.env` files.
4. If the file is present, run `npm test` and `npm start` from that worktree and open its exact URL in Browser canvas. Verify the marker and the new workspace identity. Record this narrowly: **native provisioning observed for this App build, mode, and setup**. It does not prove source-selection rules, update propagation, general copy semantics, or cloud support.
5. If the file is absent, record **native provisioning not observed**. Use the explicit manual fallback below so the learning exercise can proceed. Do not describe the fallback as successful `.worktreeinclude` behavior. If demonstrating native provisioning is mandatory for your event, resolve this gate before scheduling the workshop.
6. Stop the disposable server and archive the disposable session once no work is needed. Keep the synthetic source configuration stable through the timed exercise. Do not edit session `.env` files to demonstrate isolation unless you have established that they are independent files.

### Explicit manual fallback

In each affected session's own worktree, create a missing `.env` from the tracked synthetic example:

```sh
test -e .env || cp .env.example .env
npm test
npm start
```

PowerShell equivalent for the first line:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

This is an explicit local copy from `.env.example`, not native App provisioning. It does not reproduce the source title marker unless you intentionally set that synthetic value. Never overwrite an existing `.env`, copy credentials, or add a hidden automatic setup script to make the observation appear successful.

### Evidence boundary

The [primary repository-configuration reference](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/repository-configuration) documents trusted scripts, server detection, and runtime variables, but does not define `.worktreeinclude`. The [agent-session reference](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions) describes session locations. Neither establishes native `.worktreeinclude` semantics in the evidence checked on 2026-10-22.

The repository deliberately leaves this uncertainty visible. A path-list file plus a standard Git worktree or a custom copy script is not a native App test. Keep any observation log local and free of real environment values.

## Timed flow

| Minutes | Participant action | Facilitator checkpoint |
| --- | --- | --- |
| 0-3 | Open the baseline, inspect `.worktreeinclude`, ignored `.env`, and `config.mjs`. State the pre-work provisioning observation. | Separate provisioning, loading, and browser exposure. Confirm synthetic values only. |
| 3-6 | Create two worktree-backed project sessions from the **same baseline**, named `Status filtering` and `Priority sorting`. Verify different worktree paths and branches. | Neither session is stacked on the other; neither shares a mutable checkout. |
| 6-9 | Give each session its exact prompt below. Let both agents work independently. | Each assignment has a bounded scope and visible acceptance criteria. |
| 9-17 | Alternate between sessions: read plans, inspect diffs, answer genuine blockers, and redirect scope creep. | Supervise decisions, not every keystroke. Never let either agent implement the other exercise. |
| 17-24 | Run each app in its own session; open each printed URL in Browser canvas. Perform the acceptance checks and inspect test evidence. | Match workspace/branch/instance/port before judging a result. A green test run is not a visual check. |
| 24-28 | Review both diffs. Give one evidence-based correction if needed; have that session fix and recheck it. | No accidental `.env` staging, broad refactor, dependencies, or missing tests. |
| 28-30 | Explain what you would approve and why, then stop both servers. | Capture one reusable supervision habit. Do not push, merge, or create a PR during this lab. |

If an agent runs past the checkpoint, use the current diff to practise inspection rather than waiting silently. Finish one acceptance check per session and record unfinished criteria honestly.

## Session setup

Use the App's project-session creation flow and select an isolated worktree for each session. Both must start from the published sample baseline (normally `main`), not another session's in-progress branch. UI labels can vary by build; confirm the resulting paths and branches rather than relying on a particular button label.

Use **Interactive** mode for this lab so you can steer each session and answer its permission requests. **Plan** is useful when you need to approve an approach before implementation; **Autopilot** is for a sufficiently bounded objective once its permissions are understood. Changing mode does not replace acceptance criteria or review.

In each session, ask the agent to report its current worktree path and branch, confirm `.env` is present without dumping it, and run `npm test`. If configuration is missing, use the pre-work fallback explicitly. A missing `.env` must not be silently worked around by weakening validation.

Keep both sessions independent. Give each only its own prompt. Do not ask one to coordinate, spawn, or import changes from the other.

## Exact prompt: Session A

```text
Implement status filtering for this synthetic field-service board in this
session's worktree. Read README.md and the existing code first. Do not implement
priority sorting, spawn other agents, add dependencies, or publish anything.

Add a clearly labelled status control with All (default), Open, In progress,
and Resolved. Show only matching tickets and a visible "Showing X of Y" count.
Keep the three summary counts board-wide, not filtered.

When a status changes, reapply the active filter. If the selected ticket becomes
hidden, clear its detail panel and put keyboard focus somewhere useful.
Show a helpful empty state when no tickets match. Reset demo must restore the
baseline records, clear selection, and return the filter to All.

Preserve ticket selection, keyboard operation, status advancement, the synthetic
banner, configuration allowlist, and visible workspace identity. Add focused
automated tests, including empty results and a status change under a filter.

Run npm test. Start this session's server on its dynamically assigned port and
open its printed URL in the existing Browser canvas. Check the acceptance
criteria in docs/workshop.md. Summarize changed files and remaining limitations.
Do not commit .env, push, create a PR, merge, or change the other session.
```

### Session A acceptance checks

| Check | Expected result |
| --- | --- |
| Initial view | All selected; six tickets; `Showing 6 of 6`. |
| Status choices | Open shows 3; In progress shows 2; Resolved shows 1 on the baseline. |
| Summary | Always counts all records: initially 3 / 2 / 1, regardless of filter. |
| Selected issue leaves filter | Filter Open, select LAB-101, move it to In progress: only 2 open tickets remain; details clear; focus is usable. |
| Empty result | Filter Resolved; select LAB-103 and move it to Open: no resolved tickets remain; helpful empty state and `Showing 0 of 6`. |
| Reset | All, six baseline records, original status counts, no selection. |
| Keyboard and evidence | Filter and ticket controls work by keyboard; focused tests cover empty and transition cases; `npm test` passes. |

## Exact prompt: Session B

```text
Implement priority sorting for this synthetic field-service board in this
session's worktree. Read README.md and the existing code first. Do not implement
status filtering, spawn other agents, add dependencies, or publish anything.

Add a clearly labelled sort control with Original order (default), High to low,
and Low to high. Use the domain order High > Medium > Low, not alphabetic order.
Preserve baseline order within equal-priority groups and do not mutate the
baseline fixture. Sorting must preserve selection and current status changes.
Reset demo restores baseline records, clears selection, and selects Original
order. Keep all six tickets visible and summary counts board-wide.

Preserve keyboard operation, status advancement, the synthetic banner,
configuration allowlist, and visible workspace identity. Add focused automated
tests for both directions, equal-priority ties, reset, and non-mutation.

Run npm test. Start this session's server on its dynamically assigned port and
open its printed URL in the existing Browser canvas. Check the acceptance
criteria in docs/workshop.md. Summarize changed files and remaining limitations.
Do not commit .env, push, create a PR, merge, or change the other session.
```

### Session B acceptance checks

| Check | Expected ticket order or behavior |
| --- | --- |
| Original order | LAB-101, LAB-102, LAB-103, LAB-104, LAB-105, LAB-106. |
| High to low | LAB-102, LAB-104, LAB-101, LAB-106, LAB-103, LAB-105. |
| Low to high | LAB-103, LAB-105, LAB-101, LAB-106, LAB-102, LAB-104. |
| Ties | Equal-priority issues keep their original relative order. |
| Selection and state | Select LAB-101, advance its status, then change sort direction: the same ticket stays selected and its changed status remains. |
| Counts | All six records stay visible; sorting does not change status totals. |
| Reset and evidence | Original order, baseline status counts, no selection; keyboard operation and focused tests pass. |

## Browser canvas supervision

Use **Run training app** in each trusted session, or ask that session to run `npm start` and keep it available for inspection. The script emits `Local: http://127.0.0.1:<port>` only after listening. If automatic detection does not open the preview, use this prompt with the actual URL:

```text
Open the exact local URL printed by this session's server in the existing
Browser canvas. Read the page and confirm its workspace, branch, instance ID,
and port match this session. Inspect the assigned acceptance criteria, including
keyboard behavior. Do not create a canvas extension or restart the other app.
```

Two running servers receive different available ports. A restart can change the port and instance ID: use the terminal's fresh URL, not an old tab. Both apps may look identical until exercise changes appear; the identity strip is the authority for which one you are inspecting.

Inspect what the user sees: labels, selected state, empty results, focus after a change, narrow layout, and errors. Then inspect the diff and automated evidence. Do not approve a visual claim based solely on an agent's summary.

## Review and cleanup

Before approval, check that only the assigned feature changed, no fixture was silently removed, no entire environment was exposed, and `.env` is still ignored and untracked. `git status --short` should not list it; `git ls-files -- .env` should print nothing. Do not use `git add -f .env`.

Stop both run scripts using their terminal controls or Ctrl+C. If an agent owns the server, ask it to stop that specific process. Verify the local URLs no longer respond. Do not use process-name-wide kill commands.

Keep sessions with useful uncommitted work until it has been reviewed or saved intentionally. Archive disposable sessions only after stopping their servers and confirming their work is no longer needed. Publishing, PR creation, combining both features, and merging are outside this 30-minute exercise and require separate review and authorization.

## Facilitator debrief

Ask participants to name the evidence that justified approval, one moment they redirected an agent, and which layer made their configuration visible. The intended distinction is: Git isolates tracked work; local-file provisioning is a separate App behavior to verify; `config.mjs` loads and validates `.env`; the allowlisted API response decides what reaches the browser.
