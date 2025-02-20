import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Index to optimize queries
// We assume that when creating a match, you order the user IDs so that user1 < user2.
MatchSchema.index({ user1: 1 });
MatchSchema.index({ user2: 1} );

export default mongoose.model('Match', MatchSchema);
