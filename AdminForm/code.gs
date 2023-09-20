var userId = null;
var displayName = null;
var pictureUrl = null;
var problem_id = null;
var userName = null;
var request = null;
var location = null;
var problemPicture = null;
var receiveDate = null;

function doGet(e) {
  //userId = e.parameter.userId;
  userId = 'Ua710c1847a661789b0d3a7b8f6d82727';
  /*displayName = e.parameter.displayName;
  pictureUrl = e.parameter.pictureUrl;*/
  problem_id = findFixer(userId)[0].Problem;
  
  if (problem_id.length > 0) {
    var template = HtmlService.createTemplateFromFile("index");
    var tool_list1 = findToolType('ไฟฟ้า');
    template.tool_list1 = tool_list1;

    var tool_list2 = findToolType('ไอที');
    template.tool_list2 = tool_list2;

    var tool_list3 = findToolType('ประปา');
    template.tool_list3 = tool_list3;

    var tool_list4 = findToolType('ทั่วไป');
    template.tool_list4 = tool_list4;

    template.problem_id = problem_id;
    
    return template.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } else {
    var template = HtmlService.createTemplateFromFile("idle");
    return template.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
}

function saveRequest(userId, displayName, pictureUrl, request){
  var sheetID = '11ONVfN8YD_aBVflke-fUP-aYdY38z6zuUvlkaS_ZWKw';
  var doc = SpreadsheetApp.openById(sheetID);
  var sheet = doc.getSheetByName("test");
  sheet.appendRow([userId,displayName,pictureUrl,request])
}