/**
 * PUBLIC CHAT - FIXED DRAG POSITIONING
 */

document.addEventListener("DOMContentLoaded", () => {
  const chatWidget = document.getElementById("publicChatWidget");
  const chatToggle = document.getElementById("publicChatToggle");
  const chatWindow = document.getElementById("publicChatWindow");
  const chatInput = document.getElementById("publicChatInput");
  const chatSend = document.getElementById("publicChatSend");
  const chatMessages = document.getElementById("publicChatMessages");
  const onlineCount = document.getElementById("onlineCount");

  // Socket.io client
  let socket = null;
  let isConnected = false;

  // Drag state
  let isDragging = false;
  let hasDragged = false;
  let startX, startY, initialLeft, initialTop;
  const DRAG_THRESHOLD = 5;

  // ===== POSITION HELPERS =====
  function resetToDefaultPosition() {
    chatWidget.style.left = "auto";
    chatWidget.style.top = "auto";
    chatWidget.style.right = "24px";
    chatWidget.style.bottom = "24px";
  }

  function setDragPosition(left, top) {
    chatWidget.style.left = `${left}px`;
    chatWidget.style.top = `${top}px`;
    chatWidget.style.right = "auto";
    chatWidget.style.bottom = "auto";
  }

  // ===== SOCKET.IO SETUP =====
  function initSocket() {
    if (typeof io === "undefined") {
      const script = document.createElement("script");
      script.src = "/socket.io/socket.io.js";
      script.onload = connectSocket;
      script.onerror = () => console.error("❌ Failed to load socket.io");
      document.head.appendChild(script);
    } else {
      connectSocket();
    }
  }

  function connectSocket() {
    const sessionId = getSessionId();
    const personId = window.currentPersonId;

    socket = io({
      auth: { sessionId, personId },
      transports: ["websocket", "polling"],
      path: "/socket.io",
    });

    socket.on("connect", () => {
      isConnected = true;
      updateOnlineCount();
      loadInitialMessages();
    });

    socket.on("connect_error", (error) => {
      console.warn("⚠️ Proceeding without auth (demo mode)");
      isConnected = true;
      updateOnlineCount();
      loadInitialMessages();
    });

    socket.on("disconnect", () => {
      isConnected = false;
      updateOnlineCount();
    });

    socket.on("new_message", (message) => {
      addMessageToUI(message, true);
    });

    socket.on("chat_error", (error) => {
      showToast(error.message || "Chat error", "error");
    });
  }

  function getSessionId() {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "sessionId") {
        return decodeURIComponent(value);
      }
    }
    const userMeta = document.querySelector('meta[name="user-person-id"]');
    if (userMeta && userMeta.content) {
      return "person-" + userMeta.content;
    }
    return null;
  }

  // ===== LOAD INITIAL MESSAGES =====
  async function loadInitialMessages() {
    try {
      const response = await fetch("/api/chat/messages?limit=50");
      const result = await response.json();

      if (result.success) {
        const messages = result.messages || [];
        const systemMsg = chatMessages.querySelector(".message.system");
        chatMessages.innerHTML = "";
        if (systemMsg) chatMessages.appendChild(systemMsg);

        if (Array.isArray(messages) && messages.length > 0) {
          messages.forEach((msg) => addMessageToUI(msg, false));
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }

  // ===== SEND MESSAGE (FIXED: Single emit) =====
  function sendMessage() {
    const text = chatInput.value.trim();

    if (!text) {
      showToast("Please type a message", "info");
      return;
    }

    if (!isConnected || !socket) {
      showToast("Chat not connected. Please refresh.", "error");
      return;
    }

    // Optimistic UI update
    const tempId = "temp-" + Date.now();
    addMessageToUI(
      {
        message_id: tempId,
        person_id: "current",
        full_name: "You",
        profile_pic_path:
          document.querySelector("#settingsProfileAvatar")?.src ||
          "https://ui-avatars.com/api/?name=You&background=0c6e5f&color=fff",
        message_text: text,
        sent_at: new Date().toISOString(),
        is_temp: true,
      },
      true,
    );

    chatInput.value = "";

    // ✅ Emit ONCE (removed duplicate emit)
    socket.emit("chat_message", { text, tempId });
  }

  // ===== ADD MESSAGE TO UI (FIXED: Remove temp messages) =====
  function addMessageToUI(message, scrollToBottom = true) {
    if (!message || message.is_deleted) return;

    // Remove any temporary optimistic messages with same text
    if (!message.is_temp) {
      const tempMessages = chatMessages.querySelectorAll("[data-temp-id]");
      tempMessages.forEach((msg) => {
        const tempText = msg.querySelector(".message-text")?.textContent;
        if (tempText === message.message_text) {
          msg.remove();
        }
      });
    }

    const msg = document.createElement("div");
    const isSentByCurrentUser =
      message.person_id === "current" ||
      message.person_id === window.currentPersonId;

    msg.className = `message ${isSentByCurrentUser ? "sent" : "received"}`;

    // Store temp ID for removal
    if (message.is_temp) {
      msg.setAttribute("data-temp-id", message.message_id);
    }

    const avatarUrl =
      message.profile_pic_path &&
      message.profile_pic_path !==
        "/uploads/profilePictures/defaultProfilePic.jpg"
        ? message.profile_pic_path
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            message.full_name || "User",
          )}&background=${isSentByCurrentUser ? "0c6e5f" : "109e88"}&color=fff`;

    // ✅ Format date and time (FIXED: single declaration)
    const messageDate = new Date(message.sent_at);
    const date = messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const time = messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // ✅ Simple HTML: name (line 1), date+time (line 2), message (line 3)
    msg.innerHTML = `
    <div class="message-avatar">
      <img src="${avatarUrl}" alt="${message.full_name || "User"}" loading="lazy">
    </div>
    <div class="message-content">
      <div class="message-header">
        <span class="message-username">${escapeHtml(message.full_name || "Unknown")}</span>
      </div>
      <div class="message-time">${date} ${time}</div>
      <div class="message-text"></div>
    </div>
  `;

    const textElement = msg.querySelector(".message-text");
    if (textElement && message.message_text) {
      textElement.textContent = message.message_text;
    }

    chatMessages.appendChild(msg);

    if (scrollToBottom) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ===== DRAG FUNCTIONALITY (FIXED) =====
  const dragStart = (e) => {
    hasDragged = false;
    isDragging = false;
    startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    startY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;

    // Get current position (handle both positioning modes)
    const rect = chatWidget.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
  };

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

    // Only start dragging if moved beyond threshold
    if (dist > DRAG_THRESHOLD && !isDragging) {
      isDragging = true;
      hasDragged = true;
      chatWidget.classList.add("dragging");
      if (e.type === "touchmove") e.preventDefault();
    }

    if (isDragging) {
      if (e.type === "touchmove") e.preventDefault();

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      // Constrain to viewport
      const padding = 10;
      const maxX = window.innerWidth - chatWidget.offsetWidth - padding;
      const maxY = window.innerHeight - chatWidget.offsetHeight - padding;

      newLeft = Math.max(padding, Math.min(newLeft, maxX));
      newTop = Math.max(padding, Math.min(newTop, maxY));

      // ✅ Use helper to set drag position
      setDragPosition(newLeft, newTop);
    }
  };

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

  // ===== TOGGLE CHAT WINDOW =====
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

  // ===== SEND BUTTON & KEYBOARD =====
  if (chatSend && chatInput) {
    chatSend.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }

  // ===== ATTACH DRAG EVENTS =====
  chatToggle.addEventListener("mousedown", dragStart);
  chatToggle.addEventListener("touchstart", dragStart, { passive: false });
  document.addEventListener("mousemove", dragMove);
  document.addEventListener("touchmove", dragMove, { passive: false });
  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("touchend", dragEnd);

  // ===== SAVE/LOAD WIDGET POSITION (FIXED) =====
  function saveWidgetPosition(widget) {
    const rect = widget.getBoundingClientRect();
    try {
      localStorage.setItem(
        "chatWidgetPosition",
        JSON.stringify({
          left: rect.left,
          top: rect.top,
          // Save which positioning mode we're using
          usesLeftTop: widget.style.right === "auto",
        }),
      );
    } catch (e) {}
  }

  function loadWidgetPosition(widget) {
    try {
      const saved = localStorage.getItem("chatWidgetPosition");
      if (!saved) {
        // ✅ Ensure default position on first load
        resetToDefaultPosition();
        return;
      }
      const pos = JSON.parse(saved);
      const padding = 10;
      const maxX = window.innerWidth - widget.offsetWidth - padding;
      const maxY = window.innerHeight - widget.offsetHeight - padding;

      // ✅ Only apply saved position if it's valid and on-screen
      if (
        pos.left >= padding &&
        pos.left <= maxX &&
        pos.top >= padding &&
        pos.top <= maxY
      ) {
        if (pos.usesLeftTop) {
          setDragPosition(
            Math.max(padding, Math.min(pos.left, maxX)),
            Math.max(padding, Math.min(pos.top, maxY)),
          );
        } else {
          // If saved with right/bottom, just ensure defaults
          resetToDefaultPosition();
        }
      } else {
        // ✅ Reset if saved position is off-screen
        resetToDefaultPosition();
      }
    } catch (e) {
      // ✅ Reset on any error
      resetToDefaultPosition();
    }
  }

  // ===== ONLINE COUNT UPDATE =====
  function updateOnlineCount() {
    if (onlineCount) {
      onlineCount.textContent = isConnected ? "24" : "0";
    }
  }

  // ===== TOAST NOTIFICATIONS =====
  function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const iconMap = { success: "fa-check", error: "fa-xmark", info: "fa-info" };
    const icon = iconMap[type] || "fa-check";

    toast.innerHTML = `<div class="toast-icon"><i class="fa-solid ${icon}"></i></div><div class="toast-content">${message}</div>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 300);
    }, 3000);
  }

  // ===== INITIALIZE =====
  console.log("🚀 Public chat initializing...");

  // ✅ Load position FIRST, before any other logic
  loadWidgetPosition(chatWidget);

  // Set currentPersonId
  const userMeta = document.querySelector('meta[name="user-person-id"]');
  if (userMeta && userMeta.content) {
    window.currentPersonId = parseInt(userMeta.content);
  }

  initSocket();

  // ✅ Reset position if off-screen on resize
  window.addEventListener("resize", () => {
    const rect = chatWidget.getBoundingClientRect();
    const padding = 10;
    if (
      rect.right < padding ||
      rect.bottom < padding ||
      rect.left < padding ||
      rect.top < padding
    ) {
      resetToDefaultPosition();
      try {
        localStorage.removeItem("chatWidgetPosition");
      } catch (e) {}
    }
  });

  setTimeout(() => resetToDefaultPosition(), 100);
});
