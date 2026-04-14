let currentStep = 1;
const verificationState = {
  email: { sent: false, verified: false, timer: null },
  phone: { sent: false, verified: false, timer: null },
};

// ===== LOCATION CASCADE =====
async function initLocationDropdowns() {
  await loadDivisions();
  await loadBloodGroups();
  await loadGenders();
  setupLocationEventListeners();
}

// load genders from db
async function loadGenders() {
  try {
    const response = await fetch("/api/locations/genders");
    const genders = await response.json();

    const select = document.getElementById("gender");
    select.innerHTML =
      '<option value="" disabled selected>Select Gender</option>';

    genders.forEach((g) => {
      const option = document.createElement("option");
      option.value = g.gender_id; // Store ID for backend
      option.textContent = g.gender_name; // Show name to user
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading genders:", error);
    showToast("Failed to load genders.", "error");
  }
}

// load blood groups from db
async function loadBloodGroups() {
  try {
    const response = await fetch("/api/locations/blood-groups");
    const bloodGroups = await response.json();

    const select = document.getElementById("bloodGroup");
    select.innerHTML =
      '<option value="" disabled selected>Select Blood Group</option>';

    bloodGroups.forEach((bg) => {
      const option = document.createElement("option");
      option.value = bg.blood_group_id; // Store ID for backend
      option.textContent = bg.blood_group_name; // Show name to user
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading blood groups:", error);
    showToast("Failed to load blood groups.", "error");
  }
}

// load divisions from db
async function loadDivisions() {
  try {
    const response = await fetch("/api/locations/divisions");
    const divisions = await response.json();
    const select = document.getElementById("division");
    select.innerHTML =
      '<option value="" disabled selected>Select Division</option>';
    divisions.forEach((div) => {
      const option = document.createElement("option");
      option.value = div.division_id;
      option.textContent = div.division_name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading divisions:", error);
    showToast("Failed to load divisions.", "error");
  }
}

async function loadDistricts(divisionId) {
  const districtSelect = document.getElementById("district");
  const upazilaSelect = document.getElementById("upazila");

  districtSelect.innerHTML =
    '<option value="" disabled selected>Select District</option>';
  upazilaSelect.innerHTML =
    '<option value="" disabled selected>Select Upazila</option>';
  upazilaSelect.disabled = true;

  if (!divisionId) {
    districtSelect.disabled = true;
    return;
  }

  try {
    const response = await fetch(`/api/locations/districts/${divisionId}`);
    const districts = await response.json();
    districtSelect.innerHTML =
      '<option value="" disabled selected>Select District</option>';
    districts.forEach((dist) => {
      const option = document.createElement("option");
      option.value = dist.district_id;
      option.textContent = dist.district_name;
      districtSelect.appendChild(option);
    });
    districtSelect.disabled = false;
  } catch (error) {
    console.error("Error loading districts:", error);
    showToast("Failed to load districts.", "error");
    districtSelect.disabled = true;
  }
}

async function loadUpazilas(districtId) {
  const upazilaSelect = document.getElementById("upazila");
  upazilaSelect.innerHTML =
    '<option value="" disabled selected>Select Upazila</option>';

  if (!districtId) {
    upazilaSelect.disabled = true;
    return;
  }

  try {
    const response = await fetch(`/api/locations/upazilas/${districtId}`);
    const upazilas = await response.json();
    upazilaSelect.innerHTML =
      '<option value="" disabled selected>Select Upazila</option>';
    upazilas.forEach((upa) => {
      const option = document.createElement("option");
      option.value = upa.upazila_id;
      option.textContent = upa.upazila_name;
      upazilaSelect.appendChild(option);
    });
    upazilaSelect.disabled = false;
  } catch (error) {
    console.error("Error loading upazilas:", error);
    showToast("Failed to load upazilas.", "error");
    upazilaSelect.disabled = true;
  }
}

function setupLocationEventListeners() {
  document.getElementById("division").addEventListener("change", function () {
    loadDistricts(this.value);
  });
  document.getElementById("district").addEventListener("change", function () {
    loadUpazilas(this.value);
  });
}

// ===== STEP NAVIGATION =====
function updateStepper() {
  document.querySelectorAll(".step").forEach((step, i) => {
    const stepNum = i + 1;
    step.classList.remove("active", "completed");
    if (stepNum === currentStep) step.classList.add("active");
    if (stepNum < currentStep) step.classList.add("completed");
  });
  document
    .querySelectorAll(".step-line")
    .forEach((line, i) =>
      line.classList.toggle("completed", i + 1 < currentStep),
    );
}

function showStep(step) {
  document
    .querySelectorAll(".form-section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");
  updateStepper();
}

// ===== STEP 1 VALIDATION =====
async function validatePersonalInfoAndNext() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("gender").value;
  const bloodGroup = document.getElementById("bloodGroup").value;

  const continueBtn = document.querySelector("#step1 .btn-primary");
  const originalText = continueBtn.innerHTML;
  continueBtn.disabled = true;
  continueBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Validating...';

  try {
    const response = await fetch("/api/signup/personal-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, dob, gender, bloodGroup }),
    });
    const result = await response.json();

    if (result.success) {
      showToast("Step completed!", "success");
      currentStep = 2;
      showStep(2);
    } else {
      if (result.errors)
        Object.values(result.errors).forEach((errorMsg) =>
          showToast(errorMsg, "error"),
        );
      else showToast(result.message, "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("An error occurred. Please try again.", "error");
  } finally {
    continueBtn.disabled = false;
    continueBtn.innerHTML = originalText;
  }
}

// ===== STEP 2 VALIDATION =====
async function validateContactInfoAndNext() {
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const division = document.getElementById("division").value;
  const district = document.getElementById("district").value;
  const upazila = document.getElementById("upazila").value;
  const postalCode = document.getElementById("postalCode").value.trim();
  const streetAddress = document.getElementById("streetAddress").value.trim();

  const continueBtn = document.querySelector("#step2 .btn-primary");
  const originalText = continueBtn.innerHTML;
  continueBtn.disabled = true;
  continueBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Validating...';

  try {
    const response = await fetch("/api/signup/contact-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        phone,
        division,
        district,
        upazila,
        postalCode,
        streetAddress,
        bloodGroup,
      }),
    });
    const result = await response.json();

    if (result.success) {
      showToast("Step completed!", "success");
      currentStep = 3;
      showStep(3);
    } else {
      if (result.errors)
        Object.values(result.errors).forEach((errorMsg) =>
          showToast(errorMsg, "error"),
        );
      else showToast(result.message, "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("An error occurred. Please try again.", "error");
  } finally {
    continueBtn.disabled = false;
    continueBtn.innerHTML = originalText;
  }
}

// ===== STEP 3 VALIDATION (PASSWORD) =====
async function validateStep3AndNext() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const hasLength = password.length >= 8 && password.length <= 32;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'\`~]/.test(password);

  if (!hasLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    showToast("Password does not meet requirements", "error");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }

  const continueBtn = document.querySelector("#step3 .btn-primary");
  const originalText = continueBtn.innerHTML;
  continueBtn.disabled = true;
  continueBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Validating...';

  try {
    const response = await fetch("/api/signup/validate-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirmPassword }),
    });
    const result = await response.json();

    if (result.success) {
      showToast("Step completed!", "success");
      currentStep = 4;
      showStep(4);
    } else {
      if (result.errors)
        Object.values(result.errors).forEach((msg) => showToast(msg, "error"));
      else showToast(result.message, "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("An error occurred. Please try again.", "error");
  } finally {
    continueBtn.disabled = false;
    continueBtn.innerHTML = originalText;
  }
}

// ===== PASSWORD STRENGTH & REQUIREMENTS =====
function checkPasswordStrength(password) {
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
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'\`~]/.test(password);

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
}

function updateReqItem(id, met) {
  const el = document.getElementById(id);
  if (el) el.className = met ? "req-item met" : "req-item unmet";
}

// ===== SOCIAL LOGIN BUTTONS =====
document.querySelectorAll(".btn-social").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const provider = button.textContent.trim();
    showToast(`${provider} login feature is coming soon!`, "info");
  });
});

function prevStep(step) {
  currentStep = step;
  showStep(step);
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast-card ${type}`;

  let iconPath =
    type === "success"
      ? '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />'
      : type === "error"
        ? '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />'
        : '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />';

  const title =
    type === "success" ? "Success!" : type === "error" ? "Error!" : "Notice";
  toast.innerHTML = `<div class="toast-icon"><svg viewBox="0 0 24 24">${iconPath}</svg></div><div class="toast-content"><h4>${title}</h4><p>${message}</p></div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== PASSWORD TOGGLE =====
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  const eyeSVG = isPassword
    ? '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>'
    : '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
  btn.querySelector("svg").innerHTML = eyeSVG;
}

// ===== VERIFICATION: SEND EMAIL CODE =====
async function handleSendEmailCode() {
  const btn = document.getElementById("sendEmailCode");
  btn.disabled = true;
  btn.querySelector(".btn-text").textContent = "Sending...";

  try {
    const response = await fetch("/api/signup/send-email-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: document.getElementById("email").value }),
    });
    const result = await response.json();

    if (result.success) {
      showToast(result.message, "success");
      verificationState.email.sent = true;
      document.getElementById("emailOtpGroup").style.display = "block";
      btn.style.display = "none";
      startResendTimer("email", 30);
      document.getElementById("emailTimer").style.display = "none";
    } else {
      showToast(result.message, "error");
      btn.disabled = false;
      btn.querySelector(".btn-text").textContent = "Send Code";
    }
  } catch (error) {
    console.error(error);
    showToast("Failed to send code", "error");
    btn.disabled = false;
    btn.querySelector(".btn-text").textContent = "Send Code";
  }
}

