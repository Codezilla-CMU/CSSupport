
function assignProblemToFixer(problemId) {
  const status = 'In Progress';
  let fixerName = '';

  // Get available fixers
  fixers = getAvailableFixers();
  
      if (fixers.length > 0) {
        // Assign the problem to the first available fixer
        fixers.sort((a, b) => a.Problem.length - b.Problem.length);
        const assignedFixer = fixers[0];
        const fixerName = assignedFixer.Name;
        const fixerId = assignedFixer.UserId;
        return updateProblemStatusAndFixer(problemId, status, fixerId,fixerName);
      } else {
        console.log('No available fixers.');
      }
    
    
      Logger.log(`Problem ${problemId} assigned to Fixer ${fixerName} and status updated to ${status}`);
    
  
}

// Function to get a list of available fixers
function getAvailableFixers() {
   // เปลี่ยนเป็น URI ของ MongoDB ของคุณ

  const options = {
    method: "get",
    contentType: "application/json",
    payload: JSON.stringify({ header : 'Fixer' , query : {}})
  };

  const response = UrlFetchApp.fetch(mongodbUri + "/find" , options);

  if (response.getResponseCode() === 200) {
    const data = JSON.parse(response.getContentText());
    Logger.log(data);
    return data;
  } else {
    console.error("Error fetching fixers data from MongoDB.");
    return [];
  }
}

// Function to update problem status and fixer
function updateProblemStatusAndFixer(problemId, status, fixerId, fixerName) {
  const problemOpt = {
    header : 'Problem',
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({header : "Problem" ,filter : {_id : problemId} , query : { status : status , fixer : fixerName }})
  };

  const fixerOpt = {
    header : 'Fixer',
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({header : "Fixer" ,filter : {UserId : fixerId} , query : { Problem : problemId }})
  };

  const responseProblem = UrlFetchApp.fetch(mongodbUri + "/updateSet", problemOpt);
  const responseFixer = UrlFetchApp.fetch(mongodbUri + "/updatePush", fixerOpt);
  if (responseProblem.getResponseCode() === 200) {
    console.log(`Problem ${problemId} status updated to ${status} with fixer ${fixerName}`);
  } else {
    console.error("Error updating problem status in MongoDB.");
  }
  if (responseFixer.getResponseCode() === 200) {
    console.log(`Problem ${problemId} status updated to ${status} with fixer ${fixerName}`);
  } else {
    console.error("Error updating problem fixer in MongoDB.");
  }
}

function sendFlexFixer(problemId, fixerId) {
  const findProblemOpt = {
    method : 'post',
    payload : JSON.stringify({ header : "Problem" ,query :{ _id: problemId} })
  }
  const problemRes = UrlFetchApp.fetch(Endpoint+"/find", findProblemOpt);
  const pres = JSON.parse(problemRes.getContentText());

  const findPersonOpt = {
    method : 'post',
    payload : JSON.stringify({ header : "Person" ,query :{ userID: pres[0].owner} })
  }
  const personRes = UrlFetchApp.fetch(Endpoint+"/find", findPersonOpt);
  const displayName = JSON.parse(personRes.getContentText())[0].name

  var flex = createFlexMessage(displayName, pres[0].request, pres[0].location, pres[0].receiveDate
  , pres[0].problemPicture, problemId, pres[0].status);
  sendFlexMessage(flex, fixerId, problemId);
}

