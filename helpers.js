const key = {
  'rock': [1,0,0],
  'paper': [0,1,0],
  'scissors': [0,0,1],
  '[1,0,0]': 'rock',
  '[0,1,0]': 'paper',
  '[0,0,1]': 'scissors',
}

function convertRPStoArray(game){
  let key = {
    'rock': [1,0,0],
    'paper': [0,1,0],
    'scissors': [0,0,1]
  }
  return game.map(e => key[e])
}

function getResults(cb){
  EntryModel.find({})
  .then(res => cb(res))
  .catch(err=> console.log(err))
}

function combineGames(entries){
  let result = []
  entries.forEach((entry)=>{
    result = result.concat(entry.game)
  })
  return result
}

function analyzeResults(games){
  const results = {
    wins: 0,
    losses: 0,
    ties:0,
    total: games.length,
    rock: 0,
    paper: 0,
    scissors: 0,
    rockWins: 0,
    paperWins: 0,
    scissorsWins: 0,
    longestStreak: 0,
  }
  let currentStreak = 0

  games.forEach(entry =>{
    let c1 = key[JSON.stringify(entry[0])]
    let c2 = key[JSON.stringify(entry[1])]

    results[c1] += 1
    let gameResult = determineWinner(c1,c2)
    if(gameResult > 0){
      results.wins +=1
      results[`${c1}Wins`] += 1
      currentStreak +=1
    } else if(gameResult == 0){
      results.ties +=1
      checkStreak()  
    } else {
      results.losses +=1
      checkStreak()
    }
  })

  function checkStreak(){
    if(currentStreak > results.longestStreak) results.longestStreak = currentStreak
    currentStreak = 0
  }

  return results
}

function determineWinner(c1, c2){
  if(c1 == 'rock'){
    if(c2 == 'rock') return 0
    if(c2 == 'scissors') return 1
    if(c2 == 'paper') return -1
  }
  else if(c1 == 'paper'){
    if(c2 == 'paper') return 0
    else if(c2 == 'rock') return 1
    else if(c2 == 'scissors') return -1
  }
  else if(c1 == 'scissors'){
    if(c2 == 'scissors') return 0
    else if(c2 == 'paper') return 1
    else if(c2 == 'rock') return -1
  }
}

// Choose random play. Rock, Paper, or Scissors
function chooseRandom(){
  const choices = ['rock', 'paper', 'scissors']
  return choices[Math.floor(Math.random()*3)]
}

function p(n,t){
  return Math.round(((n/t)*1000)/10) + '%'
}


module.exports = {
  combineGames,
  determineWinner,
  chooseRandom,
  p,
  key,
  convertRPStoArray
}