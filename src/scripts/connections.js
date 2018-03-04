const endpoint = ''

function sendResults(hv,cv, sessionId, stats){
  let payload = JSON.stringify({
    game: [hv, cv],
    sessionId,
    stats
  })
  let myInit = { 
    method: 'POST',
    headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
    body: payload,
    mode: 'cors',
    cache: 'default'
  };

  fetch(endpoint + '/api/entry', myInit)
  .then((res)=>{
    return res.json()
  })
  .then((json)=>{
    if(!json.success) handleServerError(json.msg)
  })
  .catch(err => handleServerError(err))
}

function fetchSessionId(){
  let myInit = { 
    method: 'GET',
    headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
    mode: 'cors',
    cache: 'default'
  };
  fetch(endpoint + '/api/session', myInit)
    .then(r=>r.json())
    .then(r=>{
      localStorage.setItem('nn-session-id', r.sessionId)
      slackURI = r.slackURI
      console.log("SessionId: " + r.sessionId)
    })
}
function fetchAnnettesPrediction(payload, cb){
  payload = JSON.stringify(payload)
  let myInit = { 
    method: 'POST',
    headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
    body: payload,
    mode: 'cors',
    cache: 'default'
  };
  fetch(endpoint + '/api/net/annette', myInit)
    .then(r=>r.json())
    .then(r=>{
      console.log('PREDICTION: ',r)
      cb(r.msg)
    })
    .catch(err => console.log(err))
}

function trainNet(){
  let myInit = { 
    method: 'GET',
    headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
    mode: 'cors',
    cache: 'default'
  };
  fetch(endpoint + '/api/net/train', myInit)
    .then(r=>r.json())
    .then(r=>{
      console.log(r)
    })
}

module.exports = {
  sendResults,
  fetchSessionId,
  trainNet,
  fetchAnnettesPrediction
}