var userId = null;
var pictureUrl = null;
const mongodbUri = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";

function doGet(e) {
  userId = e.parameter.userId;
  pictureUrl = e.parameter.pictureUrl;
  var template = HtmlService.createTemplateFromFile("index");
   
  return template.evaluate().setTitle("สถานะงาน")
  .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}

function insertFixer(doc) {
  try {
    const fixerOpt = {
      header: 'Fixer',
      'contentType': 'application/json',
      method: 'post',
      payload: JSON.stringify({ header: "Fixer", query: JSON.parse(doc) })
    };

    const fixerRes = UrlFetchApp.fetch(mongodbUri + "/insert", fixerOpt);
    const fixerId = fixerRes.getContentText().replace(/["\\]/g, '');

    Logger.log(fixerRes.getResponseCode());
    Logger.log(fixerId);
    if (fixerRes.getResponseCode() === 200 && fixerId !== "") {
      return "OK"; 
    } else {
      return "Error"; 
    }
  } catch (e) {
    Logger.log(e);
    return "Error"; 
  }
}
