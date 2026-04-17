/**
 * APPOINTMENT & RECORDS HISTORY PAGE - DYNAMIC VERSION
 * Fetches real data from database via API
 * Handles NULL values, dynamic status colors, and dynamic stats/filtering
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== STATUS CONFIGURATION - DYNAMIC COLORS WITH GOOD CONTRAST =====
  const STATUS_CONFIG = {
    pending: {
      label: "Pending",
      class: "pending",
      icon: "fa-clock",
      bg: "#fef3c7",
      color: "#92400e",
      border: "#f59e0b",
    },
    confirmed: {
      label: "Confirmed",
      class: "confirmed",
      icon: "fa-check-circle",
      bg: "#d1fae5",
      color: "#065f46",
      border: "#10b981",
    },
    completed: {
      label: "Completed",
      class: "completed",
      icon: "fa-check-double",
      bg: "#d1fae5",
      color: "#065f46",
      border: "#10b981",
    },
    cancelled: {
      label: "Cancelled",
      class: "cancelled",
      icon: "fa-times-circle",
      bg: "#fee2e2",
      color: "#991b1b",
      border: "#ef4444",
    },
    "no-show": {
      label: "No-Show",
      class: "no-show",
      icon: "fa-user-slash",
      bg: "#ffedd5",
      color: "#9a3412",
      border: "#f97316",
    },
    rescheduled: {
      label: "Rescheduled",
      class: "rescheduled",
      icon: "fa-calendar-alt",
      bg: "#dbeafe",
      color: "#1e40af",
      border: "#3b82f6",
    },
  };

  // ===== STATE =====
  let currentPage = 1;
  let itemsPerPage = 25;
  let history = [];
  let filteredData = []; // This will be the source of truth for Stats and Table
  let selectedRecord = null;

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
  async function loadAppointmentHistory() {
    try {
      console.log("🔄 Loading appointment history...");

      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;"><i class="fa-solid fa-spinner fa-spin" style="font-size:2rem;color:var(--primary);"></i><p style="margin-top:12px;color:var(--text-light);">Loading your history...</p></td></tr>`;

      const response = await fetch("/api/appointments/history");
      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("📦 API result:", result);

      if (result.success) {
        history = result.data || [];
        filteredData = [...history]; // ✅ Initialize filteredData with all data

        console.log(`✅ Loaded ${history.length} appointment records`);

        // ✅ Populate filter dropdowns dynamically
        populateVisitTypeFilter();
        populateStatusFilter();

        updateStats();
        renderTable();
      } else {
        console.error("❌ API returned error:", result.message);
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-light);">
          <i class="fa-solid fa-circle-exclamation" style="font-size:2rem;margin-bottom:12px;"></i>
          <p>${result.message || "Failed to load appointment history"}</p>
        </td></tr>`;
      }
    } catch (error) {
      console.error("❌ Error fetching appointment history:", error);
      console.error("Error stack:", error.stack);

      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-light);">
        <i class="fa-solid fa-circle-exclamation" style="font-size:2rem;margin-bottom:12px;"></i>
        <p>Error loading data. Please try again.</p>
        <p style="font-size:0.85rem;margin-top:8px;opacity:0.7;">${error.message}</p>
      </td></tr>`;
    }
  }

  // ===== POPULATE FILTERS DYNAMICALLY =====
  function populateVisitTypeFilter() {
    const select = document.getElementById("visitTypeFilter");
    if (!select) return;

    // Get unique visit types from loaded data
    const types = [...new Set(history.map((h) => h.type).filter(Boolean))];

    // Keep the "All Types" option
    select.innerHTML = '<option value="">All Types</option>';

    // Add dynamic options
    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = capitalize(type);
      select.appendChild(option);
    });
  }

  function populateStatusFilter() {
    const select = document.getElementById("statusFilter");
    if (!select) return;

    // Get unique statuses from loaded data
    const statuses = [...new Set(history.map((h) => h.status).filter(Boolean))];

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
      : "pending";
    return STATUS_CONFIG[statusKey] || STATUS_CONFIG["pending"];
  }

  // ===== STATS UPDATE =====
  function updateStats() {
    // ✅ Use filteredData so stats reflect active filters (Date, Type, Status, Search)
    const data = filteredData;

    const total = data.length;
    const admissions = data.filter((h) => h.type === "admission").length;
    const outpatient = data.filter((h) => h.type === "outpatient").length;
    const emergency = data.filter((h) => h.type === "emergency").length;

    animateNumber("totalVisits", total);
    animateNumber("admissions", admissions);
    animateNumber("outpatient", outpatient);
    animateNumber("emergency", emergency);
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
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-light);">No records found</td></tr>`;
      updateTableInfo();
      renderPagination();
      return;
    }

    pageData.forEach((record) => {
      const row = document.createElement("tr");
      row.dataset.id = record.id;

      const statusConfig = getStatusConfig(record.status);

      // ✅ Type icon based on actual type from API
      const typeIcon =
        record.type === "admission"
          ? "fa-bed"
          : record.type === "outpatient"
            ? "fa-person-walking"
            : record.type === "emergency"
              ? "fa-kit-medical"
              : "fa-rotate-right";

      // ✅ Dates logic - handle NULL values
      let datesHTML = "";
      if (record.type === "admission") {
        const admissionDate = record.admissionDate
          ? formatDate(record.admissionDate)
          : "N/A";
        const dischargeDate = record.dischargeDate
          ? formatDate(record.dischargeDate)
          : "Not discharged";

        datesHTML = `
          <div class="dates-display">
            <span class="date-primary">${admissionDate}</span>
            <span class="date-secondary">Discharged: ${dischargeDate}</span>
          </div>
        `;
      } else {
        const apptDate = record.appointmentDate
          ? formatDate(record.appointmentDate)
          : "N/A";

        datesHTML = `
          <div class="dates-display">
            <span class="date-primary">${apptDate}</span>
            <span class="date-secondary">Appointment</span>
          </div>
        `;
      }

      // ✅ Build row HTML - handle ALL nullable fields with dynamic status
      row.innerHTML = `
        <td><strong>${record.visitId || "N/A"}</strong></td>
        <td>
          <span class="type-badge ${record.type}">
            <i class="fa-solid ${typeIcon}"></i>
            ${capitalize(record.type)}
          </span>
        </td>
        <td>${record.doctor || "Unknown Doctor"}</td>
        <td>${datesHTML}</td>
        <td>${record.diagnosis || "No diagnosis recorded"}</td>
        <td>
          <span class="status-badge ${statusConfig.class}" style="background:${statusConfig.bg};color:${statusConfig.color};border:1px solid ${statusConfig.border}">
            <i class="fa-solid ${statusConfig.icon}"></i>
            ${statusConfig.label}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" title="Download" onclick="downloadRecord(${record.id})">
              <i class="fa-solid fa-download"></i>
            </button>
            <button class="btn-icon" title="View" onclick="viewRecord(${record.id})">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </td>
      `;

      row.addEventListener("mouseenter", () => {
        showRecordDetails(record);
        highlightRow(row);
      });

      row.addEventListener("click", () => {
        showRecordDetails(record);
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

  // ===== SHOW RECORD DETAILS =====
  function showRecordDetails(record) {
    selectedRecord = record;

    const statusConfig = getStatusConfig(record.status);

    // ✅ Date Section - handle NULL values
    let datesHTML = "";
    if (record.type === "admission") {
      const admissionDate = record.admissionDate
        ? formatDate(record.admissionDate)
        : "N/A";
      const dischargeDate = record.dischargeDate
        ? formatDate(record.dischargeDate)
        : "Not discharged yet";
      const duration =
        record.admissionDate && record.dischargeDate
          ? calculateDuration(record.admissionDate, record.dischargeDate)
          : "N/A";

      datesHTML = `
        <div class="detail-section">
          <h4>Admission Details</h4>
          <div class="detail-row">
            <span class="detail-label">Admission Date</span>
            <span class="detail-value">${admissionDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Discharge Date</span>
            <span class="detail-value">${dischargeDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration</span>
            <span class="detail-value">${duration}</span>
          </div>
        </div>
      `;
    } else {
      const apptDate = record.appointmentDate
        ? formatDate(record.appointmentDate)
        : "N/A";

      datesHTML = `
        <div class="detail-section">
          <h4>Appointment Details</h4>
          <div class="detail-row">
            <span class="detail-label">Appointment Date</span>
            <span class="detail-value">${apptDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Visit Type</span>
            <span class="detail-value">${capitalize(record.type)}</span>
          </div>
        </div>
      `;
    }

    // ✅ Build details panel - handle ALL nullable fields with dynamic status
    panelContent.innerHTML = `
      <div class="visit-detail">
        <div class="detail-section">
          <h4>Visit Information</h4>
          <div class="detail-row">
            <span class="detail-label">Visit ID</span>
            <span class="detail-value">${record.visitId || "N/A"}</span>
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
            <span class="detail-label">Department</span>
            <span class="detail-value">${record.department || "N/A"}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Attending Doctor</span>
            <span class="detail-value">${record.doctor || "N/A"}</span>
          </div>
        </div>

        ${datesHTML}

        <div class="detail-section">
          <h4>Diagnosis</h4>
          <div class="diagnosis-box">
            <p>${record.diagnosis || "No diagnosis recorded"}</p>
          </div>
        </div>
      </div>
    `;
  }

  function calculateDuration(start, end) {
    if (!start || !end) return "N/A";
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Day(s)`;
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
    const visitType = document.getElementById("visitTypeFilter").value;
    const status = document.getElementById("statusFilter").value;
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;

    // ✅ Filter the main history array and update filteredData
    filteredData = history.filter((record) => {
      let match = true;

      if (visitType && record.type !== visitType) match = false;
      if (status && record.status?.toLowerCase() !== status.toLowerCase())
        match = false;

      const visitDate =
        record.type === "admission"
          ? record.admissionDate
          : record.appointmentDate;

      if (dateFrom && visitDate && new Date(visitDate) < new Date(dateFrom))
        match = false;
      if (dateTo && visitDate && new Date(visitDate) > new Date(dateTo))
        match = false;

      return match;
    });

    currentPage = 1;
    renderTable();
    updateStats(); // ✅ Stats update with filters
    filtersSection.hidden = true;
  }

  function clearFilters() {
    document.getElementById("visitTypeFilter").value = "";
    document.getElementById("statusFilter").value = "";
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";

    filteredData = [...history]; // ✅ Reset to all data
    currentPage = 1;
    renderTable();
    updateStats(); // ✅ Stats reset to total
  }

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    filteredData = history.filter(
      (record) =>
        (record.visitId || "").toLowerCase().includes(term) ||
        (record.doctor || "").toLowerCase().includes(term) ||
        (record.diagnosis || "").toLowerCase().includes(term) ||
        (record.department || "").toLowerCase().includes(term),
    );

    currentPage = 1;
    renderTable();
    updateStats(); // ✅ Stats update with search
  });

  // ===== DOWNLOAD & VIEW =====
  window.downloadRecord = function (id) {
    const record = history.find((r) => r.id === id);
    showToast(
      `Downloading record ${record.visitId || record.id}...`,
      "success",
    );
  };

  window.viewRecord = function (id) {
    const record = history.find((r) => r.id === id);
    showRecordDetails(record);
    openPanel();
  };

  // Panel Buttons - Feature Coming Soon
  downloadPanel.addEventListener("click", () => {
    if (selectedRecord) {
      showToast("Feature is coming soon!", "info");
    }
  });

  viewPanel.addEventListener("click", () => {
    if (selectedRecord) {
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
  loadAppointmentHistory();
});
