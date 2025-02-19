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

UserSchema.index({ auth0Id: 1 }, { unique: true });

// Pre-save hook to recalculate profileComplete
UserSchema.pre('save', function(next) {
  console.log('Pre-save hook called');
  console.log('Major:', this.major);
  console.log('Topics:', this.topics);
  this.profileComplete = !!(this.major && this.topics && this.topics.length > 0);
  next();
});

export default mongoose.model('User', UserSchema);
