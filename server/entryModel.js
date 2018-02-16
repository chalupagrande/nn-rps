const mongoose = require('mongoose')

// define the User model schema
const EntrySchema = new mongoose.Schema({
  session: {
    type: Number,
    index: { unique: true }
  },
  results: [Number],
  stats : {
    win: Number,
    tie: Number,
    loss: Number,
    total: Number
  }
});

module.exports = mongoose.model('Entry', EntrySchema)