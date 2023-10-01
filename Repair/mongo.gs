// MongoDB connection
const Endpoint = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";
const spreadsheetId = '11ONVfN8YD_aBVflke-fUP-aYdY38z6zuUvlkaS_ZWKw';

//function to insert the client(whose that report the problem) info to mongoDB
function insert2mongo(userId, displayName, pictureUrl, requests, locations, image) {
  const pid = generateShortMd5Hash();
  const problemDoc = { _id:pid , owner:userId , location:locations , request:requests , problemPicture:image , status:"Received" , receiveDate:new Date() , finishDate:"" , fixer:"" , tools : []}
  const problemOpt = {method: 'post', payload : JSON.stringify({header : 'Problem' , query : problemDoc}) };
  const problemRes = UrlFetchApp.fetch(Endpoint+"/insertDate", problemOpt);
  updateProblemSheet('0',problemDoc,0);

  const uppersonOpt = {
    method: 'post',
    payload : JSON.stringify({ header : "Person" , filter : {_id : userId} , query : { problems : [pid,"User"]} })
  };
  const uppersonRes = UrlFetchApp.fetch(Endpoint+"/updatePush", uppersonOpt);
  const matchedCount = JSON.parse(uppersonRes.getContentText()).matchedCount;
  if (matchedCount == 0) {
    const personDoc = { _id:userId , role:"User" , name:displayName , tel:"-" , profilePicture:pictureUrl , problems:[[pid,"User"]]}
    const personOpt = {method:'post' , payload:JSON.stringify({header:'Person' , query:personDoc})}
    const personRes = UrlFetchApp.fetch(Endpoint+"/insert", personOpt);
    updatePersonSheet('0',personDoc,0);
  }
  return pid;
}

//hash Md5
function generateShortMd5Hash() {
  var inputString = Utilities.getUuid(); // Generate a UUID
  var md5hash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, inputString, Utilities.Charset.UTF_8);
  var shortId = md5hash.map(function (byte) {
    return (byte < 0 ? byte + 256 : byte).toString(16);
  }).join('').substr(0, 8); // Adjust the length as needed
  
  return shortId;
}






