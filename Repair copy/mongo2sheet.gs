const sheet = SpreadsheetApp.getActiveSpreadsheet();
function findMongo(date) {
  var sDate = date[0];
  var eDate = date[1];
  const findOpt = {
    method : 'post',
    payload : JSON.stringify( { header : 'Problem' , query : { sDate : sDate , eDate : eDate } })
  }
  const findRes = UrlFetchApp.fetch(Endpoint+"/findDate", findOpt);
  // Logger.log(findRes.getContentText());
  const plist = JSON.parse(findRes.getContentText());
  clearDashboard();
  addToolType(plist);
  return plist.length;
}

function clearDashboard() {
  var dbSheet = sheet.getSheetByName("Dashboard");
  var range = dbSheet.getRange("J15:AB33");
  range.clear();
}

function clearSheet(collection) {
  var clearSheet = sheet.getSheetByName(collection);
  var dataRange = clearSheet.getDataRange();
  var numRows = dataRange.getNumRows();

  // Clear data in all rows except for row 1
  if (numRows > 1) {
    clearSheet.deleteRows(2, numRows - 1);
  }
}

function updateProblemSheet(id,value,rows) {
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
      new Date(newValue.receiveDate),
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
      upSheet.getRange(rowToUpdate + 1, rows).setValue(newValue);
    }
  } 
}

function updatePersonSheet(id,value,rows) {
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
      upSheet.getRange(rowToUpdate + 1, rows).setValue(newValue);
    }
  } 
}

function toolSupplySheet() {
  var fixerSheet = sheet.getSheetByName("Tool");
  var dataRange = fixerSheet.getDataRange();
  var values = dataRange.getValues();
  var headerRow = values[0];

  // Loop through each row of data (starting from row 2, assuming the first row is the header)
  for (var i = 1; i < values.length; i++) {
    var rowData = values[i];
    var jsonObject = { header : 'Tool' , filter : { } , query : {} };

    // Populate the JSON object with data from the row
    for (var j = 0; j < headerRow.length; j++) {
      Logger.log(rowData[j])
      if (j == 0) {
        jsonObject.filter.name = rowData[j];
        jsonObject.query[headerRow[j]] = rowData[j];
      } 
      jsonObject.query[headerRow[j]] = rowData[j];
    }

    const jopt = {
      method : 'post',
      payload : JSON.stringify(jsonObject)
    }
    const res = UrlFetchApp.fetch(Endpoint+"/updateSet", jopt);
    const checkdup = JSON.parse(res.getContentText()).matchedCount
    Logger.log(checkdup);

    if (checkdup == 0) {
      const newtoolopt = {
        method : 'post',
        payload : JSON.stringify(jsonObject)
      }
      const ntres = UrlFetchApp.fetch(Endpoint+"/insert", newtoolopt);
      Logger.log(ntres.getResponseCode());
    }
  }
  
  clearSheet("Tool");
  const findOpt = {
    method : 'post',
    payload : JSON.stringify( { header : 'Tool' , query : {} } )
  }
  const findRes = UrlFetchApp.fetch(Endpoint+"/find", findOpt);
  Logger.log(findRes.getContentText());
  const data = findRes.getContentText();

  // Assuming the data is in JSON format
  for (var i = 0; i < JSON.parse(data).length; i++) {
    var item = JSON.parse(data)[i];
    fixerSheet.appendRow([
      item.name,
      item.type,
      item.price
    ]);
  }
}

function personSheet() {
  var problemSheet = sheet.getSheetByName("Person");
  var dataRange = problemSheet.getDataRange();
  var values = dataRange.getValues();
  var headerRow = values[0];

  // Loop through each row of data (starting from row 2, assuming the first row is the header)
  for (var i = 1; i < values.length; i++) {
    var rowData = values[i];
    var jsonObject = { header : 'Person' , filter : { } , query : {} };

    // Populate the JSON object with data from the row
    for (var j = 0; j < headerRow.length; j++) {
      Logger.log(rowData[j])
      if (j == 0) {
        jsonObject.filter._id = rowData[j];
      } 
      jsonObject.query[headerRow[j]] = rowData[j];
    }

    const jopt = {
      method : 'post',
      payload : JSON.stringify(jsonObject)
    }
    const res = UrlFetchApp.fetch(Endpoint+"/updateSet", jopt);
  }

  clearSheet("Person");
  const findOpt = {
    method : 'post',
    payload : JSON.stringify( { header : 'Person' , query : {} } )
  }
  const findRes = UrlFetchApp.fetch(Endpoint+"/find", findOpt);
  Logger.log(findRes.getContentText());
  const data = findRes.getContentText();

  var personSheet = sheet.getSheetByName("Person");
  // Assuming the data is in JSON format
  for (var i = 0; i < JSON.parse(data).length; i++) {
    var item = JSON.parse(data)[i];
    Logger.log(item._id)
    personSheet.appendRow([
      item._id,
      item.name,
      item.tel,
      item.role,
      item.profilePicture
    ]);
  }
}

