const state = {
  issues: [],
  selectedId: undefined
};

const els = {
  categoryFilter: document.querySelector("#categoryFilter"),
  closeDetail: document.querySelector("#closeDetail"),
  csvLink: document.querySelector("#csvLink"),
  detailCategory: document.querySelector("#detailCategory"),
  detailDescription: document.querySelector("#detailDescription"),
  detailMeta: document.querySelector("#detailMeta"),
  detailTitle: document.querySelector("#detailTitle"),
  emptyDetail: document.querySelector("#emptyDetail"),
  formMessage: document.querySelector("#formMessage"),
  issueDetail: document.querySelector("#issueDetail"),
  issueList: document.querySelector("#issueList"),
  noteForm: document.querySelector("#noteForm"),
  averagePriority: document.querySelector("#averagePriority"),
  categoryHeat: document.querySelector("#categoryHeat"),
  nextAction: document.querySelector("#nextAction"),
  openCount: document.querySelector("#openCount"),
  reportForm: document.querySelector("#reportForm"),
  resolutionRate: document.querySelector("#resolutionRate"),
  resolvedCount: document.querySelector("#resolvedCount"),
  search: document.querySelector("#search"),
  sortBy: document.querySelector("#sortBy"),
  statusFilter: document.querySelector("#statusFilter"),
  statusForm: document.querySelector("#statusForm"),
  statusRunway: document.querySelector("#statusRunway"),
  timelineList: document.querySelector("#timelineList"),
  topCategory: document.querySelector("#topCategory"),
  topIssue: document.querySelector("#topIssue"),
  totalCount: document.querySelector("#totalCount"),
  voteCount: document.querySelector("#voteCount")
};

const showcaseStats = {
  total: 0,
  open: 0,
  resolved: 0,
  resolutionRate: 0,
  votes: 0,
  topIssue: "Loading top priority signal…",
  topCategory: "—",
  averagePriority: 0
};

const productEls = {
  cinema: document.querySelector("#productCinema"),
  deviceWrap: document.querySelector("#productDeviceWrap"),
  screen: document.querySelector("#productScreen"),
  sceneCopies: [...document.querySelectorAll(".scene-copy")],
  scenePills: [...document.querySelectorAll(".scene-pill")],
  statSignals: document.querySelector("#showcaseStatSignals"),
  statVotes: document.querySelector("#showcaseStatVotes"),
  statRate: document.querySelector("#showcaseStatRate"),
  topIssueFoot: document.querySelector("#showcaseTopIssue"),
  mainContent: document.querySelector("#mainContent")
};

const PRODUCT_SCENE_COUNT = productEls.sceneCopies.length || 5;

function mockChrome(label = "Live preview") {
  return `
    <div class="mock-bar">
      <div class="mock-bar-left">
        <span class="mock-dot"></span>
        <span class="mock-dot"></span>
        <span class="mock-dot"></span>
        <span class="mock-title">CampusPulse</span>
      </div>
      <span class="mock-badge">${label}</span>
    </div>
  `;
}

