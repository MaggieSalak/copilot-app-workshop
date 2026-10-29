# Copilot App workshop

Take a small UI change from GitHub issue to pull request. You need Git, Node.js 24 or later, and Copilot App signed in to GitHub. The webapp uses synthetic data and has no dependencies; no `npm install` is needed.

## 1. Fork and clone

[Fork this repository on GitHub](https://github.com/algattik/copilot-app-workshop/fork). In Copilot App, start a session, choose **Clone repository**, and select **your fork**, not the upstream repository.

## 2. Choose a color in the main checkout

Select **This computer**, **Current checkout**, branch **main**, and **Interactive** mode. This uses the cloned checkout rather than creating another worktree. Ask Copilot:

```text
Confirm this is my fork's main checkout. If .env is missing, copy
.env.example to .env. Set only WORKSHOP_ACCENT in .env to violet;
preserve the other values. Never commit .env or print unrelated
environment variables.
```

Choose `teal`, `blue`, or `violet` in that prompt. This performs `cp .env.example .env` only when `.env` is missing.

## 3. Run and inspect

Review the repository configuration before accepting it, then ask:

```text
Run npm test. Start the app with npm start and open its printed
loopback URL in Browser canvas. Keep the server running.
```

Check your chosen color, six synthetic tickets, and the workspace/branch identity. Select a ticket, change its status, and click **Reset demo**. The server chooses an available port; always use its exact printed URL. Restart after config or client edits.

## 4. Create an issue in your fork

Ask Copilot:

```text
Create a GitHub issue in my fork titled "Rename Reset demo to
Restore demo". Request only the visible button-label change;
keep reset behavior unchanged. Do not implement it yet.
```

Confirm that the issue belongs to your fork.

## 5. Create an issue session, implement, and inspect

In the App's **Issues** sidebar, open your issue and click **New session**. Use **This computer**, **New worktree** based on **main**, and **Interactive** mode. The App creates the worktree; no manual Git worktree setup is needed. Ask Copilot to implement only this issue.

**The new worktree needs `.env` before the webapp can run.** It is ignored by Git, so it is not part of the checkout. Check whether the App provisioned it; if it is missing, copy only the synthetic `.env` from your original checkout into this worktree. Do not overwrite an existing file or commit it. You can ask Copilot to do this, supplying the original checkout path when needed.

**Before creating a PR, run and inspect the fix yourself.** In the issue session, ask:

```text
Confirm .env exists in this worktree. Run npm test, start this
session's app with npm start, and open its exact printed loopback
URL in Browser canvas. Keep it running for me to inspect.
```

Check the page's branch identity so you are not inspecting the original app. Confirm your color and **Restore demo**, change a ticket's status, and click the button to verify reset behavior is unchanged.

## 6. Create a pull request

Review the diff, then ask:

```text
Commit the issue's changes without .env. Push the branch to my fork
and create a PR targeting main in my fork, linked to this issue.
Do not merge it.
```

Approve publishing when prompted. Check the PR's destination, issue link, and diff.

## 7. Archive the session

Ask each session to stop its own app server. Once the issue session's changes are saved in the PR, archive that session using the App's session controls. Leave the PR open for review; archiving a session does not close its issue or merge its PR.
