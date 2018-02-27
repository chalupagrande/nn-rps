const {Architect,
      Network,
      Neuron,
      Layer,
      Trainer} = require('synaptic');


//create Annette to predict users next move
function createAndTrainPerceptron(games, toRemember){
  let numInputs = toRemember*3
  let a = new Architect.Perceptron(numInputs, Math.ceil(numInputs*0.75),3)
  for(let i = toRemember; i<games.length; i++){
    let inputs = []
    for(let j = toRemember; j>0;j--){
      //[0] position is the PLAYERS GAME
      inputs = inputs.concat(games[i-j][0])
    }
    a.activate(inputs)
    a.propagate(0.3, games[i][0])
  }
  return a
}

function createLSTM(){
  return new Architect.LSTM.length()
}


//AS OF 2/19/18: from user perspective
// let results = {
//   "wins":602,
//   "losses":657,
//   "ties":612,
//   "total":1871,
//   "rock":639,
//   "paper":590,
//   "scissors":642,
//   "rockWins":193,
//   "paperWins":207,
//   "scissorsWins":202,
//   "longestStreak":7
// }

// //aux results 
// let auxResults = {
//   winPercentage: 32.18,
//   tiePercentage: 32.71,
//   lossPercentage: 35.11,
// }

module.exports = {
    createAndTrainPerceptron,
  }