function renderProductMockScene(index) {
  const stats = showcaseStats;

  const scenes = [
    `<div class="mock-shell">
      ${mockChrome("New signal")}
      <div class="mock-card">
        <strong>Raise a campus signal</strong>
        <p>Describe what you see and where it is happening.</p>
      </div>
      <div class="mock-fields">
        <div class="mock-field"><span>Title</span><em>Broken projector in LH-204</em></div>
        <div class="mock-field"><span>Location</span><em>Lecture Hall Block · LH-204</em></div>
        <div class="mock-field"><span>Category</span><em>Infrastructure</em></div>
      </div>
      <button class="mock-btn" type="button">Submit signal</button>
    </div>`,
    `<div class="mock-shell">
      ${mockChrome("Community vote")}
      <div class="mock-list">
        <div class="mock-list-item">
          <div>
            <strong>Water leakage near hostel block</strong>
            <span>42 votes · Open</span>
          </div>
          <div class="mock-score"><span>Score</span><b>88</b></div>
        </div>
        <div class="mock-list-item">
          <div>
            <strong>Wi‑Fi dead zone in library</strong>
            <span>31 votes · Triaged</span>
          </div>
          <div class="mock-score"><span>Score</span><b>74</b></div>
        </div>
      </div>
      <button class="mock-btn" type="button">Vote for this signal</button>
    </div>`,
    `<div class="mock-shell">
      ${mockChrome("Priority board")}
      <div class="mock-metrics">
        <div><span>Open</span><strong>${stats.open}</strong></div>
        <div><span>Resolved</span><strong>${stats.resolved}</strong></div>
        <div><span>Avg priority</span><strong>${stats.averagePriority}</strong></div>
      </div>
      <div class="mock-card">
        <strong>${escapeHtml(stats.topIssue)}</strong>
        <p>Top category: ${escapeHtml(stats.topCategory)} · sorted by urgency</p>
      </div>
      <div class="mock-row">
        <span class="mock-chip accent">Highest impact</span>
        <span class="mock-chip">Sort by priority</span>
      </div>
    </div>`,
    `<div class="mock-shell">
      ${mockChrome("Timeline")}
      <div class="mock-timeline">
        <div class="mock-step"><span>Reported</span><strong>Signal submitted by student</strong></div>
        <div class="mock-step"><span>Triaged</span><strong>Issue reviewed by volunteer</strong></div>
        <div class="mock-step"><span>In progress</span><strong>Maintenance team assigned</strong></div>
      </div>
      <div class="mock-card">
        <strong>Volunteer note</strong>
        <p>ETA shared with students. Updates stay visible to everyone.</p>
      </div>
    </div>`,
    `<div class="mock-shell">
      ${mockChrome("Resolution runway")}
      <div class="mock-metrics">
        <div><span>Signals</span><strong>${stats.total}</strong></div>
        <div><span>Votes</span><strong>${stats.votes}</strong></div>
        <div><span>Resolved</span><strong>${stats.resolutionRate}%</strong></div>
      </div>
      <div class="mock-row">
        <span class="mock-chip">Reported</span>
        <span class="mock-chip">Triaged</span>
        <span class="mock-chip accent">In Progress</span>
        <span class="mock-chip">Resolved</span>
      </div>
      <div class="mock-card">
        <strong>Campus improvement, end to end</strong>
        <p>Nothing disappears into informal channels.</p>
      </div>
    </div>`
  ];

  return scenes[index] || scenes[0];
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const contentType = response.headers.get("Content-Type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function queryString() {
  const params = new URLSearchParams({
    category: els.categoryFilter.value,
    status: els.statusFilter.value,
    sort: els.sortBy.value
  });
  const search = els.search.value.trim();
  if (search) params.set("search", search);
  return params.toString();
}

function statusClass(status) {
  return {
    "Reported": "status-reported",
    "Triaged": "status-triaged",
    "In Progress": "status-progress",
    "Resolved": "status-resolved"
  }[status] || "";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderStats(stats) {
  els.totalCount.textContent = stats.total;
  els.openCount.textContent = stats.open;
  els.resolvedCount.textContent = stats.resolved;
  els.resolutionRate.textContent = `${stats.resolutionRate}%`;
  els.topCategory.textContent = stats.topCategory;
  els.topIssue.textContent = stats.topIssue;
  els.voteCount.textContent = stats.votes;
  els.averagePriority.textContent = stats.averagePriority;
  renderRunway(stats);
  updateProductShowcase(stats);
}

function renderRunway(stats) {
  const total = Math.max(1, stats.total || 0);
  const fills = {
    "Reported": "var(--coral)",
    "Triaged": "var(--gold)",
    "In Progress": "var(--blue)",
    "Resolved": "var(--teal)"
  };
  els.statusRunway.innerHTML = (stats.statusBreakdown || []).map(item => {
    const width = Math.max(7, Math.round((item.count / total) * 100));
    return `
      <article class="status-lane">
        <header>
          <span class="chip-label">${escapeHtml(item.name)}</span>
          <strong>${item.count}</strong>
        </header>
        <div class="lane-track" aria-hidden="true">
          <div class="lane-fill" style="width:${width}%;background:${fills[item.name] || "var(--teal)"}"></div>
        </div>
      </article>
    `;
  }).join("");

  const activeCategories = (stats.categoryBreakdown || []).filter(item => item.count > 0);
  const maxCategory = Math.max(1, ...activeCategories.map(item => item.count));
  els.categoryHeat.innerHTML = activeCategories.map(item => {
    const size = 8 + Math.round((item.count / maxCategory) * 8);
    return `
      <span class="heat-pill">
        <span class="heat-dot" style="width:${size}px;height:${size}px"></span>
        ${escapeHtml(item.name)} ${item.count}
      </span>
    `;
  }).join("");
}

function renderIssues() {
  if (!state.issues.length) {
    els.issueList.innerHTML = `<p class="empty">No signals match the current filters.</p>`;
    renderDetail();
    return;
  }

  els.issueList.innerHTML = state.issues.map(issue => `
    <article class="issue-card ${issue.id === state.selectedId ? "active" : ""}" data-issue="${issue.id}" tabindex="0">
      <div>
        <h3>${escapeHtml(issue.title)}</h3>
        <p>${escapeHtml(issue.description)}</p>
        <div class="meta">
          <span class="chip">${escapeHtml(issue.category)}</span>
          <span class="chip">${escapeHtml(issue.location)}</span>
          <span class="chip ${statusClass(issue.status)}">${escapeHtml(issue.status)}</span>
          <span class="chip">${issue.votes} votes</span>
        </div>
        <div class="vote-row">
          <button type="button" data-vote="${issue.id}">Vote</button>
          <span class="chip-label">Updated ${formatDate(issue.updatedAt || issue.createdAt)}</span>
        </div>
      </div>
      <div class="score-box">
        <strong>${issue.priorityScore}</strong>
        <span>priority</span>
      </div>
    </article>
  `).join("");

  if (state.selectedId === undefined) {
    state.selectedId = state.issues[0]?.id || null;
  } else if (state.selectedId && !state.issues.some(issue => issue.id === state.selectedId)) {
    state.selectedId = state.issues[0]?.id || null;
  }
  renderDetail();
}

function renderDetail() {
  const issue = state.issues.find(item => item.id === state.selectedId);
  if (!issue) {
    els.emptyDetail.classList.remove("hidden");
    els.issueDetail.classList.add("hidden");
    return;
  }

  els.emptyDetail.classList.add("hidden");
  els.issueDetail.classList.remove("hidden");
  els.detailCategory.textContent = issue.category;
  els.detailTitle.textContent = issue.title;
  els.detailDescription.textContent = issue.description;
  els.nextAction.textContent = issue.recommendation || "Collect one more confirmation, then decide whether to triage or close as duplicate.";
  els.statusForm.status.value = issue.status;
  els.detailMeta.innerHTML = `
    <span class="chip ${statusClass(issue.status)}">${escapeHtml(issue.status)}</span>
    <span class="chip">${escapeHtml(issue.location)}</span>
    <span class="chip">${issue.votes} votes</span>
    <span class="chip">Priority ${issue.priorityScore}</span>
  `;
  els.timelineList.innerHTML = [...(issue.updates || [])]
    .reverse()
    .map(update => `
      <li>
        <time>${formatDate(update.at)} - ${escapeHtml(update.author || "CampusPulse")}</time>
        <p>${escapeHtml(update.message)}</p>
      </li>
    `)
    .join("");
}

async function refresh() {
  const params = queryString();
  const [issues, stats] = await Promise.all([
    api(`/api/issues?${params}`),
    api("/api/stats")
  ]);
  state.issues = issues;
  els.csvLink.href = `/api/issues.csv?${params}`;
  renderStats(stats);
  renderIssues();
}

function updateProductShowcase(stats) {
  Object.assign(showcaseStats, stats);
  if (productEls.statSignals) productEls.statSignals.textContent = stats.total;
  if (productEls.statVotes) productEls.statVotes.textContent = stats.votes;
  if (productEls.statRate) productEls.statRate.textContent = `${stats.resolutionRate}%`;
  if (productEls.topIssueFoot && stats.topIssue && stats.topIssue !== "Loading...") {
    productEls.topIssueFoot.textContent = `Top priority right now: ${stats.topIssue} (${stats.topCategory}).`;
  }
  if (productSceneState.lastRenderedScene >= 0) {
    productSceneState.lastRenderedScene = -1;
    applyProductScene(productSceneState.index, productSceneState.local, productSceneState.progress);
  }
}

const productSceneState = {
  index: 0,
  local: 0,
  progress: 0,
  lastRenderedScene: -1
};

function getCinemaProgress() {
  const cinema = productEls.cinema;
  if (!cinema) return 0;

  const scrollRange = cinema.offsetHeight - window.innerHeight;
  if (scrollRange <= 0) return 0;

  const rect = cinema.getBoundingClientRect();
  return Math.min(1, Math.max(0, -rect.top / scrollRange));
}

function applyProductScene(index, local = 0, progress = 0) {
  productSceneState.index = index;
  productSceneState.local = local;
  productSceneState.progress = progress;

  const fade = 1 - Math.min(1, Math.abs(local - 0.5) * 2);
  const y = (0.5 - local) * 18;
  const scale = 0.92 + fade * 0.08;
  const tiltY = -10 + progress * 4;
  const tiltX = 5 - fade * 2;

  if (productEls.deviceWrap) {
    productEls.deviceWrap.style.setProperty("--device-y", `${y}px`);
    productEls.deviceWrap.style.setProperty("--device-scale", String(scale));
    productEls.deviceWrap.style.setProperty("--device-tilt-x", `${tiltX}deg`);
    productEls.deviceWrap.style.setProperty("--device-tilt-y", `${tiltY}deg`);
  }

  const t = index + local;
  productEls.sceneCopies.forEach((copy, i) => {
    const dist = Math.abs(t - i - 0.5);
    const opacity = Math.max(0, 1 - dist * 1.15);
    const copyY = (i - t) * 28;
    const copyScale = 0.96 + opacity * 0.04;
    const isActive = opacity > 0.45;
    copy.style.opacity = String(opacity);
    copy.style.transform = `translateY(${copyY}px) scale(${copyScale})`;
    copy.style.visibility = opacity > 0.02 ? "visible" : "hidden";
    copy.classList.toggle("is-active", isActive);
    copy.style.zIndex = isActive ? "2" : "1";
  });

  productEls.scenePills.forEach((pill, i) => {
    pill.classList.toggle("is-active", i === index);
  });

  if (productEls.screen) {
    if (index !== productSceneState.lastRenderedScene) {
      if (productSceneState.lastRenderedScene === -1) {
        productEls.screen.innerHTML = renderProductMockScene(index);
        productSceneState.lastRenderedScene = index;
        productEls.screen.style.setProperty("--screen-opacity", "1");
        productEls.screen.style.setProperty("--screen-y", "0");
      } else {
        productEls.screen.style.setProperty("--screen-opacity", "0");
        productEls.screen.style.setProperty("--screen-y", "12px");
        window.setTimeout(() => {
          if (productSceneState.index !== index) return;
          productEls.screen.innerHTML = renderProductMockScene(index);
          productSceneState.lastRenderedScene = index;
          productEls.screen.style.setProperty("--screen-opacity", "1");
          productEls.screen.style.setProperty("--screen-y", "0");
        }, 120);
      }
    } else {
      productEls.screen.style.setProperty("--screen-opacity", String(0.72 + fade * 0.28));
      productEls.screen.style.setProperty("--screen-y", `${(0.5 - local) * 8}px`);
    }
  }
}

function initProductScroll() {
  if (!productEls.cinema) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    applyProductScene(0, 0.5, 0);
    productEls.sceneCopies.forEach((copy, i) => {
      copy.classList.toggle("is-active", i === 0);
      copy.style.opacity = i === 0 ? "1" : "0";
      copy.style.visibility = i === 0 ? "visible" : "hidden";
      copy.style.transform = i === 0 ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)";
    });
    productEls.scenePills.forEach((pill, i) => pill.classList.toggle("is-active", i === 0));
    if (productEls.screen) {
      productEls.screen.innerHTML = renderProductMockScene(0);
      productSceneState.lastRenderedScene = 0;
    }
    return;
  }

  let ticking = false;

  function update() {
    ticking = false;
    const progress = getCinemaProgress();
    if (progress <= 0 && productEls.cinema.getBoundingClientRect().bottom < 0) {
      return;
    }

    const sceneIndex = Math.min(PRODUCT_SCENE_COUNT - 1, Math.floor(progress * PRODUCT_SCENE_COUNT));
    const local = (progress * PRODUCT_SCENE_COUNT) - sceneIndex;
    applyProductScene(sceneIndex, local, progress);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  requestAnimationFrame(update);
}

function initDashboardMode() {
  if (!productEls.mainContent) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      document.body.classList.toggle("dashboard-mode", entry.isIntersecting && entry.intersectionRatio > 0.08);
    });
  }, { threshold: [0, 0.08, 0.2] });

  observer.observe(productEls.mainContent);
}

