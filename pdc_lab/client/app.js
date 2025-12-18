const API_BASE = 'http://localhost:3000/api';
let totalRequests = 0;

// Set Language Preference
async function setLanguage() {
  const userId = document.getElementById('userId').value;
  const language = document.getElementById('language').value;
  const resultDiv = document.getElementById('languageResult');

  if (!userId || !language) {
    showResult(resultDiv, 'Please fill all fields', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/language`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, language })
    });

    const data = await response.json();
    
    if (response.ok) {
      showResult(resultDiv, `✅ ${data.message} for ${userId} → ${language}`, 'success');
      incrementRequests();
    } else {
      showResult(resultDiv, `❌ Error: ${data.error}`, 'error');
    }
  } catch (error) {
    showResult(resultDiv, `❌ Network Error: ${error.message}`, 'error');
  }
}

// Send Text Message
async function sendTextMessage() {
  const sender = document.getElementById('sender').value;
  const receiver = document.getElementById('receiver').value;
  const text = document.getElementById('messageText').value;
  const resultDiv = document.getElementById('textResult');
  const metricsDiv = document.getElementById('textMetrics');

  if (!sender || !receiver || !text) {
    showResult(resultDiv, 'Please fill all fields', 'error');
    return;
  }

  const startTime = performance.now();

  try {
    const response = await fetch(`${API_BASE}/message/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, receiver, text })
    });

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    const data = await response.json();
    
    if (response.ok) {
      showResult(resultDiv, `✅ Translation: "${text}" → "${data.translatedText}"`, 'success');
      showMetrics(metricsDiv, responseTime, JSON.stringify(data).length);
      document.getElementById('textTime').textContent = `${responseTime} ms`;
      incrementRequests();
    } else {
      showResult(resultDiv, `❌ Error: ${data.error}`, 'error');
    }
  } catch (error) {
    showResult(resultDiv, `❌ Network Error: ${error.message}`, 'error');
  }
}

// Send Audio Message
async function sendAudioMessage() {
  const audio = document.getElementById('audioData').value;
  const resultDiv = document.getElementById('audioResult');
  const metricsDiv = document.getElementById('audioMetrics');

  if (!audio) {
    showResult(resultDiv, 'Please provide audio data', 'error');
    return;
  }

  const startTime = performance.now();

  try {
    const response = await fetch(`${API_BASE}/message/audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio })
    });

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    const data = await response.json();
    
    if (response.ok) {
      showResult(resultDiv, `✅ Audio processed successfully!<br>Response: ${data.audio.substring(0, 30)}...`, 'success');
      showMetrics(metricsDiv, responseTime, JSON.stringify(data).length);
      document.getElementById('audioTime').textContent = `${responseTime} ms`;
      incrementRequests();
    } else {
      showResult(resultDiv, `❌ Error: ${data.error}`, 'error');
    }
  } catch (error) {
    showResult(resultDiv, `❌ Network Error: ${error.message}`, 'error');
  }
}

// Helper Functions
function showResult(element, message, type) {
  element.innerHTML = message;
  element.className = `result ${type}`;
}

function showMetrics(element, time, size) {
  element.innerHTML = `
    ⏱️ Response Time: <strong>${time} ms</strong><br>
    📦 Payload Size: <strong>${size} bytes</strong>
  `;
  element.className = 'metrics show';
}

function incrementRequests() {
  totalRequests++;
  document.getElementById('totalRequests').textContent = totalRequests;
}