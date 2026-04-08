document.addEventListener("DOMContentLoaded", function () {
  // ===== SECTION TOGGLE =====
  window.toggleSection = function (sectionId) {
    const body = document.getElementById(sectionId + "Body");
    const toggle = document.getElementById(sectionId + "Toggle");
    body.classList.toggle("expanded");
    toggle.classList.toggle("active");
  };

  // ===== AVATAR UPLOAD (Using new ID) =====
  const avatarUpload = document.getElementById("avatarUpload");
  const profileAvatar = document.getElementById("settingsProfileAvatar"); // ✅ Updated ID
  const displayName = document.getElementById("displayName");

  avatarUpload.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file.", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("File too large. Max 2MB allowed.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      profileAvatar.src = event.target.result;
      showToast("Profile photo updated!", "success");
    };
    reader.readAsDataURL(file);
  });

  // ===== PASSWORD TOGGLE =====
  window.togglePassword = function (inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector("i");
    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  };

  // ===== PASSWORD STRENGTH =====
  window.checkPasswordStrength = function (password) {
    const strengthEl = document.getElementById("passwordStrength");
    const bars = [
      document.getElementById("bar1"),
      document.getElementById("bar2"),
      document.getElementById("bar3"),
      document.getElementById("bar4"),
    ];
    const text = document.getElementById("strengthText");

    if (password.length === 0) {
      strengthEl.classList.remove("visible");
      return;
    }
    strengthEl.classList.add("visible");

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let level = score <= 1 ? 1 : score <= 2 ? 2 : score <= 3 ? 3 : 4;
    const classes = ["weak", "weak", "medium", "strong"];
    const labels = ["Weak", "Fair", "Good", "Strong"];

    bars.forEach((bar, i) => {
      bar.className = "strength-bar";
      if (i < level) bar.classList.add(classes[level - 1]);
    });
    text.textContent = labels[level - 1];
    text.style.color =
      level <= 1
        ? "var(--accent-red)"
        : level === 2
          ? "var(--accent-gold)"
          : "var(--accent-green)";
  };

  // ===== VERIFY GLOBAL PASSWORD =====
  function verifyGlobalPassword(actionName) {
    const password = document.getElementById("globalCurrentPassword").value;
    if (!password || password.length < 1) {
      showToast(
        `Please enter your current password to ${actionName}.`,
        "error",
      );
      document.getElementById("globalCurrentPassword").focus();
      return false;
    }
    return true; // Demo: Accepts any password
  }

  // ===== FORM SUBMISSIONS =====

  // Personal Form
  document
    .getElementById("personalForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (!verifyGlobalPassword("update personal information")) return;

      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      displayName.textContent = `${firstName} ${lastName}`;
      updateProgress();
      showToast("Personal information updated!", "success");
      document.getElementById("globalCurrentPassword").value = ""; // Clear after success
    });

  // Contact Form
  document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (!verifyGlobalPassword("update contact information")) return;

      const email = document.getElementById("email").value;
      document.getElementById("displayEmail").textContent = email;
      updateProgress();
      showToast("Contact information updated!", "success");
      document.getElementById("globalCurrentPassword").value = "";
    });

  // Address Form
  document
    .getElementById("addressForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (!verifyGlobalPassword("update address")) return;

      updateProgress();
      showToast("Address updated successfully!", "success");
      document.getElementById("globalCurrentPassword").value = "";
    });

  // Security Form (Has its own current password field)
  document
    .getElementById("securityForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const current = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirm = document.getElementById("confirmPassword").value;

      if (!current) {
        showToast("Please enter your current password.", "error");
        return;
      }
      if (!newPassword || !confirm) {
        showToast("Please fill in both new password fields.", "error");
        return;
      }
      if (newPassword.length < 8) {
        showToast("New password must be at least 8 characters.", "error");
        return;
      }
      if (newPassword !== confirm) {
        showToast("New passwords do not match.", "error");
        return;
      }

      showToast("Password updated successfully!", "success");
      this.reset();
      document.getElementById("passwordStrength").classList.remove("visible");
    });

  // ===== RESET SECTIONS =====
  window.resetSection = function (sectionId) {
    if (confirm("Reset all changes in this section?")) {
      document.getElementById(sectionId + "Form").reset();
      showToast("Section reset to defaults.", "info");
    }
  };

  // ===== PROGRESS CALCULATION =====
  function updateProgress() {
    const fields = [
      document.getElementById("firstName").value,
      document.getElementById("lastName").value,
      document.getElementById("email").value,
      document.getElementById("phone").value,
      document.getElementById("division").value,
      document.getElementById("district").value,
    ];
    const filled = fields.filter((f) => f && f.trim() !== "").length;
    const percent = Math.round((filled / fields.length) * 100);
    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressPercent").textContent = percent + "%";
  }

  // ===== VERIFICATION MODAL & TOASTS (Same as before) =====
  let verificationType = "";
  window.requestVerification = function (type) {
    verificationType = type;
    const modal = document.getElementById("verificationModal");
    document.getElementById("verifyType").textContent =
      type === "email" ? "Email" : "Phone";
    document.getElementById("verifyTarget").textContent =
      type === "email" ? "email" : "phone";
    modal.style.display = "flex";
    setTimeout(() => {
      const firstDigit = modal.querySelector(".otp-digit");
      if (firstDigit) firstDigit.focus();
    }, 100);
  };
  window.closeVerificationModal = function () {
    document.getElementById("verificationModal").style.display = "none";
  };
  window.verifyChange = function () {
    const digits = document.querySelectorAll(
      '.otp-digit[data-target="verify"]',
    );
    let code = "";
    digits.forEach((d) => (code += d.value));
    if (code.length !== 6) {
      showToast("Please enter all 6 digits.", "error");
      return;
    }
    showToast(
      `${verificationType === "email" ? "Email" : "Phone"} verified!`,
      "success",
    );
    closeVerificationModal();
    updateProgress();
  };
  window.resendVerificationCode = function () {
    showToast("Verification code resent!", "success");
  };

  // OTP Input Handlers
  document.addEventListener("input", function (e) {
    if (e.target.classList.contains("otp-digit")) {
      const value = e.target.value;
      if (!/^\d*$/.test(value)) {
        e.target.value = "";
        return;
      }
      if (value.length === 1) {
        const inputs = Array.from(
          document.querySelectorAll(
            '.otp-digit[data-target="' + e.target.dataset.target + '"]',
          ),
        );
        const index = inputs.indexOf(e.target);
        if (index < inputs.length - 1) inputs[index + 1].focus();
      }
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.target.classList.contains("otp-digit")) {
      if (e.key === "Backspace" && !e.target.value) {
        const inputs = Array.from(
          document.querySelectorAll(
            '.otp-digit[data-target="' + e.target.dataset.target + '"]',
          ),
        );
        const index = inputs.indexOf(e.target);
        if (index > 0) inputs[index - 1].focus();
      }
    }
  });
  document
    .getElementById("verificationModal")
    .addEventListener("click", function (e) {
      if (e.target === this) closeVerificationModal();
    });

  window.showToast = function (message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const iconMap = { success: "fa-check", error: "fa-xmark", info: "fa-info" };
    toast.innerHTML = `<div class="toast-icon"><i class="fa-solid ${iconMap[type]}"></i></div><div class="toast-content">${message}</div>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // ===== BANGLADESH LOCATION CASCADE (Same as before) =====
  const bangladeshLocations = {
    Barisal: {
      Barguna: ["Amtali", "Bamna"],
      Barisal: ["Agailjhara", "Babuganj"],
    },
    Chittagong: {
      "Cox's Bazar": ["Chakaria", "Teknaf"],
      Chittagong: ["Anwara", "Patiya"],
    },
    Dhaka: {
      Dhaka: ["Dhamrai", "Savar"],
      Gazipur: ["Gazipur Sadar", "Kaliakair"],
    },
    Khulna: {
      Khulna: ["Batiaghata", "Dumuria"],
      Jessore: ["Abhaynagar", "Bagherpara"],
    },
    Mymensingh: {
      Mymensingh: ["Bhaluka", "Trishal"],
      Jamalpur: ["Baksiganj", "Islampur"],
    },
    Rajshahi: {
      Rajshahi: ["Bagha", "Godagari"],
      Bogra: ["Adamdighi", "Sherpur"],
    },
    Rangpur: {
      Rangpur: ["Badarganj", "Pirganj"],
      Dinajpur: ["Birampur", "Parbatipur"],
    },
    Sylhet: {
      Sylhet: ["Balaganj", "Beanibazar"],
      Habiganj: ["Ajmiriganj", "Bahubal"],
    },
  };

  function populateDivisions() {
    const divisionSelect = document.getElementById("division");
    if (!divisionSelect) return;
    divisionSelect.innerHTML =
      '<option value="" disabled selected>Select Division</option>';
    Object.keys(bangladeshLocations)
      .sort()
      .forEach((division) => {
        const option = document.createElement("option");
        option.value = division;
        option.textContent = division;
        divisionSelect.appendChild(option);
      });
  }
  function populateDistricts(division) {
    const districtSelect = document.getElementById("district");
    const upazilaSelect = document.getElementById("upazila");
    if (!districtSelect || !upazilaSelect) return;
    districtSelect.innerHTML =
      '<option value="" disabled selected>Select District</option>';
    upazilaSelect.innerHTML =
      '<option value="" disabled selected>Select Upazila</option>';
    upazilaSelect.disabled = true;
    if (!division || !bangladeshLocations[division]) {
      districtSelect.disabled = true;
      return;
    }
    Object.keys(bangladeshLocations[division])
      .sort()
      .forEach((district) => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    districtSelect.disabled = false;
  }
  function populateUpazilas(division, district) {
    const upazilaSelect = document.getElementById("upazila");
    if (!upazilaSelect) return;
    upazilaSelect.innerHTML =
      '<option value="" disabled selected>Select Upazila</option>';
    if (!division || !district || !bangladeshLocations[division][district]) {
      upazilaSelect.disabled = true;
      return;
    }
    bangladeshLocations[division][district].sort().forEach((upazila) => {
      const option = document.createElement("option");
      option.value = upazila;
      option.textContent = upazila;
      upazilaSelect.appendChild(option);
    });
    upazilaSelect.disabled = false;
  }
  document.getElementById("division")?.addEventListener("change", function () {
    populateDistricts(this.value);
  });
  document.getElementById("district")?.addEventListener("change", function () {
    populateUpazilas(document.getElementById("division").value, this.value);
  });

  // ===== INITIALIZE =====
  populateDivisions();
  updateProgress();
  setTimeout(() => {
    toggleSection("personal");
  }, 300);
});
