const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./db')
const EntryModel = require('./entryModel')

const app = express()
const apiRouter = express.Router()

apiRouter.use(cors())
apiRouter.use(bodyParser.urlencoded({extended: false}))
apiRouter.use(bodyParser.json())

//FOR BLUEMIX
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use('/', express.static('client'))
app.use('/api', apiRouter)

apiRouter.get('/', (req, res)=>{
  res.send("You've reached the Neural Net API.")
})

apiRouter.post('/test', (req,res)=>{
  console.log(req.body)
  let d = convertRPStoArray(req.body.game)
  res.send(d)
})

apiRouter.post('/entry', (req, res)=>{
  let entry = new EntryModel(req.body)
  entry.save((err, entry) =>{
    if(err){
      res.send({
        success: false,
        msg: err
      })
    } else {
      res.send({
        success: true,
        msg: 'Entry Saved',
        entry,
      })
    }
  })
})

app.listen(port)
console.log(`listening on ${port}`)


/*
  HELPERS
~~~~~~~~~~~~~~~~~~~~ */
function convertRPStoArray(game){
  let key = {
    'rock': [1,0,0],
    'paper': [0,1,0],
    'scissors': [0,0,1]
  }
  return game.map(e => key[e])
}