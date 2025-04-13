import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import tatumIntegration from "./integrations/tatum";
import dodoexIntegration from "./integrations/dodoex";
import aaveSpecialLeverIntegration from "./integrations/aave_special_lever";
import strategyAgent from "./ai_agents/strategyAgent";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRouter);

// Example integration endpoints
app.get("/integration/tatum", async (req, res) => {
  const result = await tatumIntegration();
  res.json(result);
});

app.get("/integration/dodoex", async (req, res) => {
  const result = await dodoexIntegration();
  res.json(result);
});

app.get("/integration/aave", async (req, res) => {
  const result = await aaveSpecialLeverIntegration();
  res.json(result);
});

// Initialize AI agent (could be a background job)
strategyAgent.start();

app.listen(PORT, () => {
  console.log(`Unified middleware server listening on port ${PORT}`);
});