function problemSheet() { 
  var problemSheet = sheet.getSheetByName("Problem");
  var dataRange = problemSheet.getDataRange();
  var values = dataRange.getValues();
  var headerRow = values[0];

  // Loop through each row of data (starting from row 2, assuming the first row is the header)
  for (var i = 1; i < values.length; i++) {
    var rowData = values[i];
    var jsonObject = { header : 'Problem' , filter : { } , query : {} };

    // Populate the JSON object with data from the row
    for (var j = 0; j < headerRow.length; j++) {
      // Logger.log(rowData[j])
      if (j == 0) {
        jsonObject.filter._id = rowData[j];
      } else if (j == 6 || j == 7) {
        continue;
      } else {
        jsonObject.query[headerRow[j]] = rowData[j];
      }
    }

    const jopt = {
      method : 'post',
      payload : JSON.stringify(jsonObject)
    }
    const res = UrlFetchApp.fetch(Endpoint+"/updateSet", jopt);
    const modify = JSON.parse(res.getContentText()).modifiedCount;

    if (modify != 0) {
      // const fopt = { method : 'post' , payload : JSON.stringify({ header : 'Person' , query : { userID : jsonObject.query.owner } }) }
      // const resf = UrlFetchApp.fetch(Endpoint+"/find", jopt);
      // const role = JSON.parse(resf.getContentText())[0].role
      

      const fixerDoc = { header : 'Person' , 
      filter : {problems :  {$in: [[jsonObject.filter._id, "Fixer"],[jsonObject.filter._id, "User"]]} } ,
      query : {problems :  [jsonObject.filter._id,"Fixer"]} }  
      const fixerOpt = { method : 'post' , payload : JSON.stringify(fixerDoc)}
      const pullRes = UrlFetchApp.fetch(Endpoint+"/updatePull", fixerOpt);
      const fixDoc = { header : 'Person' , filter : {name : jsonObject.query.fixer} , 
      query : {problems :  [jsonObject.filter._id, "Fixer"] } } 
      const fixOpt = { method : 'post' , payload : JSON.stringify(fixDoc) }
      const pushRes = UrlFetchApp.fetch(Endpoint+"/updatePush", fixOpt);
      
    } 
  }

  clearSheet("Problem");
  const findOpt = {
    method : 'post',
    payload : JSON.stringify( { header : 'Problem' , query : { } })
  }
  const findRes = UrlFetchApp.fetch(Endpoint+"/find", findOpt);
  Logger.log(findRes.getContentText());
  const data = findRes.getContentText();

  // Assuming the data is in JSON format
  for (var i = 0; i < JSON.parse(data).length; i++) {
    var item = JSON.parse(data)[i];
    Logger.log(item._id)
    if (item.finishDate != "") {
      item.finishDate = new Date(item.finishDate)
    }
    problemSheet.appendRow([
      item._id,
      item.status,
      item.owner,
      item.request,
      item.location,
      item.problemPicture,
      new Date(item.receiveDate),
      item.finishDate,
      item.fixer,
      item.totalPrice
    ]);
  }
}

function addToolType(data) {
    data.forEach(function (item) {
      findToolTypes(item.tools)
    });
}

function findFirstEmptyRowInColumn(range, column) {
  var values = range.getValues();
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] === "") {
      return i + range.getRow();
    }
  }
  return -1; // Return -1 if no empty row is found
}




function findToolTypes(idlist) {
  idlist.forEach(function (id) {
    const findOpt = {
    method: 'post',
    payload: JSON.stringify({ header: 'ToolFix', query: { _id: id } })
    }
    const findRes = UrlFetchApp.fetch(Endpoint + "/find", findOpt);
    // Logger.log(findRes.getContentText());
    const data = JSON.parse(findRes.getContentText());
    Logger.log(data)
    if (data.length > 0) {
      if (data[0].type == "ไฟฟ้า") {
        var scol = 10; 
        var range = "J15:J33";
      } else if (data[0].type == "ไอที") {
        var scol = 25; 
        var range = "Y15:Y33";
      } else if (data[0].type == "ประปา") {
        var scol = 15; 
        var range = "O15:O33";        
      } else {
        var scol = 20; 
        var range = "T15:T33";
      }
    } else { 
      return 0;
    }

    var querySheet = sheet.getSheetByName("Dashboard");
    var r = querySheet.getRange(range);
    var startRow = findFirstEmptyRowInColumn(r, range.charAt(0));
    Logger.log(startRow)
  
    if (startRow === -1) {
      // The range is full, handle this case (e.g., display an error message)
      Logger.log("range is full.");
      return;
    }  
  
    
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
  });
  return 1;
  
}
