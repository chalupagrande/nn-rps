'use strict';

var sessionId = 0;
var slackURI = '';
var endpoint = '/api/';
var myInit = {
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  mode: 'cors',
  cache: 'default'
};
var stats = {
  win: 0,
  tie: 0,
  loss: 0,
  total: 0
};
var counting = false;
// ^^^^ prevents multiple votes during countdown

// Event Listeners
var buttons = document.querySelectorAll('button');
buttons.forEach(function (b) {
  return b.addEventListener('click', function (e) {
    e.preventDefault();
    var val = e.target.value;
    if (!counting) handleVote(val);
  });
});

window.addEventListener('keydown', function (e) {
  var key = { 37: 'rock', 82: 'rock',
    80: 'paper', 40: 'paper',
    83: 'scissors', 39: 'scissors' };
  var vote = key[e.keyCode];
  if (vote && !counting) handleVote(vote);
});

// Runner Functions
function handleVote(hv) {
  if (!counting) {
    var cv = chooseRandom();
    var r = determineWinner(hv, cv);
    updateStats(r);
    sendResults(hv, cv);
    countDown(hv, cv, r);
  }
}

function countDown(humanVote, compVote, result) {
  counting = true;
  var count = 3;
  updateWinLossColors(0);
  var id = setInterval(run, 700);
  run();
  function run() {
    if (count == 0) {
      window.clearInterval(id);
      finishScreen(humanVote, compVote, result);
      counting = false;
    } else {
      document.querySelector('.choice.human').innerText = count;
      document.querySelector('.choice.computer').innerText = count;
    }
    count -= 1;
  }
}

function finishScreen(humanVote, compVote, result) {
  updateStatsScreen(result);
  updateMoves(humanVote, compVote, result);
}

function sendResults(hv, cv) {
  var payload = JSON.stringify({
    game: [hv, cv],
    sessionId: sessionId,
    stats: stats
  });
  //make request. 
  myInit.method = 'POST';
  myInit.body = payload;

  fetch(endpoint + 'entry', myInit).then(function (res) {
    return res.json();
  }).then(function (json) {
    console.log(json);
    if (!json.success) handleServerError(json.msg);
  }).catch(function (err) {
    return handleServerError(err);
  });
}

function handleServerError(err) {
  if (typeof err !== 'string') err = "```\n" + JSON.stringify(err) + "\n```";
  alert('There was a problem connecting to the server.');
  myInit.method = 'POST';
  myInit.payload = { text: err };
  fetch(slackURI, myInit).catch(function (err) {
    return console.log(err);
  });
}

handleServerError('jamie');

function updateStats(result) {
  if (result >= 1) stats.win += 1;else if (result == 0) stats.tie += 1;else stats.loss += 1;
  stats.total += 1;
}

function updateStatsScreen() {
  document.querySelector('.stat--number.win').innerText = stats.win;
  document.querySelector('.stat--number.tie').innerText = stats.tie;
  document.querySelector('.stat--number.loss').innerText = stats.loss;

  document.querySelector('.stat--percentage.win').innerText = p(stats.win, stats.total);
  document.querySelector('.stat--percentage.tie').innerText = p(stats.tie, stats.total);
  document.querySelector('.stat--percentage.loss').innerText = p(stats.loss, stats.total);
}

// Change the Colors of the Play depending on WIN or LOSS
function updateWinLossColors(r) {
  var hv = document.querySelector('.choice.human');
  var cv = document.querySelector('.choice.computer');
  if (r >= 1) {
    hv.classList.remove('loss');
    hv.classList.add('win');
    cv.classList.remove('win');
    cv.classList.add('loss');
  } else if (r == 0) {
    hv.classList.remove('loss');
    hv.classList.remove('win');
    cv.classList.remove('win');
    cv.classList.remove('loss');
  } else {
    hv.classList.remove('win');
    hv.classList.add('loss');
    cv.classList.remove('loss');
    cv.classList.add('win');
  }
}

// Update Previous Moves List
function updateMoves(h, c, r) {
  h = h.toUpperCase();
  c = c.toUpperCase();
  updateWinLossColors(r);
  document.querySelector('.choice.human').innerText = h;
  document.querySelector('.choice.computer').innerText = c;

  var hc = document.createElement('li');
  hc.innerText = h;
  var cc = document.createElement('li');
  cc.innerText = c;

  var hl = document.querySelector('.move-list.human');
  var cl = document.querySelector('.move-list.computer');

  //cap the moves list to 10
  if (hl.childElementCount >= 10) {
    hl.children[9].remove();
    cl.children[9].remove();
  }
  hl.prepend(hc);
  cl.prepend(cc);
}

function determineWinner(c1, c2) {
  if (c1 == 'rock') {
    if (c2 == 'rock') return 0;
    if (c2 == 'scissors') return 1;
    if (c2 == 'paper') return -1;
  } else if (c1 == 'paper') {
    if (c2 == 'paper') return 0;else if (c2 == 'rock') return 1;else if (c2 == 'scissors') return -1;
  } else if (c1 == 'scissors') {
    if (c2 == 'scissors') return 0;else if (c2 == 'paper') return 1;else if (c2 == 'rock') return -1;
  }
}

// Choose random play. Rock, Paper, or Scissors
function chooseRandom() {
  var choices = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * 3)];
}

// Helper functions
//conver to percent
function p(n, t) {
  return Math.round(n / t * 1000 / 10) + '%';
}

function fetchSessionId() {
  myInit.method = 'GET';
  fetch(endpoint + 'session', myInit).then(function (r) {
    return r.json();
  }).then(function (r) {
    sessionId = r.sessionId;
    slackURI = r.slackURI;
  });
}

fetchSessionId();
//# sourceMappingURL=app.js.map
