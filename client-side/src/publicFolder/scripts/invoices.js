/**
 * INVOICES & BILLING PAGE
 * Fast animations • Mobile responsive • Financial tracking
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== MOCK DATA - Invoices =====
  const invoices = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      date: "2024-10-18",
      service: "Cardiology Consultation & ECG",
      amount: 12500,
      status: "paid",
      dueDate: "2024-10-25",
      paymentMethod: "Credit Card",
      paidDate: "2024-10-20",
      breakdown: { consultation: 3500, ecg: 2500, labTests: 4500, tax: 2000 },
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      date: "2024-09-22",
      service: "Pediatric Follow-up & Vaccination",
      amount: 4200,
      status: "paid",
      dueDate: "2024-09-29",
      paymentMethod: "Bank Transfer",
      paidDate: "2024-09-25",
      breakdown: { consultation: 2000, vaccines: 1500, tax: 700 },
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      date: "2024-08-12",
      service: "Emergency Room & X-Ray",
      amount: 18750,
      status: "overdue",
      dueDate: "2024-08-19",
      paymentMethod: null,
      paidDate: null,
      breakdown: { erFee: 8500, xray: 4250, medication: 3500, tax: 2500 },
    },
    {
      id: 4,
      invoiceNumber: "INV-2024-004",
      date: "2024-10-22",
      service: "Neurology MRI Scan",
      amount: 24500,
      status: "pending",
      dueDate: "2024-10-29",
      paymentMethod: null,
      paidDate: null,
      breakdown: { mri: 18000, consultation: 4500, tax: 2000 },
    },
    {
      id: 5,
      invoiceNumber: "INV-2024-005",
      date: "2024-07-15",
      service: "Annual Health Checkup",
      amount: 8900,
      status: "paid",
      dueDate: "2024-07-22",
      paymentMethod: "Cash",
      paidDate: "2024-07-15",
      breakdown: { checkup: 6500, bloodwork: 1400, tax: 1000 },
    },
    // Add more mock data
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 6,
      invoiceNumber: `INV-2024-${String(i + 6).padStart(3, "0")}`,
      date: `2024-10-${String(15 + i).padStart(2, "0")}`,
      service: [
        "Physiotherapy Session",
        "Dental Cleaning",
        "Ophthalmology Check",
        "Dermatology Consult",
        "General Checkup",
      ][i % 5],
      amount: Math.floor(Math.random() * 15000) + 2000,
      status: ["paid", "pending", "overdue", "paid", "pending"][i % 5],
      dueDate: `2024-10-${String(22 + i).padStart(2, "0")}`,
      paymentMethod: ["Credit Card", "Bank Transfer", "Cash", null, "UPI"][
        i % 5
      ],
      paidDate:
        i % 5 === 0 || i % 5 === 3
          ? `2024-10-${String(20 + i).padStart(2, "0")}`
          : null,
      breakdown: {
        service: Math.floor(Math.random() * 10000),
        tax: Math.floor(Math.random() * 2000),
      },
    })),
  ];

  // ===== STATE =====
  let currentPage = 1;
  let itemsPerPage = 25;
  let filteredData = [...invoices];
  let selectedInvoice = null;

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
    const total = invoices.length;
    const paid = invoices.filter((i) => i.status === "paid").length;
    const pending = invoices.filter((i) => i.status === "pending").length;
    const overdue = invoices.filter((i) => i.status === "overdue").length;

    animateNumber("totalInvoices", total);
    animateNumber("paidInvoices", paid);
    animateNumber("pendingInvoices", pending);
    animateNumber("overdueInvoices", overdue);
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

  // Format currency
  function formatCurrency(amount) {
    return `৳${amount.toLocaleString("en-BD")}`;
  }

  // ===== RENDER TABLE =====
  function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);

    tableBody.innerHTML = "";

    pageData.forEach((inv) => {
      const row = document.createElement("tr");
      row.dataset.id = inv.id;

      const statusClass = inv.status;
      const statusIcon =
        inv.status === "paid"
          ? "fa-check"
          : inv.status === "pending"
            ? "fa-hourglass-half"
            : "fa-circle-exclamation";

      row.innerHTML = `
        <td><strong>${inv.invoiceNumber}</strong></td>
        <td>${formatDate(inv.date)}</td>
        <td>${inv.service}</td>
        <td class="amount-cell">${formatCurrency(inv.amount)}</td>
        <td>
          <span class="status-badge ${statusClass}">
            <i class="fa-solid ${statusIcon}"></i>
            ${inv.status}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" title="Download" onclick="downloadInvoice(${inv.id})">
              <i class="fa-solid fa-download"></i>
            </button>
            <button class="btn-icon" title="View" onclick="viewInvoice(${inv.id})">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </td>
      `;

      row.addEventListener("mouseenter", () => {
        showInvoiceDetails(inv);
        highlightRow(row);
      });

      row.addEventListener("click", () => {
        showInvoiceDetails(inv);
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

  // ===== SHOW INVOICE DETAILS =====
  function showInvoiceDetails(inv) {
    selectedInvoice = inv;

    const statusClass = inv.status;
    const statusIcon =
      inv.status === "paid"
        ? "fa-check-circle"
        : inv.status === "pending"
          ? "fa-hourglass-half"
          : "fa-circle-exclamation";

    // Build breakdown HTML
    let breakdownHTML = "";
    for (const [key, value] of Object.entries(inv.breakdown)) {
      breakdownHTML += `
        <div class="breakdown-row">
          <span class="detail-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
          <span class="detail-value">${formatCurrency(value)}</span>
        </div>
      `;
    }

    panelContent.innerHTML = `
      <div class="invoice-detail">
        <div class="detail-section">
          <h4>Invoice Information</h4>
          <div class="detail-row">
            <span class="detail-label">Invoice #</span>
            <span class="detail-value">${inv.invoiceNumber}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value">
              <span class="status-badge ${statusClass}">
                <i class="fa-solid ${statusIcon}"></i> ${inv.status}
              </span>
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Invoice Date</span>
            <span class="detail-value">${formatDate(inv.date)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Due Date</span>
            <span class="detail-value">${formatDate(inv.dueDate)}</span>
          </div>
        </div>

        <div class="detail-section">
          <h4>Service Details</h4>
          <div class="detail-row">
            <span class="detail-label">Service</span>
            <span class="detail-value">${inv.service}</span>
          </div>
          ${
            inv.paymentMethod
              ? `
            <div class="detail-row">
              <span class="detail-label">Payment Method</span>
              <span class="detail-value">${inv.paymentMethod}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Paid Date</span>
              <span class="detail-value">${formatDate(inv.paidDate)}</span>
            </div>
          `
              : `
            <div class="detail-row">
              <span class="detail-label">Payment Status</span>
              <span class="detail-value" style="color:var(--accent-red)">Awaiting Payment</span>
            </div>
          `
          }
        </div>

        <div class="detail-section">
          <h4>Billing Breakdown</h4>
          <div class="billing-breakdown">
            ${breakdownHTML}
            <div class="breakdown-row total">
              <span>Total Amount</span>
              <span>${formatCurrency(inv.amount)}</span>
            </div>
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

    filteredData = invoices.filter((inv) => {
      let match = true;
      if (status && inv.status !== status) match = false;
      if (dateFrom && inv.date < dateFrom) match = false;
      if (dateTo && inv.date > dateTo) match = false;
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

    filteredData = [...invoices];
    currentPage = 1;
    renderTable();
    updateStats();
  }

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    filteredData = invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(term) ||
        inv.service.toLowerCase().includes(term) ||
        inv.status.toLowerCase().includes(term) ||
        inv.amount.toString().includes(term),
    );

    currentPage = 1;
    renderTable();
  });

  // ===== DOWNLOAD & VIEW =====
  window.downloadInvoice = function (id) {
    const inv = invoices.find((i) => i.id === id);
    showToast(`Downloading ${inv.invoiceNumber}...`, "success");
  };

  window.viewInvoice = function (id) {
    const inv = invoices.find((i) => i.id === id);
    showInvoiceDetails(inv);
    openPanel();
  };

  // Panel Buttons - Feature Coming Soon
  downloadPanel.addEventListener("click", () => {
    if (selectedInvoice) {
      showToast("Feature is coming soon!", "info");
    }
  });

  viewPanel.addEventListener("click", () => {
    if (selectedInvoice) {
      showToast("Feature is coming soon!", "info");
    }
  });

  // Download All Button
  downloadAllBtn.addEventListener("click", () => {
    showToast("Feature is coming soon!", "info");
  });

  // ===== UTILITIES =====
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
