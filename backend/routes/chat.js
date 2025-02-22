import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/:senderId/:receiverId', async (req, res) => {
    const { senderId, receiverId } = req.params;
    const { limit = 10, skip = 0} = req.query;
    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        res.json(messages.reverse());
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve messages.' });
    }
});

router.post('/', async (req, res) => {
    const { senderId, receiverId, content } = req.body;
    try {
        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            content
        });
        await message.save();
        res.json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
});


export default router;

