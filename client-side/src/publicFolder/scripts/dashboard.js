/**
 * DASHBOARD PAGE INTERACTIONS - ENHANCED
 * Smooth animations, counting numbers, micro-interactions
 * Static frontend only - backend integration later
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== ANIMATE STAT NUMBERS ON LOAD =====
  function animateNumber(element, target, duration = 1500) {
    let start = 0;
    const increment = target / (duration / 16);

    function update() {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start);
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    update();
  }

  // Animate stat numbers when they come into view
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const statCard = entry.target;
        const numberEl = statCard.querySelector(".stat-number");
        const target = parseInt(numberEl.getAttribute("data-count"), 10);

        if (numberEl && !isNaN(target)) {
          animateNumber(numberEl, target);
        }

        observer.unobserve(statCard);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".stat-card").forEach(function (card) {
    observer.observe(card);
  });

  // ===== STAT CARD HOVER EFFECT =====
  document.querySelectorAll(".stat-card").forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-4px)";
    });
    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // ===== QUICK ACTION CARDS =====
  // document.querySelectorAll(".action-card").forEach(function (card) {
  //   card.addEventListener("click", function (e) {
  //     // Demo: prevent navigation, show toast
  //     e.preventDefault();
  //     const action = this.querySelector("h3").textContent;
  //     showToast(`Opening ${action}...`);
  //   });
  // });

  // ===== APPOINTMENT ACTIONS =====
  document.querySelectorAll(".action-btn-small").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const action = this.textContent;
      showToast(`${action}...`);
    });
  });

  // ===== RECORD DOWNLOAD BUTTONS =====
  document.querySelectorAll(".btn-download").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const title =
        this.closest(".record-card").querySelector(".record-title").textContent;
      showToast(`Downloading ${title} PDF...`);
    });
  });

  // ===== RECORD VIEW BUTTONS =====
  document.querySelectorAll(".btn-view").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const title =
        this.closest(".record-card").querySelector(".record-title").textContent;
      showToast(`Viewing ${title}...`);
    });
  });

  // ===== TOAST NOTIFICATION (Enhanced) =====
  function showToast(message) {
    // Remove existing toast
    const existing = document.getElementById("demoToast");
    if (existing) existing.remove();

    // Create toast container
    const toast = document.createElement("div");
    toast.id = "demoToast";
    toast.className = "toast-notification";
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <div class="toast-content">
        <p>${message}</p>
      </div>
      <button class="toast-close" aria-label="Close notification">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    // Style the toast
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--card-bg);
      color: var(--text-dark);
      padding: 14px 20px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      border-left: 4px solid var(--primary);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 2000;
      max-width: 360px;
      animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    `;

    // Add to body
    document.body.appendChild(toast);

    // Close button functionality
    const closeBtn = toast.querySelector(".toast-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        toast.style.animation = "fadeOut 0.3s ease forwards";
        setTimeout(() => toast.remove(), 300);
      });
    }

    // Auto-remove after animation
    setTimeout(function () {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 3000);

    // Add animation keyframes if not present
    if (!document.getElementById("toastAnimations")) {
      const style = document.createElement("style");
      style.id = "toastAnimations";
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(20px);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ===== LAZY LOAD ANIMATIONS FOR CARDS =====
  const cardObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          entry.target.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
          entry.target.style.opacity = "0";
          entry.target.style.transform = "translateY(20px)";
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll(".stat-card, .action-card, .record-card")
    .forEach(function (card) {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      cardObserver.observe(card);
    });

  // Add fadeInUp keyframes
  if (!document.getElementById("cardAnimations")) {
    const style = document.createElement("style");
    style.id = "cardAnimations";
    style.textContent = `
      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
});
