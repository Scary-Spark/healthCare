let currentStep = 1;

// Verification state tracking
const verificationState = {
  email: { sent: false, verified: false, timer: null },
  phone: { sent: false, verified: false, timer: null },
};

// Demo verification codes (REMOVE IN PRODUCTION)
const demoCodes = {
  email: "123456",
  phone: "123456",
};

function updateStepper() {
  document.querySelectorAll(".step").forEach((step, i) => {
    const stepNum = i + 1;
    step.classList.remove("active", "completed");
    if (stepNum === currentStep) step.classList.add("active");
    if (stepNum < currentStep) step.classList.add("completed");
  });

  document.querySelectorAll(".step-line").forEach((line, i) => {
    line.classList.toggle("completed", i + 1 < currentStep);
  });
}

function showStep(step) {
  document
    .querySelectorAll(".form-section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");
  updateStepper();
}

function nextStep(step) {
  // If moving to step 4 (verification), populate email/phone displays
  if (step === 4) {
    const email = document.getElementById("email")?.value;
    const phone = document.getElementById("phone")?.value;

    if (email && document.getElementById("emailDisplay")) {
      document.getElementById("emailDisplay").textContent = email;
    }
    if (phone && document.getElementById("phoneDisplay")) {
      document.getElementById("phoneDisplay").textContent = phone;
    }
  }

  currentStep = step;
  showStep(step);
  showToast(getToastMessage(step - 1));
}

function prevStep(step) {
  currentStep = step;
  showStep(step);
}

function getToastMessage(step) {
  const messages = {
    1: "Personal info saved ✓",
    2: "Contact details saved ✓",
    3: "Account created successfully!",
    4: "Verification step",
  };
  return messages[step] || "";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMessage").textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";

  const eyeSVG = isPassword
    ? '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>'
    : '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';

  btn.querySelector("svg").innerHTML = eyeSVG;
}

function checkPasswordStrength(password) {
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

  let level = 0;
  if (score <= 1) level = 1;
  else if (score <= 2) level = 2;
  else if (score <= 3) level = 3;
  else level = 4;

  const classes = ["weak", "weak", "medium", "strong"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  bars.forEach((bar, i) => {
    bar.className = "strength-bar";
    if (i < level) bar.classList.add(classes[level - 1]);
  });

  text.textContent = labels[level - 1];
  text.style.color =
    level <= 1
      ? "var(--error)"
      : level === 2
        ? "var(--accent-gold)"
        : "var(--success)";
}

// ============================================
// VERIFICATION FUNCTIONS
// ============================================

function sendVerificationCode(type) {
  const btn = document.getElementById(
    `send${type.charAt(0).toUpperCase() + type.slice(1)}Code`,
  );
  const btnText = btn.querySelector(".btn-text");
  const btnLoader = btn.querySelector(".btn-loader");
  const timerEl = document.getElementById(`${type}Timer`);
  const otpGroup = document.getElementById(`${type}OtpGroup`);

  // Show loading
  btnText.style.display = "none";
  btnLoader.style.display = "flex";
  btn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    // Reset button
    btnText.style.display = "inline";
    btnLoader.style.display = "none";

    // Show OTP inputs
    otpGroup.style.display = "block";
    verificationState[type].sent = true;

    // Focus first OTP digit
    const firstDigit = otpGroup.querySelector(".otp-digit");
    if (firstDigit) firstDigit.focus();

    // Start resend timer
    startResendTimer(type, 30);

    showToast(`Verification code sent to ${type}!`, "success");
  }, 1500);
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
      document.getElementById(
        `send${type.charAt(0).toUpperCase() + type.slice(1)}Code`,
      ).disabled = false;
    }
  }, 1000);
}

function resendCode(type) {
  // Clear existing timer
  if (verificationState[type].timer) {
    clearInterval(verificationState[type].timer);
  }

  // Re-send
  sendVerificationCode(type);
  showToast(`New code sent to ${type}!`, "info");
}

function verifyCode(type) {
  const otpGroup = document.getElementById(`${type}OtpGroup`);
  const digits = otpGroup.querySelectorAll(".otp-digit");
  const errorEl = document.getElementById(`${type}OtpError`);

  // Collect OTP value
  let otp = "";
  digits.forEach((d) => (otp += d.value));

  // Validate
  if (otp.length !== 6) {
    errorEl.textContent = "Please enter all 6 digits";
    errorEl.style.display = "block";
    return;
  }

  // Check against demo code
  if (otp === demoCodes[type]) {
    // Success
    errorEl.style.display = "none";

    // Update UI
    document.getElementById(`${type}Status`).textContent = "Verified";
    document.getElementById(`${type}Status`).classList.add("verified");
    document.getElementById(`${type}Success`).style.display = "flex";
    otpGroup.style.display = "none";

    // Disable inputs
    digits.forEach((d) => (d.disabled = true));

    // Mark as verified
    verificationState[type].verified = true;

    // Add verified class to card
    document.getElementById(`${type}VerifyCard`).classList.add("verified");

    showToast(
      `${type.charAt(0).toUpperCase() + type.slice(1)} verified!`,
      "success",
    );
  } else {
    // Error
    errorEl.textContent = "Invalid code. Please try again.";
    errorEl.style.display = "block";

    // Shake animation
    otpGroup.style.animation = "shake 0.3s ease";
    setTimeout(() => (otpGroup.style.animation = ""), 300);

    // Clear inputs
    digits.forEach((d) => (d.value = ""));
    digits[0].focus();
  }
}

function completeSignup() {
  const skipVerification = document.getElementById("skipVerification").checked;

  // If not skipping, check if both are verified
  if (!skipVerification) {
    if (
      !verificationState.email.verified ||
      !verificationState.phone.verified
    ) {
      showToast(
        'Please verify your email and phone, or check "Skip for now"',
        "warning",
      );
      return;
    }
  }

  // Show success overlay
  document.getElementById("successOverlay").classList.add("show");

  // In production: submit form data to backend here
  console.log("Signup complete!", {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    emailVerified: verificationState.email.verified,
    phoneVerified: verificationState.phone.verified,
  });
}

function closeSuccess() {
  document.getElementById("successOverlay").classList.remove("show");
}

// ============================================
// OTP INPUT HANDLERS (Auto-advance & Paste)
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  const otpInputs = document.querySelectorAll(".otp-digit");

  otpInputs.forEach((input, index) => {
    // Auto-advance on input
    input.addEventListener("input", function (e) {
      const value = e.target.value;

      // Only allow numbers
      if (!/^\d*$/.test(value)) {
        e.target.value = "";
        return;
      }

      // Move to next input
      if (value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }

      // Auto-verify when last digit entered
      if (value.length === 1 && index === otpInputs.length - 1) {
        const target = e.target.dataset.target;
        // Small delay to ensure all values are set
        setTimeout(() => verifyCode(target), 100);
      }
    });

    // Handle backspace
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });

    // Handle paste
    input.addEventListener("paste", function (e) {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData("text");
      const digits = paste.replace(/\D/g, "").slice(0, 6);

      if (digits.length === 6) {
        const target = e.target.dataset.target;
        const inputs = document.querySelectorAll(
          `.otp-digit[data-target="${target}"]`,
        );

        digits.split("").forEach((digit, i) => {
          if (inputs[i]) inputs[i].value = digit;
        });

        // Auto-verify
        setTimeout(() => verifyCode(target), 100);
      }
    });
  });
});
