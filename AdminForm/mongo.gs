// MongoDB connection
const Endpoint = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";

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
  problemDoc.tools = []
  const problemOpt = {
  'contentType': 'application/json',
  method: 'post',
  payload : JSON.stringify(problemDoc)
  };
  const problemRes = UrlFetchApp.fetch(Endpoint+"/insertProblem", problemOpt);
  problemId = problemRes.getContentText().replace(/["\\]/g, '');
  Logger.log(problemRes.getResponseCode());
  Logger.log(problemId);
  

  const checkDup = UrlFetchApp.fetch(Endpoint+"/findPerson", problemOpt);
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
      'contentType': 'application/json',
      method: 'post',
      payload : JSON.stringify(personDoc)
    };
    const personRes = UrlFetchApp.fetch(Endpoint+"/insertPerson", personOpt);
    Logger.log(personRes.getResponseCode());
    Logger.log(personRes.getContentText());
  }
  return problemId;
}

//function that increase problems of client incase of 1 client report many problems
function updateDupPerson(userId,problemId) {
  const uppersonDoc = {}
  uppersonDoc.userID = userId
  uppersonDoc.problems = problemId
  const uppersonOpt = {
    'contentType': 'application/json',
      method: 'post',
      payload : JSON.stringify(uppersonDoc)
    };
  const uppersonRes = UrlFetchApp.fetch(Endpoint+"/updatePerson", uppersonOpt);
    Logger.log(uppersonRes.getResponseCode());
    Logger.log(uppersonRes.getContentText());
}






