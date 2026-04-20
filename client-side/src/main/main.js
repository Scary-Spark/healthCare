// src/main/main.js

import express from "express";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";
import __dirname from "../../clientPath.js";
import path from "path";
import router from "../routes/homeRoutes.js";
import dotenv from "dotenv";
import { pool } from "../configs/database.js";

// Load environment variables
dotenv.config({
  path: path.resolve(
    __dirname,
    "../../",
    process.env.NODE_ENV === "production" ? ".env.production" : ".env",
  ),
});

// Create Express app
const app = express();

// ✅ Create HTTP server (required for Socket.io)
const server = http.createServer(app);

// ✅ Socket.io setup with cPanel-compatible config
const io = new Server(server, {
  cors: {
    origin: [process.env.BASE_URL?.replace(/\/$/, "")], // Clean domain
    credentials: true, // ✅ Required for session cookies
  },
  transports: ["websocket", "polling"], // ✅ Fallback for cPanel
});

// ✅ Session middleware with MemoryStore (simple & works)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new session.MemoryStore(), // ✅ No external dependencies
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Trust proxy for cPanel
app.set("trust proxy", 1);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "publicFolder")));
app.set("view cache", false);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Inject user data into all views (your existing logic)
app.use(async (req, res, next) => {
  try {
    if (req.session.client?.isAuthenticated && req.session.client.personId) {
      console.log("👤 Session client:", {
        personId: req.session.client.personId,
        firstName: req.session.client.firstName,
        email: req.session.client.email,
      });

      const { getUserData } =
        await import("../controllers/clientController.js");
      const userData = await getUserData(req.session.client.personId);

      if (userData) {
        console.log("User data injected:", userData);
        res.locals.user = userData;
      } else {
        console.log("⚠️ No user data found, using session fallback");
        res.locals.user = {
          fullName: `${req.session.client.firstName} ${req.session.client.lastName}`,
          email: req.session.client.email,
          profilePic: `/uploads/profilePictures/defaultProfilePic.jpg`,
          personId: req.session.client.personId,
        };
      }
    } else {
      res.locals.user = null;
    }
  } catch (error) {
    console.error("❌ Error injecting user ", error);
    if (req.session.client?.isAuthenticated) {
      res.locals.user = {
        fullName: `${req.session.client.firstName} ${req.session.client.lastName}`,
        email: req.session.client.email,
        profilePic: `/uploads/profilePictures/defaultProfilePic.jpg`,
        personId: req.session.client.personId,
      };
    } else {
      res.locals.user = null;
    }
  }
  next();
});

io.use((socket, next) => {
  const { sessionId, personId } = socket.handshake.auth;

  // Allow if personId is provided (demo mode)
  if (personId) {
    socket.personId = personId;
    socket.userName = "User #" + personId; // Fallback name
    socket.userAvatar =
      "https://ui-avatars.com/api/?name=User&background=0c6e5f&color=fff";
    return next();
  }

  // Try session lookup (production)
  if (sessionId) {
    sessionStore.get(sessionId, (err, sessionData) => {
      if (err || !sessionData?.client?.isAuthenticated) {
        return next(new Error("Invalid session"));
      }
      socket.personId = sessionData.client.personId;
      socket.userName = sessionData.client.fullName;
      socket.userAvatar = sessionData.client.profilePic;
      next();
    });
  } else {
    next(new Error("Authentication required"));
  }
});

// ✅ Socket.io connection handler
io.on("connection", (socket) => {
  console.log(
    `✅ User connected: ${socket.userName || "Unknown"} (personId: ${socket.personId || "N/A"})`,
  );

  socket.join("public_chat");

  socket.on("chat_message", async (messageData) => {
    console.log(`📨 Received chat_message from ${socket.id}:`, messageData);

    try {
      const { text } = messageData;

      if (!text || text.trim().length === 0 || text.length > 500) {
        console.warn("⚠️ Invalid message rejected");
        socket.emit("chat_error", { message: "Invalid message" });
        return;
      }

      const personId = socket.personId || 1;
      console.log(`💾 Inserting message for personId: ${personId}`);

      const [result] = await pool.query(
        `INSERT INTO public_chat_messages (person_id, message_text) VALUES (?, ?)`,
        [personId, text.trim()],
      );

      const [rows] = await pool.query(
        `SELECT * FROM vw_public_chat_messages WHERE message_id = ?`,
        [result.insertId],
      );

      if (rows[0]) {
        console.log(`📢 Broadcasting new_message to public_chat`);
        io.to("public_chat").emit("new_message", rows[0]);
      }
    } catch (error) {
      console.error("❌ Error handling chat message:", error);
      socket.emit("chat_error", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Make io available to routes if needed
app.set("io", io);

// Routes
app.use("/", router);

// ✅ Start server with Socket.io (NOT app.listen)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV})`);
  console.log(`🔌 Socket.io ready`);
});
