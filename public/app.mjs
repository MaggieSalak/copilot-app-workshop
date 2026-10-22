import { advanceIssue, statuses, summarize } from './board.mjs';

const byId = (id) => document.getElementById(id);
const node = (tag, text, className) => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
};
let issues = [];
let baseline = [];
let selectedId = null;

function render() {
  byId('summary').replaceChildren(...Object.entries(summarize(issues)).map(([status, count]) => {
    const card = node('div', undefined, 'summary-card');
    card.append(node('span', status), node('strong', String(count)));
    return card;
  }));
  byId('issues').replaceChildren(...issues.map((issue) => {
    const item = node('li');
    const button = node('button', undefined, 'issue');
    button.type = 'button';
    button.dataset.issueId = issue.id;
    button.setAttribute('aria-pressed', String(issue.id === selectedId));
    const meta = node('span', undefined, 'issue-meta');
    meta.append(node('span', issue.id, 'ticket-id'), node('span', `${issue.priority} priority`, `priority ${issue.priority.toLowerCase()}`));
    button.append(meta, node('strong', issue.title), node('span', `${issue.site} / ${issue.owner}`, 'site'), node('span', issue.status, 'status'));
    button.addEventListener('click', () => {
      selectedId = issue.id;
      render();
      byId('issues').querySelector(`[data-issue-id="${issue.id}"]`).focus();
      byId('announcement').textContent = `Selected ${issue.id}. Details follow the issue list.`;
    });
    item.append(button);
    return item;
  }));
  renderDetail();
}

function renderDetail() {
  const issue = issues.find((entry) => entry.id === selectedId);
  const detail = byId('detail');
  const heading = node('h2', issue?.title ?? 'Choose a ticket');
  heading.id = 'detail-heading';
  detail.replaceChildren(node('p', issue?.id ?? 'TICKET DETAILS', 'eyebrow'), heading);
  if (!issue) {
    detail.append(node('p', 'Select any issue to inspect its details.'));
    return;
  }
  const nextStatus = statuses[(statuses.indexOf(issue.status) + 1) % statuses.length];
  const action = node('button', `Move to ${nextStatus}`, 'primary');
  action.type = 'button';
  action.id = 'advance';
  action.addEventListener('click', () => {
    issues = advanceIssue(issues, issue.id);
    render();
    byId('advance').focus();
    byId('announcement').textContent = `${issue.id} moved to ${nextStatus}.`;
  });
  detail.append(node('p', issue.description), node('p', `${issue.owner} / ${issue.site}`, 'site'), node('p', `Status: ${issue.status} | Priority: ${issue.priority}`), action, node('p', 'Changes stay in this browser tab only.', 'hint'));
}

async function boot() {
  try {
    const response = await fetch('/api/board');
    if (!response.ok) throw new Error(`Board request failed (${response.status}).`);
    const data = await response.json();
    document.title = data.config.title;
    byId('app-title').textContent = data.config.title;
    byId('banner').textContent = data.config.banner;
    document.documentElement.dataset.accent = data.config.accent;
    for (const [label, value] of Object.entries(data.workspace)) {
      byId('identity').append(node('dt', label), node('dd', String(value)));
    }
    baseline = data.issues;
    issues = structuredClone(baseline);
    byId('reset').disabled = false;
    byId('reset').addEventListener('click', () => {
      issues = structuredClone(baseline);
      selectedId = null;
      render();
      byId('announcement').textContent = 'Demo reset. All six training tickets restored.';
    });
    render();
  } catch (error) {
    console.error('Board initialization failed.', error);
    byId('error').hidden = false;
    byId('error').textContent = 'Cannot load the board. Check the server terminal, then reload this page.';
    byId('banner').textContent = 'Training configuration unavailable';
  }
}

await boot();
