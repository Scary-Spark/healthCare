document.addEventListener("DOMContentLoaded", function () {
  // ===== SET CURRENT YEAR IN FOOTER =====
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  // ===== NOTIFICATION DROPDOWN =====
  const notificationToggle = document.getElementById("notificationToggle");
  const notificationDropdown = document.getElementById("notificationDropdown");
  const markAllRead = document.getElementById("markAllRead");

  if (notificationToggle && notificationDropdown) {
    notificationToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen =
        notificationToggle.getAttribute("aria-expanded") === "true";
      closeAllDropdowns();
      notificationToggle.setAttribute("aria-expanded", !isOpen);
      notificationDropdown.hidden = isOpen;
    });

    document.addEventListener("click", function (e) {
      if (
        !notificationToggle.contains(e.target) &&
        !notificationDropdown.contains(e.target)
      ) {
        notificationToggle.setAttribute("aria-expanded", "false");
        notificationDropdown.hidden = true;
      }
    });
  }

  if (markAllRead) {
    markAllRead.addEventListener("click", function () {
      document
        .querySelectorAll(".notification-item.unread")
        .forEach(function (item) {
          item.classList.remove("unread");
        });
      const badge = document.getElementById("notificationCount");
      if (badge) {
        badge.textContent = "0";
        badge.hidden = true;
      }
    });
  }

  // ===== MOBILE SIDEBAR TOGGLE - FIXED =====
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

  // ===== SIDEBAR SUBMENU TOGGLE - FIXED FOR MOBILE =====
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
    if (notificationDropdown) {
      notificationDropdown.hidden = true;
      notificationToggle?.setAttribute("aria-expanded", "false");
    }
  }

  // ===== EMERGENCY BUTTON CONFIRMATION =====
  const emergencyBtn = document.querySelector(".btn-emergency");
  if (emergencyBtn) {
    emergencyBtn.addEventListener("click", function (e) {
      if (!window.location.pathname.includes("/emergency")) {
        e.preventDefault();
        const confirmed = confirm(
          "⚠️ Medical Emergency Only\n\nAre you experiencing a life-threatening situation?\n\n✓ YES: Connect immediately\n✗ NO: Use regular support",
        );
        if (confirmed) {
          window.location.href = emergencyBtn.href;
        }
      }
    });
  }

  // ===== HANDLE WINDOW RESIZE - FIXED =====
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("open");
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    }
  });
});
