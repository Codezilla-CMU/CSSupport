var userId = null;
var displayName = null;
var pictureUrl = null;

function doGet(e) {
  userId = e.parameter.userId;
  displayName = e.parameter.displayName;
  pictureUrl = e.parameter.pictureUrl;
  findFixer(userId);
  
  return HtmlService.createTemplateFromFile("index").evaluate().setTitle("ระบบแจ้งซ่อม Online")
  .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function saveRequest(userId, displayName, pictureUrl, request){
  var sheetID = '11ONVfN8YD_aBVflke-fUP-aYdY38z6zuUvlkaS_ZWKw';
  var doc = SpreadsheetApp.openById(sheetID);
  var sheet = doc.getSheetByName("test");
  sheet.appendRow([userId,displayName,pictureUrl,request])
}