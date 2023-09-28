// MongoDB connection
const Endpoint = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";
const sheet = SpreadsheetApp.openById('11ONVfN8YD_aBVflke-fUP-aYdY38z6zuUvlkaS_ZWKw');

function updateProblemSheet(id,value,row) {
  var upSheet = sheet.getSheetByName('Problem'); // Replace 'Sheet1' with your sheet's name
  var idToMatch = id; // Replace '123' with the specific ID you want to match
  var newValue = value; // Replace with the new value you want to set
  if (idToMatch == '0') {
    upSheet.appendRow([
      newValue._id,
      newValue.status,
      newValue.owner,
      newValue.request,
      newValue.location,
      newValue.problemPicture,
      new Date(newValue.recieveDate),
      newValue.finishDate,
      newValue.fixer,
      newValue.totalPrice
    ]);
  } else {
    // Find the row number where the ID matches in Column A
    var data = upSheet.getRange("A:A").getValues();
    var rowToUpdate = data.findIndex(function(row) {
      return row[0] === idToMatch;
    });

    if (rowToUpdate !== -1) {
      // Update the value in Column D (assuming Column D is index 4)
      upSheet.getRange(rowToUpdate + 1, row).setValue(newValue);
    }
  } 
}

// function updateFixerSheet(id,value,row) {
//   var upSheet = sheet.getSheetByName('Fixer'); // Replace 'Sheet1' with your sheet's name
//   var idToMatch = id; // Replace '123' with the specific ID you want to match
//   var newValue = value; // Replace with the new value you want to set
//   if (idToMatch == '0') {
//     upSheet.appendRow([
//       newValue.UserId,
//       newValue.Name,
//       newValue.Tel
//     ]);
//   } else {
//     // Find the row number where the ID matches in Column A
//     var data = upSheet.getRange("A:A").getValues();
//     var rowToUpdate = data.findIndex(function(row) {
//       return row[0] === idToMatch;
//     });

//     if (rowToUpdate !== -1) {
//       // Update the value in Column D (assuming Column D is index 4)
//       upSheet.getRange(rowToUpdate + 1, row).setValue(newValue);
//     }
//   } 
// }

function updateToolSheet(id,value,row) {
  var upSheet = sheet.getSheetByName('Tool'); // Replace 'Sheet1' with your sheet's name
  var idToMatch = id; // Replace '123' with the specific ID you want to match
  var newValue = value; // Replace with the new value you want to set
  if (idToMatch == '0') {
    upSheet.appendRow([
      newValue.name,
      newValue.type,
      newValue.price
    ]);
  } else {
    // Find the row number where the ID matches in Column A
    var data = upSheet.getRange("A:A").getValues();
    var rowToUpdate = data.findIndex(function(row) {
      return row[0] === idToMatch;
    });

    if (rowToUpdate !== -1) {
      // Update the value in Column D (assuming Column D is index 4)
      upSheet.getRange(rowToUpdate + 1, row).setValue(newValue);
    }
  } 
}

//get problem id from fixer
function findFixer(userId) {
  const findfixerOpt = {
    'method' : 'post',
    payload : JSON.stringify({header : "Person" , query : {_id : userId} })
  };
  const fixerRes = UrlFetchApp.fetch(Endpoint+"/find", findfixerOpt);
  problemId = fixerRes.getContentText();
  var jsonObject = JSON.parse(problemId)
  var problemId = jsonObject[0].problems.filter(subarray => subarray[1] === "Fixer")
  .map(subarray => subarray[0]);
  return jsonObject;
}

//sent problem info to admin form
function findProblem(problemId) {

  const findProblemOpt = {
    method: 'post',
    payload: JSON.stringify({header : "Problem" , query : {_id : problemId}})
  };
  const problemRes = UrlFetchApp.fetch(Endpoint + '/find', findProblemOpt);
  const problemFind = problemRes.getContentText();
  const jsonData = JSON.parse(problemFind);
  jsonData[0].recieveDate = formatThaiDateTime(new Date(jsonData[0].recieveDate));

  return jsonData;
}

function findToolType(types) {
  const findtoolOpt = {
    method: 'post',
    payload: JSON.stringify({header : "Tool" , query : {type : types}})
  };
  const toolRes = UrlFetchApp.fetch(Endpoint + '/find', findtoolOpt);
  const toolfind = toolRes.getContentText();
  const jsonData = JSON.parse(toolfind);
  return JSON.stringify(jsonData);
}

function findPerson(owner_id) {
  const findPersonOpt = {
    method: 'post',
    payload: JSON.stringify({ header : "Person" , query : { _id : owner_id} })
  };
  const personRes = UrlFetchApp.fetch(Endpoint + '/find', findPersonOpt);
  const personFind = personRes.getContentText();
  const jsonData = JSON.parse(personFind); 
  return jsonData;
}

// get all tools info
function findTool() {
  const toolOpt = {
    method: 'post',
    payload : JSON.stringify({header : "Tool" , query : {}})
  };
  const toolRes = UrlFetchApp.fetch(Endpoint + '/find', toolOpt);
  const arrayTool = toolRes.getContentText();
  return arrayTool;
}

