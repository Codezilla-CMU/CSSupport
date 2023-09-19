
function hideColumns() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var selectedRange = sheet.getActiveRange();
  var column = selectedRange.getColumn();
  var numColumns = selectedRange.getNumColumns();

  sheet.hideColumns(column, numColumns);
}



function showColumns() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var selectedRange = sheet.getActiveRange();
  var column = selectedRange.getColumn();
  var numColumns = selectedRange.getNumColumns();

  sheet.showColumns(column, numColumns);
}





// Function to insert data into the "Fixer" collection in MongoDB
function insertFixerToMongo(name, userId, tel, problem) {
  const fixerDoc = {
    Name: name,
    UserId: userId,
    Tel: tel,
    Problem: problem
  };

  const fixerOpt = {
    'contentType': 'application/json',
    method: 'post',
    payload: JSON.stringify(fixerDoc)
  };

  const fixerRes = UrlFetchApp.fetch("https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo" + "/insertFixer", fixerOpt);
  const fixerId = fixerRes.getContentText().replace(/["\\]/g, '');
  Logger.log(fixerRes.getResponseCode());
  Logger.log(fixerId);
}

// Example usage of the insertFixerToMongo function
function testInsertFixer() {
  const fixerName = "John Doe";
  const fixerUserId = "fixer123";
  const fixerTel = "123-456-7890";
  const fixerProblem = "Hardware Repair";

  insertFixerToMongo(fixerName, fixerUserId, fixerTel, fixerProblem);



}
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Addmin option')
    .addItem('Insert Fixer', 'showInsertFixerDialog')
    .addItem('Hide Selected Columns', 'hideColumns')
    .addItem('Show Selected Columns', 'showColumns')
    .addToUi();
}

function showInsertFixerDialog() {
  var ui = SpreadsheetApp.getUi();
  var prompt = ui.prompt(
    'Insert Fixer Data',
    'Enter Fixer Data (Name, UserID, Tel, Problem) separated by commas:',
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt.getSelectedButton() === ui.Button.OK) {
    var inputText = prompt.getResponseText();
    var inputData = inputText.split(','); // Split the input into an array

    if (inputData.length === 4) {
      var fixerName = inputData[0].trim();
      var fixerUserId = inputData[1].trim();
      var fixerTel = inputData[2].trim();
      var fixerProblem = inputData[3].trim();

      insertFixerToMongo(fixerName, fixerUserId, fixerTel, fixerProblem);
      ui.alert('Fixer Data Inserted Successfully!');
    } else {
      ui.alert('Invalid input. Please provide Name, UserID, Tel, and Problem separated by commas.');
    }
  }
}

