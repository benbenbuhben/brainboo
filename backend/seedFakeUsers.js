import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import { faker } from '@faker-js/faker';
import User from './models/User.js';
import Swipe from './models/Swipe.js';
// Import the shared arrays
import { majors, topics } from './constants.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/brainboo';

// Helper function for interactive prompts
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// Helper to get N random unique topics from the topics array
function getRandomTopics(topicArr, maxCount = 3) {
  // Shuffle the array
  const shuffled = topicArr.slice().sort(() => 0.5 - Math.random());
  // Then return a slice (1 to maxCount)
  const count = Math.floor(Math.random() * maxCount) + 1; // e.g. 1..maxCount
  return shuffled.slice(0, count);
}

async function main() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB for seeding fake users');

  const currentUserCount = await User.countDocuments({});
  const existingUsers = await User.find({});

  // Warn if there are more than 10 users
  if (currentUserCount > 10) {
    const answer = await askQuestion(
      `Warning: There are already ${currentUserCount} users in the database. Do you want to proceed with seeding fake users? (y/n) `
    );
    if (answer !== 'y') {
      console.log('Aborting seeding.');
      process.exit(0);
    }
  }

  // Warn if there are no users
  if (currentUserCount === 0) {
    const answer = await askQuestion(
      'Warning: There are no users in the database. Proceed with seeding fake users? (y/n) '
    );
    if (answer !== 'y') {
      console.log('Aborting seeding.');
      process.exit(0);
    }
  }

  // Prepare fake user data
  const NUM_USERS = 20;
  const fakeUsersData = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const randomMajor = majors[Math.floor(Math.random() * majors.length)];
    const randomTopics = getRandomTopics(topics, 5); // up to 5 topics, for example

    fakeUsersData.push({
      auth0Id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      profilePicture: faker.image.avatar(),
      major: randomMajor,
      topics: randomTopics,
      bio: faker.lorem.sentence(),
    });
  }

  let newFakeUsers = [];
  try {
    newFakeUsers = await User.insertMany(fakeUsersData);
    console.log(`Seeded ${newFakeUsers.length} fake users`);
  } catch (error) {
    console.error('Error inserting fake users:', error);
    process.exit(1);
  }

  // Optionally insert random swipes
  if (existingUsers.length > 0) {
    const answer = await askQuestion(
      'Do you want to add random swipe records for the new fake users? (y/n) '
    );
    if (answer === 'y') {
      const swipesToInsert = [];
      for (const newUser of newFakeUsers) {
        const numSwipes = Math.floor(Math.random() * Math.min(3, existingUsers.length)) + 1;
        const shuffled = existingUsers.slice().sort(() => 0.5 - Math.random());
        const selectedUsers = shuffled.slice(0, numSwipes);
        for (const existingUser of selectedUsers) {
          swipesToInsert.push({
            swiper: newUser._id,
            swipee: existingUser._id,
            liked: Math.random() < 0.5,
            createdAt: new Date(),
          });
        }
      }
      try {
        await Swipe.insertMany(swipesToInsert);
        console.log(`Inserted ${swipesToInsert.length} swipe records for new fake users`);
      } catch (error) {
        console.error('Error inserting swipe records:', error);
      }
    } else {
      console.log('Skipping swipe record insertion.');
    }
  } else {
    console.log('No existing users found; skipping swipe record insertion.');
  }

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

main().catch((err) => {
  console.error('Error in seeding process:', err);
  process.exit(1);
});
