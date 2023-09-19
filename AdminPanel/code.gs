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
    var token = 'rNIQjZJV8fwM7N1Q5dxC9xscQTPuF5LTczHpH79QHs2'
    var message = '\n ผู้เเจ้ง : ' + displayName +
      '\n ปัญหาที่เเจ้ง : ' + requests +
      '\n สถานที่ : ' + locations +
      '\n วันที่ : ' + recDate +
      '\n รูปประกอบ : ' + image
    sendLineNotify(message, token)
    var status = "Received";
    // สร้าง Flex Message และข้อความ Problem ID
    var flexMessage = createFlexMessage(userId, displayName, request, location, recDate, image, problemId, status);


    // ส่ง Flex Message และข้อความ Problem ID ไปยังผู้ใช้
    sendFlexMessageToUser(userId, flexMessage, problemId);

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



// สร้าง Flex Message
function createFlexMessage(userId, displayName, request, location, recDate, image, problemId,status) {
  // สร้างข้อความ Flex Message ของคุณ
  var flexMessage = {
    type: "flex",
    altText: "ข้อมูลแจ้งซ่อม", // ข้อความสำหรับผู้ใช้เมื่อไม่สามารถแสดง Flex Message ได้
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: image, // URL ของรูปภาพที่คุณต้องการแสดง
        size: "full",
        aspectMode: "cover",
        aspectRatio: "20:13",
      },
      "body": {
    "type": "box",
    "layout": "vertical",
    "spacing": "md",
    "contents": [
      {
        "type": "text",
        "text": "ปัญหาที่เเจ้ง (รายละเอียด)",
        "wrap": true,
        "weight": "bold",
       
        "size": "lg",
        "color": "#000000"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "lg",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "เรื่องที่แจ้ง :",
                "color": "#000000",
                "size": "sm",
                "flex": 1,
                "weight": "bold",
              
                "wrap": true,
            
                "scaling": false,
                "position": "absolute",
          
              },
              {
                "type": "text",
                "text": request,
                "wrap": true,
                "size": "sm",
                "color": "#666666",
                "flex": 4,
                "position": "relative",
                "align": "end",
                "scaling": true,
            
           
                "weight": "bold"
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "สถานะ :",
                "color": "#000000",
                "size": "sm",
                "flex": 1,
                "weight": "bold",
              
              
                "position": "absolute",
                "align": "start",
            
                "wrap": true,
                "scaling": true
              },
              {
                "type": "text",
                "text": status,
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 4,
                "position": "relative",
                "align": "end",
             
          
                "weight": "bold"
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "ผู้เเจ้ง :",
                "color": "#000000",
                "size": "sm",
                "flex": 1,
                "weight": "bold",
             
             
                "position": "absolute",
                "align": "start",
            
                "wrap": true,
                "scaling": true
              },
              {
                "type": "text",
                "text": displayName,
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 4,
                "weight": "bold",
               
           
                "position": "relative",
                "align": "end",
                "scaling": true,
           
              }
            ]
          },
          
          {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "text",
                "text": "สถานที่เเจ้ง :",
                "flex": 1,
                "size": "sm",
                "color": "#000000",
                "weight": "bold",
              
          
                "position": "absolute",
                "align": "start",
        
                "wrap": true,
                "scaling": true
              },
              {
                "type": "text",
                "text": location,
                "flex": 4,
                "size": "sm",
                "color": "#666666",
                "weight": "bold",
            
              
                "position": "relative",
                "align": "end",
          
                "wrap": true,
                "scaling": true
              }
            ],
            "spacing": "sm"
          },
          {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "text",
                "text": "วันที่เเจ้ง :",
                "flex": 1,
                "size": "sm",
                "color": "#000000",
                "weight": "bold",
             
             
                "position": "absolute",
                "align": "start",
                
                "wrap": true,
                "scaling": true
              },
              {
                "type": "text",
                "text": recDate,
                "flex": 4,
                "size": "sm",
                "color": "#666666",
                "weight": "bold",
            
               
                "position": "relative",
                "align": "end",
            
                "wrap": true,
                "scaling": true
              }
            ],
            "spacing": "sm"
          },
          {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "text",
                "text": "หมายเลขปัญหา :"+ problemId,
                "flex": 1,
                "size": "sm",
                "color": "#000000",
                "weight": "bold",
             
               
                "position": "relative",
                "align": "start",
            
                "wrap": true,
                "scaling": true
              },
            ],
            "spacing": "sm"
          },
        ]
      }
    ]
  }
    },
  };

  return flexMessage;
}





function sendFlexMessage(flexMessage, userId, problemId) {
  var token = "3udqr+wV8h1PDGWXxSidXxtGaQa7a+C9xLt6OIG3bkN+prZ8KAd81h/Km+RC35lN/gXWsmI+QhmOzLxc1XXPbrWFW7GIw12xgPT7NTJlflHjjnrPq7qNuHawQrKv6uTJwapsKKvxt0HVqsxj7lZWygdB04t89/1O/w1cDnyilFU="; // แทน YOUR_ACCESS_TOKEN_HERE ด้วย Access Token ของคุณจาก LINE Channel Developer Console
  var options = {
    method: "post",
    payload: JSON.stringify({
      to: userId,
      messages: [flexMessage],
      problemId: problemId,
    }),
    headers: { Authorization: "Bearer " + token },
    contentType: "application/json",
  };

  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", options);
}

// ฟังก์ชันส่ง Flex Message ไปยังผู้ใช้ที่ระบุพร้อมกับ problemId และ userId
function sendFlexMessageToUser(userId, flexMessage, problemId) {
  sendFlexMessage(flexMessage, userId, problemId);
}



// รับข้อมูล Postback จากผู้ใช้
function handlePostback(postbackData) {
  // ตรวจสอบ postbackData และดำเนินการคัดลอก ProblemID ไปยัง Clipboard
  var parts = postbackData.split("|");
  if (parts[0] === "copyProblemId") {
    var problemIdToCopy = parts[1];
    copyToClipboard(problemIdToCopy);
  }
}

// ฟังก์ชันคัดลอกข้อมูลไปยัง Clipboard
function copyToClipboard(text) {
  var clipboard = DriveApp.getClipboard();
  clipboard.setString(text);
}
