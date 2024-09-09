function sendTodaySpendMoney() {
  spreadSheetData = getSpreadsheet();
  var today = new Date();
  today.setHours(0, 0, 0, 0); // 時間をリセットして日付のみにする
  
  // 本日の日付に一致するデータを探す
  var todayData = spreadSheetData.filter(row => {
    var rowDate = new Date(row[0]); // 1列目の日付を取得
    rowDate.setHours(0, 0, 0, 0); // 時間をリセット
    return rowDate.getTime() === today.getTime(); // 日付が一致するかチェック
  });
  // データの形式整理
  fixedTodayData = fixSheetArray(todayData);
  todayAllMoney = calculateAllMoney(todayData);
  setuyakuNumber = getSetuyakuNumber(todayAllMoney,1500)
  
  //名言生成
  var meigen = getStreakHomekotobaGPT(setuyakuNumber)
  sendLINE(meigen);
  
  //送信message作成
  var message = getSetuyakuString(setuyakuNumber)
  message = message + `昨日は${todayAllMoney}円消費しました。\n${fixedTodayData}`

  sendLINE(message);

  recordSavingsStatus(today, setuyakuNumber);
}

function sendWeekdaySpendMoney(){
  spreadSheetData = getSpreadsheet();
  var today = new Date();
  today.setHours(0, 0, 0, 0); // 時間をリセットして日付のみにする

  var fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);
  fiveDaysAgo.setHours(0, 0, 0, 0); 

  // 本日の日付に一致するデータを探す
  var weekdaysData = spreadSheetData.filter(row => {
    var rowDate = new Date(row[0]); // 1列目の日付を取得
    rowDate.setHours(0, 0, 0, 0); // 時間をリセット
    return rowDate >= fiveDaysAgo && rowDate <= today; // 5日以内の日付かチェック
  });
  fixedData = fixSheetArray(weekdaysData);
  allMoney = calculateAllMoney(weekdaysData);
  setuyakuNumber = getSetuyakuNumber(allMoney,8000);

  var message = getSetuyakuString(setuyakuNumber)
  message =  message +`今週は${allMoney}円消費しました。\n${getSavingsSummary(fiveDaysAgo,today)}\n${fixedData}`

  sendLINE(message);
}

function sendSatSunSpendMoney(){
  spreadSheetData = getSpreadsheet();
  var today = new Date();
  today.setHours(0, 0, 0, 0); // 時間をリセットして日付のみにする

  var twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);
  twoDaysAgo.setHours(0, 0, 0, 0); 
  
  // 本日の日付に一致するデータを探す
  var twodaysData = spreadSheetData.filter(row => {
    var rowDate = new Date(row[0]); // 1列目の日付を取得
    rowDate.setHours(0, 0, 0, 0); // 時間をリセット
    return rowDate >= twoDaysAgo && rowDate <= today; // 2日以内の日付かチェック
  });
  fixedData = fixSheetArray(twodaysData);
  allMoney = calculateAllMoney(twodaysData);
  setuyakuNumber = getSetuyakuNumber(allMoney,4000);

  var message = getSetuyakuString(setuyakuNumber)
  message =  message +`この土日は${allMoney}円消費しました。\n${fixedData}`

  sendLINE(message);
}

function sendLINE(message){
    const lineOptions =
   {
      "method"  : "post",
      "payload" : {"message": message},
      "headers" : {"Authorization":"Bearer " + LINENOTIFY_TOKEN}
   };
   UrlFetchApp.fetch(LINENOTIFY_API, lineOptions);
}

function getSpreadsheet(){
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  var firstSheet = spreadsheet.getSheets()[0];
  var data = firstSheet.getDataRange().getValues();
  return data;
}

function fixSheetArray(data){
  var fixedDataString =''
  for (oneDayArray of data){
    fixedDataString = fixedDataString+`\n${oneDayArray[1]}円: ${oneDayArray[2]}`
  }
  return fixedDataString
}

function  calculateAllMoney(data){
  var allMoney = 0;
  for (oneDayArray of data){
    allMoney = allMoney + oneDayArray[1];
  }
  return allMoney
}




