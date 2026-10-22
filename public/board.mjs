export const statuses = ['Open', 'In progress', 'Resolved'];

export const seedIssues = [
  { id: 'LAB-101', title: 'Recalibrate the rooftop sensor', site: 'Juniper Station', owner: 'Team Cedar', priority: 'Medium', status: 'Open', description: 'The simulated temperature sensor reads two degrees above its reference. Review the training calibration checklist.' },
  { id: 'LAB-102', title: 'Restore the demo gateway heartbeat', site: 'Harbor Lab', owner: 'Team Maple', priority: 'High', status: 'In progress', description: 'The synthetic gateway missed its last heartbeat. Use the mock diagnostic panel to record a recovery.' },
  { id: 'LAB-103', title: 'Label the spare equipment cabinet', site: 'Cobalt Depot', owner: 'Team Birch', priority: 'Low', status: 'Resolved', description: 'Training spare parts need consistent labels. The sample inventory has been reconciled.' },
  { id: 'LAB-104', title: 'Inspect the test cooling loop', site: 'Juniper Station', owner: 'Team Maple', priority: 'High', status: 'Open', description: 'A simulated pressure alert requires inspection. This record does not control physical equipment.' },
  { id: 'LAB-105', title: 'Refresh the maintenance checklist', site: 'Harbor Lab', owner: 'Team Cedar', priority: 'Low', status: 'Open', description: 'Add the new training inspection steps to the sample checklist before the next practice run.' },
  { id: 'LAB-106', title: 'Verify the backup power indicator', site: 'Cobalt Depot', owner: 'Team Birch', priority: 'Medium', status: 'In progress', description: 'The demo indicator is awaiting verification. Record the result after reviewing the fictional readings.' }
];

export function advanceIssue(issues, id) {
  const issue = issues.find((entry) => entry.id === id);
  if (!issue) throw new Error('Unknown issue.');
  return issues.map((entry) => entry.id === id
    ? { ...entry, status: statuses[(statuses.indexOf(entry.status) + 1) % statuses.length] }
    : entry);
}

export function summarize(issues) {
  return Object.fromEntries(statuses.map((status) => [
    status, issues.filter((issue) => issue.status === status).length
  ]));
}
