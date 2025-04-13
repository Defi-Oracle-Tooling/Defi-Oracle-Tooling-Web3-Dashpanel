import express from "express";

const app = express();
const PORT = process.env.PORT || 4003;

app.use(express.json());

app.get("/microservice", (req, res) => {
    res.json({ message: "Dodoex.io Standard Microservice endpoint" });
});

app.listen(PORT, () => {
    console.log(`Dodoex.io Standard Microservice running on port ${PORT}`);
});
