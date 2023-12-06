const Message = require('./models/message');

const messages = [];

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const cursor = Message.find().cursor();

// MongoDB access URL
const mongoDB = 'mongodb+srv://MessageAdmin:vttq3Ci9GQU4Decz@cluster0.qz7yuhz.mongodb.net/message-board?retryWrites=true&w=majority';

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    console.log(doc); // Prints documents one at a time
  }
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}