function initRevealOnScroll() {
  const blocks = document.querySelectorAll(".overview, .insight-strip, .signal-runway, .workspace");
  blocks.forEach(block => block.classList.add("reveal-on-scroll"));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  blocks.forEach(block => observer.observe(block));
}

function debounce(fn, delay = 180) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

els.reportForm.addEventListener("submit", async event => {
  event.preventDefault();
  els.formMessage.textContent = "Adding signal...";
  try {
    const payload = Object.fromEntries(new FormData(els.reportForm).entries());
    const issue = await api("/api/issues", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    state.selectedId = issue.id;
    els.reportForm.reset();
    els.formMessage.textContent = "Signal added to CampusPulse.";
    await refresh();
  } catch (error) {
    els.formMessage.textContent = error.message;
  }
});

els.issueList.addEventListener("click", async event => {
  const voteButton = event.target.closest("[data-vote]");
  if (voteButton) {
    event.stopPropagation();
    voteButton.disabled = true;
    await api(`/api/issues/${voteButton.dataset.vote}/vote`, { method: "PATCH" });
    await refresh();
    return;
  }

  const card = event.target.closest("[data-issue]");
  if (!card) return;
  state.selectedId = card.dataset.issue;
  renderIssues();
});

els.issueList.addEventListener("keydown", event => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-issue]");
  if (!card) return;
  event.preventDefault();
  state.selectedId = card.dataset.issue;
  renderIssues();
});

