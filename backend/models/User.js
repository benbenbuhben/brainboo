import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  profilePicture: { type: String, default: '' },
  major: { type: String, default: '' },
  topics: { type: [String], default: [] },
  bio: { type: String, default: '' },
  profileComplete: { type: Boolean, default: false },
});


// Pre-save hook to recalculate profileComplete
UserSchema.pre('save', function(next) {
  this.profileComplete = !!(this.major && this.topics && this.topics.length > 0);
  next();
});

export default mongoose.model('User', UserSchema);
