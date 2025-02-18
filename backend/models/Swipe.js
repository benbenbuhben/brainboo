import mongoose from 'mongoose';

const SwipeSchema = new mongoose.Schema({
  swiper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  swipee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  liked: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Ensure a user can only swipe once per other user.
SwipeSchema.index({ swiper: 1, swipee: 1 }, { unique: true });

export default mongoose.model('Swipe', SwipeSchema);
