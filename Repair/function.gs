const mongodbUri = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-nktdb/endpoint/sheet2mongo";
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

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Admin option')
    // .addItem('Find Data', 'findData')
    .addItem('Update MongoDB', 'updateMongo')
    .addItem('Hide Selected Columns', 'hideColumns')
    .addItem('Show Selected Columns', 'showColumns')
    .addToUi();
}

function updateMongo() {
  problemSheet();
  personSheet();
  toolSupplySheet();
}

// [["20xx-01-01"],["20xx-01-31"]]
function findData() {
  var ui = SpreadsheetApp.getUi();
  var prompt1 = ui.prompt(
    'Find Data',
    'Enter Start Date (YYYY-MM-DD):',
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt1.getSelectedButton() === ui.Button.OK) {
    var inputText1 = prompt1.getResponseText();
    if (inputText1 === '') {
      ui.alert('Invalid input. Please provide YYYY-MM-DD');
      return;
    }
  } else {
    return;
  }

  var prompt2 = ui.prompt(
    'Find Data',
    'Enter End Date (YYYY-MM-DD):',
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt2.getSelectedButton() === ui.Button.OK) {
    var inputText2 = prompt2.getResponseText();
    if (inputText2 === '') {
      ui.alert('Invalid input. Please provide YYYY-MM-DD');
      return;
    }
    var date = []
    date[0] = inputText1
    date[1] = inputText2

    ui.alert('Fixer Data Inserted Successfully!' + ' ' + date[0] + ' '+ date[1]);
  } else {
    return;
  }
}



/*function recieveDate_googlesheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var dashboardSheet = spreadsheet.getSheetByName("Dashboard"); // ระบุชื่อตาราง "Dashboard"

  if (dashboardSheet) {
    var startDateCell = dashboardSheet.getRange(1, 3); // แถวที่ 1, คอลัมน์ที่ 3 (C)

    var startDateValue = startDateCell.getValue();
    var yearMonth = startDateValue.split("-"); // แยกปีและเดือน
    var year = Number(yearMonth[0]);
    var month = Number(yearMonth[1]);

    // สร้างวันแรกของเดือน
    var startDate = new Date(year, month - 1, 1); 

    // สร้างวันสุดท้ายของเดือน
    var endDate = new Date(year, month, 0); 

    // แปลงวันที่ให้อยู่ในโซนเวลาของประเทศไทย
    var timeZone = "Asia/Bangkok";
    var startDateStr = Utilities.formatDate(startDate, timeZone, "yyyy-MM-dd");
    var endDateStr = Utilities.formatDate(endDate, timeZone, "yyyy-MM-dd");

    // console.log("startDateStr : " + startDateStr );
    // console.log("endDateStr : " + endDateStr );

    var dataToSend = [[startDateStr], [endDateStr]];
    console.log("Date: " + dataToSend);
    
    
  } else {
    console.log("Dashboard sheet not found.");
  }


  //findMongo(dataToSend)
}

function onEdit(e) {
  var range = e.range;
  var sheet = range.getSheet();
  
  // ตรวจสอบว่าคลิกที่แผ่นงาน "Dashboard" เท่านั้น
  if (sheet.getName() === "Dashboard") {
    // ตรวจสอบเซลล์ที่ถูกคลิกว่าเป็นเซลล์ที่คุณต้องการ
    if (range.getA1Notation() === "C1") {
      // เรียกใช้ฟังก์ชัน recieveDate_googlesheet อัตโนมัติ
      recieveDate_googlesheet();
    }
  }
}
*/
function createDeleteButton() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();

  for (var i = 0; i < data.length; i++) {
    if (data[i][3] === "Fixer") {
      var button = sheet.getRange(i + 1, 6).setValue("Delete");
      var buttonId = button.getSheet().getSheetId() + i;
      var script = `
        (function() {
          google.script.run.withSuccessHandler(function() {
            google.script.host.close();
          }).deleteFixer("${buttonId}");
        })();
      `;

      sheet.getRange(i + 1, 6).setFormulaR1C1(`=HYPERLINK("#gid=${buttonId}", "Delete")`);
      sheet.getRange(i + 1, 6).setNote(`Click to delete Fixer`);
    }
  }
}

function deleteFixer(buttonId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DeleteButtons");
  var row = sheet.getRange(sheet.getRange(1, 1, sheet.getLastRow(), 1).createTextFinder(buttonId).matchEntireCell(true).findNext()).getRow();
  var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rowToDelete = row;
  var buttonCell = dataSheet.getRange(row, 6);
  buttonCell.clearContent();
  dataSheet.deleteRow(rowToDelete);

  // ทำการลบข้อมูล Fixer ใน MongoDB ด้วยโค้ดที่เหมาะสมที่นี่
  // เช่น, ใช้ MongoDB API หรือวิธีอื่น ๆ ตามความเหมาะสม

  // เมื่อลบข้อมูลเสร็จสิ้น อาจจะให้แสดงข้อความหรือส่งค่ากลับไปยังผู้ใช้ได้ตามที่คุณต้องการ
}

function installTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var sheet = SpreadsheetApp.getActiveSpreadsheet();

  // ตรวจสอบว่า Trigger สำหรับ createDeleteButton ยังไม่ถูกสร้าง
  var triggerExists = false;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "createDeleteButton") {
      triggerExists = true;
      break;
    }
  }

  // ถ้า Trigger ยังไม่ถูกสร้าง ให้สร้าง Trigger เพื่อเรียกใช้ createDeleteButton
  if (!triggerExists) {
    ScriptApp.newTrigger("createDeleteButton")
      .forSpreadsheet(sheet)
      .onOpen()
      .create();
  }
}

// เรียกใช้ installTrigger เพื่อติดตั้ง Trigger เมื่อเปิดหน้า Google Sheets ครั้งแรก
installTrigger();




