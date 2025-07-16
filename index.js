const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const userDB = require("./model.js");
const fetch = require("node-fetch");

global.fetch = fetch;

console.log("🔁 Server is starting...");

let password = "";

const database = () => {
  return mongoose.connect(process.env.MONGO_URI);
};

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("welcome to node server");
});

app.post("/signup", async (req, res) => {
  const { theme, email, links, id } = req.body;
  const allUser = await userDB.find();
  if (allUser.find((user) => user.email === email)) {
    res.status(401).send("EMAIL EXISTS");
  } else {
    let encryptedData = global.Buffer.from(theme).toString("base64");
    for (let i = 0; i < id.length; i++) {
      encryptedData += global.Buffer.from(id[i]).toString("base64");
    }
    allLink = links.map((link) => link.id);
    const user = {
      email: email,
      allId: allLink,
      password: encryptedData,
      theme,
    };
    await userDB.create(user);
    res.status(200).send("user added successfully");
  }
});

app.post("/login", async (req, res) => {
  const { email, theme } = req.body;
  const user = await userDB.find({ email: email });
  if (user.length === 0) {
    res.status(404).send("NO USER FOUND");
  } else {
    const userTheme = user[0].theme;
    if (userTheme === theme) {
      const Ids = user[0].allId;
      password = user[0].password;
      res.status(200).json({ Ids });
    } else {
      res.status(400).send("THEME INCORRECT");
    }
  }
});

app.post("/loginVerify", async (req, res) => {
  const { id, theme } = req.body;
  let encryptedData = global.Buffer.from(theme).toString("base64");
  for (let i = 0; i < id.length; i++) {
    encryptedData += global.Buffer.from(id[i]).toString("base64");
  }
  if (encryptedData === password) {
    res.status(200).send("successfully logged in");
  } else {
    res.status(401).send("ERROR");
  }
});

const port = process.env.PORT || 5000;

const connectDatabase = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await database();
    console.log("✅ MongoDB connected");

    app.listen(port, () => {
      console.log(`🚀 Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Error during startup:", error);
  }
};

connectDatabase();
