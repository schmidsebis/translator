
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const translate = new AWS.Translate({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

app.post('/translate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text must not be empty.' });
    }

    const params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'de',
      Text: text.substring(0, 5000) // AWS Translate Limit
    };

    const result = await translate.translateText(params).promise();
    res.json({ translatedText: result.TranslatedText });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ error: err.message || 'Translation failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
