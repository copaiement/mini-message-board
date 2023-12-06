const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

// import schema
const Message = require('../models/message');


mongoose.set('strictQuery', false);

// MongoDB access URL (hide this later?)
const mongoDB = 'mongodb+srv://MessageAdmin:vttq3Ci9GQU4Decz@cluster0.qz7yuhz.mongodb.net/message-board?retryWrites=true&w=majority';

// access DB and read messages
async function load() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  const messages = [];
  const cursor = Message.find().sort({ added: -1 }).cursor();
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    messages.push(doc);
  }

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
  return messages;
}

// function to update DB
async function update(newMsg) {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');

  await Message.create(newMsg);

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// Index Route Main

/* GET home page. */
router.get('/', async (req, res, next) => {
  const messages = await load().catch((err) => console.log(err));
  res.render('index', { title: 'Mini Message Board', messages: messages });
});

/* GET new message page. */
router.get('/new', (req, res, next) => {
  res.render('form', { title: 'New Message' });
});

// POST new message
router.post('/new', async (req, res, next) => {
  const newMsg = { text: req.body.msg, user: req.body.usr, added: new Date() };
  // update DB with new message
  await update(newMsg);
  // redirect to home
  res.redirect('/');
});

module.exports = router;
