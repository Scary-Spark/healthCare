/**
 * APPOINTMENT BOOKING - FIXED
 * - Doctor selection: Auto-adjust date if needed
 * - Show available days on card (no hover)
 * - Time slots: 8 AM to 8 PM, 1-hour intervals
 */

document.addEventListener("DOMContentLoaded", function () {
  async function loadUserProfile() {
    try {
      const response = await fetch("/api/appointments/profile");
      const result = await response.json();

      if (result.success && result.data) {
        const profile = result.data;

        // ✅ Populate "For Myself" tab with real user data
        const selfTab = document.getElementById("tab-self");
        if (selfTab) {
          const infoRows = selfTab.querySelectorAll(".info-row");

          // Name (first row)
          if (infoRows[0]) {
            const nameEl = infoRows[0].querySelector(".info-value");
            if (nameEl) nameEl.textContent = profile.fullName || "User";
          }

          // Contact/Phone (second row)
          if (infoRows[1]) {
            const contactEl = infoRows[1].querySelector(".info-value");
            if (contactEl) contactEl.textContent = profile.phone || "Not set";
          }

          // Email (third row)
          if (infoRows[2]) {
            const emailEl = infoRows[2].querySelector(".info-value");
            if (emailEl) emailEl.textContent = profile.email || "Not set";
          }

          // ✅ Address (fourth row) - FIXED SELECTOR + FALLBACK
          if (infoRows[3]) {
            const addressEl = infoRows[3].querySelector(".info-value");
            if (addressEl) {
              // Show concatenated address or fallback
              addressEl.textContent = profile.address || "Address not set";
              console.log(
                "✅ Address updated:",
                profile.address || "Address not set",
              );
            }
          }
        }

        // ✅ Pre-fill applicant info in "For Someone Else" tab
        const otherTab = document.getElementById("tab-other");
        if (otherTab) {
          const applicantSections = otherTab.querySelectorAll(".sub-section");

          // Applicant name
          if (applicantSections[0]) {
            const applicantName =
              applicantSections[0].querySelector(".info-value");
            if (applicantName)
              applicantName.textContent = profile.fullName || "User";
          }

          // Applicant contact
          if (applicantSections[0]) {
            const applicantInfoRows =
              applicantSections[0].querySelectorAll(".info-row");
            if (applicantInfoRows[1]) {
              const applicantContact =
                applicantInfoRows[1].querySelector(".info-value");
              if (applicantContact)
                applicantContact.textContent = profile.phone || "Not set";
            }
          }

          // ✅ Pre-fill patient address field (editable) - with fallback
          if (profile.address) {
            otherAddressInput.value = profile.address;
          } else {
            // Optional: Set default if no address in DB
            otherAddressInput.value = "Address not set";
          }
        }

        // ✅ Store for summary panel
        window.currentUserProfile = profile;
        updateSummary();

        console.log("✅ Profile loaded via API:", profile);
        return profile;
      }
      return null;
    } catch (error) {
      console.error("❌ Failed to load profile via API:", error);
      return null;
    }
  }

  async function loadDepartments() {
    const deptSelect = document.getElementById("department");
    // console.log("🔄 loadDepartments() called");

    try {
      // console.log("🌐 Fetching /api/appointments/departments...");
      const response = await fetch("/api/appointments/departments");

      // console.log("📡 Response status:", response.status);
      // console.log("📡 Response OK?", response.ok);

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      const result = await response.json();
      // console.log("📦 API result:", result);
      // console.log("🔍 result.success:", result.success);
      // console.log("🔍 result.data:", result.data);
      // console.log("🔍 result.data?.length:", result.data?.length);

      if (result.success && result.data && result.data.length > 0) {
        // console.log(`✅ Loading ${result.data.length} departments`);

        // Keep "Choose Department" option
        deptSelect.innerHTML = '<option value="">Choose Department</option>';

        result.data.forEach((dept, index) => {
          // console.log(
          //   `  [${index}] Adding: ${dept.department_name} (ID: ${dept.department_id})`,
          // );
          const option = document.createElement("option");
          option.value = dept.department_name.toLowerCase();
          option.textContent = dept.department_name;
          option.dataset.deptId = dept.department_id;
          deptSelect.appendChild(option);
        });

        // console.log("✅ Departments loaded successfully");
        // console.log(
        //   "📋 Dropdown now has",
        //   deptSelect.options.length,
        //   "options",
        // );
      } else {
        console.warn("⚠️ No departments in response");
        console.warn("  result.success:", result.success);
        console.warn("  result.data:", result.data);
      }
    } catch (error) {
      console.error("❌ Failed to load departments:", error);
      console.error("  Error name:", error.name);
      console.error("  Error message:", error.message);
      console.error("  Error stack:", error.stack);
    }
  }

  // ===== MOCK DATA =====
  const today = new Date();
  const getFutureDate = (daysOffset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split("T")[0];
  };

  const departments = {
    cardiology: "Cardiology",
    neurology: "Neurology",
    orthopedics: "Orthopedics",
    pediatrics: "Pediatrics",
    general: "General Medicine",
  };

  let doctors = [];

  async function loadDoctors() {
    try {
      const response = await fetch("/api/appointments/doctors");
      const result = await response.json();
      if (result.success) {
        doctors = result.data; // ← Real doctors from DB in mock format
        console.log(`✅ Loaded ${doctors.length} doctors from database`);
      }
    } catch (error) {
      console.error("❌ Failed to load doctors:", error);
    }
  }

  // Generate all possible time slots (8 AM to 8 PM)
  const ALL_TIME_SLOTS = [];
  for (let hour = 8; hour <= 20; hour++) {
    const h = hour.toString().padStart(2, "0");
    ALL_TIME_SLOTS.push(`${h}:00`);
  }

  // Format time for display (24h → 12h AM/PM)
  function formatTime(time24) {
    const [hours, minutes] = time24.split(":");
    let h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minutes} ${ampm}`;
  }

  // Format date for display
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Get day name from date string
  function getDayName(dateStr) {
    const date = new Date(dateStr);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  }

  // DOM Elements
  const deptSelect = document.getElementById("department");
  const dateInput = document.getElementById("appointmentDate");
  const doctorSearch = document.getElementById("doctorSearch");
  const doctorGrid = document.getElementById("doctorGrid");
  const timeSlotsSection = document.getElementById("timeSlotsSection");
  const timeSlotsGrid = document.getElementById("timeSlotsGrid");
  const selectedDoctorIdInput = document.getElementById("selectedDoctorId");
  const selectedTimeInput = document.getElementById("selectedTime");
  const otherAddressInput = document.getElementById("o_address");
  const pillTabs = document.querySelectorAll(".pill");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const confirmBtn = document.getElementById("confirmBtn");
  const progressSteps = document.querySelectorAll(".progress-step");

  // Set date range: Today to 2 months from now
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);
  dateInput.min = minDate.toISOString().split("T")[0];

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);
  dateInput.max = maxDate.toISOString().split("T")[0];

  // ===== FADE-IN ON SCROLL =====
  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    document
      .querySelectorAll(".animate-on-scroll, .doctor-card, .empty-state")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  // Progress Tracker
  function updateProgress() {
    const step1 = deptSelect.value && dateInput.value;
    const step2 = selectedDoctorIdInput.value && selectedTimeInput.value;
    const step3 =
      document.querySelector(".pill.active").dataset.tab === "self" ||
      (document.getElementById("o_fname").value &&
        document.getElementById("o_phone").value);

    progressSteps[0].classList.toggle("active", true);
    progressSteps[1].classList.toggle("active", step1 || step2);
    progressSteps[2].classList.toggle("active", step1 && step2 && step3);
  }

  function renderTimeSlots(doctor, selectedDate) {
    timeSlotsGrid.innerHTML = "";

    const availableSlots = doctor.timeSlots;

    if (availableSlots.length === 0) {
      timeSlotsGrid.innerHTML =
        '<p style="color: var(--text-light); font-size: 0.85rem;">No slots available</p>';
      return;
    }

    availableSlots.forEach((slot, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "time-slot-btn";
      btn.textContent = formatTime(slot);
      btn.dataset.time = slot;

      btn.dataset.scheduleId = doctor.slot_id || null;

      btn.style.transitionDelay = `${index * 0.03}s`;

      if (selectedTimeInput.value === slot) {
        btn.classList.add("selected");
      }

      btn.addEventListener("click", () => {
        timeSlotsGrid
          .querySelectorAll(".time-slot-btn")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedTimeInput.value = slot;

        // Store the scheduleId for booking
        if (btn.dataset.scheduleId) {
          window.selectedScheduleId = btn.dataset.scheduleId;
        }

        updateSummary();
        updateProgress();
        showToast(`Time selected: ${formatTime(slot)}`, "success");
      });

      timeSlotsGrid.appendChild(btn);
      setTimeout(() => btn.classList.add("animate-in"), 50);
    });

    timeSlotsSection.hidden = false;
  }

  // Render Doctor Grid - FIXED: Show days on card, allow any selection
  function renderDoctors() {
    const dept = deptSelect.value;
    const date = dateInput.value;
    const search = doctorSearch.value.toLowerCase().trim();

    let filtered = [...doctors];
    if (dept) filtered = filtered.filter((d) => d.dept === dept);
    // Remove date filter from grid rendering - show all doctors
    if (search)
      filtered = filtered.filter((d) => d.name.toLowerCase().includes(search));

    doctorGrid.innerHTML = "";

    if (filtered.length === 0) {
      doctorGrid.innerHTML = `<div class="empty-state"><i class="fa-regular fa-face-frown"></i><p>No specialists match your search</p></div>`;
      timeSlotsSection.hidden = true;
      return;
    }

    filtered.forEach((doc, index) => {
      const card = document.createElement("div");
      card.className = `doctor-card ${selectedDoctorIdInput.value === doc.id ? "selected" : ""}`;
      card.dataset.docId = doc.id;
      // card.style.transitionDelay = `${index * 0.05}s`;

      // Show available days on card
      const daysDisplay = doc.availableDays.slice(0, 3).join(", ");

      // Check if doctor is available on selected date (for status badge only)
      const selectedDayName = date ? getDayName(date) : null; // e.g., "Wed"
      const isAvailableOnDate =
        date && selectedDayName && doc.availableDays.includes(selectedDayName);
      const statusClass = date ? (isAvailableOnDate ? "" : "unavailable") : "";
      const statusText = date
        ? isAvailableOnDate
          ? "Available"
          : "Different dates"
        : "Select date";

      // Simplified card - NO HOVER CARD
      const avatarHtml = doc.profile_pic_path
        ? `<img src="${doc.profile_pic_path}" class="doc-avatar" style="object-fit:cover; padding:0; background:#fff;">`
        : `<div class="doc-avatar">${doc.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()}</div>`;

      card.innerHTML = `
        ${avatarHtml}
        <div class="doc-name">${doc.name}</div>
        <div class="doc-dept">${doc.specialization_name || doc.department_name || doc.dept}</div>
        <div class="doc-days"><i class="fa-regular fa-calendar"></i> ${doc.availableDays.slice(0, 3).join(", ")}</div>
        <span class="doc-status ${statusClass}">${statusText}</span>
      `;

      // Click to select doctor - FIXED: Always allow selection
      card.addEventListener("click", () => {
        selectDoctor(doc);
        // Render time slots
        if (dateInput.value) {
          renderTimeSlots(doc, dateInput.value);
        }
      });

      doctorGrid.appendChild(card);
      setTimeout(() => card.classList.add("animate-in"), 50);
    });
  }

  // Select Doctor - FIXED: Auto-adjust date if needed
  function selectDoctor(doc) {
    console.log("👆 selectDoctor called for:", doc.name);
    console.log("📋 Doctor availableDays:", doc.availableDays);

    selectedDoctorIdInput.value = doc.id;
    deptSelect.value = doc.dept;

    // ✅ ALWAYS AUTO-PICK DATE (remove the !dateInput.value check)
    if (doc.availableDays && doc.availableDays.length > 0) {
      console.log("🔍 Auto-picking date based on doctor's availability...");

      const daysMap = {
        sunday: 0,
        sun: 0,
        monday: 1,
        mon: 1,
        tuesday: 2,
        tue: 2,
        wednesday: 3,
        wed: 3,
        thursday: 4,
        thu: 4,
        friday: 5,
        fri: 5,
        saturday: 6,
        sat: 6,
      };

      const today = new Date();
      const currentDayIndex = today.getDay();

      let minDaysUntil = Infinity;
      let bestDate = null;

      doc.availableDays.forEach((dayName) => {
        const dayNameLower = dayName.toLowerCase();
        const targetIndex = daysMap[dayNameLower];

        if (targetIndex === undefined) return;

        let daysUntil = targetIndex - currentDayIndex;
        if (daysUntil < 0) daysUntil += 7;

        if (daysUntil < minDaysUntil) {
          minDaysUntil = daysUntil;
          const nextDate = new Date(today);
          nextDate.setDate(today.getDate() + daysUntil);
          bestDate = nextDate.toISOString().split("T")[0];
        }
      });

      if (bestDate) {
        console.log(`✅ Auto-picked date: ${bestDate}`);
        dateInput.value = bestDate;

        // Optional: Show toast notification
        showToast(`📅 Auto-selected: ${formatDate(bestDate)}`, "success");
      }
    } else {
      console.warn("⚠️ No available days for this doctor");
    }

    // Update UI selection
    document
      .querySelectorAll(".doctor-card")
      .forEach((c) => c.classList.remove("selected"));
    const selectedCard = doctorGrid.querySelector(`[data-doc-id="${doc.id}"]`);
    if (selectedCard) selectedCard.classList.add("selected");

    // Render time slots if date is set
    if (dateInput.value) {
      renderTimeSlots(doc);
    }

    updateSummary();
    updateProgress();
    showToast(`Selected: ${doc.name}`, "success");
  }

  // Update Summary Panel
  function updateSummary() {
    const selectedDeptOption = deptSelect.options[deptSelect.selectedIndex];
    document.getElementById("sum-dept").textContent =
      selectedDeptOption?.text && selectedDeptOption.value
        ? selectedDeptOption.text
        : "--";
    document.getElementById("sum-date").textContent = dateInput.value
      ? formatDate(dateInput.value)
      : "--";
    document.getElementById("sum-time").textContent = selectedTimeInput.value
      ? formatTime(selectedTimeInput.value)
      : "--";

    const doc = doctors.find((d) => d.id === selectedDoctorIdInput.value);

    // Update specialist name
    document.getElementById("sum-doctor").textContent = doc ? doc.name : "--";

    // ADD THIS: Update specialization name
    const specElement = document.getElementById("sum-specialization");
    if (specElement) {
      specElement.textContent =
        doc?.specialization_name || doc?.department_name || "--";
    }

    // In updateSummary(), replace this section:
    const activeTab = document.querySelector(".pill.active").dataset.tab;
    let patientName = "--";

    if (activeTab === "self") {
      // ✅ Use real user name from API-loaded profile
      const userName = window.currentUserProfile?.fullName || "Current User";
      patientName = `${userName} (Self)`;
    } else {
      const fname = document.getElementById("o_fname").value.trim();
      const lname = document.getElementById("o_lname").value.trim();
      if (fname || lname) patientName = `${fname} ${lname}`.trim();
    }

    document.getElementById("sum-patient").textContent = patientName;
  }

  // Tab Switching
  pillTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      pillTabs.forEach((b) => b.classList.remove("active"));
      tabPanes.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
      updateSummary();

      if (btn.dataset.tab === "other" && !otherAddressInput.value) {
        otherAddressInput.value =
          "45 Hospital Road, Motihar, Rajshahi 6000, Bangladesh";
      }
    });
  });

  // Event Listeners
  deptSelect.addEventListener("change", () => {
    renderDoctors();
    updateProgress();
    updateSummary();
    timeSlotsSection.hidden = true;
  });

  dateInput.addEventListener("change", () => {
    renderDoctors();
    updateProgress();
    updateSummary();

    // Re-render time slots if doctor is selected
    if (selectedDoctorIdInput.value) {
      const doc = doctors.find((d) => d.id === selectedDoctorIdInput.value);
      if (doc) {
        renderTimeSlots(doc, dateInput.value);
      }
    }
  });

  doctorSearch.addEventListener("input", renderDoctors);

  ["o_fname", "o_lname"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", updateSummary);
  });

  confirmBtn.addEventListener("click", async () => {
    if (!selectedDoctorIdInput.value) {
      showToast("Please select a specialist.", "warning");
      return;
    }
    if (!dateInput.value || !deptSelect.value) {
      showToast("Please ensure department and date are filled.", "warning");
      return;
    }
    if (!selectedTimeInput.value) {
      showToast("Please select a time slot.", "warning");
      return;
    }

    const activeTab = document.querySelector(".pill.active").dataset.tab;

    if (activeTab === "other") {
      const fname = document.getElementById("o_fname").value.trim();
      const lname = document.getElementById("o_lname").value.trim();
      const phone = document.getElementById("o_phone").value.trim();
      const address = document.getElementById("o_address").value.trim();

      if (!fname || !lname || !phone || !address) {
        showToast(
          "First name, last name, contact number, and address are required.",
          "warning",
        );
        return;
      }
    }

    const selectedDoctor = doctors.find(
      (d) => d.id === selectedDoctorIdInput.value,
    );

    const bookingData = {
      personId: window.currentPersonId,

      doctorId: parseInt(selectedDoctorIdInput.value.replace("d", "")),

      departmentId:
        deptSelect.options[deptSelect.selectedIndex]?.dataset.deptId,
      specializationId: selectedDoctor?.specialization_id,

      scheduleId: window.selectedScheduleId || selectedDoctor?.slot_id,

      preferredDate: dateInput.value,

      bookingType: activeTab === "self" ? 1 : 2,

      patientInfo:
        activeTab === "other"
          ? {
              firstName: document.getElementById("o_fname").value.trim(),
              lastName: document.getElementById("o_lname").value.trim(),
              contactNumber: document.getElementById("o_phone").value.trim(),
              email: document.getElementById("o_email").value.trim() || null, 
              address: document.getElementById("o_address").value.trim(),
            }
          : null,

      reasonForVisit: document.getElementById("symptoms").value.trim() || null,
    };

    if (!bookingData.scheduleId) {
      showToast(
        "Could not determine time slot. Please select a time again.",
        "warning",
      );
      return;
    }

    console.log("📋 Booking ", bookingData);

    const originalBtnText = confirmBtn.innerHTML;
    confirmBtn.innerHTML =
      '<i class="fa-solid fa-circle-notch fa-spin"></i> Booking...';
    confirmBtn.disabled = true;

    try {
      const response = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success) {
        showToast(
          `Appointment booked! ID: #${result.data?.appointmentId || "N/A"}`,
          "success",
        );

        // Optional: Reset form after success
        setTimeout(() => {
          selectedDoctorIdInput.value = "";
          selectedTimeInput.value = "";
          window.selectedScheduleId = null;
          document.getElementById("symptoms").value = "";
          if (activeTab === "other") {
            document.getElementById("o_fname").value = "";
            document.getElementById("o_lname").value = "";
            document.getElementById("o_phone").value = "";
            document.getElementById("o_email").value = "";
            document.getElementById("o_address").value = "";
          }
          renderDoctors(); 
          updateSummary();
        }, 2000);
      } else {
        showToast(
          result.message || "Booking failed. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("❌ Booking error:", error);
      showToast("Network error. Please check your connection.", "error");
    } finally {
      // restore button state
      confirmBtn.innerHTML = originalBtnText;
      confirmBtn.disabled = false;
    }
  });

  function showToast(message, type = "success") {
    const existing = document.getElementById("apptToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "apptToast";
    toast.innerHTML = `
      <div class="toast-icon"><i class="fa-solid fa-${type === "success" ? "circle-check" : "triangle-exclamation"}"></i></div>
      <div class="toast-content">${message}</div>
      <button class="toast-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
    `;

    toast.style.cssText = `
      position:fixed;bottom:24px;right:24px;background:var(--card-bg);color:var(--text-dark);
      padding:14px 20px;border-radius:var(--radius-md);box-shadow:var(--shadow-lg);
      border-left:4px solid ${type === "success" ? "var(--primary)" : "var(--accent-orange)"};
      display:flex;align-items:center;gap:12px;z-index:3000;max-width:360px;
      animation:slideInRight 0.3s ease,fadeOut 0.3s ease 2.7s forwards;
    `;

    document.body.appendChild(toast);

    toast.querySelector(".toast-close")?.addEventListener("click", () => {
      toast.style.animation = "fadeOut 0.3s ease forwards";
      setTimeout(() => toast.remove(), 300);
    });

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3000);

    if (!document.getElementById("toastAnims")) {
      const style = document.createElement("style");
      style.id = "toastAnims";
      style.textContent = `
        @keyframes slideInRight{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes fadeOut{from{opacity:1}to{opacity:0}}
      `;
      document.head.appendChild(style);
    }
  }

  async function init() {
    await loadDepartments();
    await loadUserProfile();
    await loadDoctors();

    initScrollAnimations();
    renderDoctors();
    updateProgress();
    updateSummary();
  }

  init();
});
