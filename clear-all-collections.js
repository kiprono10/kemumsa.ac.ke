require('dotenv').config();
const mongoose = require('mongoose');

async function clearAllCollections() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const collections = ['events', 'members', 'executives', 'classleaders', 'resources', 'messages', 'communications', 'admins'];
    
    for (const collection of collections) {
      try {
        const result = await mongoose.connection.collection(collection).deleteMany({});
        console.log(`✅ Cleared ${collection}: ${result.deletedCount} documents`);
      } catch (e) {
        console.log(`⚠️ ${collection}: ${e.message}`);
      }
    }
    
    await mongoose.disconnect();
    console.log('\n✅ All collections cleared');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

clearAllCollections();
