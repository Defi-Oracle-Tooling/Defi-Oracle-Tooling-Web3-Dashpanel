import express from "express";

const app = express();
const PORT = process.env.PORT || 4005;

app.use(express.json());

app.get("/integration", (req, res) => {
    res.json({ message: "SolaceNet Integration endpoint" });
});

app.listen(PORT, () => {
    console.log(`SolaceNet Integration service running on port ${PORT}`);
});
