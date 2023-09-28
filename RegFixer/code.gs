var userId = null;
var pictureUrl = null;
//var doc = { "Name": "hhx", "UserId": "U9d2bbec5c40e6a3278f0f077b02c4c2fff", "Tel": "1212312121", "Problem": [] }
//var docx2 = JSON.stringify(doc)
const mongodbUri = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";
const sheet = SpreadsheetApp.openById('11ONVfN8YD_aBVflke-fUP-aYdY38z6zuUvlkaS_ZWKw');

function doGet(e) {
  // userId = 'U9d2bbec5c40e6a3278f0f077b02c4c2e'

  userId = e.parameter.userId;
  pictureUrl = e.parameter.pictureUrl;
  
  var template = HtmlService.createTemplateFromFile("index");

  return template.evaluate().setTitle("สถานะงาน")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}

function updateFixer(jsonData) {
  try{
  const updateFixerOpt = {
    method: 'post',
    payload: JSON.stringify({ header: "Person", filter : { _id : JSON.parse(jsonData)._id} ,query: JSON.parse(jsonData) })
  };

  const fixerRes = UrlFetchApp.fetch(mongodbUri + "/updateSet", updateFixerOpt);
  const userID = JSON.parse(jsonData)._id
  const role = JSON.parse(jsonData).role
  updateFixerSheet(userID,role,4)
  const fixerId = fixerRes.getContentText().replace(/["\\]/g, '');

  console.log(fixerRes.getResponseCode());
  console.log(fixerId);
  return "OK"
  } catch (f) {
    return f.toString();
  }
}

function insertFixer(jsonData) {
  try{
  const updateFixerOpt = {
    method: 'post',
    payload: JSON.stringify({ header: "Person", query: JSON.parse(jsonData) })
  };

  const fixerRes = UrlFetchApp.fetch(mongodbUri + "/insert", updateFixerOpt);
  updateFixerSheet('0',JSON.parse(jsonData),0)
  const fixerId = fixerRes.getContentText().replace(/["\\]/g, '');

  console.log(fixerRes.getResponseCode());
  console.log(fixerId);
  return "OK"
  } catch (f) {
    return f.toString();
  }
}

function updateFixerSheet(id,value,row) {
  var upSheet = sheet.getSheetByName('Person'); // Replace 'Sheet1' with your sheet's name
  var idToMatch = id; // Replace '123' with the specific ID you want to match
  var newValue = value; // Replace with the new value you want to set
  if (idToMatch == '0') {
    upSheet.appendRow([
      newValue._id,
      newValue.name,
      newValue.tel,
      newValue.role,
      newValue.profilePicture
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

//0 = เป็น User แต่ ไม่ได้เป็น Fixer , 1 = เป็น Fixer อยู่แล้ว , 2 = ไม่ได้เป็น Fixer และ ไม่ได้เป็น User
function checkDup(doc) {
  //var doc = { "Name": "hhx", "UserId": "U9d2bbec5c40e6a3278f0f077b02c4c2ff", "Tel": "1212312121", "Problem": [] }
  Logger.log(doc)
  const checkDupOpt = {
    method: 'post',
    payload: JSON.stringify({ header: 'Person', query: { _id: doc.userID } })
  }

  const checkRes = UrlFetchApp.fetch(mongodbUri + "/find", checkDupOpt);
  // Logger.log(JSON.parse(checkRes.getContentText())[0].role);
  try {
  const fixerStatus = JSON.parse(checkRes.getContentText())[0].role
  if (fixerStatus == "User" ) {
    return "0"
  } else{
    return "1"
  }
    
  } catch {
    return "2"
  }
  
  
}