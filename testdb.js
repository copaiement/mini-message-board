#! /usr/bin/env node

console.log('Script to test populating DB with messages');

const Message = require('./models/message');

const messages = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// MongoDB access URL
const mongoDB = 'mongodb+srv://MessageAdmin:vttq3Ci9GQU4Decz@cluster0.qz7yuhz.mongodb.net/message-board?retryWrites=true&w=majority';

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createMessages();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function messageCreate(index, text, user, added) {
  const messagedetail = {
    text: text,
    user: user,
    added: added,
  };

  const message = new Message(messagedetail);
  await message.save();
  messages[index] = message;
  console.log(`Added message: ${text}`);
}

async function createMessages() {
  console.log('Adding Messages');
  await Promise.all([
    messageCreate(
      0,
      'This is a test',
      'TestUser',
      '2021-01-02',
    ),
    messageCreate(
      1,
      'Supatest',
      'Test Man',
      '2023-06-30',
    ),
    messageCreate(
      2,
      'I am a',
      'Robot',
      '2015-12-10',
    ),
    messageCreate(
      3,
      'WE ATE THE PEOPLE',
      'Cannibal Karl',
      '1963-10-10',
    ),
  ]);
}
