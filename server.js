const express = require("express");
const cors = require("cors");
const { TranslateClient, TranslateTextCommand } = require("@aws-sdk/client-translate");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const client = new TranslateClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.post("/translate", async (req, res) => {
  try {
    const MAX_TEXT_LENGTH = 4500; // Byte-basiert sicherer Wert
    const inputText = req.body.text.slice(0, MAX_TEXT_LENGTH);

    const params = {
      Text: inputText,
      SourceLanguageCode: "en",
      TargetLanguageCode: "de",
    };

    const command = new TranslateTextCommand(params);
    const response = await client.send(command);

    res.json({ translatedText: response.TranslatedText });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed", details: error });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
