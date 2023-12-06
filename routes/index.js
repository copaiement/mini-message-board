const express = require('express');

const router = express.Router();

// query DB for messages

const Message = require('../models/message');

const messages = [];

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const cursor = Message.find().sort({ added: -1 }).cursor();

// MongoDB access URL (hide this later?)

const mongoDB = 'mongodb+srv://MessageAdmin:vttq3Ci9GQU4Decz@cluster0.qz7yuhz.mongodb.net/message-board?retryWrites=true&w=majority';

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    messages.push(doc);
  }

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// Index Route Main

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mini Message Board', messages: messages });
});

/* GET new message page listing. */
router.get('/new', function(req, res, next) {
  res.render('form', { title: 'New Message' });
});

module.exports = router;

