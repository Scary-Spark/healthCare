document.addEventListener("DOMContentLoaded", function () {
  // ===== STATE =====
  let profileData = null;
  let originalFormData = null; // Store original values for reset

  // ===== DOM ELEMENTS =====
  const settingsProfileAvatar = document.getElementById(
    "settingsProfileAvatar",
  );
  const displayName = document.getElementById("displayName");
  const displayEmail = document.getElementById("displayEmail");
  const progressFill = document.getElementById("progressFill");
  const progressPercent = document.getElementById("progressPercent");
  const globalCurrentPassword = document.getElementById(
    "globalCurrentPassword",
  );

  // Location dropdowns
  const divisionSelect = document.getElementById("division");
  const districtSelect = document.getElementById("district");
  const upazilaSelect = document.getElementById("upazila");

  // ===== FETCH PROFILE DATA =====
  async function loadProfileData() {
    try {
      const response = await fetch("/api/profile/settings");
      const result = await response.json();

      if (result.success && result.data) {
        profileData = result.data;
        originalFormData = JSON.parse(JSON.stringify(result.data)); // Deep copy for reset
        populateFormFields();
        await loadLocationData();
        updateProgress();
      }
    } catch (error) {
      showToast("Failed to load profile data", "error");
    }
  }

  // ===== POPULATE FORM FIELDS =====
  function populateFormFields() {
    if (!profileData) return;

    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const dobInput = document.getElementById("dob");
    const genderInput = document.getElementById("gender");
    const bloodGroupInput = document.getElementById("bloodGroup");

    if (firstNameInput) firstNameInput.value = profileData.firstName || "";
    if (lastNameInput) lastNameInput.value = profileData.lastName || "";
    if (dobInput) dobInput.value = profileData.dateOfBirth || "";
    if (genderInput) genderInput.value = profileData.gender || "";
    if (bloodGroupInput)
      bloodGroupInput.value = profileData.bloodGroup || "not-tested";

    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");

    if (emailInput) emailInput.value = profileData.email || "";
    if (phoneInput) phoneInput.value = profileData.phone || "";

    const postalCodeInput = document.getElementById("postalCode");
    const streetAddressInput = document.getElementById("streetAddress");

    if (postalCodeInput) postalCodeInput.value = profileData.postalCode || "";
    if (streetAddressInput)
      streetAddressInput.value = profileData.streetAddress || "";

    if (settingsProfileAvatar && profileData.profilePic) {
      settingsProfileAvatar.src = profileData.profilePic;
    }
    if (displayName && (profileData.firstName || profileData.lastName)) {
      displayName.textContent = (
        profileData.firstName +
        " " +
        profileData.lastName
      ).trim();
    }
    if (displayEmail && profileData.email) {
      displayEmail.textContent = profileData.email;
    }
  }

  // ===== LOAD LOCATION DATA =====
  async function loadLocationData() {
    try {
      const divisionsResponse = await fetch("/api/locations/divisions");
      const divisions = await divisionsResponse.json();

      if (Array.isArray(divisions)) {
        populateDivisions(divisions);

        if (profileData.upazilaDetails) {
          await populateDistricts(profileData.upazilaDetails.divisionId);
          await populateUpazilas(profileData.upazilaDetails.districtId);

          if (divisionSelect)
            divisionSelect.value = profileData.upazilaDetails.divisionId;
          if (districtSelect)
            districtSelect.value = profileData.upazilaDetails.districtId;
          if (upazilaSelect)
            upazilaSelect.value = profileData.upazilaDetails.upazilaId;
        }
      }
    } catch (error) {
      showToast("Failed to load location data", "error");
    }
  }

  // ===== POPULATE DIVISIONS =====
  function populateDivisions(divisions) {
    if (!divisionSelect) return;

    divisionSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Division";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    divisionSelect.appendChild(defaultOption);

    if (Array.isArray(divisions)) {
      divisions.forEach((division) => {
        if (!division.division_name) return;
        const option = document.createElement("option");
        option.value = division.division_id;
        option.textContent = division.division_name;
        divisionSelect.appendChild(option);
      });
    }
  }

  // ===== POPULATE DISTRICTS =====
  async function populateDistricts(divisionId) {
    if (!districtSelect || !upazilaSelect) return;

    districtSelect.innerHTML = "";
    upazilaSelect.innerHTML = "";

    const defaultDistrict = document.createElement("option");
    defaultDistrict.value = "";
    defaultDistrict.textContent = "Select District";
    defaultDistrict.disabled = true;
    defaultDistrict.selected = true;
    districtSelect.appendChild(defaultDistrict);

    const defaultUpazila = document.createElement("option");
    defaultUpazila.value = "";
    defaultUpazila.textContent = "Select Upazila";
    defaultUpazila.disabled = true;
    defaultUpazila.selected = true;
    upazilaSelect.appendChild(defaultUpazila);

    upazilaSelect.disabled = true;

    if (!divisionId) {
      districtSelect.disabled = true;
      return;
    }

    try {
      const response = await fetch("/api/locations/districts/" + divisionId);
      const districts = await response.json();

      if (Array.isArray(districts)) {
        districts.forEach((district) => {
          if (!district.district_name) return;
          const option = document.createElement("option");
          option.value = district.district_id;
          option.textContent = district.district_name;
          districtSelect.appendChild(option);
        });
        districtSelect.disabled = false;
      }
    } catch (error) {
      showToast("Failed to load districts", "error");
    }
  }

  // ===== POPULATE UPAZILAS =====
  async function populateUpazilas(districtId) {
    if (!upazilaSelect) return;

    upazilaSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Upazila";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    upazilaSelect.appendChild(defaultOption);

    if (!districtId) {
      upazilaSelect.disabled = true;
      return;
    }

    try {
      const response = await fetch("/api/locations/upazilas/" + districtId);
      const upazilas = await response.json();

      if (Array.isArray(upazilas)) {
        upazilas.forEach((upazila) => {
          if (!upazila.upazila_name) return;
          const option = document.createElement("option");
          option.value = upazila.upazila_id;
          option.textContent = upazila.upazila_name;
          upazilaSelect.appendChild(option);
        });
        upazilaSelect.disabled = false;
      }
    } catch (error) {
      showToast("Failed to load upazilas", "error");
    }
  }

  // ===== SECTION TOGGLE =====
  window.toggleSection = function (sectionId) {
    const body = document.getElementById(sectionId + "Body");
    const toggle = document.getElementById(sectionId + "Toggle");
    if (body && toggle) {
      body.classList.toggle("expanded");
      toggle.classList.toggle("active");
    }
  };

  // ===== AVATAR UPLOAD =====
  const avatarUpload = document.getElementById("avatarUpload");
  if (avatarUpload && settingsProfileAvatar) {
    avatarUpload.addEventListener("change", async function (e) {
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

      // Show loading
      const originalSrc = settingsProfileAvatar.src;
      settingsProfileAvatar.src = URL.createObjectURL(file);

      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch("/api/profile/avatar", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          showToast("Profile photo updated!", "success");
          if (profileData) profileData.profilePic = result.data.profilePic;
        } else {
          showToast(result.message || "Failed to upload photo", "error");
          settingsProfileAvatar.src = originalSrc; // Revert on error
        }
      } catch (error) {
        showToast("Network error uploading photo", "error");
        settingsProfileAvatar.src = originalSrc;
      }
    });
  }

  // ===== PASSWORD TOGGLE =====
  window.togglePassword = function (inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector("i");
    if (input && icon) {
      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
      }
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

    if (!strengthEl || !bars[0] || !text) return;

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
    const password = globalCurrentPassword?.value;
    if (!password || password.length < 1) {
      showToast(
        "Please enter your current password to " + actionName + ".",
        "error",
      );
      if (globalCurrentPassword) globalCurrentPassword.focus();
      return false;
    }
    return true;
  }

  // ===== API CALL HELPERS =====
  async function callUpdateApi(endpoint, data) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        showToast(result.message, "success");
        // Refresh profile data to show updated values
        await loadProfileData();
        return true;
      } else {
        showToast(result.message || "Update failed", "error");
        return false;
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error");
      return false;
    }
  }

  // ===== FORM SUBMISSIONS =====

  // Personal Form
  const personalForm = document.getElementById("personalForm");
  if (personalForm) {
    personalForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!verifyGlobalPassword("update personal information")) return;

      const data = {
        firstName: document.getElementById("firstName")?.value.trim(),
        lastName: document.getElementById("lastName")?.value.trim(),
        dateOfBirth: document.getElementById("dob")?.value,
        gender: document.getElementById("gender")?.value,
        bloodGroup: document.getElementById("bloodGroup")?.value,
        currentPassword: globalCurrentPassword?.value,
      };

      const success = await callUpdateApi("/api/profile/personal", data);
      if (success && globalCurrentPassword) globalCurrentPassword.value = "";
    });
  }

  // Contact Form
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      showToast("Contact information update feature is coming soon!", "info");
    });
  }

  // Address Form
  const addressForm = document.getElementById("addressForm");
  if (addressForm) {
    addressForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!verifyGlobalPassword("update address")) return;

      const data = {
        upazilaId: document.getElementById("upazila")?.value,
        postalCode: document.getElementById("postalCode")?.value.trim(),
        streetAddress: document.getElementById("streetAddress")?.value.trim(),
        currentPassword: globalCurrentPassword?.value,
      };

      const success = await callUpdateApi("/api/profile/address", data);
      if (success && globalCurrentPassword) globalCurrentPassword.value = "";
    });
  }

  // Security Form (Password update - uses its own password field conceptually, but we use global)
  const securityForm = document.getElementById("securityForm");
  if (securityForm) {
    securityForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const newPassword = document.getElementById("newPassword")?.value;
      const confirm = document.getElementById("confirmPassword")?.value;
      const currentPassword = globalCurrentPassword?.value;

      if (!currentPassword) {
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

      const data = {
        newPassword,
        currentPassword,
      };

      const success = await callUpdateApi("/api/profile/password", data);
      if (success) {
        this.reset();
        const passwordStrength = document.getElementById("passwordStrength");
        if (passwordStrength) passwordStrength.classList.remove("visible");
        if (globalCurrentPassword) globalCurrentPassword.value = "";
      }
    });
  }

  // Two-Factor Auth Toggle (Coming Soon)
  const twoFactorToggle = document.getElementById("twoFactor");
  if (twoFactorToggle) {
    twoFactorToggle.addEventListener("change", function () {
      showToast("Two-factor authentication feature is coming soon!", "info");
      this.checked = false; // Revert toggle
    });
  }

  // ===== RESET SECTIONS =====
  window.resetSection = function (sectionId) {
    if (confirm("Reset all changes in this section?")) {
      if (sectionId === "personal" && originalFormData) {
        document.getElementById("firstName").value =
          originalFormData.firstName || "";
        document.getElementById("lastName").value =
          originalFormData.lastName || "";
        document.getElementById("dob").value =
          originalFormData.dateOfBirth || "";
        document.getElementById("gender").value = originalFormData.gender || "";
        document.getElementById("bloodGroup").value =
          originalFormData.bloodGroup || "not-tested";
      } else if (sectionId === "contact" && originalFormData) {
        document.getElementById("email").value = originalFormData.email || "";
        document.getElementById("phone").value = originalFormData.phone || "";
      } else if (sectionId === "address" && originalFormData) {
        document.getElementById("postalCode").value =
          originalFormData.postalCode || "";
        document.getElementById("streetAddress").value =
          originalFormData.streetAddress || "";
        // For location, reload from original upazilaDetails
        if (originalFormData.upazilaDetails && divisionSelect) {
          populateDistricts(originalFormData.upazilaDetails.divisionId).then(
            () => {
              populateUpazilas(originalFormData.upazilaDetails.districtId).then(
                () => {
                  divisionSelect.value =
                    originalFormData.upazilaDetails.divisionId;
                  districtSelect.value =
                    originalFormData.upazilaDetails.districtId;
                  upazilaSelect.value =
                    originalFormData.upazilaDetails.upazilaId;
                },
              );
            },
          );
        }
      } else if (sectionId === "security") {
        document.getElementById("securityForm")?.reset();
        const passwordStrength = document.getElementById("passwordStrength");
        if (passwordStrength) passwordStrength.classList.remove("visible");
      }
      showToast("Section reset to defaults.", "info");
    }
  };

  // ===== PROGRESS CALCULATION =====
  function updateProgress() {
    const fields = [
      document.getElementById("firstName")?.value,
      document.getElementById("lastName")?.value,
      document.getElementById("email")?.value,
      document.getElementById("phone")?.value,
      document.getElementById("division")?.value,
      document.getElementById("district")?.value,
    ];
    const filled = fields.filter((f) => f && f.trim() !== "").length;
    const percent = Math.round((filled / fields.length) * 100);
    if (progressFill) progressFill.style.width = percent + "%";
    if (progressPercent) progressPercent.textContent = percent + "%";
  }

  // ===== LOCATION CASCADE EVENTS =====
  if (divisionSelect) {
    divisionSelect.addEventListener("change", function () {
      populateDistricts(this.value);
      updateProgress();
    });
  }

  if (districtSelect) {
    districtSelect.addEventListener("change", function () {
      populateUpazilas(this.value);
      updateProgress();
    });
  }

  if (upazilaSelect) {
    upazilaSelect.addEventListener("change", function () {
      updateProgress();
    });
  }

  window.requestVerification = function (type) {
    showToast("Email/phone verification feature is coming soon!", "info");
  };

  window.closeVerificationModal = function () {
    const modal = document.getElementById("verificationModal");
    if (modal) modal.style.display = "none";
  };

  window.verifyChange = function () {
    showToast("Verification feature is coming soon!", "info");
    closeVerificationModal();
  };

  window.resendVerificationCode = function () {
    showToast("Verification feature is coming soon!", "info");
  };

  // ===== TOAST NOTIFICATIONS =====
  window.showToast = function (message, type) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast " + (type || "success");

    const iconMap = { success: "fa-check", error: "fa-xmark", info: "fa-info" };
    const icon = iconMap[type] || "fa-check";

    toast.innerHTML =
      '<div class="toast-icon"><i class="fa-solid ' +
      icon +
      '"></i></div><div class="toast-content">' +
      message +
      "</div>";

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 300);
    }, 3000);
  };

  // ===== INITIALIZE =====
  loadProfileData();

  setTimeout(() => {
    toggleSection("personal");
  }, 300);
});
