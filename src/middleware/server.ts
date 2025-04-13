import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import express from "express";
import cors from "cors";
import helmet from "helmet"; // Import helmet
import authRouter from "./routes/auth";
import integrationRouter from "./routes/integrations"; // Import the integrations router
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
app.use("/integrations", integrationRouter); // Use the integrations router

// Initialize AI agent (could be a background job)
strategyAgent.start();

// Global Error Handler - Must be the last middleware
app.use(globalErrorHandler);

app.listen(PORT, () => {
  logger.info(`Unified middleware server listening on port ${PORT}`);
});
