require('dotenv').config();
const mongoose = require('mongoose');
const { Event } = require('./models');

async function verifyAndDeleteEvents() {
  try {
    console.log('📡 MongoDB URI:', process.env.MONGODB_URI ? '✅ Connected' : '❌ Not set');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📊 Checking events...');
    const countBefore = await Event.countDocuments();
    console.log(`Events found: ${countBefore}`);

    if (countBefore > 0) {
      console.log('\n📋 Event list:');
      const events = await Event.find().select('title date');
      events.forEach((e, i) => {
        console.log(`  ${i + 1}. ${e.title} (${e.date})`);
      });

      console.log('\n🗑️ Deleting all events...');
      const result = await Event.deleteMany({});
      console.log(`✅ Deleted ${result.deletedCount} events`);

      const countAfter = await Event.countDocuments();
      console.log(`Remaining events: ${countAfter}`);
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyAndDeleteEvents();
