/**
 * OTHER SETTINGS - ALL COMING SOON
 * No functional features - all show "Coming Soon" toast
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== DISABLE ALL INTERACTIVE ELEMENTS =====
  // Block clicks on all inputs, selects, and buttons
  document.querySelectorAll("input, select, button").forEach((el) => {
    // Skip the close buttons and layout elements
    if (el.closest(".coming-soon-overlay") || el.disabled) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        showComingSoon("This feature");
      });
    }
  });

  // Specifically handle theme radio buttons (they're disabled but just in case)
  document.querySelectorAll('input[name="theme"]').forEach((radio) => {
    radio.addEventListener("change", function (e) {
      e.preventDefault();
      showComingSoon("Theme customization");
      // Reset to prevent any change
      this.checked = false;
    });
  });

  // Global Coming Soon function
  window.showComingSoon = function (feature) {
    showToast(`"${feature}" feature is coming soon!`, "info");
  };

  // ===== TOAST NOTIFICATION =====
  function showToast(message, type = "info") {
    const existing = document.getElementById("settingsToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "settingsToast";
    toast.innerHTML = `
      <div class="toast-icon"><i class="fa-solid fa-${type === "success" ? "circle-check" : type === "info" ? "info-circle" : "triangle-exclamation"}"></i></div>
      <div class="toast-content">${message}</div>
    `;

    toast.style.cssText = `
      position:fixed;bottom:24px;right:24px;background:#ffffff;color:#1a2e2b;
      padding:14px 20px;border-radius:var(--radius-md);box-shadow:0 8px 24px rgba(0,0,0,0.15);
      border-left:4px solid ${type === "success" ? "#0c6e5f" : type === "info" ? "#d4a853" : "#d94f4f"};
      display:flex;align-items:center;gap:12px;z-index:3000;max-width:360px;
      animation:slideInRight 0.2s ease,fadeOut 0.2s ease 2s forwards;
      border: 2px solid #d6e0de;
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
});
