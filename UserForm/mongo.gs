const Endpoint = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";

function findPerson(userId) {
  const findPersonOpt = {
    method: 'post',
    payload: JSON.stringify({ header : "Person" , query : { userID : userId , status : { $ne : "Finished"}} })
  };
  const personRes = UrlFetchApp.fetch(Endpoint + '/find', findPersonOpt);
  const personFind = personRes.getContentText();
  const jsonData = JSON.parse(personFind); 
  return jsonData;
}

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