import express from "express";

const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json());

app.get("/platform", (req, res) => {
  res.json({ message: "Absolute Realms Nexgen Platform endpoint" });
});

app.listen(PORT, () => {
  console.log(`Absolute Realms Nexgen Platform service running on port ${PORT}`);
});
