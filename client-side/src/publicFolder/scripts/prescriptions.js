/**
 * PRESCRIPTIONS PAGE - UPDATED
 * Multi-medication support • Refill removed • Fast animations
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== MOCK DATA - Prescriptions (Multiple Medications per Rx) =====
  const prescriptions = [
    {
      id: 1,
      refNumber: "RX-2024-001",
      doctor: "Dr. Sarah Jenkins",
      pharmacist: "PharmD: Lisa Chen",
      datePrescribed: "2024-10-15",
      status: "active",
      medications: [
        {
          name: "Amoxicillin 500mg",
          dosage: "500mg",
          frequency: "Twice daily",
          instructions: "Take with food. Complete full course.",
        },
        {
          name: "Paracetamol 500mg",
          dosage: "500mg",
          frequency: "Every 6 hours as needed",
          instructions: "For pain/fever relief.",
        },
      ],
    },
    {
      id: 2,
      refNumber: "RX-2024-002",
      doctor: "Dr. Michael Ross",
      pharmacist: "PharmD: James Wilson",
      datePrescribed: "2024-09-20",
      status: "active",
      medications: [
        {
          name: "Lisinopril 10mg",
          dosage: "10mg",
          frequency: "Once daily",
          instructions: "Take in the morning. Monitor BP.",
        },
        {
          name: "Amlodipine 5mg",
          dosage: "5mg",
          frequency: "Once daily",
          instructions: "Take at same time each day.",
        },
      ],
    },
    {
      id: 3,
      refNumber: "RX-2024-003",
      doctor: "Dr. Emily Chen",
      pharmacist: "PharmD: Sarah Johnson",
      datePrescribed: "2024-08-10",
      status: "expired",
      medications: [
        {
          name: "Metformin 850mg",
          dosage: "850mg",
          frequency: "Twice daily with meals",
          instructions: "Take with meals to reduce stomach upset.",
        },
        {
          name: "Sitagliptin 100mg",
          dosage: "100mg",
          frequency: "Once daily",
          instructions: "Do not skip doses.",
        },
      ],
    },
    {
      id: 4,
      refNumber: "RX-2024-004",
      doctor: "Dr. Mark Alston",
      pharmacist: "PharmD: Michael Brown",
      datePrescribed: "2024-10-01",
      status: "cancelled",
      medications: [
        {
          name: "Ibuprofen 400mg",
          dosage: "400mg",
          frequency: "Every 6 hours as needed",
          instructions: "Do not exceed 1200mg/24h.",
        },
      ],
    },
    {
      id: 5,
      refNumber: "RX-2024-005",
      doctor: "Dr. Sarah Jenkins",
      pharmacist: "PharmD: Lisa Chen",
      datePrescribed: "2024-07-15",
      status: "active",
      medications: [
        {
          name: "Atorvastatin 20mg",
          dosage: "20mg",
          frequency: "Once daily at bedtime",
          instructions: "Take at bedtime. Avoid grapefruit.",
        },
        {
          name: "Aspirin 81mg",
          dosage: "81mg",
          frequency: "Once daily",
          instructions: "Take with food.",
        },
      ],
    },
    // Add more mock data
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 6,
      refNumber: `RX-2024-${String(i + 6).padStart(3, "0")}`,
      doctor: [
        "Dr. Sarah Jenkins",
        "Dr. Michael Ross",
        "Dr. Mark Alston",
        "Dr. Emily Chen",
        "Dr. James Miller",
      ][i % 5],
      pharmacist: [
        "PharmD: Lisa Chen",
        "PharmD: James Wilson",
        "PharmD: Sarah Johnson",
      ][i % 3],
      datePrescribed: `2024-10-${String(15 + i).padStart(2, "0")}`,
      status: ["active", "expired", "cancelled", "active", "active"][i % 5],
      medications: [
        {
          name: ["Omeprazole 20mg", "Levothyroxine 50mcg", "Metoprolol 25mg"][
            i % 3
          ],
          dosage: "As prescribed",
          frequency: "Once daily",
          instructions: "Follow doctor instructions.",
        },
      ],
    })),
  ];

  // ===== STATE =====
  let currentPage = 1;
  let itemsPerPage = 25;
  let filteredData = [...prescriptions];
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

  // ===== STATS UPDATE =====
  function updateStats() {
    const total = prescriptions.length;
    const active = prescriptions.filter((p) => p.status === "active").length;
    const expired = prescriptions.filter((p) => p.status === "expired").length;
    const cancelled = prescriptions.filter(
      (p) => p.status === "cancelled",
    ).length;

    animateNumber("totalPrescriptions", total);
    animateNumber("activePrescriptions", active);
    animateNumber("expiredPrescriptions", expired);
    animateNumber("cancelledPrescriptions", cancelled);
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

    pageData.forEach((rx) => {
      const row = document.createElement("tr");
      row.dataset.id = rx.id;

      const statusClass = rx.status;
      const statusIcon =
        rx.status === "active"
          ? "fa-check"
          : rx.status === "expired"
            ? "fa-clock-rotate-left"
            : "fa-ban";

      // Medication preview
      const medCount = rx.medications.length;
      const firstMed = rx.medications[0].name;
      const medPreview =
        medCount > 1
          ? `${firstMed} <span class="med-count">+${medCount - 1} more</span>`
          : firstMed;

      row.innerHTML = `
        <td><strong>${rx.refNumber}</strong></td>
        <td>
          <div class="med-preview">
            <span class="med-name">${medPreview}</span>
          </div>
        </td>
        <td>${rx.doctor}</td>
        <td>${formatDate(rx.datePrescribed)}</td>
        <td>
          <span class="status-badge ${statusClass}">
            <i class="fa-solid ${statusIcon}"></i>
            ${rx.status}
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

    const statusClass = rx.status;
    const statusIcon =
      rx.status === "active"
        ? "fa-check-circle"
        : rx.status === "expired"
          ? "fa-clock-rotate-left"
          : "fa-ban";

    const medicationsHTML = rx.medications
      .map(
        (med) => `
      <div class="med-card">
        <div class="med-header">
          <span class="med-name">${med.name}</span>
          <span class="med-dosage">${med.dosage}</span>
        </div>
        <div class="med-details">
          <div class="med-detail-item">
            <span class="med-detail-label">Frequency</span>
            <span class="med-detail-value">${med.frequency}</span>
          </div>
          <div class="med-detail-item">
            <span class="med-detail-label">Instructions</span>
            <span class="med-detail-value">${med.instructions}</span>
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
            <span class="detail-value">${rx.refNumber}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value">
              <span class="status-badge ${statusClass}">
                <i class="fa-solid ${statusIcon}"></i> ${rx.status}
              </span>
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Prescribed Date</span>
            <span class="detail-value">${formatDate(rx.datePrescribed)}</span>
          </div>
        </div>

        <div class="detail-section">
          <h4>Healthcare Providers</h4>
          <div class="detail-row">
            <span class="detail-label">Prescribing Doctor</span>
            <span class="detail-value">${rx.doctor}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Dispensed By</span>
            <span class="detail-value">${rx.pharmacist}</span>
          </div>
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
      if (status && rx.status !== status) match = false;
      if (dateFrom && rx.datePrescribed < dateFrom) match = false;
      if (dateTo && rx.datePrescribed > dateTo) match = false;
      return match;
    });

    currentPage = 1;
    renderTable();
    updateStats();
    filtersSection.hidden = true;
  }

  function clearFilters() {
    document.getElementById("statusFilter").value = "";
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";

    filteredData = [...prescriptions];
    currentPage = 1;
    renderTable();
    updateStats();
  }

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    filteredData = prescriptions.filter(
      (rx) =>
        rx.refNumber.toLowerCase().includes(term) ||
        rx.doctor.toLowerCase().includes(term) ||
        rx.medications.some((m) => m.name.toLowerCase().includes(term)),
    );

    currentPage = 1;
    renderTable();
  });

  // ===== DOWNLOAD & VIEW =====
  window.downloadPrescription = function (id) {
    const rx = prescriptions.find((r) => r.id === id);
    showToast(`Downloading ${rx.refNumber}...`, "success");
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
