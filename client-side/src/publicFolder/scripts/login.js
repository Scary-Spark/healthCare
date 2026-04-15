// ============================================
// NovaLife Patient Login - Frontend Scripts
// NO backend authentication - frontend validation only
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // 1. DOM ELEMENTS
  // ============================================
  const patientLoginForm = document.getElementById("patientLoginForm");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const successMessage = document.getElementById("successMessage");

  const loginIdentifier = document.getElementById("loginIdentifier");
  const password = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const backToLogin = document.getElementById("backToLogin");
  const backToLoginFromSuccess = document.getElementById(
    "backToLoginFromSuccess",
  );
  const signupLink = document.getElementById("signupLink");

  const resetEmail = document.getElementById("resetEmail");
  const resetEmailDisplay = document.getElementById("resetEmailDisplay");
  const resendLink = document.getElementById("resendLink");

  const loginBtn = document.getElementById("loginBtn");
  const resetBtn = document.getElementById("resetBtn");

  const googleLogin = document.getElementById("googleLogin");
  const facebookLogin = document.getElementById("facebookLogin");

  // ============================================
  // 2. PASSWORD VISIBILITY TOGGLE
  // ============================================
  if (togglePassword && password) {
    togglePassword.addEventListener("click", function () {
      const isPassword = password.type === "password";
      password.type = isPassword ? "text" : "password";

      // Toggle the icon class properly
      const icon = togglePassword.querySelector("i");
      if (icon) {
        if (isPassword) {
          // Change to eye-slash (showing password)
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          // Change back to eye (hiding password)
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      }

      togglePassword.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password",
      );
    });
  }

  // ============================================
  // 3. FORM SWITCHING (Login ↔ Forgot Password)
  // ============================================
  function showForm(formToShow) {
    // Hide all forms/messages
    patientLoginForm.style.display = "none";
    forgotPasswordForm.style.display = "none";
    successMessage.style.display = "none";

    // Show requested form
    if (formToShow === "login") {
      patientLoginForm.style.display = "block";
      loginIdentifier?.focus();
    } else if (formToShow === "forgot") {
      forgotPasswordForm.style.display = "block";
      resetEmail?.focus();
    } else if (formToShow === "success") {
      successMessage.style.display = "block";
    }
  }

  forgotPasswordLink?.addEventListener("click", (e) => {
    e.preventDefault();
    clearErrors();
    showForm("forgot");
  });

  backToLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    clearErrors();
    showForm("login");
  });

  backToLoginFromSuccess?.addEventListener("click", (e) => {
    e.preventDefault();
    clearErrors();
    showForm("login");
  });

  resendLink?.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Reset link resent! Check your email.", "success");
  });

  // ============================================
  // 4. FRONTEND VALIDATION
  // ============================================
  function validateEmailOrPhone(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  }

  function validatePassword(value) {
    return value.length >= 6;
  }

  function showError(input, errorElement, message) {
    if (input) input.classList.add("error");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  }

  function clearError(input, errorElement) {
    if (input) input.classList.remove("error");
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }
  }

  function clearErrors() {
    clearError(loginIdentifier, document.getElementById("identifierError"));
    clearError(password, document.getElementById("passwordError"));
    clearError(resetEmail, document.getElementById("resetEmailError"));
  }

  function validateLoginForm() {
    let isValid = true;
    clearErrors();

    const identifierValue = loginIdentifier?.value.trim();
    const passwordValue = password?.value;

    if (!identifierValue) {
      showError(
        loginIdentifier,
        document.getElementById("identifierError"),
        "Email or phone is required",
      );
      isValid = false;
    } else if (!validateEmailOrPhone(identifierValue)) {
      showError(
        loginIdentifier,
        document.getElementById("identifierError"),
        "Please enter a valid email or phone number",
      );
      isValid = false;
    }

    if (!passwordValue) {
      showError(
        password,
        document.getElementById("passwordError"),
        "Password is required",
      );
      isValid = false;
    } else if (!validatePassword(passwordValue)) {
      showError(
        password,
        document.getElementById("passwordError"),
        "Password must be at least 6 characters",
      );
      isValid = false;
    }

    return isValid;
  }

  function validateForgotForm() {
    clearError(resetEmail, document.getElementById("resetEmailError"));

    const emailValue = resetEmail?.value.trim();

    if (!emailValue) {
      showError(
        resetEmail,
        document.getElementById("resetEmailError"),
        "Email is required",
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      showError(
        resetEmail,
        document.getElementById("resetEmailError"),
        "Please enter a valid email address",
      );
      return false;
    }

    return true;
  }

  // form submission
  patientLoginForm?.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateLoginForm()) return;

    // Show loading state
    setLoading(loginBtn, true);
    clearErrors();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginIdentifier.value.trim(),
          password: password.value,
          remember: document.getElementById("remember")?.checked || false,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showToast("Login successful! Redirecting...", "success");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        showToast(result.message, "error");

        // Show specific field errors if available
        if (result.errors) {
          if (result.errors.identifier) {
            showError(
              loginIdentifier,
              document.getElementById("identifierError"),
              result.errors.identifier,
            );
          }
          if (result.errors.password) {
            showError(
              password,
              document.getElementById("passwordError"),
              result.errors.password,
            );
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("Connection error. Please try again.", "error");
    } finally {
      setLoading(loginBtn, false);
    }
  });

  // forgot password form submit handler
  forgotPasswordForm?.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateForgotForm()) return;

    setLoading(resetBtn, true);
    clearError(resetEmail, document.getElementById("resetEmailError"));

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail.value.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        resetEmailDisplay.textContent = resetEmail.value;
        showToast(result.message, "success");
        showForm("success");
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setLoading(resetBtn, false);
    }
  });

  // ============================================
  // 6. SOCIAL LOGIN (Frontend Demo)
  // ============================================
  function handleSocialLogin(provider) {
    showToast(`${provider} login initiated`, "info");

    // Demo: Show what would happen
    setTimeout(() => {
      alert(
        `🔐 ${provider} OAuth Flow\n\nIn production:\n1. Redirect to ${provider} OAuth\n2. User authenticates\n3. Receive token\n4. Create/find patient account\n5. Redirect to dashboard\n\nThis is a frontend demo only.`,
      );
    }, 800);
  }

  googleLogin?.addEventListener("click", () => handleSocialLogin("Google"));
  facebookLogin?.addEventListener("click", () => handleSocialLogin("Facebook"));

  // ============================================
  // 7. SIGNUP LINK
  // ============================================
  signupLink?.addEventListener("click", function (e) {
    // In production: e.preventDefault() + redirect to /patient/register
    // For demo, just show info
    e.preventDefault();
    showToast("Redirecting to registration...", "info");
    setTimeout(() => {
      alert(
        "📝 Patient Registration\n\nIn production, this would navigate to the patient registration page where new users can:\n• Create account\n• Verify identity\n• Set up profile\n• Add insurance info",
      );
    }, 500);
  });

  // ============================================
  // 8. UTILITY FUNCTIONS
  // ============================================
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
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fa-solid ${icons[type] || icons.info}"></i>
      <div class="toast-content">
        <div class="toast-title">${titles[type] || "Notice"}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    container.appendChild(toast);

    // Close button
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => removeToast(toast));

    // Auto-remove after 5 seconds
    setTimeout(() => removeToast(toast), 5000);
  }

  function removeToast(toast) {
    toast.style.animation = "slideOut 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }

  // ============================================
  // 9. REAL-TIME VALIDATION
  // ============================================
  loginIdentifier?.addEventListener("input", () => {
    if (loginIdentifier.classList.contains("error")) {
      if (validateEmailOrPhone(loginIdentifier.value.trim())) {
        clearError(loginIdentifier, document.getElementById("identifierError"));
        loginIdentifier.classList.add("success");
      }
    }
  });

  password?.addEventListener("input", () => {
    if (password.classList.contains("error")) {
      if (validatePassword(password.value)) {
        clearError(password, document.getElementById("passwordError"));
        password.classList.add("success");
      }
    }
  });

  resetEmail?.addEventListener("input", () => {
    if (resetEmail.classList.contains("error")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(resetEmail.value.trim())) {
        clearError(resetEmail, document.getElementById("resetEmailError"));
        resetEmail.classList.add("success");
      }
    }
  });

  // ============================================
  // 10. KEYBOARD ACCESSIBILITY
  // ============================================
  // Allow Enter key to submit forms
  [loginIdentifier, password, resetEmail].forEach((input) => {
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const form = input.closest("form");
        if (form) form.requestSubmit();
      }
    });
  });

  // ============================================
  // 11. AUTO-FOCUS FIRST INPUT
  // ============================================
  setTimeout(() => {
    loginIdentifier?.focus();
  }, 300);
});
