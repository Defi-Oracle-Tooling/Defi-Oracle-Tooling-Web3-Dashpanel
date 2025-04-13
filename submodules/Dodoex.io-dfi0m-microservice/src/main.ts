import express from "express";

const app = express();
const PORT = process.env.PORT || 4004;

app.use(express.json());

app.get("/microservice", (req, res) => {
    res.json({ message: "Dodoex.io DFI0M Microservice endpoint" });
});

app.listen(PORT, () => {
    console.log(`Dodoex.io DFI0M Microservice running on port ${PORT}`);
});
