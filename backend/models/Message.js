import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: String, ref: 'User', required: true }, // Auth0 ID
  receiver: { type: String, ref: 'User', required: true }, // Auth0 ID
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Message', MessageSchema);