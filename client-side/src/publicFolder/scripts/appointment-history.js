/**
 * APPOINTMENT & RECORDS HISTORY PAGE
 * Fast animations • Mobile responsive • Admission/Release tracking
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== MOCK DATA - Appointment & Records History =====
  const history = [
    {
      id: 1,
      visitId: "V-2024-001",
      type: "admission",
      doctor: "Dr. Sarah Jenkins",
      department: "Cardiology",
      diagnosis: "Acute Myocardial Infarction",
      appointmentDate: "2024-10-15",
      admissionDate: "2024-10-15",
      dischargeDate: "2024-10-18",
      status: "completed",
    },
    {
      id: 2,
      visitId: "V-2024-002",
      type: "outpatient",
      doctor: "Dr. Emily Chen",
      department: "Pediatrics",
      diagnosis: "Seasonal Allergies - Follow-up",
      appointmentDate: "2024-09-22",
      admissionDate: null,
      dischargeDate: null,
      status: "completed",
    },
    {
      id: 3,
      visitId: "V-2024-003",
      type: "emergency",
      doctor: "Dr. Mark Alston",
      department: "Emergency Medicine",
      diagnosis: "Fractured Radius",
      appointmentDate: "2024-08-10",
      admissionDate: "2024-08-10",
      dischargeDate: "2024-08-12",
      status: "completed",
    },
    {
      id: 4,
      visitId: "V-2024-004",
      type: "followup",
      doctor: "Dr. Sarah Jenkins",
      department: "Cardiology",
      diagnosis: "Post-Infarction Checkup",
      appointmentDate: "2024-10-22",
      admissionDate: null,
      dischargeDate: null,
      status: "completed",
    },
    {
      id: 5,
      visitId: "V-2024-005",
      type: "admission",
      doctor: "Dr. Michael Ross",
      department: "Neurology",
      diagnosis: "Severe Migraine Investigation",
      appointmentDate: "2024-07-05",
      admissionDate: "2024-07-05",
      dischargeDate: "2024-07-07",
      status: "completed",
    },
    // Add more mock data
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 6,
      visitId: `V-2024-${String(i + 6).padStart(3, "0")}`,
      type: ["admission", "outpatient", "emergency", "followup"][i % 4],
      doctor: [
        "Dr. Sarah Jenkins",
        "Dr. Michael Ross",
        "Dr. Mark Alston",
        "Dr. Emily Chen",
        "Dr. James Miller",
      ][i % 5],
      department: [
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "General",
      ][i % 5],
      diagnosis: [
        "Routine Checkup",
        "Flu Symptoms",
        "Back Pain",
        "Annual Physical",
        "Hypertension",
      ][i % 5],
      appointmentDate: `2024-10-${String(15 + i).padStart(2, "0")}`,
      admissionDate:
        i % 4 === 0 ? `2024-10-${String(15 + i).padStart(2, "0")}` : null,
      dischargeDate:
        i % 4 === 0 ? `2024-10-${String(17 + i).padStart(2, "0")}` : null,
      status: ["completed", "completed", "completed", "cancelled"][i % 4],
    })),
  ];

  // ===== STATE =====
  let currentPage = 1;
  let itemsPerPage = 25;
  let filteredData = [...history];
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

  // ===== STATS UPDATE =====
  function updateStats() {
    const total = history.length;
    const admissions = history.filter((h) => h.type === "admission").length;
    const outpatient = history.filter((h) => h.type === "outpatient").length;
    const emergency = history.filter((h) => h.type === "emergency").length;

    animateNumber("totalVisits", total);
    animateNumber("admissions", admissions);
    animateNumber("outpatient", outpatient);
    animateNumber("emergency", emergency);
  }

  function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
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

    pageData.forEach((record) => {
      const row = document.createElement("tr");
      row.dataset.id = record.id;

      const statusClass =
        record.status === "completed"
          ? "completed"
          : record.status === "in-patient"
            ? "in-patient"
            : "cancelled";
      const statusIcon =
        record.status === "completed"
          ? "fa-check"
          : record.status === "in-patient"
            ? "fa-hospital"
            : "fa-xmark";

      const typeIcon =
        record.type === "admission"
          ? "fa-bed"
          : record.type === "outpatient"
            ? "fa-person-walking"
            : record.type === "emergency"
              ? "fa-kit-medical"
              : "fa-rotate-right";

      // Dates logic
      let datesHTML = "";
      if (record.type === "admission") {
        datesHTML = `
          <div class="dates-display">
            <span class="date-primary">${formatDate(record.admissionDate)}</span>
            <span class="date-secondary">Discharged: ${formatDate(record.dischargeDate)}</span>
          </div>
        `;
      } else {
        datesHTML = `
          <div class="dates-display">
            <span class="date-primary">${formatDate(record.appointmentDate)}</span>
            <span class="date-secondary">Appointment</span>
          </div>
        `;
      }

      row.innerHTML = `
        <td><strong>${record.visitId}</strong></td>
        <td>
          <span class="type-badge ${record.type}">
            <i class="fa-solid ${typeIcon}"></i>
            ${capitalize(record.type)}
          </span>
        </td>
        <td>${record.doctor}</td>
        <td>${datesHTML}</td>
        <td>${record.diagnosis}</td>
        <td>
          <span class="status-badge ${statusClass}">
            <i class="fa-solid ${statusIcon}"></i>
            ${record.status}
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

    const statusClass =
      record.status === "completed"
        ? "completed"
        : record.status === "in-patient"
          ? "in-patient"
          : "cancelled";
    const statusIcon =
      record.status === "completed"
        ? "fa-check-circle"
        : record.status === "in-patient"
          ? "fa-hospital"
          : "fa-xmark";

    // Date Section
    let datesHTML = "";
    if (record.type === "admission") {
      datesHTML = `
        <div class="detail-section">
          <h4>Admission Details</h4>
          <div class="detail-row">
            <span class="detail-label">Admission Date</span>
            <span class="detail-value">${formatDate(record.admissionDate)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Discharge Date</span>
            <span class="detail-value">${formatDate(record.dischargeDate)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration</span>
            <span class="detail-value">${calculateDuration(record.admissionDate, record.dischargeDate)}</span>
          </div>
        </div>
      `;
    } else {
      datesHTML = `
        <div class="detail-section">
          <h4>Appointment Details</h4>
          <div class="detail-row">
            <span class="detail-label">Appointment Date</span>
            <span class="detail-value">${formatDate(record.appointmentDate)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Visit Type</span>
            <span class="detail-value">${capitalize(record.type)}</span>
          </div>
        </div>
      `;
    }

    panelContent.innerHTML = `
      <div class="visit-detail">
        <div class="detail-section">
          <h4>Visit Information</h4>
          <div class="detail-row">
            <span class="detail-label">Visit ID</span>
            <span class="detail-value">${record.visitId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value">
              <span class="status-badge ${statusClass}">
                <i class="fa-solid ${statusIcon}"></i> ${record.status}
              </span>
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Department</span>
            <span class="detail-value">${record.department}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Attending Doctor</span>
            <span class="detail-value">${record.doctor}</span>
          </div>
        </div>

        ${datesHTML}

        <div class="detail-section">
          <h4>Diagnosis</h4>
          <div class="diagnosis-box">
            <p>${record.diagnosis}</p>
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

    filteredData = history.filter((record) => {
      let match = true;

      if (visitType && record.type !== visitType) match = false;
      if (status && record.status !== status) match = false;

      const visitDate =
        record.type === "admission"
          ? record.admissionDate
          : record.appointmentDate;
      if (dateFrom && visitDate < dateFrom) match = false;
      if (dateTo && visitDate > dateTo) match = false;

      return match;
    });

    currentPage = 1;
    renderTable();
    updateStats();
    filtersSection.hidden = true;
  }

  function clearFilters() {
    document.getElementById("visitTypeFilter").value = "";
    document.getElementById("statusFilter").value = "";
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";

    filteredData = [...history];
    currentPage = 1;
    renderTable();
    updateStats();
  }

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    filteredData = history.filter(
      (record) =>
        record.visitId.toLowerCase().includes(term) ||
        record.doctor.toLowerCase().includes(term) ||
        record.diagnosis.toLowerCase().includes(term) ||
        record.department.toLowerCase().includes(term),
    );

    currentPage = 1;
    renderTable();
  });

  // ===== DOWNLOAD & VIEW =====
  window.downloadRecord = function (id) {
    const record = history.find((r) => r.id === id);
    showToast(`Downloading record ${record.visitId}...`, "success");
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
  updateStats();
  renderTable();
});
