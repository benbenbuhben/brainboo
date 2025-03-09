import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// POST /api/chats/summary
router.post('/summary', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'Missing senderId or receiverId in request body.' });
    }

    // Fetch messages and build the transcript as before…
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ createdAt: 1 });
    const transcript = messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
    const prompt = `Please summarize the following conversation:\n\n${transcript}`;

    const ollamaUrl = 'http://ollama:11434/api/generate';
    // Set stream: true for streaming response
    const ollamaResponse = await fetch(ollamaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: "gemma2:2b", prompt, stream: true })
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API responded with status ${ollamaResponse.status}`);
    }

    // Set headers to support streaming
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache'
    });

    // Create a reader to stream data from Ollama
    const reader = ollamaResponse.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      res.write(chunk); // send chunk to client
    }
    res.end();
  } catch (error) {
    console.error('Error summarizing chat:', error);
    res.status(500).json({ error: 'Failed to summarize chat' });
  }
});


export default router;
