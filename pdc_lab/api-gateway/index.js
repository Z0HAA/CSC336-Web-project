const express = require('express');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// ✅ CORS Middleware - MUST BE FIRST
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(bodyParser.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "🚀 Distributed Chat System API Gateway",
    status: "✅ Running",
    endpoints: {
      setLanguage: "POST /api/language",
      sendText: "POST /api/message/text",
      sendAudio: "POST /api/message/audio"
    }
  });
});

app.use('/api', chatRoutes);

app.listen(3000, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   API Gateway Running Successfully! ✅     ║
╚════════════════════════════════════════════╝

🌐 API: http://localhost:3000
📋 Endpoints ready: /api/language, /api/message/text, /api/message/audio

💡 Now open your UI in the browser!
  `);
});