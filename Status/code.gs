var userId = null;
var displayName = null;
var pictureUrl = null;
var problem_id = null;
var userName = null;
var status = null;
var request = null;
var location = null;
var problemPicture = null;
var recieveDate = null;
var problemList = null;

function doGet(e) {
  //userId = "Ua710c1847a661789b0d3a7b8f6d82727";
  userId = e.parameter.userId;
  displayName = e.parameter.displayName;
  pictureUrl = e.parameter.pictureUrl;

  try {
    var checkFixer = findFixer(userId).length;

    if (checkFixer > 0) {
      try {
        problem_id = findFixer(userId)[0].problems
          .filter(subarray => subarray[1] === "Fixer")
          .map(subarray => subarray[0]);

        if (problem_id.length > 0) {
          Logger.log("problem_id.length = " + problem_id.length)
          var template = HtmlService.createTemplateFromFile("admin");
          var tool_list1 = findToolType('ไฟฟ้า');
          template.tool_list1 = tool_list1;

          var tool_list2 = findToolType('ไอที');
          template.tool_list2 = tool_list2;

          var tool_list3 = findToolType('ประปา');
          template.tool_list3 = tool_list3;

          var tool_list4 = findToolType('ทั่วไป');
          template.tool_list4 = tool_list4;

          template.problem_id = problem_id;

          return template.evaluate()
            .setTitle("Admin Dashboard")
            .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
            .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        } else {
          try {
            problemList = findPerson(userId)[0].problems
              .filter(subarray => subarray[1] === "User")
              .map(subarray => subarray[0]);

            if (problemList.length > 0) {
              var template = HtmlService.createTemplateFromFile("user");
              template.problemList = problemList;

              return template.evaluate()
                .setTitle("User Dashboard")
                .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
                .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
            } else {
              var template = HtmlService.createTemplateFromFile("idleUser");
              return template.evaluate()
                .setTitle("Idle User Dashboard")
                .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
                .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
            }
          } catch (f){
            Logger.log(f.toString() + "User")
            var template = HtmlService.createTemplateFromFile("idleUser");
            return template.evaluate()
              .setTitle("Idle User Dashboard")
              .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
              .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
          }
        }
      } catch (f){
        Logger.log(f.toString() + "Admin")
        var template = HtmlService.createTemplateFromFile("idleAdmin");
        return template.evaluate()
          .setTitle("Idle Admin Dashboard")
          .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      }
    } else {
      var template = HtmlService.createTemplateFromFile("idleUser");
      return template.evaluate()
        .setTitle("Idle User Dashboard")
        .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
  } catch (error) {
    Logger.log(error.toString())
  }
}
