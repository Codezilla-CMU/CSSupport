// MongoDB connection
const Endpoint = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";

//get problem id from fixer
function findFixer(userId) {
  const findfixerDoc = {}
  findfixerDoc._id = userId
  findfixerDoc.field = "UserId"

  const findfixerOpt = {
    'method' : 'post',
    payload : JSON.stringify(findfixerDoc)
  };
  const fixerRes = UrlFetchApp.fetch(Endpoint+"/findFixer", findfixerOpt);
  Logger.log(fixerRes);
  problemId = fixerRes.getContentText();
  
  // Remove the square brackets from the string
  // Parse the modified string into a JSON object
  var jsonObject = JSON.parse(problemId)

  var problemId = jsonObject[0].Problem;
  Logger.log(problemId);
  findProblem(problemId);
}

//sent problem info to admin form
function findProblem(problemId) {
  const findProblemrDoc = {
    _id: problemId
  };

  const findProblemOpt = {
    method: 'post',
    payload: JSON.stringify(findProblemrDoc)
  };

  // เรียกใช้งาน UrlFetchApp ด้วย Endpoint และ findProblemOpt
  const problemRes = UrlFetchApp.fetch(Endpoint + '/findProblem', findProblemOpt);
  const problemFind = problemRes.getContentText();
  const jsonData = JSON.parse(problemFind); 
  Logger.log(jsonData);
  return jsonData;
}

// get all tools info
function findTool() {
  const toolOpt = {
    method: 'post',
  };

  const toolRes = UrlFetchApp.fetch(Endpoint + '/findTool', toolOpt);
  const arrayTool = toolRes.getContentText();
  Logger.log(toolRes.getResponseCode());
  Logger.log(toolRes.getContentText());

  return arrayTool;
}


//after finish admin form update problem status & after finish admin form update problem id in fixer
function updateFinish(userId,problemId) {
  const problemDoc = {}
  problemDoc._id = problemId
  problemDoc.status = "Finished"
  problemDoc.finishDate = new Date

  const problemOpt = {
    method: 'post',
    payload: JSON.stringify(problemDoc)
  };

  const problemRes = UrlFetchApp.fetch(Endpoint + '/updateProblem', problemOpt);
  Logger.log(problemRes.getResponseCode());
  Logger.log(problemRes.getContentText());

  const fixerOpt = {
    method: 'post',
    payload: JSON.stringify({UserId : userId , Problem : null})
  };

  const fixerRes = UrlFetchApp.fetch(Endpoint + '/updateFixer', fixerOpt);
  Logger.log(fixerRes.getResponseCode());
  Logger.log(fixerRes.getContentText());


}

