/**
 * Pack & Trace — Google Sheets Backend API Script (SECURE STATIC EDITION)
 * Developed for PNiX STUDIOS by Gemini Spark
 * 
 * Secure static mode allows zero-friction, real-time background autosave 
 * and syncing without requiring manual OTP passwords or multi-step logins.
 */

// Fetches the secret token dynamically from your Google Script Environment Variables
var API_SECRET = PropertiesService.getScriptProperties().getProperty("API_SECRET");

function doGet(e) {
  var token = e.parameter.token;
  if (!token || token !== API_SECRET) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "unauthorized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var boxesSheet = ss.getSheetByName("Boxes") || createTab(ss, "Boxes", ["id", "name", "roomCode", "room", "desc", "handlingCode"]);
  var itemsSheet = ss.getSheetByName("Items") || createTab(ss, "Items", ["boxId", "label", "desc", "count"]);
  var roomsSheet = ss.getSheetByName("Rooms") || createTab(ss, "Rooms", ["roomCode", "name", "packed", "repaired", "cleaned", "finished", "note"]);
  
  var rawBoxes = getRowsAsJson(boxesSheet);
  var rawItems = getRowsAsJson(itemsSheet);
  var rawRoomsArray = getRowsAsJson(roomsSheet);
  
  var boxes = rawBoxes.map(function(box) {
    box.items = rawItems.filter(function(item) {
      return String(item.boxId).toUpperCase() === String(box.id).toUpperCase();
    }).map(function(item) {
      return {
        id: "item_" + Math.random().toString(36).substr(2, 9),
        label: item.label,
        desc: item.desc || "",
        count: parseInt(item.count, 10) || 1
      };
    });
    return box;
  });
  
  var rooms = {};
  rawRoomsArray.forEach(function(r) {
    rooms[r.roomCode] = {
      name: r.name,
      packed: String(r.packed).toUpperCase() === "TRUE",
      repaired: String(r.repaired).toUpperCase() === "TRUE",
      cleaned: String(r.cleaned).toUpperCase() === "TRUE",
      finished: String(r.finished).toUpperCase() === "TRUE",
      note: r.note || ""
    };
  });

  if (Object.keys(rooms).length === 0) {
    rooms = {
      "BA": { name: "Bathroom", packed: false, repaired: false, cleaned: false, finished: false, note: "" },
      "BR": { name: "Bedroom", packed: false, repaired: false, cleaned: false, finished: false, note: "" },
      "KT": { name: "Kitchen", packed: false, repaired: false, cleaned: false, finished: false, note: "" },
      "LR": { name: "Living Room", packed: false, repaired: false, cleaned: false, finished: false, note: "" },
      "OF": { name: "Office", packed: false, repaired: false, cleaned: false, finished: false, note: "" },
      "PR": { name: "Playroom", packed: false, repaired: false, cleaned: false, finished: false, note: "" },
      "ST": { name: "Storage", packed: false, repaired: false, cleaned: false, finished: false, note: "" }
    };
  }

  var payload = {
    boxes: boxes,
    rooms: rooms
  };
  
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = { status: "error", message: "unsupported_action" };
  
  try {
    var postData = JSON.parse(e.postData.contents);
    
    if (!postData.token || postData.token !== API_SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "unauthorized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var action = postData.action;

    if (action === "addBox") {
      var sheet = ss.getSheetByName("Boxes") || createTab(ss, "Boxes", ["id", "name", "roomCode", "room", "desc", "handlingCode"]);
      var existingRowIndex = findRowIndex(sheet, 1, postData.id);
      if (existingRowIndex > 0) {
        sheet.getRange(existingRowIndex, 1, 1, 6).setValues([[
          postData.id, postData.name, postData.roomCode, postData.room, postData.desc || "", postData.handlingCode || ""
        ]]);
      } else {
        sheet.appendRow([
          postData.id, postData.name, postData.roomCode, postData.room, postData.desc || "", postData.handlingCode || ""
        ]);
      }
      result = { status: "success", action: "addBox", id: postData.id };
      
    } else if (action === "addItem") {
      var sheet = ss.getSheetByName("Items") || createTab(ss, "Items", ["boxId", "label", "desc", "count"]);
      
      // Upsert: check if item already exists in this box
      var rowIndex = findItemRowIndex(sheet, postData.boxId, postData.label);
      var rowData = [
        postData.boxId, postData.label, postData.desc || "", postData.count || 1
      ];
      
      if (rowIndex > 0) {
        sheet.getRange(rowIndex, 1, 1, 4).setValues([rowData]);
      } else {
        sheet.appendRow(rowData);
      }
      result = { status: "success", action: "addItem", label: postData.label };
      
    } else if (action === "updateRoom") {
      var sheet = ss.getSheetByName("Rooms") || createTab(ss, "Rooms", ["roomCode", "name", "packed", "repaired", "cleaned", "finished", "note"]);
      var roomNameMap = {
        "BA": "Bathroom", "BR": "Bedroom", "KT": "Kitchen", "LR": "Living Room", 
        "OF": "Office", "PR": "Playroom", "ST": "Storage"
      };
      
      var rowIndex = findRowIndex(sheet, 1, postData.roomCode);
      var rowData = [
        postData.roomCode, 
        roomNameMap[postData.roomCode] || "Storage", 
        postData.packed, 
        postData.repaired, 
        postData.cleaned, 
        postData.finished, 
        postData.note || ""
      ];
      
      if (rowIndex > 0) {
        sheet.getRange(rowIndex, 1, 1, 7).setValues([rowData]);
      } else {
        sheet.appendRow(rowData);
      }
      result = { status: "success", action: "updateRoom", roomCode: postData.roomCode };
    } else if (action === "deleteBox") {
      var boxesSheet = ss.getSheetByName("Boxes") || createTab(ss, "Boxes", ["id", "name", "roomCode", "room", "desc", "handlingCode"]);
      var itemsSheet = ss.getSheetByName("Items") || createTab(ss, "Items", ["boxId", "label", "desc", "count"]);
      
      var boxIndex = findRowIndex(boxesSheet, 1, postData.id);
      if (boxIndex > 0) {
        boxesSheet.deleteRow(boxIndex);
      }
      
      // Cascade delete: remove all items of that box from the Items sheet
      var itemValues = itemsSheet.getDataRange().getValues();
      for (var i = itemValues.length - 1; i >= 1; i--) {
        if (String(itemValues[i][0]).toUpperCase() === String(postData.id).toUpperCase()) {
          itemsSheet.deleteRow(i + 1);
        }
      }
      result = { status: "success", action: "deleteBox", id: postData.id };
      
    } else if (action === "deleteItem") {
      var itemsSheet = ss.getSheetByName("Items") || createTab(ss, "Items", ["boxId", "label", "desc", "count"]);
      var values = itemsSheet.getDataRange().getValues();
      for (var i = values.length - 1; i >= 1; i--) {
        if (String(values[i][0]).toUpperCase() === String(postData.boxId).toUpperCase() &&
            String(values[i][1]).toUpperCase() === String(postData.label).toUpperCase()) {
          itemsSheet.deleteRow(i + 1);
          break; // delete one match
        }
      }
      result = { status: "success", action: "deleteItem", label: postData.label };
    }
  } catch(err) {
    result = { status: "error", message: err.message };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function createTab(ss, name, headers) {
  var sheet = ss.insertSheet(name);
  sheet.appendRow(headers);
  return sheet;
}

function findRowIndex(sheet, colIndex, value) {
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][colIndex - 1]).toUpperCase() === String(value).toUpperCase()) {
      return i + 1;
    }
  }
  return -1;
}

function findItemRowIndex(sheet, boxId, label) {
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]).toUpperCase() === String(boxId).toUpperCase() &&
        String(values[i][1]).toUpperCase() === String(label).toUpperCase()) {
      return i + 1; // 1-based Row Index
    }
  }
  return -1;
}

function getRowsAsJson(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var jsonArray = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    jsonArray.push(obj);
  }
  return jsonArray;
}

