const express = require('express');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());
app.use(cors());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get('/', (req, res) => res.send('hello'));

app.post('/write-lyrics', async (req, res) => {
    console.log(req.body)
    const prompt = req.body.prompt;
    try {
        if (prompt == null) {
            throw new Error("No prompt was provided");
        }
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            temperature: 0.8,
            max_tokens: 100,
        });
        const completion = response.data.choices[0].text;
        console.log(completion);
        return res.status(200).json({
            success: true,
            message: completion,
        });
    } catch (error) {
        console.log(error.message)
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));