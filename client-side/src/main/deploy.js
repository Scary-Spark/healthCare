import express from "express";
import { exec } from "child_process";
import path from "path";

const app = express();
const port = 3001;

const appFolder = path.resolve();
app.use(express.json());

app.post("/deploy", (req, res) => {
  console.log("Webhook received! Pulling latest code...");

  // Pull latest code from GitHub
  exec("git pull origin main", { cwd: appFolder }, (err, stdout, stderr) => {
    if (err) {
      console.error("Git pull error:", err);
      return res.status(500).send("Pull failed");
    }

    console.log("Git pull output:", stdout);
    console.error("Git pull errors:", stderr);
    res.send("Pull success");

    // Optional: install dependencies if package.json changed
    exec("npm install", { cwd: appFolder }, (err, out, errOut) => {
      if (err) console.error("npm install error:", err);
      else console.log("npm install output:", out);
    });

    // Optional: restart your Node.js server
    // If using cPanel Node.js app, it may auto-restart
    // Otherwise, use PM2:
    // exec("pm2 restart main.js", { cwd: appFolder }, (err, out) => { ... });
  });
});

app.get("/", (req, res) => res.send("Webhook listener running"));

app.listen(port, () => {
  console.log(`Webhook listener running on port ${PORT}`);
});