// ===== VERIFICATION: SEND PHONE CODE =====
async function handleSendPhoneCode() {
  const btn = document.getElementById("sendPhoneCode");
  btn.disabled = true;
  btn.querySelector(".btn-text").textContent = "Sending...";

  try {
    const response = await fetch("/api/signup/send-phone-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: document.getElementById("phone").value }),
    });
    const result = await response.json();

    if (result.success) {
      showToast(result.message, "info");
      verificationState.phone.sent = true;
      document.getElementById("phoneOtpGroup").style.display = "block";
      btn.style.display = "none";
      startResendTimer("phone", 30);
      document.getElementById("phoneTimer").style.display = "none";
    } else {
      showToast(result.message, "error");
      btn.disabled = false;
      btn.querySelector(".btn-text").textContent = "Send Code";
    }
  } catch (error) {
    console.error(error);
    showToast("Failed to send code", "error");
    btn.disabled = false;
    btn.querySelector(".btn-text").textContent = "Send Code";
  }
}

// ===== VERIFICATION: VERIFY CODE =====
async function handleVerifyCode(type) {
  const otpGroup = document.getElementById(`${type}OtpGroup`);
  const digits = otpGroup.querySelectorAll(".otp-digit");
  const errorEl = document.getElementById(`${type}OtpError`);

  let otp = "";
  digits.forEach((d) => (otp += d.value));

  if (otp.length !== 6) {
    errorEl.textContent = "Please enter all 6 digits";
    errorEl.style.display = "block";
    return;
  }

  try {
    const endpoint =
      type === "email"
        ? "/api/signup/verify-email"
        : "/api/signup/verify-phone";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });
    const result = await response.json();

    if (result.success) {
      errorEl.style.display = "none";
      verificationState[type].verified = true;

      document.getElementById(`${type}Status`).textContent = "Verified";
      document.getElementById(`${type}Status`).classList.add("verified");
      document.getElementById(`${type}Success`).style.display = "flex";
      otpGroup.style.display = "none";
      digits.forEach((d) => (d.disabled = true));
      document.getElementById(`${type}VerifyCard`).classList.add("verified");
      showToast(result.message, "success");
    } else {
      errorEl.textContent = result.message || "Invalid code";
      errorEl.style.display = "block";
      otpGroup.style.animation = "shake 0.3s ease";
      setTimeout(() => (otpGroup.style.animation = ""), 300);
    }
  } catch (error) {
    console.error(error);
    errorEl.textContent = "Verification failed";
    errorEl.style.display = "block";
  }
}

