import * as THREE from "./vendor/three.module.min.js";

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
  signalScene: document.querySelector("#signalScene"),
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

function initSignalScene() {
  const canvas = els.signalScene;
  if (!canvas || !window.WebGLRenderingContext) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 9);

  const group = new THREE.Group();
  scene.add(group);

  const colors = [0x147c72, 0xe85d4f, 0xc7df5f, 0xf4b63f, 0x3c6e91];
  const nodeGeometry = new THREE.IcosahedronGeometry(0.075, 2);
  const nodes = [];
  const nodePositions = [];

  for (let i = 0; i < 54; i++) {
    const ring = i % 3;
    const angle = i * 0.72;
    const radius = 1.3 + ring * 0.55 + Math.sin(i * 1.7) * 0.18;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(i * 0.41) * 1.05;
    const z = Math.sin(angle) * radius;
    const material = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      emissive: colors[i % colors.length],
      emissiveIntensity: 0.22,
      roughness: 0.42,
      metalness: 0.08
    });
    const mesh = new THREE.Mesh(nodeGeometry, material);
    mesh.position.set(x, y, z);
    mesh.userData.phase = i * 0.31;
    nodes.push(mesh);
    nodePositions.push(mesh.position.clone());
    group.add(mesh);
  }

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x147c72,
    transparent: true,
    opacity: 0.18
  });
  const linePoints = [];
  for (let i = 0; i < nodePositions.length; i++) {
    for (let j = i + 1; j < nodePositions.length; j++) {
      const distance = nodePositions[i].distanceTo(nodePositions[j]);
      if (distance > 0.76 && distance < 1.24 && linePoints.length < 360) {
        linePoints.push(nodePositions[i], nodePositions[j]);
      }
    }
  }
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
  group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xc7df5f,
    emissive: 0xc7df5f,
    emissiveIntensity: 0.18,
    transparent: true,
    opacity: 0.72,
    roughness: 0.28
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.018, 12, 140), ringMaterial);
  ring.rotation.x = Math.PI / 2.9;
  group.add(ring);

  scene.add(new THREE.AmbientLight(0xf7f2e8, 1.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 4, 5);
  scene.add(key);

  const pointer = { x: 0, y: 0 };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  canvas.addEventListener("pointermove", event => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.55;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.4;
  });

  window.addEventListener("resize", resize);
  resize();

  function render(time = 0) {
    const t = time * 0.001;
    group.rotation.y += ((0.24 + pointer.x) - group.rotation.y) * 0.018;
    group.rotation.x += ((-0.14 + pointer.y) - group.rotation.x) * 0.018;
    ring.rotation.z = t * 0.22;
    nodes.forEach(node => {
      const pulse = 1 + Math.sin(t * 2.1 + node.userData.phase) * 0.18;
      node.scale.setScalar(pulse);
    });
    renderer.render(scene, camera);
    if (!reduceMotion) requestAnimationFrame(render);
  }

  render();
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

initSignalScene();
refresh().catch(error => {
  els.issueList.innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
});
