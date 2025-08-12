import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/ask", async (req, res) => {
    const { question } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful coding assistant." },
                { role: "user", content: question }
            ]
        })
    });

    const data = await response.json();
    res.json(data);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
app.get('/', function (req, res) {
  res.render('index', {});
});