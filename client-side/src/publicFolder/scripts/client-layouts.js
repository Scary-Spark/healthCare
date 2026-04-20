document.addEventListener("DOMContentLoaded", function () {
  // ===== SET CURRENT YEAR IN FOOTER =====
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== EMERGENCY BUTTON - COMING SOON =====
  const emergencyBtn = document.querySelector(".btn-emergency");
  if (emergencyBtn) {
    emergencyBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showToast("Emergency assistance feature is coming soon!", "info");
    });
  }

  // ===== NOTIFICATION BELL - COMING SOON =====
  const notificationToggle = document.getElementById("notificationToggle");
  const notificationDropdown = document.getElementById("notificationDropdown");

  if (notificationToggle) {
    notificationToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      showToast("Notifications feature is coming soon!", "info");

      // Close dropdown if somehow opened
      if (notificationDropdown) {
        notificationDropdown.hidden = true;
        notificationToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Also prevent dropdown from opening via any other means
  if (notificationDropdown) {
    notificationDropdown.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  // ===== PROFILE DROPDOWN =====
  const profileToggle = document.getElementById("profileToggle");
  const profileDropdown = document.getElementById("profileDropdown");

  if (profileToggle && profileDropdown) {
    profileToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = profileToggle.getAttribute("aria-expanded") === "true";
      closeAllDropdowns();
      profileToggle.setAttribute("aria-expanded", !isOpen);
      profileDropdown.hidden = isOpen;
    });

    document.addEventListener("click", function (e) {
      if (
        !profileToggle.contains(e.target) &&
        !profileDropdown.contains(e.target)
      ) {
        profileToggle.setAttribute("aria-expanded", "false");
        profileDropdown.hidden = true;
      }
    });
  }

  // ===== MOBILE SIDEBAR TOGGLE =====
  const mobileBtn = document.getElementById("mobileMenuToggle");
  const sidebarClose = document.getElementById("sidebarClose");
  const sidebar = document.getElementById("clientSidebar");

  if (mobileBtn) {
    mobileBtn.addEventListener("click", function () {
      sidebar.classList.add("open");
      document.body.classList.add("sidebar-open");
      document.body.style.overflow = "hidden";
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", function () {
      sidebar.classList.remove("open");
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    });
  }

  // Close sidebar when clicking outside (mobile only)
  document.addEventListener("click", function (e) {
    if (
      window.innerWidth <= 768 &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      !mobileBtn?.contains(e.target)
    ) {
      sidebar.classList.remove("open");
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    }
  });

  // ===== SIDEBAR SUBMENU TOGGLE =====
  document.querySelectorAll(".submenu-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const target = this.getAttribute("data-target");
      const submenu = document.getElementById("submenu-" + target);
      const parent = this.closest(".has-submenu");

      if (!submenu) return;

      const isOpen = submenu.classList.contains("open");

      // Close ALL other submenus first
      document.querySelectorAll(".submenu").forEach(function (otherSubmenu) {
        if (otherSubmenu !== submenu) {
          otherSubmenu.classList.remove("open");
          otherSubmenu.closest(".has-submenu")?.classList.remove("open");
          otherSubmenu.previousElementSibling?.setAttribute(
            "aria-expanded",
            "false",
          );
        }
      });

      // Toggle current submenu
      if (isOpen) {
        submenu.classList.remove("open");
        parent?.classList.remove("open");
        this.setAttribute("aria-expanded", "false");
      } else {
        submenu.classList.add("open");
        parent?.classList.add("open");
        this.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ===== ACTIVE LINK HIGHLIGHTING =====
  const currentPath = window.location.pathname;

  document
    .querySelectorAll(".nav-link[data-page], .submenu a")
    .forEach(function (link) {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");

        // Expand parent submenu if this is a submenu link
        const parentSubmenu = link.closest(".submenu");
        if (parentSubmenu) {
          parentSubmenu.classList.add("open");
          parentSubmenu.closest(".has-submenu")?.classList.add("open");
          parentSubmenu.previousElementSibling?.setAttribute(
            "aria-expanded",
            "true",
          );
        }
      }
    });

  // ===== HELPER: CLOSE ALL DROPDOWNS =====
  function closeAllDropdowns() {
    if (profileDropdown) {
      profileDropdown.hidden = true;
      profileToggle?.setAttribute("aria-expanded", "false");
    }
    // Notification dropdown is now disabled, so we don't need to close it
  }

  // ===== TOAST NOTIFICATION =====
  function showToast(message, type = "success") {
    const existing = document.getElementById("layoutToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "layoutToast";
    toast.innerHTML = `
      <div class="toast-icon"><i class="fa-solid fa-${type === "success" ? "circle-check" : "info-circle"}"></i></div>
      <div class="toast-content">${message}</div>
    `;

    toast.style.cssText = `
      position:fixed;bottom:24px;right:24px;background:var(--card-bg);color:var(--text-dark);
      padding:14px 20px;border-radius:var(--radius-md);box-shadow:var(--shadow-lg);
      border-left:4px solid ${type === "success" ? "var(--primary)" : "var(--accent-gold)"};
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

  // ===== HANDLE WINDOW RESIZE =====
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("open");
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    }
  });
});
