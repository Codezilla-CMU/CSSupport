var userId = null;
var displayName = null;
var pictureUrl = null;
var link = null;

// old code

function doGet(e) {
  userId = e.parameter.userId;
  displayName = e.parameter.displayName;
  pictureUrl = e.parameter.pictureUrl;

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

function uploadFile(data, file, userId, displayName, pictureUrl, request, location) {
  try {
    var folder = DriveApp.getFolderById('1wDbmiYqAErWyd6U8hR4hrsGm6n9E-vrx');
    var contentType = data.substring(5, data.indexOf(';')),
      bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,') + 7)),
      blob = Utilities.newBlob(bytes, contentType, file),
      file = folder.createFolder([displayName + new Date()]).createFile(blob),
      filelid = file.getId();
    const requests = request
    const locations = location
    const image = 'https://drive.google.com/uc?id=' + filelid
    var lock = LockService.getPublicLock();
    lock.waitLock(30000);
    var doc = SpreadsheetApp.openById(sheetID);
    var sheet = doc.getSheetByName("Problem");
    recDate = new Date;
    var problemId = insert2mongo(userId, displayName, pictureUrl, requests, locations, image, recDate)
    sheet.appendRow([userId, displayName, pictureUrl, requests, locations, image, recDate])
    assignProblemToFixer(problemId);
    var tokens = 'rNIQjZJV8fwM7N1Q5dxC9xscQTPuF5LTczHpH79QHs2'
    var message = '\n ผู้เเจ้ง : ' + displayName +
      '\n ปัญหาที่เเจ้ง : ' + requests +
      '\n สถานที่ : ' + locations +
      '\n วันที่ : ' + recDate +
      '\n รูปประกอบ : ' + image
    sendLineNotify(message, tokens)
    var status = "Received";
    // สร้าง Flex Message และข้อความ Problem ID
    var flexMessage = createFlexMessage(userId, displayName, request, location, recDate, image, problemId, status);

    // ส่ง Flex Message และข้อความ Problem ID ไปยังผู้ใช้
    sendFlexMessageToUser(flexMessage ,userId, problemId);
    return "OK"
  } catch (f) {
    return f.toString();
  } finally {
    lock.releaseLock();
  }
}

function sendLineNotify(message, token) {
  var options = {
    "method": "post",
    "payload": {
      "message": message,
    },
    "headers": { "Authorization": "Bearer " + token }
  };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}







