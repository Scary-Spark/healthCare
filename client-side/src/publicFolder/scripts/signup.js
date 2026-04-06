// added
// Bangladesh Location Data (Division → District → Upazila)
const bangladeshLocations = {
  Barisal: {
    Barguna: [
      "Amtali",
      "Bamna",
      "Barguna Sadar",
      "Betagi",
      "Patharghata",
      "Taltali",
    ],
    Barisal: [
      "Agailjhara",
      "Babuganj",
      "Bakerganj",
      "Banaripara",
      "Gaurnadi",
      "Hizla",
      "Barisal Sadar",
      "Mehendiganj",
      "Muladi",
      "Wazirpur",
    ],
    Bhola: [
      "Bhola Sadar",
      "Burhanuddin",
      "Char Fasson",
      "Daulatkhan",
      "Lalmohan",
      "Manpura",
      "Tazumuddin",
    ],
    Jhalokati: ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"],
    Patuakhali: [
      "Bauphal",
      "Dashmina",
      "Galachipa",
      "Kalapara",
      "Mirzaganj",
      "Patuakhali Sadar",
      "Rangabali",
      "Dumki",
    ],
    Pirojpur: [
      "Bhandaria",
      "Kaukhali",
      "Mathbaria",
      "Nazirpur",
      "Nesarabad",
      "Pirojpur Sadar",
      "Indurkani",
    ],
  },
  Chittagong: {
    Bandarban: [
      "Ali Kadam",
      "Bandarban Sadar",
      "Lama",
      "Naikhongchhari",
      "Rowangchhari",
      "Ruma",
      "Thanchi",
    ],
    Brahmanbaria: [
      "Akhaura",
      "Bancharampur",
      "Brahmanbaria Sadar",
      "Kasba",
      "Nabinagar",
      "Nasirnagar",
      "Sarail",
      "Ashuganj",
      "Bijoynagar",
    ],
    Chandpur: [
      "Chandpur Sadar",
      "Faridganj",
      "Haimchar",
      "Haziganj",
      "Kachua",
      "Matlab Dakshin",
      "Matlab Uttar",
      "Shahrasti",
    ],
    Chittagong: [
      "Anwara",
      "Banshkhali",
      "Boalkhali",
      "Chandanaish",
      "Fatikchhari",
      "Hathazari",
      "Lohagara",
      "Mirsharai",
      "Patiya",
      "Rangunia",
      "Raozan",
      "Sandwip",
      "Satkania",
      "Sitakunda",
      "Chittagong Port",
    ],
    Comilla: [
      "Barura",
      "Brahmanpara",
      "Burichang",
      "Chandina",
      "Chauddagram",
      "Daudkandi",
      "Debidwar",
      "Homna",
      "Laksam",
      "Muradnagar",
      "Nangalkot",
      "Comilla Sadar",
      "Meghna",
      "Monohargonj",
      "Sadarsouth",
      "Titas",
      "Comilla Adarsha Sadar",
    ],
    "Cox's Bazar": [
      "Chakaria",
      "Cox's Bazar Sadar",
      "Kutubdia",
      "Maheshkhali",
      "Ramu",
      "Teknaf",
      "Ukhia",
      "Pekua",
    ],
    Feni: [
      "Chhagalnaiya",
      "Daganbhuiyan",
      "Feni Sadar",
      "Parshuram",
      "Sonagazi",
      "Fulgazi",
    ],
    Khagrachhari: [
      "Dighinala",
      "Khagrachhari Sadar",
      "Lakshmichhari",
      "Mahalchhari",
      "Manikchhari",
      "Matiranga",
      "Panchhari",
      "Ramgarh",
      "Guimara",
    ],
    Lakshmipur: [
      "Lakshmipur Sadar",
      "Raipur",
      "Ramganj",
      "Ramgati",
      "Kamalnagar",
    ],
    Noakhali: [
      "Begumganj",
      "Noakhali Sadar",
      "Chatkhil",
      "Companiganj",
      "Hatiya",
      "Senbagh",
      "Sonaimuri",
      "Subarnachar",
      "Kabirhat",
    ],
    Rangamati: [
      "Bagaichhari",
      "Barkal",
      "Kawkhali",
      "Belaichhari",
      "Kaptai",
      "Juraichhari",
      "Langadu",
      "Naniarchar",
      "Rajasthali",
      "Rangamati Sadar",
    ],
  },
  Dhaka: {
    Dhaka: [
      "Dhamrai",
      "Dohar",
      "Keraniganj",
      "Nawabganj",
      "Savar",
      "Dhaka Sadar",
    ],
    Faridpur: [
      "Alfadanga",
      "Bhanga",
      "Boalmari",
      "Charbhadrasan",
      "Faridpur Sadar",
      "Madhukhali",
      "Nagarkanda",
      "Sadarpur",
      "Saltha",
    ],
    Gazipur: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
    Gopalganj: [
      "Gopalganj Sadar",
      "Kashiani",
      "Kotalipara",
      "Muksudpur",
      "Tungipara",
    ],
    Kishoreganj: [
      "Austagram",
      "Bajitpur",
      "Bhairab",
      "Hossainpur",
      "Itna",
      "Karimganj",
      "Katiadi",
      "Kishoreganj Sadar",
      "Kuliarchar",
      "Mithamain",
      "Nikli",
      "Pakundia",
      "Tarail",
    ],
    Madaripur: ["Rajoir", "Madaripur Sadar", "Kalkini", "Shibchar"],
    Manikganj: [
      "Manikganj Sadar",
      "Singair",
      "Shibalaya",
      "Saturia",
      "Harirampur",
      "Ghior",
      "Daulatpur",
    ],
    Munshiganj: [
      "Lohajang",
      "Sreenagar",
      "Munshiganj Sadar",
      "Sirajdikhan",
      "Tongibari",
      "Gazaria",
    ],
    Narayanganj: [
      "Araihazar",
      "Bandar",
      "Narayanganj Sadar",
      "Rupganj",
      "Sonargaon",
      "Siddhirganj",
    ],
    Narsingdi: [
      "Belabo",
      "Monohardi",
      "Narsingdi Sadar",
      "Palash",
      "Raipura",
      "Shibpur",
    ],
    Rajbari: [
      "Baliakandi",
      "Goalandaghat",
      "Pangsha",
      "Rajbari Sadar",
      "Kalukhali",
    ],
    Shariatpur: [
      "Bhedarganj",
      "Damudya",
      "Gosairhat",
      "Naria",
      "Shariatpur Sadar",
      "Zanjira",
      "Shakhipur",
    ],
    Tangail: [
      "Basail",
      "Bhuapur",
      "Delduar",
      "Ghatail",
      "Gopalpur",
      "Kalihati",
      "Madhupur",
      "Mirzapur",
      "Nagarpur",
      "Sakhipur",
      "Tangail Sadar",
      "Dhanbari",
    ],
  },
  Khulna: {
    Bagerhat: [
      "Bagerhat Sadar",
      "Chitalmari",
      "Fakirhat",
      "Kachua",
      "Mollahat",
      "Mongla",
      "Morrelganj",
      "Rampal",
      "Sarankhola",
    ],
    Chuadanga: ["Alamdanga", "Chuadanga Sadar", "Damurhuda", "Jibannagar"],
    Jessore: [
      "Abhaynagar",
      "Bagherpara",
      "Chaugachha",
      "Jhikargachha",
      "Keshabpur",
      "Jessore Sadar",
      "Manirampur",
      "Sharsha",
    ],
    Jhenaidah: [
      "Harinakunda",
      "Jhenaidah Sadar",
      "Kaliganj",
      "Kotchandpur",
      "Maheshpur",
      "Shailkupa",
    ],
    Khulna: [
      "Batiaghata",
      "Dacope",
      "Dumuria",
      "Digholia",
      "Koyra",
      "Paikgachha",
      "Phultala",
      "Rupsa",
      "Terokhada",
      "Daulatpur",
      "Khalishpur",
      "Khan Jahan Ali",
      "Kotwali",
      "Sonadanga",
      "Harintana",
    ],
    Kushtia: [
      "Bheramara",
      "Daulatpur",
      "Khoksa",
      "Kumarkhali",
      "Kushtia Sadar",
      "Mirpur",
    ],
    Magura: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
    Meherpur: ["Gangni", "Meherpur Sadar", "Mujibnagar"],
    Narail: ["Kalia", "Lohagara", "Narail Sadar"],
    Satkhira: [
      "Assasuni",
      "Debhata",
      "Kalaroa",
      "Kaliganj",
      "Satkhira Sadar",
      "Shyamnagar",
      "Tala",
    ],
  },
  Mymensingh: {
    Jamalpur: [
      "Baksiganj",
      "Dewanganj",
      "Islampur",
      "Jamalpur Sadar",
      "Madarganj",
      "Melandaha",
      "Sarishabari",
    ],
    Mymensingh: [
      "Bhaluka",
      "Trishal",
      "Haluaghat",
      "Muktagachha",
      "Dhobaura",
      "Fulbaria",
      "Gaffargaon",
      "Gauripur",
      "Ishwarganj",
      "Mymensingh Sadar",
      "Nandail",
      "Phulpur",
    ],
    Netrokona: [
      "Atpara",
      "Barhatta",
      "Durgapur",
      "Kalmakanda",
      "Kendua",
      "Khaliajuri",
      "Madan",
      "Mohanganj",
      "Netrokona Sadar",
      "Purbadhala",
    ],
    Sherpur: [
      "Jhenaigati",
      "Nakla",
      "Nalitabari",
      "Sherpur Sadar",
      "Sreebardi",
    ],
  },
  Rajshahi: {
    Bogra: [
      "Adamdighi",
      "Bogra Sadar",
      "Sherpur",
      "Dhunat",
      "Dhupchanchia",
      "Gabtali",
      "Kahaloo",
      "Nandigram",
      "Sariakandi",
      "Shajahanpur",
      "Shibganj",
      "Sonatala",
    ],
    Joypurhat: ["Akkelpur", "Joypurhat Sadar", "Kalai", "Khetlal", "Panchbibi"],
    Naogaon: [
      "Atrai",
      "Badalgachhi",
      "Manda",
      "Dhamoirhat",
      "Mohadevpur",
      "Naogaon Sadar",
      "Niamatpur",
      "Patnitala",
      "Porsha",
      "Raninagar",
      "Sapahar",
    ],
    Natore: [
      "Bagatipara",
      "Baraigram",
      "Gurudaspur",
      "Lalpur",
      "Natore Sadar",
      "Singra",
      "Naldanga",
    ],
    Chapainawabganj: [
      "Bholahat",
      "Gomastapur",
      "Nachole",
      "Chapainawabganj Sadar",
      "Shibganj",
    ],
    Pabna: [
      "Atgharia",
      "Bera",
      "Bhangura",
      "Chatmohar",
      "Faridpur",
      "Ishwardi",
      "Pabna Sadar",
      "Santhia",
      "Sujanagar",
    ],
    Rajshahi: [
      "Bagha",
      "Bagmara",
      "Charghat",
      "Durgapur",
      "Godagari",
      "Mohanpur",
      "Paba",
      "Puthia",
      "Tanore",
      "Rajshahi Sadar",
    ],
    Sirajganj: [
      "Belkuchi",
      "Chauhali",
      "Kamarkhanda",
      "Kazipur",
      "Raiganj",
      "Shahjadpur",
      "Sirajganj Sadar",
      "Tarash",
      "Ullahpara",
    ],
  },
  Rangpur: {
    Dinajpur: [
      "Birampur",
      "Birganj",
      "Biral",
      "Bochaganj",
      "Chirirbandar",
      "Phulbari",
      "Ghoraghat",
      "Hakimpur",
      "Kaharole",
      "Khansama",
      "Dinajpur Sadar",
      "Nawabganj",
      "Parbatipur",
    ],
    Gaibandha: [
      "Fulchhari",
      "Gaibandha Sadar",
      "Gobindaganj",
      "Palashbari",
      "Sadullapur",
      "Saghata",
      "Sundarganj",
    ],
    Kurigram: [
      "Bhurungamari",
      "Char Rajibpur",
      "Chilmari",
      "Phulbari",
      "Kurigram Sadar",
      "Nageshwari",
      "Rajarhat",
      "Raomari",
      "Ulipur",
    ],
    Lalmonirhat: [
      "Aditmari",
      "Hatibandha",
      "Kaliganj",
      "Lalmonirhat Sadar",
      "Patgram",
    ],
    Nilphamari: [
      "Dimla",
      "Domar",
      "Jaldhaka",
      "Kishoreganj",
      "Nilphamari Sadar",
      "Saidpur",
    ],
    Panchagarh: ["Atwari", "Boda", "Debiganj", "Panchagarh Sadar", "Tetulia"],
    Rangpur: [
      "Badarganj",
      "Gangachara",
      "Kaunia",
      "Rangpur Sadar",
      "Mithapukur",
      "Pirgachha",
      "Pirganj",
      "Taraganj",
    ],
    Thakurgaon: [
      "Baliadangi",
      "Haripur",
      "Pirganj",
      "Ranisankail",
      "Thakurgaon Sadar",
    ],
  },
  Sylhet: {
    Habiganj: [
      "Ajmiriganj",
      "Baniachong",
      "Bahubal",
      "Chunarughat",
      "Habiganj Sadar",
      "Lakhai",
      "Madhabpur",
      "Nabiganj",
      "Shaistagonj",
    ],
    Moulvibazar: [
      "Barlekha",
      "Juri",
      "Kamalganj",
      "Kulaura",
      "Moulvibazar Sadar",
      "Rajnagar",
      "Sreemangal",
    ],
    Sunamganj: [
      "Bishwamvarpur",
      "Chhatak",
      "Derai",
      "Dharamapasha",
      "Dowarabazar",
      "Jagannathpur",
      "Jamalganj",
      "Sulla",
      "Sunamganj Sadar",
      "Shanthiganj",
      "Tahirpur",
    ],
    Sylhet: [
      "Balaganj",
      "Beanibazar",
      "Bishwanath",
      "Companiganj",
      "Fenchuganj",
      "Golapganj",
      "Gowainghat",
      "Jaintiapur",
      "Kanaighat",
      "Sylhet Sadar",
      "Zakiganj",
      "Dakshinsurma",
      "Osmaninagar",
    ],
  },
};

