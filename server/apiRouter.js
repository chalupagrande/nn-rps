// Imports
const express = require('express')
const EntryModel = require('./entryModel')
const {convertRPStoArray} = require('../helpers')
const bodyParser = require('body-parser')
const cors = require('cors')
const request = require('request')

// create router
const apiRouter = new express.Router()

// setup middleware
apiRouter.use(cors())
apiRouter.use(bodyParser.urlencoded({extended: false}))
apiRouter.use(bodyParser.json())

//set endpounts
apiRouter.get('/', (req, res)=>{
  res.send("You've reached the Neural Net API.")
})

apiRouter.post('/test', (req,res)=>{
  console.log(req.body)
  res.send('recieved ' + req.body)
})

apiRouter.get('/session', (req, res)=>{
  EntryModel.findOneAndUpdate({sessionMasterId: true}, {sessionId: $inc})
    .then(idobj => res.send({
      sessionId: idobj.sessionId
    }))
})

apiRouter.post('/entry', (req, res)=>{
  let d = req.body
  d.game = convertRPStoArray(d.game)
  let entry = new EntryModel(d)
  EntryModel.findOne({sessionId: d.sessionId})
    .then((resEntry) => {
      if(resEntry){
        resEntry.game.push(entry.game)
        resEntry.stats = entry.stats
        return resEntry.save((e,m)=>handleSave(e,m, res))
      } else {
        entry.game = [entry.game]
        entry.save((e,m) => handleSave(e,m, res))
      }
    })
    .catch(err => handleError(err, res))
                              
})

apiRouter.get('/entry', (req, res)=>{
  EntryModel.findOne({sessionId: req.body.sessionId})
    .then(resEntry =>{
      if(resEntry) res.send({
        success: true,
        body: resEntry,
      })
      else res.send({
        success: false,
        msg: 'No entry found'
      })
    })
})

apiRouter.get('/entry/all', (req, res)=>{
  EntryModel.find({})
    .then(resEntry =>{
      if(resEntry) res.send({
        success: true,
        body: resEntry,
      })
      else res.send({
        success: false,
        msg: 'No entry found'
      })
    })
})

/*
  HELPERS
~~~~~~~~~~~~~~~~~~~~ */
function handleSave(err, model, res){
  if(err) return handleError(err, res)
  else return res.send({success: true, model})
}

function handleError(err, res){
  console.log(err)
  sendErrorRequest(err)
  return res.send({success: false, msg: err})
}

function sendErrorRequest(err){
  let str = err
  if(typeof err != 'string'){
    str = "```\n" + JSON.stringify + "\n```"
  } 
  request({
    method: 'POST',
    uri: "https://hooks.slack.com/services/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",
    body: {text: str},
    json: true
  },(err, a)=>{
    if(err) console.log('ERROR', err)
    else console.log(a)
  })
}

//export
module.exports = apiRouter