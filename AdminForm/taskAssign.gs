function assignProblemToFixer(problemId) {
  const status = 'In Progress';
  let fixerName = '';

  // Get available fixers
  fixers = getAvailableFixers();
  
      if (fixers.length > 0) {
        // Assign the problem to the first available fixer
        fixerName = fixers[0].Name;
        fixerId = fixers[0].UserId;
        return updateProblemStatusAndFixer(problemId, status, fixerId,fixerName);
      } else {
        console.log('No available fixers.');
      }
    
    
      Logger.log(`Problem ${problemId} assigned to Fixer ${fixerName} and status updated to ${status}`);
    
  
}

// Function to get a list of available fixers
function getAvailableFixers() {
  const mongodbUri = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo"; // เปลี่ยนเป็น URI ของ MongoDB ของคุณ

  const options = {
    method: "get",
    contentType: "application/json",
    payload: JSON.stringify({ _id : null , field : "Problem"})
  };

  const response = UrlFetchApp.fetch(mongodbUri + "/findFixer" , options);

  if (response.getResponseCode() === 200) {
    const data = JSON.parse(response.getContentText());
    // ตอนนี้คุณสามารถใช้ข้อมูลที่ได้จาก MongoDB ได้ตามต้องการ
    // ตัวอย่าง: console.log(data);
    return data;
  } else {
    console.error("Error fetching fixers data from MongoDB.");
    return [];
  }
}

// Function to update problem status and fixer
function updateProblemStatusAndFixer(problemId, status, fixerName, fixerId) {
  const mongodbUri = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";

  const problemOpt = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({_id : problemId , status : status , fixer : fixerName })
  };

  const fixerOpt = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({UserId:fixerId,Problem:problemId})
  };

  Logger.log(problemId)

  const responseProblem = UrlFetchApp.fetch(mongodbUri + "/updateProblem", problemOpt);
  const responseFixer = UrlFetchApp.fetch(mongodbUri + "/updateFixer", fixerOpt);
  
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

