// ============================================
// NovaLife Medical Center - Home Page Scripts (FIXED)
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // 1. MOBILE MENU TOGGLE
  // ============================================
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const header = document.querySelector(".header");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle(
          "fa-bars",
          !navLinks.classList.contains("active"),
        );
        icon.classList.toggle(
          "fa-xmark",
          navLinks.classList.contains("active"),
        );
      }
    });
  }

  document.addEventListener("click", function (e) {
    if (
      navLinks &&
      mobileMenuBtn &&
      !navLinks.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)
    ) {
      navLinks.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    }
  });

  // ============================================
  // 2. HEADER SCROLL EFFECT
  // ============================================
  let lastScroll = 0;
  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;
    if (header) {
      header.classList.toggle("scrolled", currentScroll > 50);
      if (currentScroll > lastScroll && currentScroll > 200) {
        header.classList.add("header-hide");
      } else {
        header.classList.remove("header-hide");
      }
    }
    lastScroll = currentScroll;
  });

  // ============================================
  // 3. SMOOTH SCROLL FOR NAVIGATION LINKS
  // ============================================
  const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');
  navLinkItems.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection && header) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
        navLinks?.classList.remove("active");
        const icon = mobileMenuBtn?.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");
        }
      }
    });
  });

  // ============================================
  // 4. ACTIVE NAV LINK ON SCROLL
  // ============================================
  const sections = document.querySelectorAll("section[id]");
  function highlightNavLink() {
    const scrollPosition = window.scrollY + 200;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinkItems.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`)
            link.classList.add("active");
        });
      }
    });
  }
  window.addEventListener("scroll", highlightNavLink);

  // ============================================
  // 5. DOCTOR SLIDER NAVIGATION - COMPLETELY FIXED
  // ============================================
  const sliderTrack = document.querySelector(".slider-track");
  const sliderPrevBtn = document.querySelector(".slider-nav.prev");
  const sliderNextBtn = document.querySelector(".slider-nav.next");
  let sliderDots = document.querySelectorAll(".slider-dots .dot");
  const doctorCards = document.querySelectorAll(".doctor-card");

  if (sliderTrack && sliderPrevBtn && sliderNextBtn && doctorCards.length > 0) {
    let currentSlide = 0;
    let cardWidth = 0;
    let visibleCards = 0;
    let maxSlide = 0;

    const getCardWidth = () => {
      const card = doctorCards[0];
      const style = window.getComputedStyle(card);
      const gap = parseInt(style.marginRight || style.gap || 24);
      return card.offsetWidth + gap;
    };

    const getVisibleCards = () => {
      const containerWidth = sliderTrack.parentElement?.offsetWidth || 0;
      return Math.max(1, Math.floor(containerWidth / cardWidth));
    };

    const generateSliderDots = () => {
      const dotsContainer = document.querySelector(".slider-dots");
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      const totalDots = Math.min(maxSlide + 1, 6);
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("span");
        dot.className = `dot${i === 0 ? " active" : ""}`;
        dot.addEventListener("click", () => {
          currentSlide = i;
          updateSlider();
        });
        dotsContainer.appendChild(dot);
      }
      sliderDots = document.querySelectorAll(".slider-dots .dot");
    };

    const updateSlider = () => {
      currentSlide = Math.max(0, Math.min(currentSlide, maxSlide));
      sliderTrack.scrollTo({
        left: currentSlide * cardWidth,
        behavior: "smooth",
      });
      sliderDots.forEach((dot, index) =>
        dot.classList.toggle("active", index === currentSlide),
      );
      sliderPrevBtn.style.opacity = currentSlide === 0 ? "0.5" : "1";
      sliderPrevBtn.style.pointerEvents = currentSlide === 0 ? "none" : "auto";
      sliderNextBtn.style.opacity = currentSlide >= maxSlide ? "0.5" : "1";
      sliderNextBtn.style.pointerEvents =
        currentSlide >= maxSlide ? "none" : "auto";
    };

    const initSlider = () => {
      cardWidth = getCardWidth();
      visibleCards = getVisibleCards();
      maxSlide = Math.max(0, doctorCards.length - visibleCards);
      currentSlide = Math.min(currentSlide, maxSlide);
      generateSliderDots();
      updateSlider();
    };

    initSlider();

    sliderPrevBtn.addEventListener("click", () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
      }
    });
    sliderNextBtn.addEventListener("click", () => {
      if (currentSlide < maxSlide) {
        currentSlide++;
        updateSlider();
      }
    });

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initSlider, 150);
    });

    // Touch swipe support
    let touchStartX = 0,
      touchEndX = 0;
    sliderTrack.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );
    sliderTrack.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && currentSlide < maxSlide) currentSlide++;
          else if (diff < 0 && currentSlide > 0) currentSlide--;
          updateSlider();
        }
      },
      { passive: true },
    );
  }

  // ============================================
  // 6. FAQ ACCORDION - DYNAMIC HEIGHT
  // ============================================
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    question?.addEventListener("click", function () {
      const isActive = item.classList.contains("active");
      faqItems.forEach((other) => {
        const otherAnswer = other.querySelector(".faq-answer");
        other.classList.remove("active");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });
      if (!isActive) {
        item.classList.add("active");
        if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // ============================================
  // 7. SCROLL TO TOP BUTTON
  // ============================================
  const scrollTopBtn = document.querySelector(".scroll-top");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("visible", window.pageYOffset > 500);
    });
    scrollTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ============================================
  // 8. STATS COUNTER ANIMATION - IMPROVED
  // ============================================
  const statNumbers = document.querySelectorAll(".stat-number");
  let statsAnimated = false;
  function animateStats() {
    if (statsAnimated) return;
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-count")) || 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      const suffix = stat.textContent.includes("+") ? "+" : "";
      const update = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.floor(current) + suffix;
          requestAnimationFrame(update);
        } else {
          stat.textContent = target + suffix;
        }
      };
      update();
    });
    statsAnimated = true;
  }
  const statsSection = document.querySelector(".hero-stats");
  if (statsSection) {
    const checkVisibility = () => {
      const rect = statsSection.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };
    if (checkVisibility()) animateStats();
    else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateStats();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.3 },
      );
      observer.observe(statsSection);
    }
  }

  // ============================================
  // 9. NOTIFICATION SYSTEM
  // ============================================
  function showNotification(message, type = "info") {
    const existing = document.querySelector(".notification");
    if (existing) existing.remove();
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    const icons = {
      success: "fa-circle-check",
      error: "fa-circle-exclamation",
      info: "fa-circle-info",
      warning: "fa-triangle-exclamation",
    };
    const colors = {
      success: "#22c55e",
      error: "#ef4444",
      info: "#3b82f6",
      warning: "#f97316",
    };
    notification.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${message}</span><button class="notification-close"><i class="fa-solid fa-xmark"></i></button>`;
    Object.assign(notification.style, {
      position: "fixed",
      top: "100px",
      right: "20px",
      padding: "16px 20px",
      background: colors[type] || colors.info,
      color: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      zIndex: "10000",
      animation: "slideIn 0.3s ease",
      maxWidth: "400px",
    });
    document.body.appendChild(notification);
    const closeBtn = notification.querySelector(".notification-close");
    Object.assign(closeBtn.style, {
      background: "none",
      border: "none",
      color: "#fff",
      cursor: "pointer",
      padding: "4px",
      marginLeft: "auto",
    });
    const remove = () => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    };
    closeBtn.addEventListener("click", remove);
    setTimeout(remove, 5000);
  }
  // Add animation keyframes
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}`;
    document.head.appendChild(style);
  }

  // ============================================
  // 10. FORM SUBMISSION HANDLERS
  // ============================================
  const newsletterForm = document.querySelector(".newsletter-form");
  newsletterForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]')?.value;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotification("Thank you for subscribing!", "success");
      this.querySelector('input[type="email"]').value = "";
    } else {
      showNotification("Please enter a valid email address.", "error");
    }
  });

  // ============================================
  // 11. INTERACTIVE CARD CLICKS
  // ============================================
  document
    .querySelectorAll(".doctor-card, .dept-card, .read-more, .card-link")
    .forEach((el) => {
      el.addEventListener("click", function (e) {
        if (this.getAttribute("href") === "#") {
          e.preventDefault();
          const name = this.querySelector("h4, h3")?.textContent || "this item";
          showNotification(
            `Viewing ${this.classList.contains("dept-card") ? "department" : "profile"} for ${name}`,
            "info",
          );
        }
      });
    });
});
