const mongoose = require('mongoose')
require('mongoose-function')(mongoose)
// define the User model schema
const EntrySchema = new mongoose.Schema({
  sessionId: {
    type: Number,
    index: { unique: true }
  },
  game: Array,
  net: Function,
  stats : {
    win: Number,
    tie: Number,
    loss: Number,
    total: Number
  }
});

module.exports = mongoose.model('NNEntry', EntrySchema)