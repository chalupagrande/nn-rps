const mongoose = require('mongoose')

// define the User model schema
const EntrySchema = new mongoose.Schema({
  sessionId: {
    type: Number,
    index: { unique: true }
  },
  game: Array,
  stats : {
    win: Number,
    tie: Number,
    loss: Number,
    total: Number
  }
});

module.exports = mongoose.model('Entry', EntrySchema)