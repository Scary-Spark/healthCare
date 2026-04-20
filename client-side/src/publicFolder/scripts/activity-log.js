/**
 * ACTIVITY LOG PAGE - DYNAMIC VERSION
 * Fetches real logs from database via API
 * Filtering, search, pagination, export
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== STATE =====
  let logs = [];
  let filteredLogs = [];
  let currentPage = 1;
  const itemsPerPage = 20;

  // ===== DOM ELEMENTS =====
  const logsTableBody = document.getElementById("logsTableBody");
  const logSearch = document.getElementById("logSearch");
  const actionFilter = document.getElementById("actionFilter");
  const dateFilter = document.getElementById("dateFilter");
  const applyFiltersBtn = document.getElementById("applyFilters");
  const exportLogsBtn = document.getElementById("exportLogs");
  const logPagination = document.getElementById("logPagination");
  const totalLogsEl = document.getElementById("totalLogs");
  const securityEventsEl = document.getElementById("securityEvents");
  const dataChangesEl = document.getElementById("dataChanges");

  // ===== LOAD LOGS FROM API =====
  async function loadLogs() {
    try {
      const params = new URLSearchParams();
      const action = actionFilter?.value || "";
      const days = dateFilter?.value || "30";

      if (action) params.append("action", action);
      if (days !== "all") params.append("days", days);

      const response = await fetch(`/api/logs?${params}`);
      const result = await response.json();

      if (result.success) {
        logs = result.data || [];
        filteredLogs = [...logs];
        updateStats();
        renderLogs();
        renderPagination();
      } else {
        showEmptyState("Failed to load activity logs");
      }
    } catch (error) {
      console.error("Error loading logs:", error);
      showEmptyState("Unable to load activity logs. Please try again.");
    }
  }

  // ===== UPDATE STATS =====
  function updateStats() {
    if (totalLogsEl) totalLogsEl.textContent = logs.length;

    // Count security events (login, logout, password_change)
    const securityActions = ["LOGIN", "LOGOUT", "PASSWORD_CHANGE"];
    const securityCount = logs.filter((log) =>
      securityActions.includes(log.action_type?.toUpperCase()),
    ).length;
    if (securityEventsEl) securityEventsEl.textContent = securityCount;

    // Count data changes (profile_update, data_export, etc.)
    const dataActions = [
      "CLIENT_UPDATED",
      "PERSON_UPDATED",
      "DATA_EXPORT",
      "RECORD_VIEW",
    ];
    const dataCount = logs.filter((log) =>
      dataActions.includes(log.action_type?.toUpperCase()),
    ).length;
    if (dataChangesEl) dataChangesEl.textContent = dataCount;
  }

  // ===== RENDER LOGS TABLE =====
  function renderLogs() {
    if (!logsTableBody) return;

    if (filteredLogs.length === 0) {
      showEmptyState("No activity logs found matching your filters");
      return;
    }

    // Pagination slice
    const start = (currentPage - 1) * itemsPerPage;
    const pageLogs = filteredLogs.slice(start, start + itemsPerPage);

    let html = "";

    pageLogs.forEach((log) => {
      const timestamp = formatDate(log.created_at);
      const actionType = log.action_type?.toUpperCase() || "UNKNOWN";
      const actionClass = actionType.toLowerCase().replace(/_/g, "-");
      const actionLabel = formatActionLabel(actionType);
      const target = log.table_name ? formatTableName(log.table_name) : "N/A";
      const description = log.description || "No description";
      const referenceId = log.reference_id || "-";

      html += `
    <tr>
      <td>${timestamp}</td>
      <td><span class="action-badge ${actionClass}">${actionLabel}</span></td>
      <td class="target-cell">${target}</td>
      <td class="description-cell" title="${escapeHtml(description)}">${escapeHtml(description)}</td>
      <td class="reference-cell">${referenceId}</td>
      <td>
        <button class="details-btn" onclick="showLogDetails(${log.log_id})">
          <i class="fa-solid fa-eye"></i> View
        </button>
      </td>
    </tr>
  `;
    });

    logsTableBody.innerHTML = html;
  }

  // ===== SHOW EMPTY STATE =====
  function showEmptyState(message) {
    if (logsTableBody) {
      logsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:60px 20px;">
            <div class="empty-state">
              <i class="fa-solid fa-clipboard-list"></i>
              <p>${message}</p>
            </div>
          </td>
        </tr>
      `;
    }
  }

  // ===== RENDER PAGINATION =====
  function renderPagination() {
    if (!logPagination) return;

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

    if (totalPages <= 1) {
      logPagination.innerHTML = "";
      return;
    }

    let html = `
      <div class="pagination-info">
        Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredLogs.length)} of ${filteredLogs.length} entries
      </div>
      <div class="pagination-buttons">
        <button id="prevPage" ${currentPage === 1 ? "disabled" : ""}>
          <i class="fa-solid fa-chevron-left"></i> Previous
        </button>
        <button id="nextPage" ${currentPage === totalPages ? "disabled" : ""}>
          Next <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    `;

    logPagination.innerHTML = html;

    // Add event listeners
    document.getElementById("prevPage")?.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderLogs();
        renderPagination();
      }
    });

    document.getElementById("nextPage")?.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderLogs();
        renderPagination();
      }
    });
  }

  // ===== FILTER LOGS =====
  function applyFilters() {
    const searchTerm = logSearch?.value.toLowerCase() || "";
    const actionType = actionFilter?.value || "";

    filteredLogs = logs.filter((log) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        log.description?.toLowerCase().includes(searchTerm) ||
        log.action_type?.toLowerCase().includes(searchTerm) ||
        log.table_name?.toLowerCase().includes(searchTerm);

      // Action type filter
      const matchesAction = !actionType || log.action_type === actionType;

      return matchesSearch && matchesAction;
    });

    currentPage = 1;
    renderLogs();
    renderPagination();
  }

  // ===== FORMAT HELPERS =====
  function formatActionLabel(action) {
    if (!action) return "Unknown";

    // Handle UPPERCASE_WITH_UNDERSCORES format
    return action
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  function formatTableName(table) {
    const names = {
      payments: "Payment",
      appointments: "Appointment",
      clients: "Client Account",
      persons: "Person Profile",
      lab_reports: "Lab Report",
      prescriptions: "Prescription",
    };
    return (
      names[table] ||
      table?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
      "N/A"
    );
  }

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ===== SHOW LOG DETAILS MODAL =====
  window.showLogDetails = function (logId) {
    const log = logs.find((l) => l.log_id === logId);
    if (!log) return;

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
          <h3>Activity Details</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body">
          <div style="display: grid; gap: 12px; font-size: 0.9rem;">
            <div><strong>Timestamp:</strong> ${formatDate(log.created_at)}</div>
            <div><strong>Action:</strong> ${formatActionLabel(log.action_type)}</div>
            <div><strong>Target:</strong> ${formatTableName(log.table_name)}</div>
            <div><strong>Description:</strong> ${escapeHtml(log.description || "N/A")}</div>
            <div><strong>Reference ID:</strong> ${log.reference_id || "N/A"}</div>
            <div><strong>Log ID:</strong> ${log.log_id}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()">
            Close
          </button>
        </div>
      </div>
    `;

    // Add modal styles if not present
    if (!document.querySelector("#modalStyles")) {
      const style = document.createElement("style");
      style.id = "modalStyles";
      style.textContent = `
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .modal-content {
          background: var(--card-bg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          max-width: 500px;
          width: 100%;
          animation: modalSlide 0.2s ease;
        }
        .modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h3 {
          margin: 0;
          font-size: 1.1rem;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: var(--text-light);
        }
        .modal-body {
          padding: 20px;
        }
        .modal-footer {
          padding: 16px 20px;
          border-top: 1px solid var(--border);
          text-align: right;
        }
        @keyframes modalSlide {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(modal);
  };

  // ===== EXPORT LOGS =====
  function exportLogs() {
    const data = filteredLogs.map((log) => ({
      Timestamp: log.created_at,
      Action: formatActionLabel(log.action_type),
      Target: formatTableName(log.table_name),
      Description: log.description,
      ReferenceID: log.reference_id,
      LogID: log.log_id,
    }));

    const csv = [
      Object.keys(data[0] || {}).join(","),
      ...data.map((row) =>
        Object.values(row)
          .map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showToast("Logs exported successfully!", "success");
  }

  // ===== TOAST NOTIFICATION =====
  function showToast(message, type = "success") {
    const existing = document.getElementById("logToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "logToast";
    toast.innerHTML = `
      <div class="toast-icon"><i class="fa-solid fa-${type === "success" ? "circle-check" : "circle-exclamation"}"></i></div>
      <div class="toast-content">${message}</div>
    `;

    toast.style.cssText = `
      position:fixed;bottom:24px;right:24px;background:var(--card-bg);color:var(--text-dark);
      padding:14px 20px;border-radius:var(--radius-md);box-shadow:var(--shadow-lg);
      border-left:4px solid ${type === "success" ? "var(--primary)" : "var(--accent-red)"};
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

  // ===== SETUP EVENT LISTENERS =====
  function setupEvents() {
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener("click", applyFilters);
    }

    if (exportLogsBtn) {
      exportLogsBtn.addEventListener("click", exportLogs);
    }

    // Real-time search
    if (logSearch) {
      logSearch.addEventListener("input", () => {
        currentPage = 1;
        applyFilters();
      });
    }
  }

  // ===== INITIALIZE =====
  setupEvents();
  loadLogs();
});
