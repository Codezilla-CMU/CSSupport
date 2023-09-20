var userId = null;
var displayName = null;
var pictureUrl = null;
var problemList = null;
var userName = null;
var request = null;
var location = null;
var problemPicture = null;
var receiveDate = null;

function doGet(e) {
  userId = e.parameter.userId;
  problemList = findPerson(userId)[0].problems
  if (problemList.length > 0) {
    var template = HtmlService.createTemplateFromFile("index");
    template.problemList = problemList;
    
    return template.evaluate().setTitle("สถานะงาน")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } else {
    var template = HtmlService.createTemplateFromFile("idle");
    
    return template.evaluate().setTitle("สถานะงาน")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
}

function saveRequest(userId, displayName, pictureUrl, request){
  var sheetID = '11ONVfN8YD_aBVflke-fUP-aYdY38z6zuUvlkaS_ZWKw';
  var doc = SpreadsheetApp.openById(sheetID);
  var sheet = doc.getSheetByName("test");
  sheet.appendRow([userId,displayName,pictureUrl,request])
}