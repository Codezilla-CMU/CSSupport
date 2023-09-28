var userId = null;
var displayName = null;
var pictureUrl = null;
var link = null;

// old code

function doGet(e) {
  userId = e.parameter.userId;
  displayName = e.parameter.displayName;
  pictureUrl = e.parameter.pictureUrl;

  // userId = "U9d2bbec5c40e6a3278f0f077b02c4c2e";
  // displayName = 'Fluke';
  // pictureUrl = 'https://profile.line-scdn.net/0hiecjDENiNkpOEx7tnQdINT5DNSBtYm9YZHV5eS9EYX9wKyQeayJ7e3IUbXkjJCFMMiB9LC5BOHJCAEEsUEXKfkkja3tyInMea3xwrg';

  return HtmlService.createTemplateFromFile("index").evaluate().setTitle("ระบบแจ้งซ่อม Online")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


function processForm(formObject) {
  var result = "";
  if (formObject.searchtext) {
    result = search(formObject.searchtext);
  }
  return result;
}

function search(searchtext) {
  var spreadsheetId = '11ONVfN8YD_aBVflke-fUP-aYdY38z6zuUvlkaS_ZWKw';
  var dataRage = 'test!A2:D';
  var data = Sheets.Spreadsheets.Values.get(spreadsheetId, dataRage).values;
  var ar = [];

  data.forEach(function (f) {
    if (~f.indexOf(searchtext)) {
      ar.push(f);
    }
  });
  return ar;
}

var SCRIPT_PROP = PropertiesService.getScriptProperties();
var sheetID = '11ONVfN8YD_aBVflke-fUP-aYdY38z6zuUvlkaS_ZWKw'
function setup() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  SCRIPT_PROP.setProperty(sheetID, doc.getId());
}

function uploadFile(data, file,userId, displayName, pictureUrl, request, location) {
  try {
    var folder = DriveApp.getFolderById('1wDbmiYqAErWyd6U8hR4hrsGm6n9E-vrx');
    var contentType = data.substring(5, data.indexOf(';')),
      bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,') + 7)),
      blob = Utilities.newBlob(bytes, contentType, file),
      file = folder.createFolder([displayName + new Date()]).createFile(blob),
      filelid = file.getId();
    const image = 'https://drive.google.com/uc?id=' + filelid

      var recDate = new Date();
      var thaiRecDate = formatThaiDateTime(recDate);

      var problemId = insert2mongo(userId, displayName, pictureUrl, request, location, image, recDate)
      var fixerName = assignProblemToFixer(problemId);

      var status = "Recieved";
      var flexMessage = createFlexMessage(fixerName, request, location, thaiRecDate, image, problemId, status);
      sendFlexMessage(flexMessage ,userId, problemId);

    return "OK"
  } catch (f) {
    return f.toString();
  }
}

function formatThaiDateTime(dateString) {
  var timeZone = 'Asia/Bangkok'; // Time zone for Bangkok
  var date = new Date(dateString);
  var thaiDate = Utilities.formatDate(date, timeZone, 'dd/MM/yyyy HH:mm:ss');
  return thaiDate;
}






