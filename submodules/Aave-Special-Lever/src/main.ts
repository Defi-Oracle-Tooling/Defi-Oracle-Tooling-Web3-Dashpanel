import express from "express";
import leverRouter from "./routes/lever";

// Assuming a shared logger setup or replace with submodule-specific logging
// import logger from '../../src/middleware/logger'; // Adjust path if needed

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use("/lever", leverRouter);

app.listen(PORT, () => {
  // console.log(`Aave-Special-Lever service running on port ${PORT}`);
  // Replace with actual logger if available, otherwise keep console for submodule
  console.log(`Aave-Special-Lever service running on port ${PORT}`);
});
