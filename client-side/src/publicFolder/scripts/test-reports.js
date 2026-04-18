/**
 * TEST REPORTS PAGE - DYNAMIC VERSION
 * Fetches real data from database via API
 * Handles NULL values and dynamic status colors
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== STATUS CONFIGURATION - DYNAMIC COLORS =====
  const STATUS_CONFIG = {
    completed: {
      label: "Completed",
      class: "completed",
      icon: "fa-check-circle",
      bg: "#d1fae5",
      color: "#065f46",
      border: "#10b981",
    },
    pending: {
      label: "Pending",
      class: "pending",
      icon: "fa-clock",
      bg: "#fef3c7",
      color: "#92400e",
      border: "#f59e0b",
    },
    critical: {
      label: "Critical",
      class: "critical",
      icon: "fa-triangle-exclamation",
      bg: "#fee2e2",
      color: "#991b1b",
      border: "#ef4444",
    },
  };

  // ===== STATE =====
  let currentPage = 1;
  let itemsPerPage = 25;
  let testReports = []; // Will be populated by API
  let filteredData = [];
  let selectedReport = null;

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
  async function loadTestReports() {
    try {

      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;"><i class="fa-solid fa-spinner fa-spin" style="font-size:2rem;color:var(--primary);"></i><p style="margin-top:12px;color:var(--text-light);">Loading your test reports...</p></td></tr>`;

      const response = await fetch("/api/test-reports");
      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("📦 API result:", result);

      if (result.success) {
        testReports = result.reports || [];
        filteredData = [...testReports];

        // Populate filter dropdowns dynamically
        populateTestTypeFilter();
        populateStatusFilter();

        // Update UI
        updateStats();
        renderTable();
      } else {
        console.error("❌ API returned error:", result.message);
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-light);">
        <i class="fa-solid fa-circle-exclamation" style="font-size:2rem;margin-bottom:12px;"></i>
        <p>${result.message || "Failed to load test reports"}</p>
      </td></tr>`;
      }
    } catch (error) {
      console.error("❌ Error fetching test reports:", error);
      console.error("Error stack:", error.stack);

      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-light);">
      <i class="fa-solid fa-circle-exclamation" style="font-size:2rem;margin-bottom:12px;"></i>
      <p>Error loading data. Please try again.</p>
      <p style="font-size:0.85rem;margin-top:8px;opacity:0.7;">${error.message}</p>
    </td></tr>`;
    }
  }

  // ===== POPULATE FILTERS DYNAMICALLY =====
  function populateTestTypeFilter() {
    const select = document.getElementById("testTypeFilter");
    if (!select) return;

    // Get unique test types from loaded data (based on test name patterns)
    const types = [
      ...new Set(testReports.map((r) => r.testType).filter(Boolean)),
    ];

    // Keep the "All Types" option
    select.innerHTML = '<option value="">All Types</option>';

    // Add dynamic options with proper labels
    const typeLabels = {
      blood: "Blood Test",
      urine: "Urine Test",
      xray: "X-Ray",
      mri: "MRI",
      ct: "CT Scan",
      ultrasound: "Ultrasound",
      other: "Other",
    };

    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = typeLabels[type] || capitalize(type);
      select.appendChild(option);
    });
  }

  function populateStatusFilter() {
    const select = document.getElementById("statusFilter");
    if (!select) return;

    // Get unique statuses from loaded data
    const statuses = [
      ...new Set(testReports.map((r) => r.status).filter(Boolean)),
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
      : "pending";
    return STATUS_CONFIG[statusKey] || STATUS_CONFIG["pending"];
  }

  // ===== STATS UPDATE =====
  function updateStats() {
    // ✅ Use filteredData so stats reflect active filters
    const data = filteredData;

    const total = data.length;
    const pending = data.filter((r) => r.status === "pending").length;
    const completed = data.filter((r) => r.status === "completed").length;
    const critical = data.filter((r) => r.status === "critical").length;

    animateNumber("totalTests", total);
    animateNumber("pendingTests", pending);
    animateNumber("completedTests", completed);
    animateNumber("criticalTests", critical);
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
      if (testReports.length === 0) {
        // No reports in database
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center;padding:60px 40px;">
              <div style="max-width:400px;margin:0 auto;">
                <i class="fa-solid fa-file-medical" style="font-size:4rem;color:var(--border);margin-bottom:20px;display:block;"></i>
                <h3 style="color:var(--text-dark);margin:0 0 8px 0;font-size:1.3rem;">No Test Reports Yet</h3>
                <p style="color:var(--text-light);margin:0 0 20px 0;font-size:0.95rem;">
                  You don't have any test reports on record. When your doctor orders tests, 
                  the results will appear here.
                </p>
                <button onclick="window.location.href='/appointment'" style="
                  background:var(--primary);
                  color:white;
                  border:none;
                  padding:12px 24px;
                  border-radius:8px;
                  font-weight:600;
                  cursor:pointer;
                  font-size:0.9rem;
                ">
                  <i class="fa-solid fa-plus" style="margin-right:8px;"></i>
                  Book an Appointment
                </button>
              </div>
            </td>
          </tr>
        `;
      } else {
        // Filtered results are empty
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center;padding:60px 40px;">
              <div style="max-width:400px;margin:0 auto;">
                <i class="fa-solid fa-search" style="font-size:3rem;color:var(--border);margin-bottom:20px;display:block;"></i>
                <h3 style="color:var(--text-dark);margin:0 0 8px 0;font-size:1.3rem;">No Matching Reports</h3>
                <p style="color:var(--text-light);margin:0;font-size:0.95rem;">
                  No test reports match your current filters. Try adjusting your search or filters.
                </p>
              </div>
            </td>
          </tr>
        `;
      }
      updateTableInfo();
      renderPagination();
      return;
    }

    pageData.forEach((report) => {
      const row = document.createElement("tr");
      row.dataset.id = report.id;

      const statusConfig = getStatusConfig(report.status);

      row.innerHTML = `
        <td><strong>${report.refNumber || "N/A"}</strong></td>
        <td>${report.testName || "Unknown Test"}</td>
        <td>${report.doctor || "Unknown Doctor"}</td>
        <td>${formatDate(report.date)}</td>
        <td>
          <span class="status-badge ${statusConfig.class}" style="background:${statusConfig.bg};color:${statusConfig.color};border:1px solid ${statusConfig.border}">
            <i class="fa-solid ${statusConfig.icon}"></i>
            ${statusConfig.label}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" title="Download" onclick="downloadReport(${report.id})">
              <i class="fa-solid fa-download"></i>
            </button>
            <button class="btn-icon" title="View" onclick="viewReport(${report.id})">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </td>
      `;

      row.addEventListener("mouseenter", () => {
        showReportDetails(report);
        highlightRow(row);
      });

      row.addEventListener("click", () => {
        showReportDetails(report);
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

  // ===== SHOW REPORT DETAILS =====
  function showReportDetails(report) {
    selectedReport = report;

    const statusConfig = getStatusConfig(report.status);

    // Format results for display
    let resultsHTML = "";
    if (report.results && report.results.length > 0) {
      resultsHTML = `
        <div class="test-results">
          ${report.results
            .map(
              (result) => `
            <div class="result-item">
              <span class="result-name">${result.parameter || "N/A"}</span>
              <span class="result-value ${result.normal ? "" : "abnormal"}">
                ${result.value || "N/A"} ${result.unit || ""}
                ${result.referenceRange ? `<span class="result-range">(${result.referenceRange})</span>` : ""}
              </span>
              ${result.remarks ? `<span class="result-remarks">${result.remarks}</span>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    } else {
      resultsHTML = `
        <div style="
          padding: 20px;
          background: var(--bg);
          border-radius: var(--radius-md);
          text-align: center;
          color: var(--text-light);
          font-size: 0.9rem;
          font-style: italic;
        ">
          No detailed results available for this test report.
        </div>
      `;
    }

    panelContent.innerHTML = `
      <div class="report-detail">
        <div class="detail-section">
          <h4>Report Information</h4>
          <div class="detail-row">
            <span class="detail-label">Reference #</span>
            <span class="detail-value">${report.refNumber || "N/A"}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Test Name</span>
            <span class="detail-value">${report.testName || "N/A"}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value">
              <span class="status-badge ${statusConfig.class}" style="background:${statusConfig.bg};color:${statusConfig.color};border:1px solid ${statusConfig.border};padding:6px 12px;">
                <i class="fa-solid ${statusConfig.icon}"></i> ${statusConfig.label}
              </span>
            </span>
          </div>
        </div>

        <div class="detail-section">
          <h4>Appointment Details</h4>
          <div class="detail-row">
            <span class="detail-label">Appointment Date</span>
            <span class="detail-value">${formatDate(report.appointmentDate)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Test Date</span>
            <span class="detail-value">${formatDate(report.date)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Doctor</span>
            <span class="detail-value">${report.doctor || "N/A"}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Department</span>
            <span class="detail-value">${report.department || "N/A"}</span>
          </div>
        </div>

        <div class="detail-section">
          <h4>Test Results</h4>
          ${resultsHTML}
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
    const testType = document.getElementById("testTypeFilter").value;
    const status = document.getElementById("statusFilter").value;
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;

    filteredData = testReports.filter((report) => {
      let match = true;

      if (testType && report.testType !== testType) match = false;
      if (status && report.status?.toLowerCase() !== status.toLowerCase())
        match = false;

      if (dateFrom && report.date && new Date(report.date) < new Date(dateFrom))
        match = false;
      if (dateTo && report.date && new Date(report.date) > new Date(dateTo))
        match = false;

      return match;
    });

    currentPage = 1;
    renderTable();
    updateStats(); // ✅ Stats update with filters
    filtersSection.hidden = true;
  }

  function clearFilters() {
    document.getElementById("testTypeFilter").value = "";
    document.getElementById("statusFilter").value = "";
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";

    filteredData = [...testReports]; // ✅ Reset to all data
    currentPage = 1;
    renderTable();
    updateStats(); // ✅ Stats reset to total
  }

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    filteredData = testReports.filter(
      (report) =>
        (report.refNumber || "").toLowerCase().includes(term) ||
        (report.testName || "").toLowerCase().includes(term) ||
        (report.doctor || "").toLowerCase().includes(term),
    );

    currentPage = 1;
    renderTable();
    updateStats(); // ✅ Stats update with search
  });

  // ===== DOWNLOAD & VIEW =====
  window.downloadReport = function (id) {
    const report = testReports.find((r) => r.id === id);
    showToast(`Downloading ${report.refNumber || report.id}...`, "info");
  };

  window.viewReport = function (id) {
    const report = testReports.find((r) => r.id === id);
    showReportDetails(report);
    openPanel();
  };

  // Panel Buttons - Feature Coming Soon
  downloadPanel.addEventListener("click", () => {
    if (selectedReport) {
      showToast("Feature is coming soon!", "info");
    }
  });

  viewPanel.addEventListener("click", () => {
    if (selectedReport) {
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
  loadTestReports(); // ✅ Fetch real data on page load
});