function handleResendCode(type) {
  if (type === "email") handleSendEmailCode();
  else handleSendPhoneCode();
}

function startResendTimer(type, seconds) {
  const timerEl = document.getElementById(`${type}Timer`);
  timerEl.style.display = "inline";
  let remaining = seconds;
  verificationState[type].timer = setInterval(() => {
    remaining--;
    timerEl.innerHTML = `Resend in <strong>${remaining}s</strong>`;
    if (remaining <= 0) {
      clearInterval(verificationState[type].timer);
      timerEl.style.display = "none";
      const btn = document.getElementById(
        `send${type.charAt(0).toUpperCase() + type.slice(1)}Code`,
      );
      btn.style.display = "inline-flex";
      btn.disabled = false;
    }
  }, 1000);
}

// ===== COMPLETE REGISTRATION =====
async function handleCompleteRegistration() {
  // 1. Check Terms
  const termsAccepted = document.getElementById("termsAccepted").checked;
  if (!termsAccepted) {
    showToast("You must accept the Terms and Conditions", "error");
    return;
  }

  // 2. Check Verification
  if (!verificationState.email.verified || !verificationState.phone.verified) {
    showToast("Please verify both email and phone first", "error");
    return;
  }

  // 3. Prepare Data
  const btn = document.querySelector("#step4 .btn-primary");
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

  const payload = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    dob: document.getElementById("dob").value,
    gender: document.getElementById("gender").value,
    bloodGroup: document.getElementById("bloodGroup").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    division: document.getElementById("division").value,
    district: document.getElementById("district").value,
    upazila: document.getElementById("upazila").value,
    postalCode: document.getElementById("postalCode").value,
    streetAddress: document.getElementById("streetAddress").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch("/api/signup/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (result.success) {
      showToast("Registration successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else {
      showToast(result.message, "error");
    }
  } catch (error) {
    console.error(error);
    showToast("Registration failed", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// ===== OTP INPUT HANDLERS =====
document.addEventListener("DOMContentLoaded", async function () {
  await initLocationDropdowns();

  // Set email/phone display in Step 4
  const email = document.getElementById("email")?.value;
  const phone = document.getElementById("phone")?.value;
  if (email && document.getElementById("emailDisplay"))
    document.getElementById("emailDisplay").textContent = email;
  if (phone && document.getElementById("phoneDisplay"))
    document.getElementById("phoneDisplay").textContent = phone;

  const otpInputs = document.querySelectorAll(".otp-digit");
  otpInputs.forEach((input, index) => {
    input.addEventListener("input", function (e) {
      const value = e.target.value;
      if (!/^\d*$/.test(value)) {
        e.target.value = "";
        return;
      }
      if (value.length === 1 && index < otpInputs.length - 1)
        otpInputs[index + 1].focus();
      if (value.length === 1 && index === otpInputs.length - 1) {
        const target = e.target.dataset.target;
        const otpGroup = document.getElementById(`${target}OtpGroup`);
        const digits = otpGroup.querySelectorAll(".otp-digit");
        let otp = "";
        digits.forEach((d) => (otp += d.value));
        if (otp.length === 6) setTimeout(() => handleVerifyCode(target), 300);
      }
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !e.target.value && index > 0)
        otpInputs[index - 1].focus();
    });
    input.addEventListener("paste", function (e) {
      e.preventDefault();
      const digits = (e.clipboardData || window.clipboardData)
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);
      if (digits.length === 6) {
        const inputs = document.querySelectorAll(
          `.otp-digit[data-target="${e.target.dataset.target}"]`,
        );
        digits.split("").forEach((digit, i) => {
          if (inputs[i]) inputs[i].value = digit;
        });
        setTimeout(() => handleVerifyCode(e.target.dataset.target), 300);
      }
    });
  });
});
