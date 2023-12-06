const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  text: { type: String, required: true },
  user: { type: String, required: true },
  added: { type: Date, required: true },
});

// Virtual for book's URL
MessageSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/book/${this._id}`;
});

// Export model
module.exports = mongoose.model('Message', MessageSchema);
