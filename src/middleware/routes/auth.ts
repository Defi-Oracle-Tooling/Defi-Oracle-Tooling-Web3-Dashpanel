import { Router, Request, Response } from "express";

const router = Router();

// Dummy authentication endpoint
router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  // TODO: Replace with actual authentication logic
  // - Hash and compare password securely (e.g., using bcrypt)
  // - Generate a session token (e.g., JWT)
  // - Potentially integrate with Tatum.io for user verification if applicable
  if (username === "admin" && password === "password") {
    res.json({ message: "Login successful (dummy)", token: "dummy-jwt-token" });
  } else {
    res.status(401).json({ message: "Invalid credentials (dummy)" });
  }
});

export default router;