// Get all divisions sorted alphabetically
const divisions = Object.keys(bangladeshLocations).sort();

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

// ============================================
// LOCATION CASCADE FUNCTIONS
// ============================================

function populateDivisions() {
  const divisionSelect = document.getElementById("division");
  if (!divisionSelect) return;

  // Clear existing options except the first one
  divisionSelect.innerHTML =
    '<option value="" disabled selected>Select Division</option>';

  // Add divisions in alphabetical order
  divisions.forEach((division) => {
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

  // Reset district and upazila
  districtSelect.innerHTML =
    '<option value="" disabled selected>Select District</option>';
  upazilaSelect.innerHTML =
    '<option value="" disabled selected>Select Upazila</option>';
  upazilaSelect.disabled = true;

  if (!division || !bangladeshLocations[division]) {
    districtSelect.disabled = true;
    return;
  }

  // Get districts for this division and sort them
  const districts = Object.keys(bangladeshLocations[division]).sort();

  // Add districts
  districts.forEach((district) => {
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

  // Reset upazila
  upazilaSelect.innerHTML =
    '<option value="" disabled selected>Select Upazila</option>';

  if (!division || !district || !bangladeshLocations[division][district]) {
    upazilaSelect.disabled = true;
    return;
  }

  // Get upazilas for this district and sort them
  const upazilas = [...bangladeshLocations[division][district]].sort();

  // Add upazilas
  upazilas.forEach((upazila) => {
    const option = document.createElement("option");
    option.value = upazila;
    option.textContent = upazila;
    upazilaSelect.appendChild(option);
  });

  upazilaSelect.disabled = false;
}

// Event Listeners for Location Cascade
document.addEventListener("DOMContentLoaded", function () {
  // Populate divisions on page load
  populateDivisions();

  const divisionSelect = document.getElementById("division");
  const districtSelect = document.getElementById("district");

  // When division changes
  if (divisionSelect) {
    divisionSelect.addEventListener("change", function () {
      const selectedDivision = this.value;
      populateDistricts(selectedDivision);
    });
  }

  // When district changes
  if (districtSelect) {
    districtSelect.addEventListener("change", function () {
      const selectedDivision = document.getElementById("division").value;
      const selectedDistrict = this.value;
      populateUpazilas(selectedDivision, selectedDistrict);
    });
  }
});
