import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceIssue, seedIssues, statuses, summarize } from '../public/board.mjs';

test('baseline contains six unique synthetic tickets and every status and priority', () => {
  assert.equal(seedIssues.length, 6);
  assert.equal(new Set(seedIssues.map((issue) => issue.id)).size, 6);
  assert.deepEqual(new Set(seedIssues.map((issue) => issue.status)), new Set(statuses));
  assert.deepEqual(new Set(seedIssues.map((issue) => issue.priority)), new Set(['High', 'Medium', 'Low']));
  assert.deepEqual(summarize(seedIssues), { Open: 3, 'In progress': 2, Resolved: 1 });
});

test('status advancement cycles without mutating the baseline or other records', () => {
  const original = structuredClone(seedIssues);
  let issues = seedIssues;
  for (const status of ['In progress', 'Resolved', 'Open']) {
    issues = advanceIssue(issues, 'LAB-101');
    assert.equal(issues[0].status, status);
    assert.deepEqual(issues.slice(1), original.slice(1));
  }
  assert.deepEqual(seedIssues, original);
});

test('summary follows current state, including empty boards', () => {
  assert.deepEqual(summarize(advanceIssue(seedIssues, 'LAB-101')), { Open: 2, 'In progress': 3, Resolved: 1 });
  assert.deepEqual(summarize([]), { Open: 0, 'In progress': 0, Resolved: 0 });
});

test('unknown issue cannot be silently advanced', () => {
  assert.throws(() => advanceIssue(seedIssues, 'LAB-999'), /Unknown issue/);
});
