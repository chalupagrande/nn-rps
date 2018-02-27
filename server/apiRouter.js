// Imports
const express = require('express')
const EntryModel = require('./models/entryModel')
const SessionModel = require('./models/sessionModel')
const {convertRPSGametoArray, combineGames} = require('../helpers')
const {createAndTrainPerceptron} = require('./net/annette')
const bodyParser = require('body-parser')
const cors = require('cors')
const request = require('request')

let Annette;

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

/*
  SESSION
~~~~~~~~~~~~~~~~~~~*/
apiRouter.get('/session', (req, res)=>{
  SessionModel.findOneAndUpdate({sessionMasterId: true}, {$inc: {sessionId: 1}})
    .then(idobj => res.send({sessionId: idobj.sessionId}))
    .catch(err => handleError(err, res))
})

/*
  ENTRY
~~~~~~~~~~~~~~~~~~~~ */
apiRouter.post('/entry', (req, res)=>{
  let d = req.body
  console.log('updating sessiong: ' + d.sessionId)
  d.game = convertRPSGametoArray(d.game)
  let entry = new EntryModel(d)
  EntryModel.findOneAndUpdate({sessionId: d.sessionId},
                              {$push: {game: d.game}},
                              {upsert: true})
    .then((resEntry) => {
      console.log(resEntry)
      handleSave(resEntry, res)
    })
    .catch(err => handleError(err, res))
                              
})

apiRouter.get('/entry/:id', (req, res)=>{
  EntryModel.findOne({sessionId: req.params.id})
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
  NET
~~~~~~~~~~~~~~~~ */

apiRouter.get('/net/train', (req, res)=>{
  EntryModel.find({})
    .then((allEntries)=>{
      let games = combineGames(allEntries)
      global.Annette = createAndTrainPerceptron(games, 5)
      res.send({success: true, msg: 'Annette has been trained on all previous games'})
    }).catch(err =>{
      console.log(err)
      res.send({success: false, msg: err})
    })
})

apiRouter.post('/net/annette', (req, res)=>{
  let inputs = req.body
  console.log(inputs)
  let result = global.Annette.activate(inputs)
  res.send({success: true, msg: result})
})
/*
  STATS
~~~~~~~~~~~~~~~~ */

/*
  HELPERS
~~~~~~~~~~~~~~~~~~~~ */
function handleSave(model, res){
  return res.send({success: true, model})
}

function handleError(err, res){
  console.log(err)
  sendErrorRequest(err)
  return res.send({success: false, msg: err})
}

function sendErrorRequest(err){
  let str = err
  if(typeof err != 'string'){
    str = "```\n" + JSON.stringify(err) + "\n```"
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