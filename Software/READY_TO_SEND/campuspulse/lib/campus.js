const { randomUUID } = require("crypto");

const ALLOWED_STATUSES = ["Reported", "Triaged", "In Progress", "Resolved"];
const ALLOWED_CATEGORIES = ["Water", "Safety", "Hostel", "Transport", "Labs", "General"];

function normalizeText(value) {
  return String(value || "").trim();
}

function createIssue(payload, now = new Date()) {
  const title = normalizeText(payload.title);
  const location = normalizeText(payload.location);
  const category = normalizeText(payload.category || "General");
  const description = normalizeText(payload.description);
  const contact = normalizeText(payload.contact || "Anonymous");

  if (title.length < 6) throw new Error("Title should be at least 6 characters.");
  if (location.length < 2) throw new Error("Location is required.");
  if (!ALLOWED_CATEGORIES.includes(category)) throw new Error("Invalid category.");
  if (description.length < 12) throw new Error("Description should be at least 12 characters.");

  const createdAt = now.toISOString();
  return {
    id: randomUUID(),
    title,
    location,
    category,
    description,
    contact,
    status: "Reported",
    votes: 1,
    createdAt,
    updatedAt: createdAt,
    updates: [
      {
        at: createdAt,
        type: "status",
        message: "Issue reported to CampusPulse.",
        author: contact
      }
    ]
  };
}

function ensureIssueShape(issue) {
  return {
    contact: "Anonymous",
    updatedAt: issue.createdAt,
    updates: [],
    ...issue
  };
}

function priorityScore(issue, now = new Date()) {
  const created = new Date(issue.createdAt).getTime();
  const ageHours = Number.isFinite(created) ? Math.max(0, (now.getTime() - created) / 36e5) : 0;
  const statusBoost = issue.status === "Reported" ? 8 : issue.status === "Triaged" ? 5 : issue.status === "In Progress" ? 2 : -12;
  return Math.round(issue.votes * 4 + Math.min(ageHours, 96) * 0.35 + statusBoost);
}

function summarize(issues, now = new Date()) {
  const normalized = issues.map(ensureIssueShape);
  const open = normalized.filter(issue => issue.status !== "Resolved").length;
  const resolved = normalized.length - open;
  const votes = normalized.reduce((sum, issue) => sum + issue.votes, 0);
  const statusBreakdown = breakdownBy(normalized, "status", ALLOWED_STATUSES);
  const categoryBreakdown = breakdownBy(normalized, "category", ALLOWED_CATEGORIES)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const topCategory = Object.entries(
    normalized.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  const topIssue = [...normalized]
    .filter(issue => issue.status !== "Resolved")
    .sort((a, b) => priorityScore(b, now) - priorityScore(a, now))[0];

  return {
    total: normalized.length,
    open,
    resolved,
    votes,
    topCategory,
    topIssue: topIssue ? topIssue.title : "None",
    resolutionRate: normalized.length ? Math.round((resolved / normalized.length) * 100) : 0,
    statusBreakdown,
    categoryBreakdown,
    averagePriority: normalized.length
      ? Math.round(normalized.reduce((sum, issue) => sum + priorityScore(issue, now), 0) / normalized.length)
      : 0
  };
}

function breakdownBy(issues, field, order = []) {
  const counts = issues.reduce((acc, issue) => {
    const key = issue[field] || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const names = [...new Set([...order, ...Object.keys(counts)])];
  return names
    .map(name => ({ name, count: counts[name] || 0 }))
    .filter(item => item.count > 0 || order.includes(item.name));
}

function filterIssues(issues, query = {}) {
  const category = normalizeText(query.category || "all");
  const status = normalizeText(query.status || "all");
  const search = normalizeText(query.search).toLowerCase();
  const sort = normalizeText(query.sort || "priority");

  let result = issues.map(ensureIssueShape).filter(issue => {
    const matchesCategory = category === "all" || issue.category === category;
    const matchesStatus = status === "all" || issue.status === status;
    const haystack = `${issue.title} ${issue.location} ${issue.description} ${issue.category}`.toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    return matchesCategory && matchesStatus && matchesSearch;
  });

  if (sort === "newest") {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === "votes") {
    result.sort((a, b) => b.votes - a.votes);
  } else if (sort === "status") {
    result.sort((a, b) => ALLOWED_STATUSES.indexOf(a.status) - ALLOWED_STATUSES.indexOf(b.status));
  } else {
    result.sort((a, b) => priorityScore(b) - priorityScore(a));
  }

  return result.map(issue => ({
    ...issue,
    priorityScore: priorityScore(issue),
    recommendation: recommendAction(issue)
  }));
}

function addUpdate(issue, payload, now = new Date()) {
  const message = normalizeText(payload.message);
  const author = normalizeText(payload.author || "CampusPulse volunteer");
  if (message.length < 8) throw new Error("Update should be at least 8 characters.");
  const next = ensureIssueShape(issue);
  const at = now.toISOString();
  next.updates = [
    ...(next.updates || []),
    {
      at,
      type: "note",
      message,
      author
    }
  ];
  next.updatedAt = at;
  return next;
}

function recommendAction(issue) {
  const shaped = ensureIssueShape(issue);
  if (shaped.status === "Resolved") return "Publish the fix, thank contributors, and watch for repeat reports.";
  if (shaped.status === "In Progress") return "Share the next checkpoint publicly and attach owner/date details.";
  if (shaped.status === "Triaged") return "Convert the signal into a small action ticket with an owner and target date.";
  if (shaped.votes >= 30) return "Escalate for triage today because many students are affected.";
  if (shaped.category === "Safety") return "Verify location details quickly and route to the responsible body.";
  return "Collect one more confirmation, then decide whether to triage or close as duplicate.";
}

function updateStatus(issue, status, now = new Date()) {
  const nextStatus = normalizeText(status);
  if (!ALLOWED_STATUSES.includes(nextStatus)) throw new Error("Invalid status");
  const next = ensureIssueShape(issue);
  const at = now.toISOString();
  next.status = nextStatus;
  next.updatedAt = at;
  next.updates = [
    ...(next.updates || []),
    {
      at,
      type: "status",
      message: `Status changed to ${nextStatus}.`,
      author: "Technical Council"
    }
  ];
  return next;
}

function toCsv(issues) {
  const headers = ["id", "title", "category", "location", "status", "votes", "priorityScore", "createdAt", "updatedAt"];
  const rows = issues.map(issue => {
    const shaped = ensureIssueShape(issue);
    return {
      ...shaped,
      priorityScore: priorityScore(shaped)
    };
  });
  const escape = value => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [
    headers.join(","),
    ...rows.map(row => headers.map(header => escape(row[header])).join(","))
  ].join("\n");
}

module.exports = {
  ALLOWED_CATEGORIES,
  ALLOWED_STATUSES,
  addUpdate,
  createIssue,
  ensureIssueShape,
  filterIssues,
  priorityScore,
  recommendAction,
  summarize,
  toCsv,
  updateStatus
};
