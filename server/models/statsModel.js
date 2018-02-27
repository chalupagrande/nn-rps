const mongoose = require('mongoose')

// define the User model schema
const statsModel = new mongoose.Schema({
  name: String,
  stats : {
    win: Number,
    tie: Number,
    loss: Number,
    total: Number
  }
});

module.exports = mongoose.model('stats', statsModel)