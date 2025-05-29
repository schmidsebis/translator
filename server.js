const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

const translate = new AWS.Translate();

app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
  const { text, sourceLang = 'en', targetLang = 'de' } = req.body;

  const params = {
    SourceLanguageCode: sourceLang,
    TargetLanguageCode: targetLang,
    Text: text,
  };

  try {
    const result = await translate.translateText(params).promise();
    res.json({ translatedText: result.TranslatedText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});