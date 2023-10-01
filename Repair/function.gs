const token = "3udqr+wV8h1PDGWXxSidXxtGaQa7a+C9xLt6OIG3bkN+prZ8KAd81h/Km+RC35lN/gXWsmI+QhmOzLxc1XXPbrWFW7GIw12xgPT7NTJlflHjjnrPq7qNuHawQrKv6uTJwapsKKvxt0HVqsxj7lZWygdB04t89/1O/w1cDnyilFU="; // แทน YOUR_ACCESS_TOKEN_HERE ด้วย Access Token ของคุณจาก LINE Channel Developer Console
// สร้าง Flex Message
function createFlexMessage(fixerName, request, location, recDate, image, problemId, status) {
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
            "text": "Reported Problems (detail)",
            "wrap": true,
            "weight": "bold",
            "align": "center",
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
                    "text": "Problem :",
                    "color": "#000000",
                    "size": "sm",
                    "flex": 1,
                    "weight": "bold",
                   
                    "wrap": true,
                    "position": "absolute"

                   

                  },
                  {
                    "type": "text",
                    "text": request,
                    "wrap": true,
                    "size": "sm",
                    "color": "#4169E1",
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
                    "text": "Status :",
                    "color": "#000000",
                    "size": "sm",
                    "flex": 1,
                    "weight": "bold",
                    "wrap": true,
                    "position": "absolute"
 
                  },
                  {
                    "type": "text",
                    "text": status,
                    "wrap": true,
                    "color": "#4169E1",
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
                    "text": "Fixer :",
                    "color": "#000000",
                    "size": "sm",
                    "flex": 1,
                    "weight": "bold",
                    "wrap": true,
                    "position": "absolute"
 
                  },
                  {
                    "type": "text",
                    "text": fixerName,
                    "wrap": true,
                    "color": "#4169E1",
                    "size": "sm",
                    "flex": 4,
                    "weight": "bold",
                    "position": "relative",       
                    "align": "end",
                   

                  }
                ]
              },

              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "Location :",
                    "flex": 1,
                    "size": "sm",
                    "color": "#000000",
                    "weight": "bold",
                    "wrap": true,
                    "position": "absolute"

     
                  },
                  {
                    "type": "text",
                    "text": location,
                    "flex": 4,
                    "size": "sm",
                    "color": "#4169E1",
                    "weight": "bold", 
                    "position": "relative",      
                    "align": "end",
                    "wrap": true,
                    
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
                    "text": "Notified date :",
                    "flex": 1,
                    "size": "sm",
                    "color": "#000000",
                    "weight": "bold",
                    "wrap": true,
                    "position": "absolute"
  
                  },
                  {
                    "type": "text",
                    "text": recDate,
                    "flex": 4,
                    "size": "sm",
                    "color": "#4169E1",
                    "weight": "bold",
                   
                    "position": "relative", 
                    "wrap": true,  
                    "align": "end",      
                   
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
                    "text": "ProblemID : " ,
                    "flex": 1,
                    "size": "sm",
                    "color": "#b22222",
                    "weight": "bold",   
                    "wrap": true,
                    "position": "absolute"                                                
                  },
                  {
                    "type": "text",
                    "text":  problemId,
                    "flex": 4,
                    "size": "sm",
                    "color": "#b22222",
                    "weight": "bold",
                   
                    "position": "relative", 
                    "wrap": true,  
                    "align": "end",
    
                  }
                ],
                "spacing": "sm"
              },
            ]
          }
        ],
      },
    },
  };

  return flexMessage;
}

function createFlexMessageFixer(displayName, request, location, recDate, image, problemId, status) {
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
            "text": "เเจ้งซ่อม (รายละเอียด)",
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
                    "position": "absolute"
                                 
                  },
                  {
                    "type": "text",
                    "text": request,
                    "wrap": true,
                    "size": "sm",
                    "color": "#228B22",
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
                    "text": "สถานะ :",
                    "color": "#000000",
                    "size": "sm",
                    "flex": 1,
                    "weight": "bold",  
                    "wrap": true,
                    "position": "absolute"                               
                  },
                  {
                    "type": "text",
                    "text": status,
                    "wrap": true,
                    "color": "#228B22",
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
                    "text": "คนเเจ้ง :",
                    "color": "#000000",
                    "size": "sm",
                    "flex": 1,
                    "weight": "bold",   
                    "wrap": true,
                    "position": "absolute"                                                      
                  },
                  {
                    "type": "text",
                    "text": displayName,                   
                    "color": "#228B22",
                    "size": "sm",
                    "flex": 4,
                    "weight": "bold",
                    "position": "relative",   
                    "align": "end",
                    "wrap": true,
                   

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
                    "wrap": true,
                    "position": "absolute"                        
                  },
                  {
                    "type": "text",
                    "text": location,
                    "flex": 4,
                    "size": "sm",
                    "color": "#228B22",
                    "weight": "bold",
                    "position": "relative",                     
                    "align": "end",
                    "wrap": true,
                    
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
                    "wrap": true,
                    "position": "absolute"                                          
                  },
                  {
                    "type": "text",
                    "text": recDate,
                    "flex": 4,
                    "size": "sm",
                    "color": "#228B22",
                    "weight": "bold",
                    "position": "relative",                          
                    "align": "end",
                    "wrap": true,
                    
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
                    "text": "หมายเลขปัญหา : ",
                    "flex": 1,
                    "size": "sm",
                    "color": "#b22222",
                    "weight": "bold",                  
                    "align": "start",
                    "wrap": true,
                    "position": "absolute"
                 
                  },
                   {
                    "type": "text",
                    "text":  problemId,
                    "flex": 4,
                    "size": "sm",
                    "color": "#b22222",
                    "weight": "bold",
                   
                    "position": "relative", 
                    "wrap": true,  
                    "align": "end",
                   
                   
                   
                  }
                ],
                "spacing": "sm"
              },
            ]
          }
        ],
      },
    },
  };

  return flexMessage;
}

function sendFlexMessage(flexMessage, userId, problemId) {
  
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