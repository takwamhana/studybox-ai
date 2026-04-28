import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedDemoUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@example.com' });
    if (existingUser) {
      console.log('✅ Demo user already exists');
      await mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash('Demo123', 10);

    const demoUser = new User({
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
      avatar: null,
      preferences: { favoriteFields: [], favoriteStyles: [] },
      badges: [
        { id: 'first-box', name: '🚀 First Box Created', unlockedAt: new Date(), progress: 100 }
      ],
      statistics: {
        totalBoxes: 3,
        totalOrders: 1,
        totalSpent: 45.99,
        favoriteFields: ['STEM', 'Mathematics']
      }
    });

    await demoUser.save();
    console.log('✅ Demo user created successfully');
    console.log('   Email: demo@example.com');
    console.log('   Password: Demo123');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding demo user:', error);
    process.exit(1);
  }
}

seedDemoUser();
