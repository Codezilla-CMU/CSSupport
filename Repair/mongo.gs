// MongoDB connection
const Endpoint = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";
const spreadsheetId = '11ONVfN8YD_aBVflke-fUP-aYdY38z6zuUvlkaS_ZWKw';

//function to insert the client(whose that report the problem) info to mongoDB
function insert2mongo(userId, displayName, pictureUrl, requests, locations, image) {
  const pid = generateShortMd5Hash();
  const problemDoc = {}
  problemDoc._id = pid
  problemDoc.owner = userId
  problemDoc.location = locations
  problemDoc.request = requests
  problemDoc.problemPicture = image
  problemDoc.status = "Recieved"
  problemDoc.recieveDate = new Date()
  problemDoc.finishDate = ""
  problemDoc.fixer = ""
  problemDoc.tools = null
  const problemOpt = {
    header : 'Problem',
  'contentType': 'application/json',
  method: 'post',
  payload : JSON.stringify({header : 'Problem' , query : problemDoc})
  };
  const problemRes = UrlFetchApp.fetch(Endpoint+"/insertDate", problemOpt);
  updateProblemSheet('0',problemDoc,0);
  problemId = problemRes.getContentText().replace(/["\\]/g, '');
  Logger.log(problemRes.getResponseCode());
  Logger.log(problemRes.getContentText());

  const checkDupOpt = {
    method : 'post',
    payload : JSON.stringify({ header : "Person" ,query :{ _id: userId} })
  }
  const checkDup = UrlFetchApp.fetch(Endpoint+"/find", checkDupOpt);
  const userDup = JSON.parse(checkDup.getContentText()).length ;
  if (userDup > 0) {
    updateDupPerson(userId,pid);
  } else {
    const personDoc = {}
    personDoc._id = userId
    personDoc.role = "User"
    personDoc.name = displayName
    personDoc.tel = "-"
    personDoc.profilePicture = pictureUrl
    personDoc.problems = [[pid,"User"]]
    const personOpt = {
      header : 'Person',
      'contentType': 'application/json',
      method: 'post',
      payload : JSON.stringify({ header : 'Person' , query : personDoc})
    };
    const personRes = UrlFetchApp.fetch(Endpoint+"/insert", personOpt);
    updatePersonSheet('0',personDoc,0);
    Logger.log(personRes.getResponseCode());
    Logger.log(personRes.getContentText());
  }
  return pid;
}

//function that increase problems of client incase of 1 client report many problems
function updateDupPerson(userId,problemId) {
  const uppersonOpt = {
    method: 'post',
    payload : JSON.stringify({ header : "Person" , filter : {_id : userId} , query : { problems : [problemId,"User"]} })
  };
    const uppersonRes = UrlFetchApp.fetch(Endpoint+"/updatePush", uppersonOpt);
    Logger.log(uppersonRes.getResponseCode());
    Logger.log(uppersonRes.getContentText());
  
}

function generateShortMd5Hash() {
  var inputString = Utilities.getUuid(); // Generate a UUID
  var md5hash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, inputString, Utilities.Charset.UTF_8);
  var shortId = md5hash.map(function (byte) {
    return (byte < 0 ? byte + 256 : byte).toString(16);
  }).join('').substr(0, 8); // Adjust the length as needed
  
  return shortId;
}