els.statusForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!state.selectedId) return;
  await api(`/api/issues/${state.selectedId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: els.statusForm.status.value })
  });
  await refresh();
});

els.noteForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!state.selectedId) return;
  const payload = Object.fromEntries(new FormData(els.noteForm).entries());
  await api(`/api/issues/${state.selectedId}/updates`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  els.noteForm.reset();
  await refresh();
});

els.closeDetail.addEventListener("click", () => {
  state.selectedId = null;
  renderDetail();
  renderIssues();
});

[els.categoryFilter, els.statusFilter, els.sortBy].forEach(control => {
  control.addEventListener("change", refresh);
});
els.search.addEventListener("input", debounce(refresh));

const THEME_STORAGE_KEY = "campuspulse-theme";

function initThemeToggle() {
  const toggle = document.querySelector("#themeToggle");
  if (!toggle) return;

  const label = toggle.querySelector(".theme-toggle-label");

  function applyTheme(isLight) {
    document.documentElement.classList.toggle("light-mode", isLight);
    toggle.setAttribute("aria-pressed", String(isLight));
    toggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    if (label) label.textContent = isLight ? "Dark" : "Light";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isLight ? "light" : "dark");
    } catch (error) {}
  }

  applyTheme(document.documentElement.classList.contains("light-mode"));

  toggle.addEventListener("click", () => {
    applyTheme(!document.documentElement.classList.contains("light-mode"));
  });
}

initThemeToggle();
initProductScroll();
initDashboardMode();
initRevealOnScroll();
refresh().catch(error => {
  els.issueList.innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
});
