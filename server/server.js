const express = require('express')
const apiRouter = require('./apiRouter')
const SessionModel = require('./sessionModel')
const dbConnection = require('./db')

//set original sessions
SessionModel.findOneAndUpdate({
                              sessionMasterId: true
                            },{
                              sessionMasterId: true,
                              sessionId: 1000
                            }, {
                              upsert: true,
                            })
          .then(res => console.log(res))
          .catch(err => console.log('THERE WAS AN ERROR: ', err))

const app = express()

//FOR BLUEMIX
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use('/', express.static('client'))
app.use('/api', apiRouter)



app.listen(port)
console.log(`listening on ${port}`)
