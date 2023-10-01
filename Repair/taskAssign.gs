
function assignProblemToFixer(problemId,uname) {
  let fixerName = '';

  // Get available fixers
  fixers = getAvailableFixers();
  
      if (fixers.length > 0) {
        // Assign the problem to the first available fixer
        fixers.sort((a, b) => 
        a.problems.filter(subarray => subarray[1] === "Fixer").length - 
        b.problems.filter(subarray => subarray[1] === "Fixer").length);
        const assignedFixer = fixers[0];
        const fixerName = assignedFixer.name;
        const fixerId = assignedFixer._id;
        updateProblemStatusAndFixer(problemId, fixerId,fixerName,uname);
        return fixerName;
         
      } else {
        console.log('No available fixers.');
         return '';
      }
    
}

// Function to get a list of available fixers
function getAvailableFixers() {
   // เปลี่ยนเป็น URI ของ MongoDB ของคุณ

  const options = {
    method: "get",
    contentType: "application/json",
    payload: JSON.stringify({ header : 'Person' , query : { role : "Fixer"}})
  };

  const response = UrlFetchApp.fetch(mongodbUri + "/find" , options);
  // Logger.log(response.getContentText())

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
function updateProblemStatusAndFixer(problemId, fixerId, fixerName,uname) {
  const problemOpt = {
    method: "post",
    payload: JSON.stringify({header : "Problem" ,filter : {_id : problemId} , query : { fixer : fixerName }})
  };

  const fixerOpt = {
    method: "post",
    payload: JSON.stringify({header : "Person" ,filter : {_id : fixerId} , query : { problems : [problemId,"Fixer"] }})
  };

  const responseProblem = UrlFetchApp.fetch(mongodbUri + "/updateSet", problemOpt);
  const responseFixer = UrlFetchApp.fetch(mongodbUri + "/updatePush", fixerOpt);
  sendFlexFixer(problemId, fixerId,uname)
  updateProblemSheet(problemId,fixerName,9);
  if (responseProblem.getResponseCode() === 200) {
    console.log(`Problem ${problemId} assigned to Fixer ${fixerName} `);
  } else {
    console.error("Error updating problem status in MongoDB.");
  }
  if (responseFixer.getResponseCode() === 200) {
    console.log(`Problem ${problemId} assigned to Fixer ${fixerName} `);
  } else {
    console.error("Error updating problem fixer in MongoDB.");
  }
}

function sendFlexFixer(problemId, fixerId,uname) {
  const findProblemOpt = {
    method : 'post',
    payload : JSON.stringify({ header : "Problem" ,query :{ _id: problemId} })
  }
  const problemRes = UrlFetchApp.fetch(Endpoint+"/find", findProblemOpt);
  const pres = JSON.parse(problemRes.getContentText());

  const displayName = uname;
  pres[0].receiveDate = formatThaiDateTime(new Date(pres[0].receiveDate));

  var flex = createFlexMessageFixer(displayName, pres[0].request, pres[0].location, pres[0].receiveDate
  , pres[0].problemPicture, problemId, pres[0].status);
  sendFlexMessage(flex, fixerId, problemId);
}

function formatThaiDateTime(dateString) {
  var timeZone = 'Asia/Bangkok'; // Time zone for Bangkok
  var date = new Date(dateString);
  var thaiDate = Utilities.formatDate(date, timeZone, 'dd/MM/yyyy HH:mm:ss');
  return thaiDate;
}




