const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");

const createApp = require("../app");

test("health endpoint reports API and database status", async () => {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, "ok");
    assert.ok(["connected", "disconnected"].includes(body.database));
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("protected data endpoints reject requests without a session", async () => {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/goals`);
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.message, "Sign in to continue");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("registration rejects invalid values before database access", async () => {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "A", email: "invalid", password: "short" }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.ok(Array.isArray(body.errors));
    assert.ok(body.errors.length > 0);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("logout clears the session cookie without requiring a valid session", async () => {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/auth/logout`, { method: "POST" });
    const cookie = response.headers.get("set-cookie") || "";

    assert.equal(response.status, 204);
    assert.match(cookie, /sgms_token=;/);
    assert.match(cookie, /HttpOnly/i);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});