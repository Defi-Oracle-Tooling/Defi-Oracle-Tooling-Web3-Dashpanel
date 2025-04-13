import express from "express";
import leverRouter from "./routes/lever";

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use("/lever", leverRouter);

app.listen(PORT, () => {
  console.log(`Aave-Special-Lever service running on port ${PORT}`);
});
