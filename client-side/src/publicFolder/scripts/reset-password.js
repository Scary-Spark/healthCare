// ============================================
// NovaLife Password Reset - Frontend Script
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // Get token from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const resetTokenInput = document.getElementById("resetToken");
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  const resetSuccessMessage = document.getElementById("resetSuccessMessage");
  const resetErrorMessage = document.getElementById("resetErrorMessage");
  const resetErrorText = document.getElementById("resetErrorText");
  const resetSubmitBtn = document.getElementById("resetSubmitBtn");

  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");

  // Check if token exists
  if (!token) {
    showResetError(
      "Invalid or missing reset token. Please request a new password reset link.",
    );
    return;
  }

  // Set token in hidden input
  if (resetTokenInput) {
    resetTokenInput.value = token || "";
  }
  console.log("📥 Token set in hidden input:", resetTokenInput.value);

  // ===== PASSWORD VISIBILITY TOGGLE (GLOBAL FUNCTION) =====
  window.togglePassword = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";

    // Toggle icon
    const icon = btn.querySelector("svg") || btn.querySelector("i");
    if (icon) {
      if (isPassword) {
        // Show password (eye-slash)
        icon.innerHTML =
          '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
      } else {
        // Hide password (eye)
        icon.innerHTML =
          '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
      }
    }
  };

  // ===== PASSWORD STRENGTH & REQUIREMENTS (SAME AS SIGNUP) =====
  window.checkPasswordStrength = function (password) {
    const strengthEl = document.getElementById("passwordStrength");
    const bars = [
      document.getElementById("bar1"),
      document.getElementById("bar2"),
      document.getElementById("bar3"),
      document.getElementById("bar4"),
    ];
    const text = document.getElementById("strengthText");

    const hasLength = password.length >= 8 && password.length <= 32;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'\`~]/.test(
      password,
    );

    // Update requirement checklist
    updateReqItem("req-length", hasLength);
    updateReqItem("req-upper", hasUpper);
    updateReqItem("req-lower", hasLower);
    updateReqItem("req-number", hasNumber);
    updateReqItem("req-special", hasSpecial);

    if (password.length === 0) {
      strengthEl.classList.remove("visible");
      return;
    }
    strengthEl.classList.add("visible");

    // Calculate score (0-4)
    let score = 0;
    if (hasLength) score++;
    if (hasUpper && hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    const classes = ["weak", "weak", "medium", "strong"];
    const labels = ["Weak", "Fair", "Good", "Strong"];
    let level = Math.min(score, 4);

    bars.forEach((bar, i) => {
      bar.className = "strength-bar";
      if (i < level) bar.classList.add(classes[level - 1]);
    });

    text.textContent = labels[level - 1] || "Too short";
    text.style.color =
      level <= 1
        ? "var(--error)"
        : level === 2
          ? "var(--accent-gold)"
          : "var(--success)";
  };

  function updateReqItem(id, met) {
    const el = document.getElementById(id);
    if (el) {
      el.className = met ? "req-item met" : "req-item unmet";
    }
  }

  // Form validation
  function validateResetForm() {
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll(".error-message").forEach((el) => {
      el.style.display = "none";
      el.textContent = "";
    });
    document
      .querySelectorAll("input")
      .forEach((el) => el.classList.remove("error"));

    const passwordValue = newPassword?.value;
    const confirmValue = confirmPassword?.value;

    // Validate new password
    if (!passwordValue) {
      showError(newPassword, "newPasswordError", "New password is required");
      isValid = false;
    } else {
      const hasLength = passwordValue.length >= 8 && passwordValue.length <= 32;
      const hasUpper = /[A-Z]/.test(passwordValue);
      const hasLower = /[a-z]/.test(passwordValue);
      const hasNumber = /[0-9]/.test(passwordValue);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'\`~]/.test(
        passwordValue,
      );

      if (!hasLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
        showError(
          newPassword,
          "newPasswordError",
          "Password does not meet all requirements",
        );
        isValid = false;
      }
    }

    // Validate confirm password
    if (!confirmValue) {
      showError(
        confirmPassword,
        "confirmPasswordError",
        "Please confirm your password",
      );
      isValid = false;
    } else if (passwordValue !== confirmValue) {
      showError(
        confirmPassword,
        "confirmPasswordError",
        "Passwords do not match",
      );
      isValid = false;
    }

    return isValid;
  }

  function showError(input, errorId, message) {
    if (input) input.classList.add("error");
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = "block";
    }
  }

  function showResetError(message) {
    if (resetPasswordForm) resetPasswordForm.style.display = "none";
    if (resetErrorMessage) {
      resetErrorMessage.style.display = "block";
      if (resetErrorText) resetErrorText.textContent = message;
    }
  }

  function showResetSuccess() {
    if (resetPasswordForm) resetPasswordForm.style.display = "none";
    if (resetSuccessMessage) resetSuccessMessage.style.display = "block";
  }

  function setLoading(button, isLoading) {
    if (!button) return;
    const btnText = button.querySelector(".btn-text");
    const btnLoader = button.querySelector(".btn-loader");
    if (isLoading) {
      button.disabled = true;
      if (btnText) btnText.style.display = "none";
      if (btnLoader) btnLoader.style.display = "flex";
    } else {
      button.disabled = false;
      if (btnText) btnText.style.display = "inline";
      if (btnLoader) btnLoader.style.display = "none";
    }
  }

  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const icons = {
      success: "fa-circle-check",
      error: "fa-circle-exclamation",
      info: "fa-circle-info",
      warning: "fa-triangle-exclamation",
    };

    const titles = {
      success: "Success",
      error: "Error",
      info: "Notice",
      warning: "Warning",
    };

    const toast = document.createElement("div");
    toast.className = `toast-card ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <svg viewBox="0 0 24 24">
          <path d="${type === "success" ? "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" : type === "error" ? "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"}"/>
        </svg>
      </div>
      <div class="toast-content">
        <h4>${titles[type] || "Notice"}</h4>
        <p>${message}</p>
      </div>
    `;

    container.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  // Form submission
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!validateResetForm()) return;

      setLoading(resetSubmitBtn, true);

      try {
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: resetTokenInput.value,
            password: newPassword.value,
            confirmPassword: confirmPassword.value,
          }),
        });

        const result = await response.json();

        if (result.success) {
          showToast("Password reset successful!", "success");
          showResetSuccess();
        } else {
          showToast(result.message, "error");
          showResetError(result.message);
        }
      } catch (error) {
        console.error("Reset error:", error);
        showToast("An error occurred. Please try again.", "error");
        showResetError("Connection error. Please try again.");
      } finally {
        setLoading(resetSubmitBtn, false);
      }
    });
  }
});
