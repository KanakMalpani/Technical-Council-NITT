const test = require("node:test");
const assert = require("node:assert/strict");

const {
  addUpdate,
  createIssue,
  filterIssues,
  priorityScore,
  recommendAction,
  summarize,
  toCsv,
  updateStatus
} = require("../lib/campus");

const now = new Date("2026-07-05T00:00:00.000Z");

function sampleIssues() {
  return [
    {
      id: "water",
      title: "Water station is dry",
      location: "Octagon",
      category: "Water",
      description: "The refill station is empty after dinner.",
      status: "Reported",
      votes: 20,
      createdAt: "2026-07-04T00:00:00.000Z",
      updatedAt: "2026-07-04T00:00:00.000Z",
      updates: []
    },
    {
      id: "path",
      title: "Pathway lighting is weak",
      location: "Hostel road",
      category: "Safety",
      description: "The route needs stronger lighting at night.",
      status: "Resolved",
      votes: 8,
      createdAt: "2026-07-01T00:00:00.000Z",
      updatedAt: "2026-07-02T00:00:00.000Z",
      updates: []
    },
    {
      id: "queue",
      title: "Laundry queue is unpredictable",
      location: "Hostel laundry",
      category: "Hostel",
      description: "Students waste time checking machine availability.",
      status: "In Progress",
      votes: 15,
      createdAt: "2026-07-03T00:00:00.000Z",
      updatedAt: "2026-07-03T00:00:00.000Z",
      updates: []
    }
  ];
}

test("createIssue validates and creates a report with an initial timeline", () => {
  const issue = createIssue(
    {
      title: "Broken lab projector",
      location: "Orion 201",
      category: "Labs",
      description: "The projector flickers during lectures.",
      contact: "firstyear@nitt.edu"
    },
    now
  );

  assert.equal(issue.status, "Reported");
  assert.equal(issue.votes, 1);
  assert.equal(issue.updates.length, 1);
  assert.equal(issue.contact, "firstyear@nitt.edu");
});

test("createIssue rejects invalid reports", () => {
  assert.throws(
    () => createIssue({ title: "Bad", location: "", category: "Water", description: "short" }, now),
    /Title should be/
  );
  assert.throws(
    () => createIssue({ title: "Valid title", location: "Admin block", category: "Invalid", description: "Long enough description" }, now),
    /Invalid category/
  );
});

test("summarize returns impact stats and top issue", () => {
  const stats = summarize(sampleIssues(), now);
  assert.equal(stats.total, 3);
  assert.equal(stats.open, 2);
  assert.equal(stats.resolved, 1);
  assert.equal(stats.resolutionRate, 33);
  assert.equal(stats.topCategory, "Water");
  assert.equal(stats.topIssue, "Water station is dry");
  assert.equal(stats.averagePriority > 0, true);
  assert.deepEqual(
    stats.statusBreakdown.filter(item => item.count > 0).map(item => [item.name, item.count]),
    [["Reported", 1], ["In Progress", 1], ["Resolved", 1]]
  );
  assert.equal(stats.categoryBreakdown[0].name, "Hostel");
});

test("filterIssues supports category, status, search, and priority sorting", () => {
  const filtered = filterIssues(sampleIssues(), {
    category: "Water",
    status: "Reported",
    search: "octagon",
    sort: "priority"
  });

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, "water");
  assert.ok(filtered[0].priorityScore > 0);
  assert.match(filtered[0].recommendation, /Escalate|Collect|Verify/);
});

test("priorityScore gives unresolved high-vote issues a higher score", () => {
  const [water, path] = sampleIssues();
  assert.ok(priorityScore(water, now) > priorityScore(path, now));
});

test("updateStatus appends a status timeline entry", () => {
  const issue = updateStatus(sampleIssues()[0], "In Progress", now);
  assert.equal(issue.status, "In Progress");
  assert.equal(issue.updates.at(-1).message, "Status changed to In Progress.");
});

test("addUpdate appends a note timeline entry", () => {
  const issue = addUpdate(sampleIssues()[0], { message: "Maintenance team informed.", author: "TC volunteer" }, now);
  assert.equal(issue.updates.at(-1).type, "note");
  assert.equal(issue.updates.at(-1).author, "TC volunteer");
});

test("toCsv exports issue rows with escaped values", () => {
  const csv = toCsv([{ ...sampleIssues()[0], title: 'Water "station" dry' }]);
  assert.match(csv, /priorityScore/);
  assert.match(csv, /"Water ""station"" dry"/);
});

test("recommendAction returns contextual next steps", () => {
  assert.match(recommendAction(sampleIssues()[0]), /Escalate|Collect|Verify/);
  assert.match(recommendAction({ ...sampleIssues()[0], status: "In Progress" }), /checkpoint/);
  assert.match(recommendAction(sampleIssues()[1]), /Publish/);
});
