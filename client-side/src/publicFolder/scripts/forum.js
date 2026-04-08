/**
 * COMMUNITY FORUM - DISCORD-LIKE UI
 * Channel list • Right panel details • Search • Emergency posts • View Details modal
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== MOCK DATA =====
  const forumData = [
    {
      category: "General",
      channels: [
        {
          id: "general",
          name: "general",
          description: "Introductions, casual chat, and community updates",
          posts: 342,
          lastActive: "2m ago",
          icon: "fa-comments",
        },
        {
          id: "emergency",
          name: "emergency",
          description:
            "URGENT: Blood donations, emergency assistance, immediate help needed",
          posts: 28,
          lastActive: "Just now",
          icon: "fa-truck-medical",
          isEmergency: true,
        },
        {
          id: "announcements",
          name: "announcements",
          description: "Official NovaLife updates and policy changes",
          posts: 45,
          lastActive: "1d ago",
          icon: "fa-bullhorn",
        },
      ],
    },
    {
      category: "Health & Wellness",
      channels: [
        {
          id: "health-tips",
          name: "health-tips",
          description: "Share wellness advice, diet tips, and healthy habits",
          posts: 128,
          lastActive: "15m ago",
          icon: "fa-heart-pulse",
        },
        {
          id: "mental-health",
          name: "mental-health",
          description: "Supportive space for mental wellness discussions",
          posts: 89,
          lastActive: "45m ago",
          icon: "fa-brain",
        },
        {
          id: "fitness",
          name: "fitness",
          description: "Exercise routines, physiotherapy tips, and recovery",
          posts: 67,
          lastActive: "2h ago",
          icon: "fa-dumbbell",
        },
      ],
    },
    {
      category: "Support & Advice",
      channels: [
        {
          id: "patient-support",
          name: "patient-support",
          description: "Ask questions, share experiences, get peer support",
          posts: 256,
          lastActive: "5m ago",
          icon: "fa-hand-holding-medical",
        },
        {
          id: "medication-qna",
          name: "medication-qna",
          description:
            "Questions about prescriptions, side effects, and alternatives",
          posts: 94,
          lastActive: "3h ago",
          icon: "fa-pills",
        },
        {
          id: "insurance-help",
          name: "insurance-help",
          description: "Navigate billing, claims, and coverage questions",
          posts: 41,
          lastActive: "1d ago",
          icon: "fa-file-invoice-dollar",
        },
      ],
    },
    {
      category: "Off-Topic",
      channels: [
        {
          id: "random",
          name: "random",
          description: "Non-medical chat, hobbies, and fun discussions",
          posts: 182,
          lastActive: "8m ago",
          icon: "fa-dice",
        },
        {
          id: "success-stories",
          name: "success-stories",
          description: "Celebrate recoveries and positive health journeys",
          posts: 53,
          lastActive: "4h ago",
          icon: "fa-trophy",
        },
      ],
    },
  ];

  // Mock posts for panels - NOW WITH TITLES
  const mockPosts = {
    general: [
      {
        title: "Telemedicine Experience",
        author: "Sarah M.",
        avatar: "SM",
        date: "Today at 10:30 AM",
        body: "Has anyone tried the new telemedicine feature? The video quality was surprisingly good! I had my follow-up appointment yesterday and the doctor was able to see my wound healing progress clearly. The only issue was a slight audio delay, but overall I'd recommend it for non-emergency consultations. Much more convenient than driving to the hospital!",
        likes: 12,
        replies: 4,
        isEmergency: false,
      },
      {
        title: "Lab Results - All Clear!",
        author: "David K.",
        avatar: "DK",
        date: "Today at 9:15 AM",
        body: "Just got my lab results back. Everything looks normal! Thanks to everyone who supported me during this stressful time. Your messages and prayers really helped. Remember to stay positive and follow your doctor's advice. Wishing everyone good health! 🙏",
        likes: 28,
        replies: 7,
        isEmergency: false,
      },
      {
        title: "Medication List Pro Tip",
        author: "Priya R.",
        avatar: "PR",
        date: "Yesterday at 4:20 PM",
        body: "Pro tip: Always keep a list of your current medications in your phone notes. Include dosage, frequency, and prescribing doctor. Saved me twice already when I forgot what I was taking. Also helpful for emergency situations when you can't communicate clearly.",
        likes: 45,
        replies: 11,
        isEmergency: false,
      },
    ],
    emergency: [
      {
        title: "URGENT: O- Blood Needed",
        author: "Ahmed H.",
        avatar: "AH",
        date: "Just now",
        body: "My mother needs O- blood urgently at Rajshahi Medical College Hospital. She's in surgery right now. Please contact me at 017XX-XXXXXX if you can donate. May Allah bless you all. This is a life-threatening emergency.",
        likes: 0,
        replies: 0,
        isEmergency: true,
        contact: "017XX-XXXXXX",
      },
      {
        title: "Emergency Ambulance Needed",
        author: "Fatima K.",
        avatar: "FK",
        date: "5m ago",
        body: "Need ambulance from Motihar to Medical College Hospital. Patient has severe chest pain. Please help! Contact: 018XX-XXXXXX",
        likes: 3,
        replies: 2,
        isEmergency: true,
        contact: "018XX-XXXXXX",
      },
      {
        title: "A+ Blood Donor Needed",
        author: "Rahim S.",
        avatar: "RS",
        date: "15m ago",
        body: "Looking for A+ blood donor for my father at NovaLife Hospital. He lost a lot of blood during surgery. Please DM me if you can help. Contact: 019XX-XXXXXX",
        likes: 8,
        replies: 5,
        isEmergency: true,
        contact: "019XX-XXXXXX",
      },
    ],
    "health-tips": [
      {
        title: "Daily Hydration Reminder",
        author: "Dr. Emily",
        avatar: "EC",
        date: "Today at 11:00 AM",
        body: "Reminder: Stay hydrated! Aim for 8 glasses of water daily, more if you're active. Dehydration can cause headaches, fatigue, and kidney problems. Set reminders on your phone if needed. Your body will thank you! 💧",
        likes: 34,
        replies: 8,
        isEmergency: false,
      },
      {
        title: "Morning Yoga Changed My Life",
        author: "Mark T.",
        avatar: "MT",
        date: "Today at 8:45 AM",
        body: "Morning yoga has completely changed my back pain routine. 15 minutes daily makes a huge difference. I started with simple stretches and gradually moved to more complex poses. My physiotherapist approved my routine. Happy to share my sequence if anyone is interested!",
        likes: 19,
        replies: 5,
        isEmergency: false,
      },
    ],
    "patient-support": [
      {
        title: "Starting Treatment Tomorrow",
        author: "Lisa W.",
        avatar: "LW",
        date: "Today at 10:00 AM",
        body: "Starting my new treatment plan tomorrow. A bit nervous but ready. Sending strength to everyone fighting their battles. Remember, we're all in this together. Feel free to message me if you need someone to talk to. 💪",
        likes: 56,
        replies: 14,
        isEmergency: false,
      },
      {
        title: "Knee Arthroscopy Recovery Time?",
        author: "James H.",
        avatar: "JH",
        date: "Yesterday at 6:30 PM",
        body: "Does anyone know how long recovery usually takes for knee arthroscopy? My surgeon said 4-6 weeks. I work a desk job so I should be able to return to work after 2 weeks hopefully. Any tips for faster recovery? Ice, elevation, physical therapy?",
        likes: 22,
        replies: 9,
        isEmergency: false,
      },
    ],
  };

  let activeChannel = null;
  let currentSearchTerm = "";

  // ===== DOM ELEMENTS =====
  const channelList = document.getElementById("channelList");
  const channelCount = document.getElementById("channelCount");
  const forumPanel = document.getElementById("forumPanel");
  const forumSearch = document.getElementById("forumSearch");
  const createPostBtn = document.getElementById("createPostBtn");

  // ===== INIT =====
  function init() {
    renderChannelList();
    setupEvents();
  }

  function setupEvents() {
    // Search - Now searches BOTH channels AND posts
    forumSearch.addEventListener("input", (e) => {
      currentSearchTerm = e.target.value.toLowerCase();
      if (currentSearchTerm.length > 0) {
        searchChannelsAndPosts(currentSearchTerm);
      } else {
        renderChannelList();
      }
    });

    // Create Post
    createPostBtn.addEventListener("click", () =>
      showToast('"New Post" feature is coming soon!', "info"),
    );

    // Close panel on mobile
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 1024 &&
        forumPanel.classList.contains("open") &&
        !forumPanel.contains(e.target) &&
        !e.target.closest(".channel-item")
      ) {
        forumPanel.classList.remove("open");
      }
    });
  }

  // ===== RENDER CHANNELS =====
  function renderChannelList(data = forumData) {
    channelList.innerHTML = "";
    let totalChannels = 0;

    data.forEach((cat) => {
      if (cat.channels.length === 0) return;

      const header = document.createElement("div");
      header.className = "category-header";
      header.innerHTML = `<i class="fa-solid fa-chevron-down"></i> ${cat.category}`;
      channelList.appendChild(header);

      cat.channels.forEach((ch) => {
        totalChannels++;
        const item = document.createElement("div");
        item.className = `channel-item ${activeChannel === ch.id ? "active" : ""} ${ch.isEmergency ? "emergency" : ""}`;
        item.dataset.id = ch.id;

        const emergencyBadge = ch.isEmergency
          ? '<span class="emergency-badge">Emergency</span>'
          : "";

        item.innerHTML = `
          <div class="channel-icon"><i class="fa-solid ${ch.icon}"></i></div>
          <div class="channel-info">
            <div class="channel-name"><span class="hash">#</span> ${ch.name} ${emergencyBadge}</div>
            <div class="channel-desc">${ch.description}</div>
          </div>
          <div class="channel-meta">
            <div class="channel-posts">${ch.posts} posts</div>
            <div class="channel-time">${ch.lastActive}</div>
          </div>
        `;
        item.addEventListener("click", () => openChannel(ch));
        channelList.appendChild(item);
      });
    });

    channelCount.textContent = totalChannels;
  }

  // Search both channels AND posts
  function searchChannelsAndPosts(term) {
    const results = [];

    // Search channels
    forumData.forEach((cat) => {
      const matchingChannels = cat.channels.filter(
        (ch) =>
          ch.name.toLowerCase().includes(term) ||
          ch.description.toLowerCase().includes(term),
      );

      if (matchingChannels.length > 0) {
        results.push({
          ...cat,
          channels: matchingChannels,
        });
      }
    });

    // Search posts
    Object.keys(mockPosts).forEach((channelId) => {
      const matchingPosts = mockPosts[channelId].filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.body.toLowerCase().includes(term),
      );

      if (matchingPosts.length > 0) {
        // Find the channel
        const channel = forumData
          .flatMap((c) => c.channels)
          .find((c) => c.id === channelId);
        if (channel) {
          const existingCat = results.find(
            (r) => r.category === getCategoryForChannel(channelId),
          );
          if (existingCat) {
            if (!existingCat.channels.find((c) => c.id === channelId)) {
              existingCat.channels.push(channel);
            }
          } else {
            results.push({
              category: getCategoryForChannel(channelId),
              channels: [channel],
            });
          }
        }
      }
    });

    renderChannelList(results);
  }

  function getCategoryForChannel(channelId) {
    for (const cat of forumData) {
      if (cat.channels.find((c) => c.id === channelId)) {
        return cat.category;
      }
    }
    return "Other";
  }

  // ===== OPEN CHANNEL (RIGHT PANEL) =====
  function openChannel(channel) {
    activeChannel = channel.id;

    // Update active state in list
    document.querySelectorAll(".channel-item").forEach((el) => {
      el.classList.toggle("active", el.dataset.id === channel.id);
    });

    // Get mock posts or generate fallback
    const posts = mockPosts[channel.id] || generateFallbackPosts(channel);

    forumPanel.innerHTML = `
      <div class="panel-header">
        <h3><i class="fa-solid ${channel.icon}"></i> #${channel.name} ${channel.isEmergency ? '<span class="emergency-badge">Emergency</span>' : ""}</h3>
        <p>${channel.description}</p>
      </div>
      <div class="panel-content">
        ${posts
          .map(
            (p) => `
          <div class="post-card ${p.isEmergency ? "emergency" : ""}" onclick="viewPostDetails(${JSON.stringify(p).replace(/"/g, "&quot;")})">
            <div class="post-header">
              <div class="post-author">
                <div class="author-avatar">${p.avatar}</div>
                <div class="author-info">
                  <div class="name">${p.author} ${p.isEmergency ? '<span class="emergency-badge">URGENT</span>' : ""}</div>
                  <div class="date">${p.date}</div>
                </div>
              </div>
            </div>
            <div class="post-title">${p.title}</div>
            <div class="post-body">${p.body}</div>
            <div class="post-actions">
              <button class="post-action" onclick="event.stopPropagation(); showToast('Likes feature coming soon!', 'info')">
                <i class="fa-regular fa-heart"></i> ${p.likes}
              </button>
              <button class="post-action" onclick="event.stopPropagation(); showToast('Reply feature coming soon!', 'info')">
                <i class="fa-regular fa-comment"></i> ${p.replies}
              </button>
              <button class="post-action" onclick="event.stopPropagation(); viewPostDetails(${JSON.stringify(p).replace(/"/g, "&quot;")})">
                <i class="fa-solid fa-eye"></i> View Details
              </button>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="panel-input-area">
        <div class="input-disabled">
          <i class="fa-solid fa-lock"></i> Posting & replies coming soon...
        </div>
      </div>
    `;

    // Open panel on mobile
    if (window.innerWidth <= 1024) {
      forumPanel.classList.add("open");
    }
  }

  // View Full Post Details Modal
  window.viewPostDetails = function (post) {
    const modal = document.createElement("div");
    modal.className = "post-modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${post.isEmergency ? '<span class="emergency-badge">Emergency</span> ' : ""}${post.title}</h3>
          <button class="modal-close" onclick="this.closest('.post-modal').remove()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-post-title">${post.title}</div>
          <div class="modal-post-body">${post.body}</div>
          ${post.contact ? `<div style="margin-top: 16px; padding: 12px; background: #fff3cd; border-left: 4px solid var(--accent-orange); border-radius: 6px;"><strong>Contact:</strong> ${post.contact}</div>` : ""}
        </div>
        <div class="modal-footer">
          <div class="modal-author">
            <div class="author-avatar">${post.avatar}</div>
            <div>
              <div style="font-weight: 600;">${post.author}</div>
              <div style="font-size: 0.8rem; color: var(--text-light);">${post.date}</div>
            </div>
          </div>
          <div style="display: flex; gap: 16px;">
            <button class="post-action" onclick="showToast('Likes feature coming soon!', 'info')">
              <i class="fa-regular fa-heart"></i> ${post.likes} Likes
            </button>
            <button class="post-action" onclick="showToast('Reply feature coming soon!', 'info')">
              <i class="fa-regular fa-comment"></i> ${post.replies} Replies
            </button>
          </div>
        </div>
      </div>
    `;

    // Close modal on outside click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    document.body.appendChild(modal);
  };

  function generateFallbackPosts(channel) {
    return [
      {
        title: "Welcome to #" + channel.name,
        author: "Community Bot",
        avatar: "CB",
        date: "Welcome",
        body: `Welcome to #${channel.name}! This is a space for ${channel.description}. Be respectful and supportive.`,
        likes: 99,
        replies: 0,
        isEmergency: false,
      },
      {
        title: "First Post",
        author: "User_" + Math.floor(Math.random() * 100),
        avatar: "U",
        date: "2 days ago",
        body: "Looking forward to engaging with this community! 🌟",
        likes: 12,
        replies: 3,
        isEmergency: false,
      },
    ];
  }

  // ===== UTILS =====
  function showToast(message, type = "info") {
    const existing = document.getElementById("forumToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "forumToast";
    toast.innerHTML = `
      <div class="toast-icon"><i class="fa-solid fa-${type === "success" ? "circle-check" : type === "info" ? "info-circle" : "triangle-exclamation"}"></i></div>
      <div class="toast-content">${message}</div>
    `;

    toast.style.cssText = `
      position:fixed;bottom:24px;right:24px;background:var(--card-bg);color:var(--text-dark);
      padding:14px 20px;border-radius:var(--radius-md);box-shadow:var(--shadow-lg);
      border-left:4px solid ${type === "success" ? "var(--primary)" : type === "info" ? "var(--accent-gold)" : "var(--accent-red)"};
      display:flex;align-items:center;gap:12px;z-index:3000;max-width:360px;
      animation:slideInRight 0.2s ease,fadeOut 0.2s ease 2s forwards;
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 2200);

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

  // Start
  init();
});
