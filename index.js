const express = require("express");
const logger = require("./logger");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  logger.info("Home API called");
  res.send("Hello");
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  logger.info("Login attempt", { user: username });

  if (username === "admin") {
    logger.info("Login success", { user: username });
    res.json({ message: "success" });
  } else {
    logger.error("Login failed", { user: username });
    res.status(401).json({ message: "failed" });
  }
});

app.post("/register", (req, res) => {
  const { username, email } = req.body;
  logger.info("Register attempt", { user: username, email });

  if (!username || !email) {
    logger.warn("Registration missing fields", { user: username, email });
    return res.status(400).json({ message: "missing fields" });
  }

  logger.info("User registered successfully", { user: username, email });
  res.json({ message: "registered" });
});

app.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  logger.warn("User deletion requested", { userId: id });
  res.json({ message: `user ${id} deleted` });
});

app.listen(3000, () => {
  logger.info("Server started");
});