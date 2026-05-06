const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/api/upload", async (req, res) => {
  try {
    const { eat, uid, pass, bio } = req.body;
    let jwt;

    // 🔹 EAT → ACCESS → JWT
    if (eat) {
      let r1 = await fetch(`https://9x-eat-to-access-coral.vercel.app/rizer?eat_token=${eat}`);
      let d1 = await r1.json();

      let r2 = await fetch(`https://9x-access-to-jwt.vercel.app/rizer?access_token=${d1.access_token}`);
      let d2 = await r2.json();

      jwt = d2.jwt;
    }

    // 🔹 UID + PASS (only if valid external API)
    if (uid && pass) {
      let login = await fetch("https://example.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, pass })
      });

      let data = await login.json();
      jwt = data.jwt;
    }

    if (!jwt) {
      return res.json({ error: "JWT not found" });
    }

    // 🔹 BIO UPLOAD
    let r3 = await fetch("https://9x-long.vercel.app/bio_upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwt, bio })
    });

    let result = await r3.json();
    res.json(result);

  } catch (err) {
    res.json({ error: err.message });
  }
});

// Frontend route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 SUMON 9X RUNNING");
});