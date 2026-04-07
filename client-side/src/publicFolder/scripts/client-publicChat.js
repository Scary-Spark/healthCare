/**
 * PUBLIC CHAT - FIXED POSITION JUMPING
 * Properly tracks initial position to prevent random jumps
 */

document.addEventListener("DOMContentLoaded", () => {
  const chatWidget = document.getElementById("publicChatWidget");
  const chatToggle = document.getElementById("publicChatToggle");
  const chatWindow = document.getElementById("publicChatWindow");
  const chatInput = document.getElementById("publicChatInput");
  const chatSend = document.getElementById("publicChatSend");
  const chatMessages = document.getElementById("publicChatMessages");

  // ===== STATE VARIABLES =====
  let isDragging = false;
  let hasDragged = false;
  let startX, startY;
  let initialLeft, initialTop; // 🎯 STORE INITIAL POSITION
  const DRAG_THRESHOLD = 5;

  // ===== DRAG START =====
  const dragStart = (e) => {
    hasDragged = false;
    isDragging = false;

    // Get mouse/touch position
    startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    startY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;

    // 🎯 GET WIDGET'S CURRENT POSITION ONCE
    const rect = chatWidget.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
  };

  // ===== DRAG MOVE =====
  const dragMove = (e) => {
    if (startX === undefined || initialLeft === undefined) return;

    const currentX = e.type.includes("mouse")
      ? e.clientX
      : e.touches[0].clientX;
    const currentY = e.type.includes("mouse")
      ? e.clientY
      : e.touches[0].clientY;

    const dx = currentX - startX;
    const dy = currentY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Trigger drag mode if moved beyond threshold
    if (dist > DRAG_THRESHOLD && !isDragging) {
      isDragging = true;
      hasDragged = true;
      chatWidget.classList.add("dragging");

      if (e.type === "touchmove") e.preventDefault();
    }

    // Update position if dragging
    if (isDragging) {
      if (e.type === "touchmove") e.preventDefault();

      // 🎯 CALCULATE NEW POSITION FROM INITIAL (not current!)
      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      // Constrain to viewport
      const padding = 10;
      const maxX = window.innerWidth - chatWidget.offsetWidth - padding;
      const maxY = window.innerHeight - chatWidget.offsetHeight - padding;

      newLeft = Math.max(padding, Math.min(newLeft, maxX));
      newTop = Math.max(padding, Math.min(newTop, maxY));

      // Apply position
      chatWidget.style.left = `${newLeft}px`;
      chatWidget.style.top = `${newTop}px`;
      chatWidget.style.right = "auto";
      chatWidget.style.bottom = "auto";
    }
  };

  // ===== DRAG END =====
  const dragEnd = () => {
    if (isDragging) {
      chatWidget.classList.remove("dragging");
      saveWidgetPosition(chatWidget);
    }
    isDragging = false;
    startX = undefined;
    startY = undefined;
    initialLeft = undefined;
    initialTop = undefined;
  };

  // ===== ATTACH EVENTS =====
  chatToggle.addEventListener("mousedown", dragStart);
  chatToggle.addEventListener("touchstart", dragStart, { passive: false });

  document.addEventListener("mousemove", dragMove);
  document.addEventListener("touchmove", dragMove, { passive: false });

  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("touchend", dragEnd);

  // ===== CLICK HANDLER =====
  chatToggle.addEventListener("click", (e) => {
    if (hasDragged) {
      hasDragged = false;
      return;
    }

    const isOpen = !chatWindow.hidden;
    chatWindow.hidden = isOpen;
    chatToggle.setAttribute("aria-expanded", !isOpen);

    if (!isOpen) {
      setTimeout(() => chatInput?.focus(), 100);
      const badge = document.getElementById("publicChatBadge");
      if (badge) badge.hidden = true;
    }
  });

  // ===== SEND MESSAGE =====
  if (chatSend && chatInput && chatMessages) {
    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      addMessage(text, "sent", "You");
      chatInput.value = "";

      setTimeout(() => {
        const responses = ["Thanks! 👍", "Great point!", "Anyone else?"];
        const users = ["Alice Smith", "Bob Jones", "Carol White"];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        addMessage(
          responses[Math.floor(Math.random() * responses.length)],
          "received",
          randomUser,
        );
      }, 1500);
    };

    chatSend.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }

  // ===== ADD MESSAGE =====
  function addMessage(text, type, username) {
    const msg = document.createElement("div");
    msg.className = `message ${type}`;

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=${type === "sent" ? "0c6e5f" : "109e88"}&color=fff`;

    msg.innerHTML = `
      <div class="message-avatar">
        <img src="${avatarUrl}" alt="${username}" loading="lazy">
      </div>
      <div class="message-content">
        <div class="message-meta">
          <span class="message-username">${escapeHtml(username)}</span>
          <span class="message-time">${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <p>${escapeHtml(text)}</p>
      </div>
    `;

    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ===== SAVE/LOAD POSITION =====
  function saveWidgetPosition(widget) {
    const rect = widget.getBoundingClientRect();
    try {
      localStorage.setItem(
        "chatWidgetPosition",
        JSON.stringify({ left: rect.left, top: rect.top }),
      );
    } catch (e) {}
  }

  function loadWidgetPosition(widget) {
    try {
      const saved = localStorage.getItem("chatWidgetPosition");
      if (!saved) return;
      const pos = JSON.parse(saved);
      const padding = 10;
      const maxX = window.innerWidth - widget.offsetWidth - padding;
      const maxY = window.innerHeight - widget.offsetHeight - padding;

      widget.style.left = `${Math.max(padding, Math.min(pos.left, maxX))}px`;
      widget.style.top = `${Math.max(padding, Math.min(pos.top, maxY))}px`;
      widget.style.right = "auto";
      widget.style.bottom = "auto";
    } catch (e) {}
  }

  loadWidgetPosition(chatWidget);

  // Reset if off-screen on resize
  window.addEventListener("resize", () => {
    const rect = chatWidget.getBoundingClientRect();
    const padding = 10;
    if (rect.right < padding || rect.bottom < padding) {
      chatWidget.style.left = "auto";
      chatWidget.style.top = "auto";
      chatWidget.style.right = "24px";
      chatWidget.style.bottom = "24px";
      try {
        localStorage.removeItem("chatWidgetPosition");
      } catch (e) {}
    }
  });
});
