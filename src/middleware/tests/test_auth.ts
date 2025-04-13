import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import authRouter from "../routes/auth";

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

describe("Authentication API", () => {
  it("should return error for missing credentials", async () => {
    const res = await request(app).post("/auth").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return a token for valid credentials", async () => {
    const res = await request(app).post("/auth").send({
      username: "user",
      password: "pass"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});
