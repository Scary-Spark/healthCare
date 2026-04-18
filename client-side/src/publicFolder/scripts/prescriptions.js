/**
 * PRESCRIPTIONS PAGE - DYNAMIC VERSION
 * Fetches real data from database via API
 * Handles NULL values and dynamic status colors
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== STATUS CONFIGURATION - DYNAMIC COLORS =====
  const STATUS_CONFIG = {
    active: {
      label: "Active",
      class: "active",
      icon: "fa-check-circle",
      bg: "#d1fae5",
      color: "#065f46",
      border: "#10b981",
    },
    expired: {
      label: "Expired",
      class: "expired",
      icon: "fa-clock-rotate-left",
      bg: "#fef3c7",
      color: "#92400e",
      border: "#f59e0b",
    },
    cancelled: {
      label: "Cancelled",
      class: "cancelled",
      icon: "fa-ban",
      bg: "#fee2e2",
      color: "#991b1b",
      border: "#ef4444",
    },
  };

  // ===== STATE =====
  let currentPage = 1;
  let itemsPerPage = 25;
  let prescriptions = []; // Will be populated by API
  let filteredData = [];
  let selectedPrescription = null;

  // ===== DOM ELEMENTS =====
  const tableBody = document.getElementById("tableBody");
  const searchInput = document.getElementById("searchInput");
  const filterBtn = document.getElementById("filterBtn");
  const filtersSection = document.getElementById("filtersSection");
  const applyFilterBtn = document.getElementById("applyFilter");
  const clearFilterBtn = document.getElementById("clearFilter");
  const downloadAllBtn = document.getElementById("downloadAllBtn");
  const itemsPerPageSelect = document.getElementById("itemsPerPage");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const detailsPanel = document.getElementById("detailsPanel");
  const panelContent = document.getElementById("panelContent");
  const panelClose = document.getElementById("panelClose");
  const downloadPanel = document.getElementById("downloadPanel");
  const viewPanel = document.getElementById("viewPanel");

  // ===== FETCH DATA FROM API =====
  async function loadPrescriptions() {
    try {
      console.log("🔄 Loading prescriptions...");

      // Show loading state
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;"><i class="fa-solid fa-spinner fa-spin" style="font-size:2rem;color:var(--primary);"></i><p style="margin-top:12px;color:var(--text-light);">Loading your prescriptions...</p></td></tr>`;

      const response = await fetch("/api/prescriptions");
      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("📦 API result:", result);

      if (result.success) {
        prescriptions = result.data || [];
        filteredData = [...prescriptions];
        console.log(`✅ Loaded ${prescriptions.length} prescription records`);

        // Populate filter dropdowns dynamically
        populateStatusFilter();

        // Update UI
        updateStats();
        renderTable();
      } else {
        console.error("❌ API returned error:", result.message);
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-light);">
          <i class="fa-solid fa-circle-exclamation" style="font-size:2rem;margin-bottom:12px;"></i>
          <p>${result.message || "Failed to load prescriptions"}</p>
        </td></tr>`;
      }
    } catch (error) {
      console.error("❌ Error fetching prescriptions:", error);
      console.error("Error stack:", error.stack);

      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-light);">
        <i class="fa-solid fa-circle-exclamation" style="font-size:2rem;margin-bottom:12px;"></i>
        <p>Error loading data. Please try again.</p>
        <p style="font-size:0.85rem;margin-top:8px;opacity:0.7;">${error.message}</p>
      </td></tr>`;
    }
  }

  // ===== POPULATE FILTERS DYNAMICALLY =====
  function populateStatusFilter() {
    const select = document.getElementById("statusFilter");
    if (!select) return;

    // Get unique statuses from loaded data
    const statuses = [
      ...new Set(prescriptions.map((p) => p.status).filter(Boolean)),
    ];

    // Keep the "All Status" option
    select.innerHTML = '<option value="">All Status</option>';

    // Add dynamic options with proper labels
    statuses.forEach((status) => {
      const option = document.createElement("option");
      option.value = status.toLowerCase();
      // Use STATUS_CONFIG for nice labels, fallback to capitalize
      const config = STATUS_CONFIG[status.toLowerCase()];
      option.textContent = config?.label || capitalize(status);
      select.appendChild(option);
    });
  }

  // ===== GET STATUS CONFIG =====
  function getStatusConfig(status) {
    const statusKey = status
      ? status.toLowerCase().replace(/\s+/g, "-")
      : "active";
    return STATUS_CONFIG[statusKey] || STATUS_CONFIG["active"];
  }

  // ===== STATS UPDATE =====
  function updateStats() {
    // ✅ Use filteredData so stats reflect active filters
    const data = filteredData;

    const total = data.length;
    const active = data.filter((p) => p.status === "active").length;
    const expired = data.filter((p) => p.status === "expired").length;
    const cancelled = data.filter((p) => p.status === "cancelled").length;

    animateNumber("totalPrescriptions", total);
    animateNumber("activePrescriptions", active);
    animateNumber("expiredPrescriptions", expired);
    animateNumber("cancelledPrescriptions", cancelled);
  }

  function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 500;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  // ===== RENDER TABLE =====
  function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);

    tableBody.innerHTML = "";

    if (pageData.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-light);">No prescriptions found</td></tr>`;
      updateTableInfo();
      renderPagination();
      return;
    }

    pageData.forEach((rx) => {
      const row = document.createElement("tr");
      row.dataset.id = rx.id;

      const statusConfig = getStatusConfig(rx.status);

      // Medication preview
      const medCount = rx.medications.length;
      const firstMed = rx.medications[0]?.name || "N/A";
      const medPreview =
        medCount > 1
          ? `${firstMed} <span class="med-count">+${medCount - 1} more</span>`
          : firstMed;

      row.innerHTML = `
        <td><strong>${rx.refNumber || "N/A"}</strong></td>
        <td>
          <div class="med-preview">
            <span class="med-name">${medPreview}</span>
          </div>
        </td>
        <td>${rx.doctor || "Unknown Doctor"}</td>
        <td>${formatDate(rx.datePrescribed)}</td>
        <td>
          <span class="status-badge ${statusConfig.class}" style="background:${statusConfig.bg};color:${statusConfig.color};border:1px solid ${statusConfig.border}">
            <i class="fa-solid ${statusConfig.icon}"></i>
            ${statusConfig.label}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" title="Download" onclick="downloadPrescription(${rx.id})">
              <i class="fa-solid fa-download"></i>
            </button>
            <button class="btn-icon" title="View" onclick="viewPrescription(${rx.id})">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </td>
      `;

      row.addEventListener("mouseenter", () => {
        showPrescriptionDetails(rx);
        highlightRow(row);
      });

      row.addEventListener("click", () => {
        showPrescriptionDetails(rx);
        highlightRow(row);
        openPanel();
      });

      tableBody.appendChild(row);
    });

    updateTableInfo();
    renderPagination();
  }

  function highlightRow(activeRow) {
    document.querySelectorAll(".records-table tbody tr").forEach((row) => {
      row.classList.remove("active");
    });
    activeRow.classList.add("active");
  }

  function updateTableInfo() {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, filteredData.length);

    document.getElementById("showingCount").textContent =
      filteredData.length > 0 ? start : 0;
    document.getElementById("totalCount").textContent = filteredData.length;
  }

  // ===== PAGINATION =====
  function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    paginationNumbers.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        const btn = document.createElement("button");
        btn.className = `pagination-num ${i === currentPage ? "active" : ""}`;
        btn.textContent = i;
        btn.addEventListener("click", () => {
          currentPage = i;
          renderTable();
        });
        paginationNumbers.appendChild(btn);
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        const span = document.createElement("span");
        span.textContent = "...";
        span.style.padding = "0 8px";
        paginationNumbers.appendChild(span);
      }
    }

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
  }

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  itemsPerPageSelect.addEventListener("change", (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    renderTable();
  });

  // ===== SHOW PRESCRIPTION DETAILS =====
  function showPrescriptionDetails(rx) {
    selectedPrescription = rx;

    const statusConfig = getStatusConfig(rx.status);

    const medicationsHTML = rx.medications
      .map(
        (med) => `
        <div class="med-card">
          <div class="med-header">
            <span class="med-name">${med.name || "N/A"}</span>
            <span class="med-dosage">${med.dosage || ""}</span>
          </div>
          <div class="med-details">
            <div class="med-detail-item">
              <span class="med-detail-label">Frequency</span>
              <span class="med-detail-value">${med.frequency || "N/A"}</span>
            </div>
            ${
              med.duration
                ? `
              <div class="med-detail-item">
                <span class="med-detail-label">Duration</span>
                <span class="med-detail-value">${med.duration}</span>
              </div>
            `
                : ""
            }
            <div class="med-detail-item">
              <span class="med-detail-label">Instructions</span>
              <span class="med-detail-value">${med.instructions || "N/A"}</span>
            </div>
          </div>
        </div>
      `,
      )
      .join("");

    panelContent.innerHTML = `
      <div class="prescription-detail">
        <div class="detail-section">
          <h4>Prescription Information</h4>
          <div class="detail-row">
            <span class="detail-label">Prescription #</span>
            <span class="detail-value">${rx.refNumber || "N/A"}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value">
              <span class="status-badge ${statusConfig.class}" style="background:${statusConfig.bg};color:${statusConfig.color};border:1px solid ${statusConfig.border};padding:6px 12px;">
                <i class="fa-solid ${statusConfig.icon}"></i> ${statusConfig.label}
              </span>
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Prescribed Date</span>
            <span class="detail-value">${formatDate(rx.datePrescribed)}</span>
          </div>
        </div>

        <div class="detail-section">
          <h4>Healthcare Provider</h4>
          <div class="detail-row">
            <span class="detail-label">Prescribing Doctor</span>
            <span class="detail-value">${rx.doctor || "N/A"}</span>
          </div>
          <!-- ✅ Removed "Dispensed By" as requested -->
        </div>

        <div class="detail-section">
          <h4>Medications (${rx.medications.length})</h4>
          <div class="medications-list">
            ${medicationsHTML}
          </div>
        </div>
      </div>
    `;
  }

  function openPanel() {
    if (window.innerWidth <= 1024) {
      detailsPanel.classList.add("open");
    }
  }

  panelClose.addEventListener("click", () => {
    detailsPanel.classList.remove("open");
  });

  // ===== SEARCH & FILTER =====
  filterBtn.addEventListener("click", () => {
    filtersSection.hidden = !filtersSection.hidden;
  });

  applyFilterBtn.addEventListener("click", applyFilters);
  clearFilterBtn.addEventListener("click", clearFilters);

  function applyFilters() {
    const status = document.getElementById("statusFilter").value;
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;

    filteredData = prescriptions.filter((rx) => {
      let match = true;

      if (status && rx.status?.toLowerCase() !== status.toLowerCase())
        match = false;

      if (
        dateFrom &&
        rx.datePrescribed &&
        new Date(rx.datePrescribed) < new Date(dateFrom)
      )
        match = false;
      if (
        dateTo &&
        rx.datePrescribed &&
        new Date(rx.datePrescribed) > new Date(dateTo)
      )
        match = false;

      return match;
    });

    currentPage = 1;
    renderTable();
    updateStats(); // ✅ Stats update with filters
    filtersSection.hidden = true;
  }

  function clearFilters() {
    document.getElementById("statusFilter").value = "";
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";

    filteredData = [...prescriptions]; // ✅ Reset to all data
    currentPage = 1;
    renderTable();
    updateStats(); // ✅ Stats reset to total
  }

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    filteredData = prescriptions.filter(
      (rx) =>
        (rx.refNumber || "").toLowerCase().includes(term) ||
        (rx.doctor || "").toLowerCase().includes(term) ||
        rx.medications.some((m) => (m.name || "").toLowerCase().includes(term)),
    );

    currentPage = 1;
    renderTable();
    updateStats(); // ✅ Stats update with search
  });

  // ===== DOWNLOAD & VIEW =====
  window.downloadPrescription = function (id) {
    const rx = prescriptions.find((r) => r.id === id);
    showToast(`Downloading ${rx.refNumber || rx.id}...`, "info");
  };

  window.viewPrescription = function (id) {
    const rx = prescriptions.find((r) => r.id === id);
    showPrescriptionDetails(rx);
    openPanel();
  };

  // Panel Buttons - Feature Coming Soon
  downloadPanel.addEventListener("click", () => {
    if (selectedPrescription) {
      showToast("Feature is coming soon!", "info");
    }
  });

  viewPanel.addEventListener("click", () => {
    if (selectedPrescription) {
      showToast("Feature is coming soon!", "info");
    }
  });

  // Download All Button
  downloadAllBtn.addEventListener("click", () => {
    showToast("Feature is coming soon!", "info");
  });

  // ===== UTILITIES =====
  function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function showToast(message, type = "success") {
    const existing = document.getElementById("recordsToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "recordsToast";
    toast.innerHTML = `
      <div class="toast-icon"><i class="fa-solid fa-${type === "success" ? "circle-check" : type === "info" ? "info-circle" : "triangle-exclamation"}"></i></div>
      <div class="toast-content">${message}</div>
    `;

    toast.style.cssText = `
      position:fixed;bottom:24px;right:24px;background:var(--card-bg);color:var(--text-dark);
      padding:14px 20px;border-radius:var(--radius-md);box-shadow:var(--shadow-lg);
      border-left:4px solid ${type === "success" ? "var(--primary)" : type === "info" ? "var(--accent-gold)" : "var(--accent-red)"};
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

  // ===== INITIALIZE =====
  loadPrescriptions(); // ✅ Fetch real data on page load
});
