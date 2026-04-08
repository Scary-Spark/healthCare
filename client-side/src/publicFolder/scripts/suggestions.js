/**
 * SUGGESTIONS & COMPLAINTS - FULL IMPLEMENTATION
 * Status tracking • Voting • Search/Filter • Modal Details • Toasts
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== MOCK DATA =====
  let submissions = [
    {
      id: 1,
      type: "suggestion",
      category: "tech",
      title: "Add Dark Mode to Patient Portal",
      description:
        "It would be great to have a dark mode option for late-night browsing. Reduces eye strain significantly.",
      status: "in-progress",
      priority: "medium",
      author: "Sarah M.",
      avatar: "SM",
      date: "2024-10-20",
      votes: 24,
      declinedReason: "",
    },
    {
      id: 2,
      type: "complaint",
      category: "staff",
      title: "Long Wait Times at Front Desk",
      description:
        "Waited over 45 minutes just to check in for a scheduled appointment. Staff seemed overwhelmed. Please improve queue management.",
      status: "under-review",
      priority: "high",
      author: "David K.",
      avatar: "DK",
      date: "2024-10-18",
      votes: 18,
      declinedReason: "",
    },
    {
      id: 3,
      type: "suggestion",
      category: "facilities",
      title: "More Charging Stations in Waiting Area",
      description:
        "Patients often wait with phones at low battery. Installing USB charging ports near seats would be very helpful.",
      status: "resolved",
      priority: "low",
      author: "Anonymous",
      avatar: "AN",
      date: "2024-10-15",
      votes: 31,
      declinedReason: "",
    },
    {
      id: 4,
      type: "complaint",
      category: "billing",
      title: "Incorrect Insurance Claim Processing",
      description:
        "My recent claim was rejected due to a coding error on your end. I had to pay out of pocket. Please review and refund.",
      status: "pending",
      priority: "critical",
      author: "Priya R.",
      avatar: "PR",
      date: "2024-10-12",
      votes: 9,
      declinedReason: "",
    },
    {
      id: 5,
      type: "suggestion",
      category: "tech",
      title: "Mobile App Push Notifications for Appointments",
      description:
        "Send reminders 24h and 1h before appointments via app notifications instead of just email.",
      status: "declined",
      priority: "medium",
      author: "Mark T.",
      avatar: "MT",
      date: "2024-10-10",
      votes: 12,
      declinedReason: "Already implemented in v2.1 update.",
    },
    {
      id: 6,
      type: "complaint",
      category: "facilities",
      title: "Restroom Cleanliness on 3rd Floor",
      description:
        "The restrooms near radiology are frequently out of soap and paper towels. Maintenance schedule needs improvement.",
      status: "resolved",
      priority: "medium",
      author: "Lisa W.",
      avatar: "LW",
      date: "2024-10-08",
      votes: 27,
      declinedReason: "",
    },
  ];

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

  // ===== INIT =====
  function init() {
    renderSubmissions(submissions);
    updateStats();
    setupEvents();
  }

  function setupEvents() {
    // Form Toggle
    newSubmissionBtn.addEventListener("click", () => {
      submissionForm.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    closeFormBtn.addEventListener("click", () =>
      submissionForm.classList.add("hidden"),
    );
    cancelFormBtn.addEventListener("click", () =>
      submissionForm.classList.add("hidden"),
    );

    // Form Submit
    feedbackForm.addEventListener("submit", handleSubmit);

    // Filters
    searchInput.addEventListener("input", filterSubmissions);
    typeFilter.addEventListener("change", filterSubmissions);
    statusFilter.addEventListener("change", filterSubmissions);

    // Close modal on outside click
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay")) e.target.remove();
    });
  }

  // ===== RENDER =====
  function renderSubmissions(data) {
    submissionsList.innerHTML = "";

    if (data.length === 0) {
      submissionsList.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-light);">
        <i class="fa-regular fa-folder-open" style="font-size: 3rem; margin-bottom: 12px; opacity: 0.4;"></i>
        <p>No submissions found matching your criteria.</p>
      </div>`;
      return;
    }

    data.forEach((sub) => {
      const card = document.createElement("div");
      card.className = `submission-card ${sub.type}`;

      const statusBadge = `<span class="status-badge ${sub.status}">${formatStatus(sub.status)}</span>`;
      const priorityBadge = `<span class="card-priority ${sub.priority}">${capitalize(sub.priority)}</span>`;
      const typeBadge = `<span class="card-type ${sub.type}"><i class="fa-solid ${sub.type === "suggestion" ? "fa-lightbulb" : "fa-exclamation"}"></i> ${capitalize(sub.type)}</span>`;
      const isVoted = currentUserVotes.has(sub.id);

      card.innerHTML = `
        <div class="card-header">
          <div style="display:flex; gap:8px; align-items:center;">${typeBadge} ${priorityBadge}</div>
          ${statusBadge}
        </div>
        <h3 class="card-title">${sub.title}</h3>
        <p class="card-desc">${sub.description}</p>
        <div class="card-meta">
          <div class="card-author">
            <div class="author-avatar">${sub.avatar}</div>
            <span>${sub.author} • ${formatDate(sub.date)}</span>
          </div>
          <div class="card-actions">
            <button class="card-action ${isVoted ? "voted" : ""}" onclick="handleVote(${sub.id})">
              <i class="fa-${isVoted ? "solid" : "regular"} fa-thumbs-up"></i> ${sub.votes}
            </button>
            <button class="card-action" onclick="showDetails(${sub.id})">
              <i class="fa-solid fa-eye"></i> Details
            </button>
          </div>
        </div>
      `;
      submissionsList.appendChild(card);
    });
  }

  function updateStats() {
    document.getElementById("statTotal").textContent = submissions.length;
    document.getElementById("statPending").textContent = submissions.filter(
      (s) => s.status === "pending",
    ).length;
    document.getElementById("statProgress").textContent = submissions.filter(
      (s) => s.status === "in-progress" || s.status === "under-review",
    ).length;
    document.getElementById("statResolved").textContent = submissions.filter(
      (s) => s.status === "resolved",
    ).length;
  }

  // ===== ACTIONS =====
  function handleSubmit(e) {
    e.preventDefault();

    const type = document.getElementById("formType").value;
    const category = document.getElementById("formCategory").value;
    const title = document.getElementById("formTitle").value.trim();
    const description = document.getElementById("formDescription").value.trim();
    const priority = document.getElementById("formPriority").value;
    const anonymous = document.getElementById("formAnonymous").checked;

    const newSub = {
      id: Date.now(),
      type,
      category,
      title,
      description,
      status: "pending",
      priority,
      author: anonymous ? "Anonymous" : "John Doe",
      avatar: anonymous ? "AN" : "JD",
      date: new Date().toISOString().split("T")[0],
      votes: 0,
      declinedReason: "",
    };

    submissions.unshift(newSub);
    renderSubmissions(submissions);
    updateStats();
    feedbackForm.reset();
    submissionForm.classList.add("hidden");
    showToast(
      "Feedback submitted successfully! Thank you for your input.",
      "success",
    );
  }

  window.handleVote = function (id) {
    if (currentUserVotes.has(id)) {
      showToast("You already voted on this submission.", "info");
      return;
    }
    const sub = submissions.find((s) => s.id === id);
    if (sub) {
      sub.votes++;
      currentUserVotes.add(id);
      filterSubmissions();
    }
  };

  window.showDetails = function (id) {
    const sub = submissions.find((s) => s.id === id);
    if (!sub) return;

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${sub.title}</h3>
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
          <p class="modal-desc">${sub.description}</p>
          ${sub.status === "declined" && sub.declinedReason ? `<div style="margin-top:16px; padding:12px; background:#fde8e8; border-left:4px solid var(--accent-red); border-radius:6px; font-size:0.9rem;"><strong>Reason for decline:</strong> ${sub.declinedReason}</div>` : ""}
          ${sub.status === "resolved" ? `<div style="margin-top:16px; padding:12px; background:#d4edda; border-left:4px solid var(--accent-green); border-radius:6px; font-size:0.9rem;"><strong>Status:</strong> ✅ This issue has been resolved. Thank you for your feedback!</div>` : ""}
        </div>
        <div class="modal-footer">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="author-avatar">${sub.avatar}</div>
            <div>
              <div style="font-weight:600; font-size:0.9rem;">${sub.author}</div>
              <div style="font-size:0.8rem; color:var(--text-light);">${sub.votes} community votes</div>
            </div>
          </div>
          <button class="btn-primary" style="padding:8px 16px; font-size:0.85rem;" onclick="handleVote(${sub.id}); this.closest('.modal-overlay').remove();">
            <i class="fa-regular fa-thumbs-up"></i> Upvote
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  function filterSubmissions() {
    const term = searchInput.value.toLowerCase();
    const type = typeFilter.value;
    const status = statusFilter.value;

    const filtered = submissions.filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.author.toLowerCase().includes(term);
      const matchType = !type || s.type === type;
      const matchStatus = !status || s.status === status;
      return matchSearch && matchType && matchStatus;
    });

    renderSubmissions(filtered);
  }

  // ===== UTILS =====
  function formatStatus(status) {
    return status.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function formatDate(str) {
    const d = new Date(str);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
