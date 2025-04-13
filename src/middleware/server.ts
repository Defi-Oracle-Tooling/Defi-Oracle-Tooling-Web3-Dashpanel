import express from "express";
import cors from "cors";
import helmet from "helmet"; // Import helmet
import authRouter from "./routes/auth";
import tatumIntegration from "./integrations/tatum";
import dodoexIntegration from "./integrations/dodoex";
import aaveSpecialLeverIntegration from "./integrations/aave_special_lever";
import strategyAgent from "./ai_agents/strategyAgent";
import logger from "./logger";
import globalErrorHandler from "./errorHandler"; // Import the error handler

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet()); // Use helmet for security headers
app.use(express.json());

// Routes
app.use("/auth", authRouter);

// Example integration endpoints
app.get("/integration/tatum", async (req, res, next) => {
  try {
    const result = await tatumIntegration();
    res.json(result);
  } catch (error) {
    next(error); // Pass error to global handler
  }
});

app.get("/integration/dodoex", async (req, res, next) => {
  try {
    const result = await dodoexIntegration();
    res.json(result);
  } catch (error) {
    next(error); // Pass error to global handler
  }
});

app.get("/integration/aave", async (req, res, next) => {
  try {
    const result = await aaveSpecialLeverIntegration();
    res.json(result);
  } catch (error) {
    next(error); // Pass error to global handler
  }
});

// Initialize AI agent (could be a background job)
strategyAgent.start();

// Global Error Handler - Must be the last middleware
app.use(globalErrorHandler);

app.listen(PORT, () => {
  logger.info(`Unified middleware server listening on port ${PORT}`);
});
