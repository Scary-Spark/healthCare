/**
 * PAYMENT & ACCOUNT BALANCE - FIXED HOVER/PANEL
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== MOCK DATA =====
  const transactions = [
    {
      id: 1,
      reference: "TXN-2024-001",
      type: "recharge",
      service: "Wallet Top-Up via bKash",
      date: "2024-10-20",
      amount: 5000,
      direction: "credit",
      status: "completed",
      method: "Mobile Banking",
    },
    {
      id: 2,
      reference: "TXN-2024-002",
      type: "consultation",
      service: "Dr. Sarah Jenkins - Cardiology",
      date: "2024-10-18",
      amount: 3500,
      direction: "debit",
      status: "completed",
      method: "Wallet Balance",
    },
    {
      id: 3,
      reference: "TXN-2024-003",
      type: "lab",
      service: "Complete Blood Count & Lipid Panel",
      date: "2024-10-15",
      amount: 4500,
      direction: "debit",
      status: "pending",
      method: "Unpaid",
    },
    {
      id: 4,
      reference: "TXN-2024-004",
      type: "pharmacy",
      service: "Amoxicillin 500mg (30 tabs)",
      date: "2024-10-12",
      amount: 1200,
      direction: "debit",
      status: "overdue",
      method: "Unpaid",
    },
    {
      id: 5,
      reference: "TXN-2024-005",
      type: "refund",
      service: "Cancelled MRI Scan Refund",
      date: "2024-10-10",
      amount: 18000,
      direction: "credit",
      status: "completed",
      method: "Bank Transfer",
    },
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 6,
      reference: `TXN-2024-${String(i + 6).padStart(3, "0")}`,
      type: ["consultation", "lab", "pharmacy", "recharge"][i % 4],
      service: [
        "Doctor Consultation",
        "Lab Test",
        "Pharmacy Purchase",
        "Wallet Top-Up",
      ][i % 4],
      date: `2024-10-${String(15 + i).padStart(2, "0")}`,
      amount: [3500, 4500, 1200, 2000][i % 4],
      direction: ["debit", "debit", "debit", "credit"][i % 4],
      status: ["pending", "overdue", "completed", "completed"][i % 4],
      method: "Unpaid",
    })),
  ];

  // ===== STATE =====
  let currentPage = 1;
  let itemsPerPage = 25;
  let filteredData = [...transactions];
  let selectedTransaction = null;
  let currentBalance = 12450;

  // ===== DOM ELEMENTS =====
  const tableBody = document.getElementById("tableBody");
  const searchInput = document.getElementById("searchInput");
  const filterBtn = document.getElementById("filterBtn");
  const filtersSection = document.getElementById("filtersSection");
  const applyFilterBtn = document.getElementById("applyFilter");
  const clearFilterBtn = document.getElementById("clearFilter");
  const itemsPerPageSelect = document.getElementById("itemsPerPage");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const detailsPanel = document.getElementById("detailsPanel");
  const panelContent = document.getElementById("panelContent");
  const panelClose = document.getElementById("panelClose");
  const downloadPanel = document.getElementById("downloadPanel");
  const viewPanel = document.getElementById("viewPanel");

  // ===== INITIALIZE =====
  function init() {
    updateStats();
    renderTable();
    setupButtons();
  }

  function setupButtons() {
    // Coming Soon Buttons
    const comingSoonBtns = [
      { id: "addBalanceBtn", msg: "Add Balance" },
      { id: "downloadStatementBtn", msg: "Download Statement" },
    ];

    comingSoonBtns.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el)
        el.addEventListener("click", () =>
          showToast(`"${item.msg}" feature is coming soon!`, "info"),
        );
    });

    // Wallet Action Buttons
    document.querySelectorAll(".btn-action").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const featureName =
          btn.querySelector("span")?.textContent || "This action";
        showToast(`"${featureName}" feature is coming soon!`, "info");
      });
    });

    // Filters
    applyFilterBtn.addEventListener("click", applyFilters);
    clearFilterBtn.addEventListener("click", clearFilters);
    filterBtn.addEventListener(
      "click",
      () => (filtersSection.hidden = !filtersSection.hidden),
    );
    searchInput.addEventListener("input", handleSearch);

    // Pagination
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

    // Panel Actions
    panelClose.addEventListener("click", () =>
      detailsPanel.classList.remove("open"),
    );
    downloadPanel.addEventListener("click", () =>
      showToast("Downloading receipt...", "success"),
    );
    viewPanel.addEventListener("click", () => {
      if (selectedTransaction) handlePay(selectedTransaction);
    });
  }

  // ===== STATS =====
  function updateStats() {
    const totalSpent = transactions
      .filter((t) => t.direction === "debit" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);
    const pending = transactions
      .filter((t) => t.status !== "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    document.getElementById("currentBalance").textContent =
      formatCurrency(currentBalance);
    document.getElementById("totalSpent").textContent =
      formatCurrency(totalSpent);
    document.getElementById("pendingAmount").textContent =
      formatCurrency(pending);
    document.getElementById("lastTransaction").textContent = formatDate(
      transactions[0]?.date || "--",
    );
    document.getElementById("walletAmount").textContent = formatCurrency(
      currentBalance,
    ).replace("৳", "");
  }

  // ===== RENDER TABLE =====
  function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const pageData = filteredData.slice(start, start + itemsPerPage);
    tableBody.innerHTML = "";

    pageData.forEach((txn) => {
      const row = document.createElement("tr");
      row.dataset.id = txn.id;

      const isPayable = txn.status !== "completed";

      let mainActionBtn = "";
      if (isPayable) {
        mainActionBtn = `<button class="btn-pay" onclick="handlePayById(${txn.id})">
                           <i class="fa-solid fa-credit-card"></i> Pay Now
                         </button>`;
      } else {
        mainActionBtn = `<button class="btn-paid" disabled>
                           <i class="fa-solid fa-check-circle"></i> Paid
                         </button>`;
      }

      row.innerHTML = `
        <td><strong>${txn.reference}</strong></td>
        <td><span class="type-badge ${txn.type}">${capitalize(txn.type)}</span></td>
        <td>${txn.service}</td>
        <td>${formatDate(txn.date)}</td>
        <td class="amount-cell ${txn.direction}">${txn.direction === "credit" ? "+" : "-"}${formatCurrency(txn.amount)}</td>
        <td><span class="status-badge ${txn.status}">${capitalize(txn.status)}</span></td>
        <td>
          <div class="table-actions">
             ${isPayable ? `<button class="btn-icon" title="View Details" onclick="viewTransaction(${txn.id})"><i class="fa-solid fa-eye"></i></button>` : ""}
             <button class="btn-icon" title="Receipt" onclick="showToast('Downloading receipt...', 'success')"><i class="fa-solid fa-download"></i></button>
          </div>
          <div class="table-action-main">${mainActionBtn}</div>
        </td>
      `;

      // HOVER EVENT - Update panel content
      row.addEventListener("mouseenter", () => {
        showTransactionDetails(txn);
        highlightRow(row);
        // Only open panel on mobile (where it's hidden by default)
        if (window.innerWidth <= 1024) {
          detailsPanel.classList.add("open");
        }
      });

      // CLICK EVENT - For mobile compatibility
      row.addEventListener("click", () => {
        showTransactionDetails(txn);
        highlightRow(row);
        detailsPanel.classList.add("open");
      });

      tableBody.appendChild(row);
    });

    document.getElementById("showingCount").textContent = pageData.length;
    document.getElementById("totalCount").textContent = filteredData.length;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled =
      currentPage >= Math.ceil(filteredData.length / itemsPerPage);
  }

  function highlightRow(activeRow) {
    document.querySelectorAll(".records-table tbody tr").forEach((row) => {
      row.classList.remove("active");
    });
    activeRow.classList.add("active");
  }

  // ===== ACTIONS =====
  window.handlePayById = function (id) {
    const txn = transactions.find((t) => t.id === id);
    handlePay(txn);
  };

  window.viewTransaction = function (id) {
    const txn = transactions.find((t) => t.id === id);
    showTransactionDetails(txn);
    detailsPanel.classList.add("open");
  };

  function handlePay(txn) {
    if (!txn) return;

    if (txn.status === "completed") {
      showToast("Already Paid!", "warning");
      return;
    }

    if (currentBalance < txn.amount) {
      showToast("Insufficient Account Balance!", "error");
      return;
    }

    if (confirm(`Pay ${formatCurrency(txn.amount)} using Account Balance?`)) {
      txn.status = "completed";
      txn.method = "Wallet Balance";
      currentBalance -= txn.amount;

      updateStats();
      renderTable();
      if (selectedTransaction && selectedTransaction.id === txn.id) {
        showTransactionDetails(txn);
      }
      showToast("Payment Successful!", "success");
    }
  }

  function showTransactionDetails(txn) {
    selectedTransaction = txn;
    const isPayable = txn.status !== "completed";

    // Update Panel Button
    if (isPayable) {
      viewPanel.innerHTML = `<i class="fa-solid fa-credit-card"></i> Pay Now`;
      viewPanel.className = "btn-view-panel";
      viewPanel.disabled = false;
    } else {
      viewPanel.innerHTML = `<i class="fa-solid fa-check"></i> Already Paid`;
      viewPanel.className = "btn-view-panel btn-paid-style";
      viewPanel.disabled = true;
    }

    panelContent.innerHTML = `
      <div class="transaction-detail">
        <div class="detail-section">
          <h4>Transaction Details</h4>
          <div class="detail-row"><span class="detail-label">Reference</span><span class="detail-value">${txn.reference}</span></div>
          <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">${txn.service}</span></div>
          <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${formatDate(txn.date)}</span></div>
          <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="status-badge ${txn.status}">${capitalize(txn.status)}</span></span></div>
        </div>
        <div class="detail-section">
          <h4>Payment Info</h4>
          <div class="detail-row"><span class="detail-label">Method</span><span class="detail-value">${txn.method}</span></div>
          <div class="detail-row"><span class="detail-label">Amount</span><span class="detail-value amount-cell ${txn.direction}" style="font-size:1.2rem">
            ${txn.direction === "credit" ? "+" : "-"}${formatCurrency(txn.amount)}
          </span></div>
        </div>
      </div>
    `;
  }

  // ===== FILTER & SEARCH =====
  function applyFilters() {
    const type = document.getElementById("typeFilter").value;
    const status = document.getElementById("statusFilter").value;
    const from = document.getElementById("dateFrom").value;
    const to = document.getElementById("dateTo").value;

    filteredData = transactions.filter((t) => {
      return (
        (!type || t.type === type) &&
        (!status || t.status === status) &&
        (!from || t.date >= from) &&
        (!to || t.date <= to)
      );
    });
    currentPage = 1;
    renderTable();
    filtersSection.hidden = true;
  }

  function clearFilters() {
    document.getElementById("typeFilter").value = "";
    document.getElementById("statusFilter").value = "";
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";
    filteredData = [...transactions];
    currentPage = 1;
    renderTable();
  }

  function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    filteredData = transactions.filter(
      (t) =>
        t.reference.toLowerCase().includes(term) ||
        t.service.toLowerCase().includes(term),
    );
    currentPage = 1;
    renderTable();
  }

  // ===== UTILS & TOAST =====
  window.showComingSoon = function (feature) {
    showToast(`"${feature}" feature is coming soon!`, "info");
  };

  function showToast(message, type = "success") {
    const existing = document.getElementById("paymentToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "paymentToast";
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

  function formatCurrency(amt) {
    return `৳${Math.abs(amt).toLocaleString("en-BD", { minimumFractionDigits: 2 })}`;
  }
  function formatDate(str) {
    return new Date(str).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Start
  init();
});
