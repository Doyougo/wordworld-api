import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.DEEPSEEK_API_KEY;

app.post('/ask', async (req, res) => {
    const word = req.body.word;

    const prompt = `Give synonym, antonym, English definition and example sentence for the word: "${word}"`;

    try {
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5
        }, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const result = response.data.choices[0].message.content;
        res.send({ result });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send("Failed to get response from DeepSeek.");
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
