import mongoose from 'mongoose';

const MajorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  topics: { type: [String], default: [] }
});

export default mongoose.model('Major', MajorSchema);