/**
 * APPOINTMENT BOOKING - FIXED
 * - Doctor selection: Auto-adjust date if needed
 * - Show available days on card (no hover)
 * - Time slots: 8 AM to 8 PM, 1-hour intervals
 */

document.addEventListener("DOMContentLoaded", function () {
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

  const doctors = [
    {
      id: "d1",
      name: "Dr. Sarah Jenkins",
      dept: "cardiology",
      availableDates: [getFutureDate(3), getFutureDate(5), getFutureDate(10)],
      availableDays: ["Mon", "Tue", "Thu", "Fri"],
      timeSlots: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "14:00",
        "15:00",
        "16:00",
      ],
    },
    {
      id: "d2",
      name: "Dr. Michael Ross",
      dept: "cardiology",
      availableDates: [getFutureDate(2), getFutureDate(7), getFutureDate(12)],
      availableDays: ["Mon", "Wed", "Sat"],
      timeSlots: ["09:00", "10:00", "11:00", "13:00", "15:00", "16:00"],
    },
    {
      id: "d3",
      name: "Dr. Mark Alston",
      dept: "neurology",
      availableDates: [getFutureDate(4), getFutureDate(8), getFutureDate(14)],
      availableDays: ["Tue", "Thu", "Fri"],
      timeSlots: ["08:00", "10:00", "11:00", "14:00", "15:00", "17:00"],
    },
    {
      id: "d4",
      name: "Dr. Emily Chen",
      dept: "pediatrics",
      availableDates: [getFutureDate(1), getFutureDate(6), getFutureDate(9)],
      availableDays: ["Mon", "Wed", "Thu"],
      timeSlots: ["08:00", "09:00", "11:00", "13:00", "14:00"],
    },
    {
      id: "d5",
      name: "Dr. James Miller",
      dept: "general",
      availableDates: [getFutureDate(2), getFutureDate(3), getFutureDate(5)],
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      timeSlots: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ],
    },
    {
      id: "d6",
      name: "Dr. Lisa Wong",
      dept: "orthopedics",
      availableDates: [getFutureDate(4), getFutureDate(8), getFutureDate(11)],
      availableDays: ["Tue", "Thu", "Sat"],
      timeSlots: ["09:00", "11:00", "13:00", "14:00", "16:00"],
    },
  ];

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

  // Render Time Slots for selected doctor & date
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
      card.style.transitionDelay = `${index * 0.05}s`;

      // Show available days on card
      const daysDisplay = doc.availableDays.slice(0, 3).join(", ");

      // Check if doctor is available on selected date (for status badge only)
      const isAvailableOnDate = date && doc.availableDates.includes(date);
      const statusClass = date ? (isAvailableOnDate ? "" : "unavailable") : "";
      const statusText = date
        ? isAvailableOnDate
          ? "Available"
          : "Different dates"
        : "Select date";

      // Simplified card - NO HOVER CARD
      card.innerHTML = `
        <div class="doc-avatar">${doc.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)}</div>
        <div class="doc-name">${doc.name}</div>
        <div class="doc-dept">${departments[doc.dept]}</div>
        <div class="doc-days"><i class="fa-regular fa-calendar"></i> ${daysDisplay}</div>
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
    const selectedDate = dateInput.value;

    selectedDoctorIdInput.value = doc.id;
    deptSelect.value = doc.dept;

    // If date is selected but doctor not available, auto-pick first available date
    if (selectedDate && !doc.availableDates.includes(selectedDate)) {
      // Show helpful message
      showToast(
        `${doc.name} is not available on ${formatDate(selectedDate)}. Date adjusted to ${formatDate(doc.availableDates[0])}.`,
        "warning",
      );
      dateInput.value = doc.availableDates[0];
    } else if (!selectedDate) {
      // Auto-select first available date if none selected
      dateInput.value = doc.availableDates[0];
    }

    // Update UI
    document
      .querySelectorAll(".doctor-card")
      .forEach((c) => c.classList.remove("selected"));
    const selectedCard = doctorGrid.querySelector(`[data-doc-id="${doc.id}"]`);
    if (selectedCard) selectedCard.classList.add("selected");

    // Re-render time slots with new date
    renderTimeSlots(doc, dateInput.value);

    updateSummary();
    updateProgress();
    showToast(`Selected: ${doc.name}`, "success");
  }

  // Update Summary Panel
  function updateSummary() {
    document.getElementById("sum-dept").textContent = deptSelect.value
      ? departments[deptSelect.value]
      : "--";
    document.getElementById("sum-date").textContent = dateInput.value
      ? formatDate(dateInput.value)
      : "--";
    document.getElementById("sum-time").textContent = selectedTimeInput.value
      ? formatTime(selectedTimeInput.value)
      : "--";

    const doc = doctors.find((d) => d.id === selectedDoctorIdInput.value);
    document.getElementById("sum-doctor").textContent = doc ? doc.name : "--";

    const activeTab = document.querySelector(".pill.active").dataset.tab;
    let patientName = "--";
    if (activeTab === "self") patientName = "John Doe (Self)";
    else {
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

  // Confirm Button
  confirmBtn.addEventListener("click", () => {
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
      if (
        !document.getElementById("o_fname").value ||
        !document.getElementById("o_phone").value
      ) {
        showToast("Please fill in required patient details.", "warning");
        return;
      }
    }

    confirmBtn.innerHTML =
      '<i class="fa-solid fa-circle-notch fa-spin"></i> Booking...';
    confirmBtn.disabled = true;

    setTimeout(() => {
      showToast(
        "✅ Appointment booked successfully! Confirmation sent to your email.",
        "success",
      );
      confirmBtn.innerHTML =
        '<i class="fa-solid fa-check-circle"></i> Confirm Appointment';
      confirmBtn.disabled = false;
    }, 1200);
  });

  // ===== TOAST NOTIFICATION =====
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

  // Initialize
  initScrollAnimations();
  renderDoctors();
  updateProgress();
});
