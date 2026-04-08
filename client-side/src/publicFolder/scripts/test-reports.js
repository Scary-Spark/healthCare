/**
 * TEST REPORTS PAGE
 * Fast animations • Mobile responsive • Feature coming soon messages
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== MOCK DATA - Test Reports =====
  const testReports = [
    {
      id: 1,
      refNumber: "TR-2024-001",
      testName: "Complete Blood Count (CBC)",
      testType: "blood",
      doctor: "Dr. Sarah Jenkins",
      performedBy: "Lab Tech: Michael Brown",
      date: "2024-10-15",
      status: "completed",
      appointmentDate: "2024-10-14",
      department: "Hematology",
      results: {
        Hemoglobin: { value: "14.2 g/dL", normal: true },
        "WBC Count": { value: "7,500/μL", normal: true },
        Platelets: { value: "250,000/μL", normal: true },
        "RBC Count": { value: "4.8 M/μL", normal: true },
      },
    },
    {
      id: 2,
      refNumber: "TR-2024-002",
      testName: "Lipid Profile",
      testType: "blood",
      doctor: "Dr. Michael Ross",
      performedBy: "Lab Tech: Emily White",
      date: "2024-10-18",
      status: "completed",
      appointmentDate: "2024-10-17",
      department: "Biochemistry",
      results: {
        "Total Cholesterol": { value: "195 mg/dL", normal: true },
        HDL: { value: "52 mg/dL", normal: true },
        LDL: { value: "118 mg/dL", normal: true },
        Triglycerides: { value: "145 mg/dL", normal: true },
      },
    },
    {
      id: 3,
      refNumber: "TR-2024-003",
      testName: "Urinalysis",
      testType: "urine",
      doctor: "Dr. Mark Alston",
      performedBy: "Lab Tech: Sarah Johnson",
      date: "2024-10-20",
      status: "pending",
      appointmentDate: "2024-10-19",
      department: "Clinical Pathology",
      results: {},
    },
    {
      id: 4,
      refNumber: "TR-2024-004",
      testName: "Chest X-Ray",
      testType: "xray",
      doctor: "Dr. Emily Chen",
      performedBy: "Radiologist: Dr. James Wilson",
      date: "2024-10-22",
      status: "completed",
      appointmentDate: "2024-10-21",
      department: "Radiology",
      results: {
        Finding: { value: "No acute abnormality", normal: true },
        "Heart Size": { value: "Normal", normal: true },
        Lungs: { value: "Clear", normal: true },
      },
    },
    {
      id: 5,
      refNumber: "TR-2024-005",
      testName: "MRI Brain",
      testType: "mri",
      doctor: "Dr. Mark Alston",
      performedBy: "Radiologist: Dr. Lisa Wong",
      date: "2024-10-25",
      status: "critical",
      appointmentDate: "2024-10-24",
      department: "Neuro-Radiology",
      results: {
        Finding: { value: "Small lesion detected", normal: false },
        Recommendation: { value: "Follow-up in 3 months", normal: true },
      },
    },
    // Add more mock data
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 6,
      refNumber: `TR-2024-${String(i + 6).padStart(3, "0")}`,
      testName: [
        "Blood Glucose",
        "Thyroid Panel",
        "CT Abdomen",
        "Ultrasound",
        "ECG",
      ][i % 5],
      testType: ["blood", "blood", "ct", "ultrasound", "blood"][i % 5],
      doctor: [
        "Dr. Sarah Jenkins",
        "Dr. Michael Ross",
        "Dr. Mark Alston",
        "Dr. Emily Chen",
        "Dr. James Miller",
      ][i % 5],
      performedBy: [
        "Lab Tech: Sample",
        "Lab Tech: Demo",
        "Radiologist: Sample",
      ][i % 3],
      date: `2024-10-${String(15 + i).padStart(2, "0")}`,
      status: ["completed", "pending", "completed", "critical", "completed"][
        i % 5
      ],
      appointmentDate: `2024-10-${String(14 + i).padStart(2, "0")}`,
      department: [
        "Hematology",
        "Biochemistry",
        "Radiology",
        "Cardiology",
        "Neurology",
      ][i % 5],
      results: {
        "Result 1": { value: "Normal", normal: true },
        "Result 2": { value: "Normal", normal: true },
      },
    })),
  ];

  // ===== STATE =====
  let currentPage = 1;
  let itemsPerPage = 25;
  let filteredData = [...testReports];
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

  // ===== STATS UPDATE =====
  function updateStats() {
    const total = testReports.length;
    const pending = testReports.filter((r) => r.status === "pending").length;
    const completed = testReports.filter(
      (r) => r.status === "completed",
    ).length;
    const critical = testReports.filter((r) => r.status === "critical").length;

    animateNumber("totalTests", total);
    animateNumber("pendingTests", pending);
    animateNumber("completedTests", completed);
    animateNumber("criticalTests", critical);
  }

  function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    const duration = 500; // Faster animation
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

    pageData.forEach((report) => {
      const row = document.createElement("tr");
      row.dataset.id = report.id;

      const statusClass = report.status;
      const statusIcon =
        report.status === "completed"
          ? "fa-check"
          : report.status === "pending"
            ? "fa-clock"
            : "fa-triangle-exclamation";

      row.innerHTML = `
        <td><strong>${report.refNumber}</strong></td>
        <td>${report.testName}</td>
        <td>${report.doctor}</td>
        <td>${formatDate(report.date)}</td>
        <td>
          <span class="status-badge ${statusClass}">
            <i class="fa-solid ${statusIcon}"></i>
            ${report.status}
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

      // Hover to show details
      row.addEventListener("mouseenter", () => {
        showReportDetails(report);
        highlightRow(row);
      });

      // Click to select
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

    const statusClass = report.status;
    const statusIcon =
      report.status === "completed"
        ? "fa-check-circle"
        : report.status === "pending"
          ? "fa-clock"
          : "fa-triangle-exclamation";

    let resultsHTML = "";
    if (Object.keys(report.results).length > 0) {
      resultsHTML = `
        <div class="test-results">
          ${Object.entries(report.results)
            .map(
              ([key, value]) => `
            <div class="result-item">
              <span class="result-name">${key}</span>
              <span class="result-value ${value.normal ? "" : "abnormal"}">${value.value}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    }

    panelContent.innerHTML = `
      <div class="report-detail">
        <div class="detail-section">
          <h4>Report Information</h4>
          <div class="detail-row">
            <span class="detail-label">Reference #</span>
            <span class="detail-value">${report.refNumber}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Test Name</span>
            <span class="detail-value">${report.testName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value">
              <span class="status-badge ${statusClass}">
                <i class="fa-solid ${statusIcon}"></i> ${report.status}
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
            <span class="detail-value">${report.doctor}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Performed By</span>
            <span class="detail-value">${report.performedBy}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Department</span>
            <span class="detail-value">${report.department}</span>
          </div>
        </div>

        ${resultsHTML}
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
      if (status && report.status !== status) match = false;
      if (dateFrom && report.date < dateFrom) match = false;
      if (dateTo && report.date > dateTo) match = false;

      return match;
    });

    currentPage = 1;
    renderTable();
    updateStats();
    filtersSection.hidden = true;
  }

  function clearFilters() {
    document.getElementById("testTypeFilter").value = "";
    document.getElementById("statusFilter").value = "";
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";

    filteredData = [...testReports];
    currentPage = 1;
    renderTable();
    updateStats();
  }

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    filteredData = testReports.filter(
      (report) =>
        report.testName.toLowerCase().includes(term) ||
        report.doctor.toLowerCase().includes(term) ||
        report.refNumber.toLowerCase().includes(term),
    );

    currentPage = 1;
    renderTable();
  });

  // ===== DOWNLOAD & VIEW =====
  window.downloadReport = function (id) {
    const report = testReports.find((r) => r.id === id);
    showToast(`Downloading ${report.testName}...`, "success");
  };

  window.viewReport = function (id) {
    const report = testReports.find((r) => r.id === id);
    showReportDetails(report);
    openPanel();
  };

  // Download Panel Button
  downloadPanel.addEventListener("click", () => {
    if (selectedReport) {
      showToast("Feature is coming soon!", "info");
    }
  });

  // View Panel Button
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
  function formatDate(dateStr) {
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
  updateStats();
  renderTable();
});
