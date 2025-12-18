const express = require('express');
const router = express.Router();

const translationClient = require('../grpcClients/translationClient');
const audioClient = require('../grpcClients/audioClient');

let users = {};
let chatHistory = [];

router.post('/language', (req, res) => {
  const { userId, language } = req.body;
  
  if (!userId || !language) {
    return res.status(400).json({ error: "userId and language required" });
  }
  
  users[userId] = language;
  res.json({ message: "Language saved" });
});

router.post('/message/text', (req, res) => {
  const { sender, receiver, text } = req.body;
  
  if (!sender || !receiver || !text) {
    return res.status(400).json({ error: "sender, receiver, and text required" });
  }
  
  const lang = users[receiver];
  
  if (!lang) {
    return res.status(400).json({ error: "Receiver language not set" });
  }

  translationClient.translateText(text, lang, (translatedText) => {
    if (!translatedText) {
      return res.status(500).json({ error: "Translation failed" });
    }
    chatHistory.push({ sender, receiver, translatedText });
    res.json({ translatedText });
  });
});

router.post('/message/audio', (req, res) => {
  if (!req.body.audio) {
    return res.status(400).json({ error: "audio data required" });
  }
  
  const audioBuffer = Buffer.from(req.body.audio, 'base64');

  audioClient.processAudio(audioBuffer, (response) => {
    if (!response) {
      return res.status(500).json({ error: "Audio processing failed" });
    }
    res.json({
      audio: response.toString('base64')
    });
  });
});

module.exports = router;