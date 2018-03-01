// Imports
const express = require('express')
const EntryModel = require('./models/entryModel')
const SessionModel = require('./models/sessionModel')
const {Architect} = require('synaptic')
const {convertRPSGametoArray, combineGames} = require('../helpers')
const bodyParser = require('body-parser')
const cors = require('cors')
const request = require('request')

// NEURAL NETWORKS
// 3 options (rps) * 2 players * 3 games
let gamesToRemember = 3
const Annette = new Architect.Perceptron(3 * 2 * gamesToRemember, 12, 3)

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
  SessionModel.findOneAndUpdate({sessionMasterId: true}, 
                                {$inc: {sessionId: 1}},
                                {upsert: true})
    .then(idobj => res.send({sessionId: idobj.sessionId}))
    .catch(err => handleError(err, res))
})

/*
  ENTRY
~~~~~~~~~~~~~~~~~~~~ */
apiRouter.post('/entry', (req, res)=>{
  let d = req.body
  d.game = convertRPSGametoArray(d.game)
  let entry = new EntryModel(d)
  EntryModel.findOneAndUpdate({sessionId: d.sessionId},
                              {$push: {game: d.game},
                              net: ()=> console.log('jamie')},
                              {upsert: true},)
    .then((resEntry) => {
      trainAnnette()
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


apiRouter.post('/net/annette', (req,res)=>{
  console.log('FETCHING PREDICTION ON:',req.body)
  let prediction = Annette.activate(req.body)
  res.send({success: true, msg: prediction})

})

function trainAnnette(){
  EntryModel.find({})
    .then(games => {
      let combinedGames = combineGames(games)
      if(combinedGames.length >= gamesToRemember+1){
        console.log('TRAINING ON ', combinedGames)
        trainPerceptron(combinedGames, gamesToRemember)
      }
    })
    .catch((err)=> console.log('THERE WAS AN ERROR TRAINING', err))
}

function trainPerceptron(games, toRemember){
  let numInputs = toRemember*3*2
  for(let i = toRemember; i<games.length; i++){
    let inputs = []
    for(let j = toRemember; j>0;j--){
      //[0] position is the PLAYERS GAME
      inputs = inputs.concat(games[i-j][0])
      inputs = inputs.concat(games[i-j][1])
    }
    Annette.activate(inputs)
    Annette.propagate(0.45, games[i][0])
  }
}


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