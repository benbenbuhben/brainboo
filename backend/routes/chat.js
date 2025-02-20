import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/:senderId/:receiverId', async (req, res) => {
    const { senderId, receiverId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve messages.' });
    }
});

export default router;