//after finish admin form update problem status & after finish admin form update problem id in fixer
function updateFinish(userId,problemId,list, status, totalPrice) {
  parseList = JSON.parse(list);
  const toolList = []
  if (status == "Finished") {
    for (var i = 0; i < parseList.length; i++) {
      toolList.push(insertTool(parseList[i]));
    }

    var finishDate = new Date();
    const problemOpt = {
      method: 'post',
      payload: JSON.stringify({ header : "Problem" , filter : {_id : problemId} , query : { status : status , finishDate : finishDate , tools : toolList, totalPrice : totalPrice } })
    };
    const problemRes = UrlFetchApp.fetch(Endpoint + '/updateDate', problemOpt);
    updateProblemSheet(problemId,status,2);
    updateProblemSheet(problemId,finishDate,8);
    updateProblemSheet(problemId,totalPrice,10);
    
    Logger.log(problemRes.getResponseCode());
    Logger.log(problemRes.getContentText());

    const fixerOpt = {
      method: 'post',
      payload: JSON.stringify({header : "Person" , filter : { _id : userId} , 
      query : {problems :  {$in: [
               [problemId, "Fixer"],
               [problemId, "User"]
            ]
         } } })

    };
    const fixerRes = UrlFetchApp.fetch(Endpoint + '/updatePull', fixerOpt);
    Logger.log(fixerRes.getResponseCode());
    Logger.log(fixerRes.getContentText());
    finishFlex(problemId,userId);
  } else {
    const problemOpt = {
      method: 'post',
      payload: JSON.stringify({ header : "Problem" , filter : {_id : problemId} , query : { status : status } })
    };
    const problemRes = UrlFetchApp.fetch(Endpoint + '/updateSet', problemOpt);
    updateProblemSheet(problemId,status,2);
    Logger.log(problemRes.getResponseCode());
    Logger.log(problemRes.getContentText());
  }
}

//insert new tool to mongoDB
function insertTool(toolList) {
  const tid = generateShortMd5Hash();
  toolList._id = tid
  const toolOpt = {
    method: 'post',
    payload: JSON.stringify({header : "ToolFix" , query : toolList})
  };
  const toolRes = UrlFetchApp.fetch(Endpoint + '/insert', toolOpt);
  addToolType(tid,toolList.type);
  return tid;
}

//insert new tool to mongoDB
function insertNewTool(name, price, type) {
  const toolDoc = {
    name : name,
    price : parseInt(price),
    type : type
  }

  const toolOpt = {
    method:'post',
    payload: JSON.stringify({header: "Tool" , query : toolDoc})
  };
  const toolRes =  UrlFetchApp.fetch(Endpoint + '/insert', toolOpt);
  updateToolSheet('0',toolDoc,0);
}

function addToolType(id,type) {
    if (type == "ไฟฟ้า") {
      findToolTypes(id,"ไฟฟ้า",6,"F2:F");
    } else if (type == "ประปา") {
      findToolTypes(id,"ประปา",11,"K2:K");
    } else if (type == "ทั่วไป") {
      findToolTypes(id,"ทั่วไป",16,"P2:P");
    } else {
      findToolTypes(id,"ไอที",21,"U2:U");
    }
}

function findToolTypes(id,type,scol,range) {
  const findOpt = {
    method: 'post',
    payload: JSON.stringify({ header: 'ToolFix', query: { _id: id } })
  }
  const findRes = UrlFetchApp.fetch(Endpoint + "/find", findOpt);
  Logger.log(findRes.getContentText());
  const data = JSON.parse(findRes.getContentText());

  var querySheet = sheet.getSheetByName("Query");
  var avals = querySheet.getRange(range).getValues();
  var startRow = avals.filter(String).length + 2;

  // Assuming the data is an array of objects
  data.forEach(function (item) {
    var matchingRows = querySheet.getRange(range).createTextFinder(item.name).findAll();
    if (matchingRows.length > 0) {
      var row = matchingRows[0].getRow();
      var rowData = querySheet.getRange(row, scol, 1, 3).getValues(); // Get data from columns F, G, and H

        // Update column G
        var currentQtyG = rowData[0][1]; // Get the current value in column G
        querySheet.getRange(row, scol+1).setValue(currentQtyG + item.qty); // Update column G
        
        // Update column H
        var currentQtyH = rowData[0][2]; // Get the current value in column H
        querySheet.getRange(row, scol+2).setValue(currentQtyH + item.price);
    } else {
      querySheet.getRange(startRow, scol).setValue(item.name); // Column F
      querySheet.getRange(startRow, scol+1).setValue(item.qty); // Column G
      querySheet.getRange(startRow, scol+2).setValue(item.price); // Column H
      startRow++; // Increment the row number
    }
  });
}

function generateShortMd5Hash() {
  var inputString = Utilities.getUuid(); // Generate a UUID
  var md5hash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, inputString, Utilities.Charset.UTF_8);
  var shortId = md5hash.map(function (byte) {
    return (byte < 0 ? byte + 256 : byte).toString(16);
  }).join('').substr(0, 6); // Adjust the length to 6 characters
  
  return shortId;
}

function finishFlex(problemId , userID) {
  const findProblemOpt = {
    method : 'post',
    payload : JSON.stringify({ header : "Problem" ,query :{ _id: problemId} })
  }
  const problemRes = UrlFetchApp.fetch(Endpoint+"/find", findProblemOpt);
  const pres = JSON.parse(problemRes.getContentText());
  Logger.log(problemRes.getContentText())

  const findPersonOpt = {
    method : 'post',
    payload : JSON.stringify({ header : "Person" ,query :{ _id: pres[0].owner} })
  }
  const personRes = UrlFetchApp.fetch(Endpoint+"/find", findPersonOpt);
  const displayName = pres[0].fixer
  pres[0].finishDate = formatThaiDateTime(new Date(pres[0].finishDate));

  var flex = createFlexMessage(displayName, pres[0].request, pres[0].location, pres[0].finishDate
  , pres[0].problemPicture, problemId, pres[0].status);

  sendFlexMessage(flex, userID, problemId);
}


function formatThaiDateTime(dateString) {
  var timeZone = 'Asia/Bangkok'; // Time zone for Bangkok
  var date = new Date(dateString);
  var thaiDate = Utilities.formatDate(date, timeZone, 'dd/MM/yyyy HH:mm:ss');
  return thaiDate;
}
