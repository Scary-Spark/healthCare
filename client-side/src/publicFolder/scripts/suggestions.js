/**
 * SUGGESTIONS & COMPLAINTS - DYNAMIC DATABASE VERSION
 * Status tracking • Voting • Search/Filter • Modal Details • Toasts
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== VOTE PERSISTENCE =====
  const VOTED_KEY = "suggestions_voted";

  // Load voted IDs from localStorage on init
  function loadVotedIds() {
    try {
      const saved = localStorage.getItem(VOTED_KEY);
      if (saved) {
        const ids = JSON.parse(saved);
        currentUserVotes = new Set(ids);
        console.log(
          `🗳️ Loaded ${currentUserVotes.size} voted IDs from localStorage`,
        );
      }
    } catch (e) {
      console.warn("⚠️ Failed to load voted IDs:", e);
    }
  }

  // Save voted IDs to localStorage
  function saveVotedIds() {
    try {
      localStorage.setItem(
        VOTED_KEY,
        JSON.stringify(Array.from(currentUserVotes)),
      );
    } catch (e) {
      console.warn("⚠️ Failed to save voted IDs:", e);
    }
  }

  // ===== STATE =====
  let submissions = [];
  let currentUserVotes = new Set();

  // ===== DOM ELEMENTS =====
  const submissionsList = document.getElementById("submissionsList");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const statusFilter = document.getElementById("statusFilter");
  const newSubmissionBtn = document.getElementById("newSubmissionBtn");
  const submissionForm = document.getElementById("submissionForm");
  const closeFormBtn = document.getElementById("closeFormBtn");
  const cancelFormBtn = document.getElementById("cancelFormBtn");
  const feedbackForm = document.getElementById("feedbackForm");
  const formAnonymous = document.getElementById("formAnonymous");

  // ===== INIT =====
  function init() {
    // ✅ Load persisted votes FIRST
    loadVotedIds();

    // Make anonymous checkbox show "coming soon"
    if (formAnonymous) {
      formAnonymous.addEventListener("change", function () {
        showToast("Anonymous submissions feature is coming soon!", "info");
        this.checked = false;
      });
    }

    loadSubmissions();
    setupEvents();
  }

  // ===== LOAD SUBMISSIONS FROM API =====
  async function loadSubmissions() {
    try {
      const params = new URLSearchParams();
      const search = searchInput?.value || "";
      const type = typeFilter?.value || "";
      const status = statusFilter?.value || "";

      if (search) params.append("search", search);
      if (type) params.append("type", type);
      if (status) params.append("status", status);

      const response = await fetch(`/api/suggestions?${params}`);
      const result = await response.json();

      if (result.success) {
        // ✅ FIX: Handle both possible response keys
        submissions = result.suggestions || result.data || [];
        renderSubmissions(submissions);
        updateStats();
      }
    } catch (error) {
      console.error("Error loading submissions:", error);
      showToast("Failed to load suggestions", "error");
    }
  }

  function setupEvents() {
    // Form Toggle
    newSubmissionBtn?.addEventListener("click", () => {
      submissionForm?.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    closeFormBtn?.addEventListener("click", () =>
      submissionForm?.classList.add("hidden"),
    );
    cancelFormBtn?.addEventListener("click", () =>
      submissionForm?.classList.add("hidden"),
    );

    // Form Submit
    feedbackForm?.addEventListener("submit", handleSubmit);

    // Filters with debounce
    let filterTimeout;
    const debouncedFilter = () => {
      clearTimeout(filterTimeout);
      filterTimeout = setTimeout(loadSubmissions, 300);
    };

    searchInput?.addEventListener("input", debouncedFilter);
    typeFilter?.addEventListener("change", loadSubmissions);
    statusFilter?.addEventListener("change", loadSubmissions);

    // Close modal on outside click
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay")) e.target.remove();
    });
  }

  // ===== RENDER =====
  function renderSubmissions(data) {
    submissionsList.innerHTML = "";

    if (!data || !Array.isArray(data) || data.length === 0) {
      submissionsList.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-light);">
      <i class="fa-regular fa-folder-open" style="font-size: 3rem; margin-bottom: 12px; opacity: 0.4;"></i>
      <p>No submissions found. Be the first to share your feedback!</p>
    </div>`;
      return;
    }

    data.forEach((sub) => {
      const card = document.createElement("div");
      card.className = `submission-card ${sub.type}`;

      const statusBadge = `<span class="status-badge ${sub.status}">${formatStatus(sub.status)}</span>`;
      const priorityBadge = `<span class="card-priority ${sub.priority}">${capitalize(sub.priority)}</span>`;
      const typeBadge = `<span class="card-type ${sub.type}"><i class="fa-solid ${sub.type === "suggestion" ? "fa-lightbulb" : "fa-exclamation"}"></i> ${capitalize(sub.type)}</span>`;

      // ✅ Check both in-memory AND localStorage for voted state
      const subId = sub.id || sub.suggestion_id;
      const isVoted = currentUserVotes.has(subId) || sub.isVoted;

      card.innerHTML = `
      <div class="card-header">
        <div style="display:flex; gap:8px; align-items:center;">${typeBadge} ${priorityBadge}</div>
        ${statusBadge}
      </div>
      <h3 class="card-title">${escapeHtml(sub.title)}</h3>
      <p class="card-desc">${escapeHtml(sub.description)}</p>
      <div class="card-meta">
        <div class="card-author">
          <div class="author-avatar">${escapeHtml(sub.avatar)}</div>
          <span>${escapeHtml(sub.author)} • ${formatDate(sub.date)}</span>
        </div>
        <div class="card-actions">
          <button class="card-action ${isVoted ? "voted" : ""}" onclick="handleVote(${subId})">
            <i class="fa-${isVoted ? "solid" : "regular"} fa-thumbs-up"></i> ${sub.votes}
          </button>
          <button class="card-action" onclick="showDetails(${subId})">
            <i class="fa-solid fa-eye"></i> Details
          </button>
        </div>
      </div>
    `;
      submissionsList.appendChild(card);
    });
  }

  function updateStats() {
    // ✅ Safety check: ensure submissions is an array
    const subs = Array.isArray(submissions) ? submissions : [];

    document.getElementById("statTotal").textContent = subs.length;
    document.getElementById("statPending").textContent = subs.filter(
      (s) => s.status === "pending",
    ).length;
    document.getElementById("statProgress").textContent = subs.filter(
      (s) => s.status === "in-progress" || s.status === "under-review",
    ).length;
    document.getElementById("statResolved").textContent = subs.filter(
      (s) => s.status === "resolved",
    ).length;
  }

  // ===== ACTIONS =====
  async function handleSubmit(e) {
    e.preventDefault();

    const type = document.getElementById("formType").value;
    const category = document.getElementById("formCategory").value;
    const title = document.getElementById("formTitle").value.trim();
    const description = document.getElementById("formDescription").value.trim();
    const priority = document.getElementById("formPriority").value;

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          type,
          // anonymous: document.getElementById("formAnonymous").checked // Coming soon
        }),
      });

      const result = await response.json();

      if (result.success) {
        feedbackForm.reset();
        submissionForm.classList.add("hidden");
        showToast(
          "Feedback submitted successfully! Thank you for your input.",
          "success",
        );
        loadSubmissions(); // Refresh list
      } else {
        showToast(result.message || "Failed to submit feedback", "error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showToast("Network error. Please try again.", "error");
    }
  }

  window.handleVote = async function (id) {
    const suggestionId = Number(id); // ✅ Ensure it's a number

    console.log("🗳️ Voting on suggestion:", suggestionId);

    // Check if already voted locally first
    if (currentUserVotes.has(suggestionId)) {
      showToast("You already voted on this submission.", "info");
      return;
    }

    try {
      console.log("📡 Sending vote request...");

      const response = await fetch("/api/suggestions/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          suggestionId: suggestionId, // ✅ Use the numeric ID
        }),
      });

      console.log("📡 Response status:", response.status);

      const result = await response.json();
      console.log("📦 Vote response:", result);

      if (result.success) {
        // ✅ Update local state AND persist to localStorage
        currentUserVotes.add(suggestionId);
        saveVotedIds(); // ✅ PERSIST HERE

        const sub = submissions.find(
          (s) => s.id === suggestionId || s.suggestion_id === suggestionId,
        );
        if (sub) {
          sub.votes = result.data?.votes || sub.votes + 1;
          sub.isVoted = true;
        }
        renderSubmissions(submissions);
        showToast("Vote recorded! Thank you.", "success");
      } else if (result.alreadyVoted) {
        // ✅ Also persist if server says already voted
        currentUserVotes.add(suggestionId);
        saveVotedIds();

        const sub = submissions.find(
          (s) => s.id === suggestionId || s.suggestion_id === suggestionId,
        );
        if (sub) sub.isVoted = true;
        renderSubmissions(submissions);
        showToast("You already voted on this submission.", "info");
      } else {
        console.error("❌ Vote failed:", result.message);
        showToast(result.message || "Failed to record vote", "error");
      }
    } catch (error) {
      console.error("❌ Vote error:", error);
      showToast("Network error. Please try again.", "error");
    }
  };

  window.showDetails = async function (id) {
    try {
      const response = await fetch(`/api/suggestions/${id}`);
      const result = await response.json();

      if (!result.success || !result.data) {
        showToast("Failed to load details", "error");
        return;
      }

      const sub = result.data;

      const modal = document.createElement("div");
      modal.className = "modal-overlay";

      // ✅ Ensure sub.id exists and is a number
      const suggestionId = Number(sub.suggestion_id || sub.id || id);

      modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${escapeHtml(sub.title)}</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="modal-meta">
            <span class="card-type ${sub.type}" style="font-size:0.8rem;"><i class="fa-solid ${sub.type === "suggestion" ? "fa-lightbulb" : "fa-exclamation"}"></i> ${capitalize(sub.type)}</span>
            <span class="card-priority ${sub.priority}" style="font-size:0.8rem;">${capitalize(sub.priority)} Priority</span>
            <span class="status-badge ${sub.status}" style="font-size:0.8rem;">${formatStatus(sub.status)}</span>
            <span>Category: ${capitalize(sub.category)}</span>
            <span>Posted: ${formatDate(sub.date)}</span>
          </div>
          <p class="modal-desc">${escapeHtml(sub.description)}</p>
          ${sub.status === "declined" && sub.declinedReason ? `<div style="margin-top:16px; padding:12px; background:#fde8e8; border-left:4px solid var(--accent-red); border-radius:6px; font-size:0.9rem;"><strong>Reason for decline:</strong> ${escapeHtml(sub.declinedReason)}</div>` : ""}
          ${sub.status === "resolved" ? `<div style="margin-top:16px; padding:12px; background:#d4edda; border-left:4px solid var(--accent-green); border-radius:6px; font-size:0.9rem;"><strong>Status:</strong> ✅ This issue has been resolved. Thank you for your feedback!</div>` : ""}
        </div>
        <div class="modal-footer">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="author-avatar">${escapeHtml(sub.avatar)}</div>
            <div>
              <div style="font-weight:600; font-size:0.9rem;">${escapeHtml(sub.author)}</div>
              <div style="font-size:0.8rem; color:var(--text-light);">${sub.votes} community votes</div>
            </div>
          </div>
          <!-- ✅ Pass suggestionId (not sub.id) to handleVote -->
          <button class="btn-primary" style="padding:8px 16px; font-size:0.85rem;" onclick="handleVote(${suggestionId}); this.closest('.modal-overlay').remove();">
            <i class="fa-regular fa-thumbs-up"></i> Upvote
          </button>
        </div>
      </div>
    `;
      document.body.appendChild(modal);
    } catch (error) {
      console.error("Details error:", error);
      showToast("Failed to load details", "error");
    }
  };

  // ===== UTILS =====
  function formatStatus(status) {
    return status.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }

  function capitalize(s) {
    return s?.charAt(0).toUpperCase() + s?.slice(1) || "";
  }

  function formatDate(str) {
    if (!str) return "";
    const d = new Date(str);
    const day = d.getDate();
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function showToast(message, type = "success") {
    const existing = document.getElementById("suggestionsToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "suggestionsToast";
    toast.innerHTML = `
      <div class="toast-icon"><i class="fa-solid fa-${type === "success" ? "circle-check" : "info-circle"}"></i></div>
      <div class="toast-content">${message}</div>
    `;

    toast.style.cssText = `
      position:fixed;bottom:24px;right:24px;background:var(--card-bg);color:var(--text-dark);
      padding:14px 20px;border-radius:var(--radius-md);box-shadow:var(--shadow-lg);
      border-left:4px solid ${type === "success" ? "var(--primary)" : "var(--accent-gold)"};
      display:flex;align-items:center;gap:12px;z-index:3000;max-width:360px;
      animation:slideInRight 0.2s ease,fadeOut 0.2s ease 2s forwards;
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 2200);

    if (!document.getElementById("toastAnims")) {
      const style = document.createElement("style");
      style.id = "toastAnims";
      style.textContent = `
        @keyframes slideInRight{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes fadeOut{from{opacity:1}to{opacity:0}}
      `;
      document.head.appendChild(style);
    }
  }

  // Start
  init();
});
