// MongoDB connection
const Endpoint = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";

//get problem id from fixer
function findFixer(userId) {
  const findfixerOpt = {
    'method' : 'post',
    payload : JSON.stringify({header : "Fixer" , query : {UserId : userId} })
  };
  const fixerRes = UrlFetchApp.fetch(Endpoint+"/find", findfixerOpt);
  problemId = fixerRes.getContentText();
  var jsonObject = JSON.parse(problemId)
  var problemId = jsonObject[0].Problem[0];
  return jsonObject;
}

//sent problem info to admin form
function findProblem(problemId) {

  const findProblemOpt = {
    method: 'post',
    payload: JSON.stringify({header : "Problem" , query : {_id : problemId}})
  };
  const problemRes = UrlFetchApp.fetch(Endpoint + '/find', findProblemOpt);
  const problemFind = problemRes.getContentText();
  const jsonData = JSON.parse(problemFind); 
  return jsonData;
}

function findToolType(types) {
  const findtoolOpt = {
    method: 'post',
    payload: JSON.stringify({header : "Tool" , query : {type : types}})
  };
  const toolRes = UrlFetchApp.fetch(Endpoint + '/find', findtoolOpt);
  const toolfind = toolRes.getContentText();
  const jsonData = JSON.parse(toolfind);
  return JSON.stringify(jsonData);
}

function findPerson(owner_id) {
  const findPersonOpt = {
    method: 'post',
    payload: JSON.stringify({ header : "Person" , query : { userID : owner_id} })
  };
  const personRes = UrlFetchApp.fetch(Endpoint + '/find', findPersonOpt);
  const personFind = personRes.getContentText();
  const jsonData = JSON.parse(personFind); 
  return jsonData;
}

// get all tools info
function findTool() {
  const toolOpt = {
    method: 'post',
    payload : JSON.stringify({header : "Tool" , query : {}})
  };
  const toolRes = UrlFetchApp.fetch(Endpoint + '/find', toolOpt);
  const arrayTool = toolRes.getContentText();
  return arrayTool;
}

//after finish admin form update problem status & after finish admin form update problem id in fixer
function updateFinish(userId,problemId,list) {
  const problemOpt = {
    method: 'post',
    payload: JSON.stringify({ header : "Problem" , filter : {_id : problemId} , query : { status : "Finished" , finishDate : new Date , tools : {list} } })
  };
  const problemRes = UrlFetchApp.fetch(Endpoint + '/updateSet', problemOpt);
  Logger.log(problemRes.getResponseCode());
  Logger.log(problemRes.getContentText());

  const fixerOpt = {
    method: 'post',
    payload: JSON.stringify({header : "Fixer" , filter : {UserId : userId} , query : {Problem : problemId}})
  };
  const fixerRes = UrlFetchApp.fetch(Endpoint + '/updatePull', fixerOpt);
  Logger.log(fixerRes.getResponseCode());
  Logger.log(fixerRes.getContentText());

}

//insert new tool to mongoDB
function insertTool(toolList) {
  console.log(toolList)
  const toolOpt = {
    method: 'post',
    payload: JSON.stringify({header : "Fixer" , query : toolList})
  };
  const toolRes = UrlFetchApp.fetch(Endpoint + '/insert', toolOpt);
}

