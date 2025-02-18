// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/brainboo';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB for seeding fake users');

    // Optional: Clear existing users if you want a fresh start
    await User.deleteMany({});
    console.log('Cleared existing users');

    const fakeUsers = [];
    const NUM_USERS = 20; // Adjust the number as needed

    for (let i = 0; i < NUM_USERS; i++) {
      fakeUsers.push({
        auth0Id: faker.string.uuid(),      // Unique identifier for the user (simulating Auth0's ID)
        email: faker.internet.email(),         // Random email
        name: faker.person.fullName(),           // Random full name
        profilePicture: faker.image.avatar(),  // URL to a random avatar image
        major: faker.commerce.department(),     // Using a commerce department as a stand-in for "major"
        topics: [
          faker.lorem.word(),
          faker.lorem.word(),
          faker.lorem.word()
        ],                                     // Array of random topics
        bio: faker.lorem.sentence()            // A random sentence for the bio
      });
    }

    await User.insertMany(fakeUsers);
    console.log(`Seeded ${NUM_USERS} fake users`);

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
