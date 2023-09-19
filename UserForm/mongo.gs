const Endpoint = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";

function findPerson(userId) {

  const findPersonOpt = {
    method: 'post',
    payload: JSON.stringify({ header : "Person" , query : { userID : userId , status : { $ne : "Finished"}} })
  };

  // เรียกใช้งาน UrlFetchApp ด้วย Endpoint และ findProblemOpt
  const personRes = UrlFetchApp.fetch(Endpoint + '/find', findPersonOpt);
  const personFind = personRes.getContentText();
  const jsonData = JSON.parse(personFind); 
  
  // Logger.log(personFind)
  // userName = jsonData[0].name
  // Logger.log(userName);
  return jsonData;
}

function findProblem(problemId) {

  const findProblemOpt = {
    method: 'post',
    payload: JSON.stringify({header : "Problem" , query : {_id : problemId}})
  };

  // เรียกใช้งาน UrlFetchApp ด้วย Endpoint และ findProblemOpt
  const problemRes = UrlFetchApp.fetch(Endpoint + '/find', findProblemOpt);
  const problemFind = problemRes.getContentText();
  const jsonData = JSON.parse(problemFind); 
  Logger.log(jsonData);
  //var owner_id = jsonData[0].owner
  //findPerson(owner_id)
  return jsonData;
}