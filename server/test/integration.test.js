import test from "node:test";
import assert from "node:assert";
import { start } from "../index.js";
import mongoose from "mongoose";

let server;
let baseUrl;

test.before(async () => {
  // Mock mongoose
  mongoose.connect = async () => {
    console.log("MOCK: MongoDB connected");
    return Promise.resolve();
  };
  
  // Start server on a dynamic port
  process.env.PORT = 0;
  process.env.MONGO_URI = "mongodb://mock"; 
  
  const appModule = await import("../index.js");
  server = await appModule.start();
  
  // Wait for server to be listening
  if (!server.listening) {
    await new Promise((resolve) => server.once("listening", resolve));
  }
  
  const { port } = server.address();
  baseUrl = `http://localhost:${port}/api`;
});

test.after(async () => {
  if (server) {
    if (server.closeAllConnections) server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

test("Health check integration", async () => {
  const res = await fetch(`${baseUrl}/health`);
  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.status, "ok");
});

test("AI ask validation - empty question", async () => {
  const res = await fetch(`${baseUrl}/ai/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: "" })
  });
  assert.strictEqual(res.status, 422, "Should return 422 for empty question");
});

test("Reporter incidents validation - invalid type", async () => {
  const res = await fetch(`${baseUrl}/reporter/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "invalid_type",
      description: "Test",
      location: { lat: 0, lng: 0 }
    })
  });
  assert.strictEqual(res.status, 422, "Should return 422 for invalid type");
});

test("Reporter booth status - no data", async () => {
  const res = await fetch(`${baseUrl}/reporter/booths/non-existent-booth/status`);
  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.status, "no_data");
});

test("Informer candidates - mock response", async () => {
  const res = await fetch(`${baseUrl}/informer/candidates?constituency=central`);
  assert.strictEqual(res.status, 200);
});
