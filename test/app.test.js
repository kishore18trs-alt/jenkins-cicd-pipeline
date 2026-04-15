const request = require("supertest");
const express = require("express");

// Minimal app clone for testing (avoids port conflicts)
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Hello"));

app.post("/login", (req, res) => {
  const { username } = req.body;
  if (username === "admin") return res.json({ message: "success" });
  return res.status(401).json({ message: "failed" });
});

app.post("/register", (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) return res.status(400).json({ message: "missing fields" });
  return res.json({ message: "registered" });
});

app.delete("/user/:id", (req, res) => {
  res.json({ message: `user ${req.params.id} deleted` });
});

describe("Express API Tests", () => {
  test("GET / returns Hello", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello");
  });

  test("POST /login with admin succeeds", async () => {
    const res = await request(app).post("/login").send({ username: "admin" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("success");
  });

  test("POST /login with wrong user fails", async () => {
    const res = await request(app).post("/login").send({ username: "hacker" });
    expect(res.status).toBe(401);
  });

  test("POST /register with valid data", async () => {
    const res = await request(app).post("/register").send({ username: "john", email: "john@test.com" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("registered");
  });

  test("POST /register missing fields returns 400", async () => {
    const res = await request(app).post("/register").send({ username: "john" });
    expect(res.status).toBe(400);
  });

  test("DELETE /user/:id removes user", async () => {
    const res = await request(app).delete("/user/42");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("user 42 deleted");
  });
});