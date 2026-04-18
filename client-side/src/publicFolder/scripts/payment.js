document.addEventListener("DOMContentLoaded", function () {
  // colors for status
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
    overdue: {
      label: "Overdue",
      class: "overdue",
      icon: "fa-triangle-exclamation",
      bg: "#fee2e2",
      color: "#991b1b",
      border: "#ef4444",
    },
  };

  let currentPage = 1;
  let itemsPerPage = 25;
  let payments = [];
  let filteredData = [];
  let selectedPayment = null;
  let currentBalance = 0;

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

  function getServiceLabel(type) {
    const labels = {
      consultation: "Consultation",
      lab: "Lab Test",
      pharmacy: "Pharmacy",
      recharge: "Recharge",
      refund: "Refund",
      other: "Other",
    };
    return labels[type] || safeCapitalize(type);
  }

  function getMethodLabel(method) {
    if (!method) return "N/A";

    const labels = {
      BKASH: "bKash",
      NAGAD: "Nagad",
      BANK_TRANSFER: "Bank Transfer",
      CARD: "Card",
      CASH: "Cash",
      SERVICE_CENTER: "Service Center",
    };

    const key = method.toUpperCase().replace(/\s+/g, "_");
    return labels[key] || safeCapitalize(method.replace(/_/g, " "));
  }

  function showPaymentConfirmation(paymentId, amount, onConfirm, onCancel) {
    // Create modal overlay
    const modal = document.createElement("div");
    modal.id = "paymentConfirmModal";
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    `;

    const amountFormatted = formatCurrency(amount).replace("৳", "");

    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 16px;
        max-width: 420px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
        overflow: hidden;
      ">
        <!-- Header -->
        <div style="
          background: linear-gradient(135deg, #0d7377 0%, #14919b 100%);
          padding: 20px 24px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div style="font-weight: 600; font-size: 1.1rem;">Confirm Payment</div>
          <button id="modalCloseBtn" style="
            background: rgba(255,255,255,0.2);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            color: white;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          ">✕</button>
        </div>
        
        <!-- Content -->
        <div style="padding: 24px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">💳</div>
            <div style="font-size: 1.3rem; font-weight: 600; color: var(--text-dark);">
              Pay ৳${amountFormatted}
            </div>
            <div style="color: var(--text-light); font-size: 0.9rem; margin-top: 4px;">
              Using your account balance
            </div>
          </div>
          
          <div style="
            background: var(--bg);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
            border-left: 4px solid var(--primary);
          ">
            <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 4px;">Current Balance</div>
            <div style="font-size: 1.2rem; font-weight: 700; color: var(--text-dark);">
              ৳${formatCurrency(currentBalance).replace("৳", "")}
            </div>
          </div>
          
          <div style="
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 20px;
            font-size: 0.9rem;
            color: #856404;
          ">
            <i class="fa-solid fa-circle-info" style="margin-right: 6px;"></i>
            This action cannot be undone. The amount will be deducted from your account balance immediately.
          </div>
          
          <!-- Buttons -->
          <div style="display: flex; gap: 12px;">
            <button id="modalCancelBtn" style="
              flex: 1;
              padding: 12px;
              border: 1px solid var(--border);
              background: white;
              color: var(--text-dark);
              border-radius: 8px;
              font-weight: 600;
              font-size: 0.95rem;
              cursor: pointer;
              transition: all 0.15s ease;
            ">Cancel</button>
            <button id="modalConfirmBtn" style="
              flex: 1;
              padding: 12px;
              border: none;
              background: var(--primary);
              color: white;
              border-radius: 8px;
              font-weight: 600;
              font-size: 0.95rem;
              cursor: pointer;
              transition: all 0.15s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
            ">
              <i class="fa-solid fa-check"></i> Pay Now
            </button>
          </div>
        </div>
      </div>
    `;

    // Add CSS animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(20px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(modal);

    // Close function
    const closeModal = () => {
      modal.style.animation = "fadeIn 0.2s ease reverse";
      setTimeout(() => {
        modal.remove();
        style.remove();
        if (onCancel) onCancel();
      }, 200);
    };

    // Event listeners
    document.getElementById("modalCloseBtn").onclick = closeModal;
    document.getElementById("modalCancelBtn").onclick = closeModal;

    document.getElementById("modalConfirmBtn").onclick = () => {
      // Show loading state on confirm button
      const confirmBtn = document.getElementById("modalConfirmBtn");
      confirmBtn.disabled = true;
      confirmBtn.innerHTML =
        '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';

      if (onConfirm) onConfirm();
    };

    // Close on overlay click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on ESC key
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", handleEsc);
      }
    };
    document.addEventListener("keydown", handleEsc);
  }

  async function loadPayments() {
    try {
      if (!tableBody) {
        return;
      }

      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;"><i class="fa-solid fa-spinner fa-spin" style="font-size:2rem;color:var(--primary);"></i><p style="margin-top:12px;color:var(--text-light);">Loading your payment history...</p></td></tr>`;

      const response = await fetch("/api/payments");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Use "payments" key that API returns
        payments = result.payments || result.data || [];
        filteredData = [...payments];

        // Get actual balance from API (first payment has balance field)
        if (
          payments.length > 0 &&
          payments[0].balance !== undefined &&
          payments[0].balance !== null
        ) {
          currentBalance = Number(payments[0].balance);
        } else {
          // Fallback: calculate balance if not provided
          calculateBalance();
        }

        if (payments.length === 0) {
          console.warn("API returned success but data array is empty!");
        }

        // Populate filter dropdowns dynamically
        populateTypeFilter();
        populateStatusFilter();

        // Update UI
        updateStats();
        renderTable();
      } else {
        console.error("API returned error:", result.message);
        if (tableBody) {
          tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-light);">
            <i class="fa-solid fa-circle-exclamation" style="font-size:2rem;margin-bottom:12px;"></i>
            <p>${result.message || "Failed to load payment history"}</p>
          </td></tr>`;
        }
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      console.error("Error stack:", error.stack);

      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-light);">
          <i class="fa-solid fa-circle-exclamation" style="font-size:2rem;margin-bottom:12px;"></i>
          <p>Error loading data. Please try again.</p>
          <p style="font-size:0.85rem;margin-top:8px;opacity:0.7;">${error.message}</p>
        </td></tr>`;
      }
    }
  }

  // calculate balance
  function calculateBalance() {
    const credits = payments
      .filter((p) => p.direction === "credit" && p.status === "completed")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const debits = payments
      .filter((p) => p.direction === "debit" && p.status === "completed")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    currentBalance = credits - debits;
  }

  // filter function
  function populateTypeFilter() {
    const select = document.getElementById("typeFilter");
    if (!select) return;

    const types = [...new Set(payments.map((p) => p.type).filter(Boolean))];

    select.innerHTML = '<option value="">All Services</option>';

    const typeLabels = {
      consultation: "Consultation",
      lab: "Lab Test",
      pharmacy: "Pharmacy",
      recharge: "Recharge",
      refund: "Refund",
      other: "Other",
    };

    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = typeLabels[type] || getServiceLabel(type);
      select.appendChild(option);
    });
  }

  function populateStatusFilter() {
    const select = document.getElementById("statusFilter");
    if (!select) return;

    const statuses = [
      ...new Set(payments.map((p) => p.status).filter(Boolean)),
    ];

    select.innerHTML = '<option value="">All Status</option>';

    statuses.forEach((status) => {
      const option = document.createElement("option");
      option.value = status.toLowerCase();
      const config = STATUS_CONFIG[status.toLowerCase()];
      option.textContent = config?.label || safeCapitalize(status);
      select.appendChild(option);
    });
  }

  function getStatusConfig(status) {
    const statusKey = status
      ? status.toLowerCase().replace(/\s+/g, "-")
      : "pending";
    return STATUS_CONFIG[statusKey] || STATUS_CONFIG["pending"];
  }

  function updateStats() {
    const data = filteredData;

    const totalSpent = data
      .filter((p) => p.direction === "debit" && p.status === "completed")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const pending = data
      .filter((p) => p.status !== "completed")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const lastTxn = data[0]?.date;

    const currentBalanceEl = document.getElementById("currentBalance");
    const totalSpentEl = document.getElementById("totalSpent");
    const pendingAmountEl = document.getElementById("pendingAmount");
    const lastTransactionEl = document.getElementById("lastTransaction");
    const walletAmountEl = document.getElementById("walletAmount");

    if (currentBalanceEl)
      currentBalanceEl.textContent = formatCurrency(currentBalance);
    if (totalSpentEl) totalSpentEl.textContent = formatCurrency(totalSpent);
    if (pendingAmountEl) pendingAmountEl.textContent = formatCurrency(pending);
    if (lastTransactionEl)
      lastTransactionEl.textContent = lastTxn ? formatDate(lastTxn) : "--";
    if (walletAmountEl)
      walletAmountEl.textContent = formatCurrency(currentBalance).replace(
        "৳",
        "",
      );
  }

  function renderTable() {
    if (!tableBody) return;

    try {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageData = filteredData.slice(start, end);

      tableBody.innerHTML = "";

      if (pageData.length === 0) {
        if (payments.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="7" style="text-align:center;padding:60px 40px;">
                <div style="max-width:400px;margin:0 auto;">
                  <i class="fa-solid fa-wallet" style="font-size:4rem;color:var(--border);margin-bottom:20px;display:block;"></i>
                  <h3 style="color:var(--text-dark);margin:0 0 8px 0;font-size:1.3rem;">No Payment History Yet</h3>
                  <p style="color:var(--text-light);margin:0 0 20px 0;font-size:0.95rem;">
                    You don't have any payment transactions on record. When you make payments for appointments, 
                    lab tests, or pharmacy purchases, they will appear here.
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
          tableBody.innerHTML = `
            <tr>
              <td colspan="7" style="text-align:center;padding:60px 40px;">
                <div style="max-width:400px;margin:0 auto;">
                  <i class="fa-solid fa-search" style="font-size:3rem;color:var(--border);margin-bottom:20px;display:block;"></i>
                  <h3 style="color:var(--text-dark);margin:0 0 8px 0;font-size:1.3rem;">No Matching Transactions</h3>
                  <p style="color:var(--text-light);margin:0;font-size:0.95rem;">
                    No payment transactions match your current filters. Try adjusting your search or filters.
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

      pageData.forEach((payment) => {
        try {
          const row = document.createElement("tr");
          row.dataset.id = payment.id;

          const statusConfig = getStatusConfig(payment.status);
          const isPayable = payment.status !== "completed";

          let mainActionBtn = "";
          if (isPayable) {
            // ✅ Real Pay Now button with loading state
            mainActionBtn = `
              <button class="btn-pay" onclick="handlePayNow(${payment.id}, ${payment.amount})" id="payBtn-${payment.id}">
                <i class="fa-solid fa-credit-card"></i> Pay Now
              </button>
            `;
          } else {
            mainActionBtn = `
              <button class="btn-paid" disabled>
                <i class="fa-solid fa-check-circle"></i> Paid
              </button>
            `;
          }

          row.innerHTML = `
            <td><strong>${safeString(payment.reference)}</strong></td>
            <td>
              <span class="type-badge ${safeString(payment.type)}">
                ${getServiceLabel(payment.type)}
              </span>
            </td>
            <td>${getMethodLabel(payment.method)}</td>
            <td>${formatDate(payment.date)}</td>
            <td class="amount-cell ${safeString(payment.direction)}">
              ${payment.direction === "credit" ? "+" : "-"}${formatCurrency(payment.amount)}
            </td>
            <td>
              <span class="status-badge ${statusConfig.class}" style="background:${statusConfig.bg};color:${statusConfig.color};border:1px solid ${statusConfig.border}">
                <i class="fa-solid ${statusConfig.icon}"></i>
                ${statusConfig.label}
              </span>
            </td>
            <td>
              <div class="table-actions">
                 ${isPayable ? `<button class="btn-icon" title="View Details" onclick="viewPayment(${payment.id})"><i class="fa-solid fa-eye"></i></button>` : ""}
                 <button class="btn-icon" title="Receipt" onclick="showToast('Downloading receipt...', 'success')"><i class="fa-solid fa-download"></i></button>
              </div>
              <div class="table-action-main">${mainActionBtn}</div>
            </td>
          `;

          row.addEventListener("mouseenter", () => {
            showPaymentDetails(payment);
            highlightRow(row);
            if (window.innerWidth <= 1024 && detailsPanel) {
              detailsPanel.classList.add("open");
            }
          });

          row.addEventListener("click", () => {
            showPaymentDetails(payment);
            highlightRow(row);
            if (detailsPanel) detailsPanel.classList.add("open");
          });

          tableBody.appendChild(row);
        } catch (rowError) {
          console.error("Error rendering row:", rowError, payment);
        }
      });

      updateTableInfo();
      renderPagination();
    } catch (error) {
      console.error("Error in renderTable:", error);
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--accent-red);">Error rendering table. Please refresh.</td></tr>`;
      }
    }
  }

  function highlightRow(activeRow) {
    document.querySelectorAll(".records-table tbody tr").forEach((row) => {
      row.classList.remove("active");
    });
    if (activeRow) activeRow.classList.add("active");
  }

  function updateTableInfo() {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, filteredData.length);

    const showingCountEl = document.getElementById("showingCount");
    const totalCountEl = document.getElementById("totalCount");

    if (showingCountEl)
      showingCountEl.textContent = filteredData.length > 0 ? start : 0;
    if (totalCountEl) totalCountEl.textContent = filteredData.length;
  }

  window.handlePayNow = async function (paymentId, amount) {
    const payBtn = document.getElementById(`payBtn-${paymentId}`);

    if (!payBtn) {
      console.error("❌ Pay button not found for payment:", paymentId);
      return;
    }

    const amountNum = Number(amount);
    if (currentBalance < amountNum) {
      showToast(
        "Insufficient account balance. Please add funds to your wallet.",
        "error",
      );
      return;
    }

    showPaymentConfirmation(
      paymentId,
      amountNum,
      async () => {
        try {
          console.log(
            `Sending payment request: paymentId=${paymentId}, amount=${amountNum}`,
          );

          // Call API
          const response = await fetch("/api/payments/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: Number(paymentId),
              amount: amountNum,
            }),
          });

          console.log(`Response status: ${response.status}`);

          const result = await response.json();
          console.log(`Response body:`, result);

          // Check result.success === true (not just truthy)
          if (result.success === true) {
            // Payment succeeded
            showToast(
              "Payment successful! Your account has been charged.",
              "success",
            );

            // Refresh the page to show updated balance and status
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            const errorMsg =
              result.message || "Payment failed. Please try again.";
            showToast(`${errorMsg}`, "error");
          }
        } catch (error) {
          console.error("Payment error (catch block):", error);
          showToast(
            "Network error. Please check your connection and try again.",
            "error",
          );
        } finally {
          // Close modal after processing (whether success or error)
          const modal = document.getElementById("paymentConfirmModal");
          if (modal) {
            modal.style.animation = "fadeIn 0.2s ease reverse";
            setTimeout(() => {
              modal.remove();
              // Restore pay button if it still exists
              const btn = document.getElementById(`payBtn-${paymentId}`);
              if (btn) {
                btn.disabled = false;
                btn.innerHTML = `<i class="fa-solid fa-credit-card"></i> Pay Now`;
              }
            }, 200);
          }
        }
      },
      // On Cancel callback
      () => {
        // User cancelled - just close modal, no action needed
        console.log("Payment cancelled by user");
      },
    );
  };

  // page for table
  function renderPagination() {
    if (!paginationNumbers) return;

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

    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn)
      nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
  }

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });
  }

  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener("change", (e) => {
      itemsPerPage = parseInt(e.target.value);
      currentPage = 1;
      renderTable();
    });
  }

  function showPaymentDetails(payment) {
    if (!panelContent) return;

    try {
      selectedPayment = payment;

      const statusConfig = getStatusConfig(payment.status);
      const isPayable = payment.status !== "completed";

      // Update Panel Button
      if (viewPanel) {
        if (isPayable) {
          // Real Pay Now button in panel
          viewPanel.innerHTML = `<i class="fa-solid fa-credit-card"></i> Pay Now`;
          viewPanel.className = "btn-view-panel";
          viewPanel.disabled = false;
          viewPanel.onclick = () => handlePayNow(payment.id, payment.amount);
        } else {
          viewPanel.innerHTML = `<i class="fa-solid fa-check"></i> Already Paid`;
          viewPanel.className = "btn-view-panel btn-paid-style";
          viewPanel.disabled = true;
          viewPanel.onclick = null;
        }
      }

      panelContent.innerHTML = `
        <div class="payment-detail">
          <div class="detail-section">
            <h4>Transaction Details</h4>
            <div class="detail-row">
              <span class="detail-label">Reference #</span>
              <span class="detail-value">${safeString(payment.reference)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service</span>
              <span class="detail-value">${getServiceLabel(payment.type)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Method</span>
              <span class="detail-value">${getMethodLabel(payment.method)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">${formatDate(payment.date)}</span>
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
            <h4>Payment Information</h4>
            <div class="detail-row">
              <span class="detail-label">Amount</span>
              <span class="detail-value amount-cell ${safeString(payment.direction)}" style="font-size:1.2rem">
                ${payment.direction === "credit" ? "+" : "-"}${formatCurrency(payment.amount)}
              </span>
            </div>
            ${
              payment.transactionId
                ? `
              <div class="detail-row">
                <span class="detail-label">Transaction ID</span>
                <span class="detail-value">${safeString(payment.transactionId)}</span>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `;
    } catch (error) {
      console.error("Error showing payment details:", error);
      if (panelContent) {
        panelContent.innerHTML = `<p style="color:var(--accent-red);">Error loading details</p>`;
      }
    }
  }

  if (filterBtn && filtersSection) {
    filterBtn.addEventListener("click", () => {
      filtersSection.hidden = !filtersSection.hidden;
    });
  }

  if (applyFilterBtn) {
    applyFilterBtn.addEventListener("click", applyFilters);
  }

  if (clearFilterBtn) {
    clearFilterBtn.addEventListener("click", clearFilters);
  }

  function applyFilters() {
    const typeFilter = document.getElementById("typeFilter");
    const statusFilter = document.getElementById("statusFilter");
    const dateFromInput = document.getElementById("dateFrom");
    const dateToInput = document.getElementById("dateTo");

    if (!typeFilter || !statusFilter || !dateFromInput || !dateToInput) return;

    const type = typeFilter.value;
    const status = statusFilter.value;
    const dateFrom = dateFromInput.value;
    const dateTo = dateToInput.value;

    filteredData = payments.filter((payment) => {
      let match = true;

      if (type && payment.type !== type) match = false;
      if (status && payment.status?.toLowerCase() !== status.toLowerCase())
        match = false;

      if (
        dateFrom &&
        payment.date &&
        new Date(payment.date) < new Date(dateFrom)
      )
        match = false;
      if (dateTo && payment.date && new Date(payment.date) > new Date(dateTo))
        match = false;

      return match;
    });

    currentPage = 1;
    renderTable();
    updateStats();

    if (filtersSection) filtersSection.hidden = true;
  }

  function clearFilters() {
    const typeFilter = document.getElementById("typeFilter");
    const statusFilter = document.getElementById("statusFilter");
    const dateFromInput = document.getElementById("dateFrom");
    const dateToInput = document.getElementById("dateTo");

    if (typeFilter) typeFilter.value = "";
    if (statusFilter) statusFilter.value = "";
    if (dateFromInput) dateFromInput.value = "";
    if (dateToInput) dateToInput.value = "";

    filteredData = [...payments];
    currentPage = 1;
    renderTable();
    updateStats();
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();

      filteredData = payments.filter(
        (payment) =>
          (payment.reference || "").toLowerCase().includes(term) ||
          (payment.service || "").toLowerCase().includes(term),
      );

      currentPage = 1;
      renderTable();
      updateStats();
    });
  }

  window.downloadPayment = function (id) {
    const payment = payments.find((p) => p.id === id);
    showToast(
      `Downloading receipt for ${safeString(payment?.reference)}...`,
      "info",
    );
  };

  window.viewPayment = function (id) {
    const payment = payments.find((p) => p.id === id);
    showPaymentDetails(payment);
    if (detailsPanel) detailsPanel.classList.add("open");
  };

  // Panel Buttons - Feature Coming Soon
  if (downloadPanel) {
    downloadPanel.addEventListener("click", () => {
      if (selectedPayment) {
        showToast("Feature is coming soon!", "info");
      }
    });
  }

  if (viewPanel) {
    viewPanel.addEventListener("click", () => {
      if (selectedPayment) {
        showComingSoon("Pay Now");
      }
    });
  }

  // Coming Soon Helper
  window.showComingSoon = function (feature) {
    if (feature === "Pay Now") {
      showToast(
        "Please use the Pay Now button in the table or details panel.",
        "info",
      );
    } else {
      showToast(`"${feature}" feature is coming soon!`, "info");
    }
  };

  // ===== SAFE UTILITIES =====
  function safeCapitalize(s) {
    if (!s) return "";
    return String(s).charAt(0).toUpperCase() + String(s).slice(1).toLowerCase();
  }

  function safeString(val) {
    return val != null ? String(val) : "N/A";
  }

  function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatCurrency(amt) {
    const amount = typeof amt === "number" ? amt : 0;
    return `৳${Math.abs(amount).toLocaleString("en-BD", { minimumFractionDigits: 2 })}`;
  }

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

  // init
  loadPayments();
});
