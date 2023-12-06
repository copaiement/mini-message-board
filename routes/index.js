const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

// import schema
const Message = require('../models/message');

mongoose.set('strictQuery', false);

// MongoDB access URL (hide this later?)
const mongoDB = 'mongodb+srv://MessageAdmin:vttq3Ci9GQU4Decz@cluster0.qz7yuhz.mongodb.net/message-board?retryWrites=true&w=majority';

// local messages variable
let messages = [];

// access DB and read messages
async function load() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  const newMessages = [];
  const cursor = Message.find().sort({ added: -1 }).cursor();
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    newMessages.push(doc);
  }

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
  messages = newMessages;
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

// initial load of messages
load().catch((err) => console.log(err));

// Index Route Main

/* GET home page. */
router.get('/', (req, res, next) => {
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
  update(newMsg);
  // add newMsg to local array
  const oldMessages = messages;
  messages = [newMsg];
  oldMessages.forEach((msg) => messages.push(msg));
  // redirect to home
  res.redirect('/');
});

// REFRESH
router.get('/refresh', async (req, res, next) => {
  console.log('refresh');
  await load().catch((err) => console.log(err));
  res.redirect('/');
});

module.exports = router;
