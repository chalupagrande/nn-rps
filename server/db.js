const mongoose = require('mongoose');

//set Promise library for mongoose
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/test', {}, err => {
  if(!err) console.log('Connection to database succeeded')
  else console.log('ERROR: FAILED TO CONNECT TO DATABASE \n' + err)
});

const db = mongoose.connection;
exports.db = db;