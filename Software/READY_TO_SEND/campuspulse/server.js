const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const {
  addUpdate,
  createIssue,
  ensureIssueShape,
  filterIssues,
  recommendAction,
  summarize,
  toCsv,
  updateStatus
} = require("./lib/campus");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_FILE = path.join(ROOT, "data", "issues.json");

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

async function readIssues() {
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

async function writeIssues(issues) {
  await fs.writeFile(DATA_FILE, JSON.stringify(issues, null, 2));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, payload, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    ...headers
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON payload"));
      }
    });
    req.on("error", reject);
  });
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/api/issues") {
    const issues = await readIssues();
    sendJson(res, 200, filterIssues(issues, Object.fromEntries(url.searchParams)));
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/issues.csv") {
    const issues = filterIssues(await readIssues(), Object.fromEntries(url.searchParams));
    sendText(res, 200, toCsv(issues), {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"campuspulse-issues.csv\""
    });
    return;
  }

  const detailMatch = url.pathname.match(/^\/api\/issues\/([^/]+)$/);
  if (req.method === "GET" && detailMatch) {
    const issues = await readIssues();
    const issue = issues.map(ensureIssueShape).find(item => item.id === detailMatch[1]);
    if (!issue) {
      sendJson(res, 404, { error: "Issue not found" });
      return;
    }
    sendJson(res, 200, { ...issue, recommendation: recommendAction(issue) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/stats") {
    const issues = await readIssues();
    sendJson(res, 200, summarize(issues));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/issues") {
    const payload = await readBody(req);
    const issue = createIssue(payload);
    const issues = await readIssues();
    issues.unshift(issue);
    await writeIssues(issues);
    sendJson(res, 201, issue);
    return;
  }

  const voteMatch = url.pathname.match(/^\/api\/issues\/([^/]+)\/vote$/);
  if (req.method === "PATCH" && voteMatch) {
    const issues = await readIssues();
    const issue = issues.find(item => item.id === voteMatch[1]);
    if (!issue) {
      sendJson(res, 404, { error: "Issue not found" });
      return;
    }
    issue.votes += 1;
    issue.updatedAt = new Date().toISOString();
    await writeIssues(issues);
    sendJson(res, 200, ensureIssueShape(issue));
    return;
  }

  const statusMatch = url.pathname.match(/^\/api\/issues\/([^/]+)\/status$/);
  if (req.method === "PATCH" && statusMatch) {
    const payload = await readBody(req);
    const issues = await readIssues();
    const index = issues.findIndex(item => item.id === statusMatch[1]);
    const issue = issues[index];
    if (!issue) {
      sendJson(res, 404, { error: "Issue not found" });
      return;
    }
    issues[index] = updateStatus(issue, payload.status);
    await writeIssues(issues);
    sendJson(res, 200, ensureIssueShape(issues[index]));
    return;
  }

  const updateMatch = url.pathname.match(/^\/api\/issues\/([^/]+)\/updates$/);
  if (req.method === "POST" && updateMatch) {
    const payload = await readBody(req);
    const issues = await readIssues();
    const index = issues.findIndex(item => item.id === updateMatch[1]);
    const issue = issues[index];
    if (!issue) {
      sendJson(res, 404, { error: "Issue not found" });
      return;
    }
    issues[index] = addUpdate(issue, payload);
    await writeIssues(issues);
    sendJson(res, 201, ensureIssueShape(issues[index]));
    return;
  }

  sendJson(res, 404, { error: "API route not found" });
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.resolve(PUBLIC_DIR, requested);

  if (!filePath.startsWith(path.resolve(PUBLIC_DIR))) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const ext = path.extname(filePath);
    const content = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream" });
    res.end(content);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/")) {
      await handleApi(req, res);
      return;
    }
    await serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`CampusPulse running at http://localhost:${PORT}`);
});
