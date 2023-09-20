// MongoDB connection
const Endpoint = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";
const spreadsheetId = '11ONVfN8YD_aBVflke-fUP-aYdY38z6zuUvlkaS_ZWKw';

//function to insert the client(whose that report the problem) info to mongoDB
function insert2mongo(userId, displayName, pictureUrl, requests, locations, image,recDate) {
  const pid = Utilities.getUuid();
  const problemDoc = {}
  problemDoc._id = pid
  problemDoc.owner = userId
  problemDoc.location = locations
  problemDoc.request = requests
  problemDoc.problemPicture = image
  problemDoc.status = "Received"
  problemDoc.receiveDate = recDate
  problemDoc.finishDate = ""
  problemDoc.fixer = ""
  problemDoc.tools = null
  const problemOpt = {
    header : 'Problem',
  'contentType': 'application/json',
  method: 'post',
  payload : JSON.stringify({header : 'Problem' , query : problemDoc})
  };
  const problemRes = UrlFetchApp.fetch(Endpoint+"/insert", problemOpt);
  problemId = problemRes.getContentText().replace(/["\\]/g, '');
  Logger.log(problemRes.getResponseCode());
  Logger.log(problemId);

  const checkDupOpt = {
    method : 'post',
    payload : JSON.stringify({ header : "Person" ,query :{ userID: userId} })
  }
  const checkDup = UrlFetchApp.fetch(Endpoint+"/find", checkDupOpt);
  const userDup = JSON.parse(checkDup.getContentText()).length ;
  if (userDup > 0) {
    updateDupPerson(userId,problemId);
  } else {
    const personDoc = {}
    problemDoc._id = pid
    personDoc.userID = userId
    personDoc.name = displayName
    personDoc.profilePicture = pictureUrl
    personDoc.problems = [problemId]
    const personOpt = {
      header : 'Person',
      'contentType': 'application/json',
      method: 'post',
      payload : JSON.stringify({ header : 'Person' , query : personDoc})
    };
    const personRes = UrlFetchApp.fetch(Endpoint+"/insert", personOpt);
    Logger.log(personRes.getResponseCode());
    Logger.log(personRes.getContentText());
  }
  return pid;
}

//function that increase problems of client incase of 1 client report many problems
function updateDupPerson(userId,problemId) {
  const uppersonOpt = {
    header : 'Person',
    'contentType': 'application/json',
      method: 'post',
      payload : JSON.stringify({ header : "Person" , filter : {userID : userId} , query : { problems : problemId} })
    };
  const uppersonRes = UrlFetchApp.fetch(Endpoint+"/updatePush", uppersonOpt);
    Logger.log(uppersonRes.getResponseCode());
    Logger.log(uppersonRes.getContentText());
}






