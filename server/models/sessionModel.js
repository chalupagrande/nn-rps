const mongoose = require('mongoose')

// define the User model schema
const sessionSchema = new mongoose.Schema({
  sessionMasterId: Boolean,
  sessionId: Number
});

module.exports = mongoose.model('Session', sessionSchema)