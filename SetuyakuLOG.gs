function getSetuyakuNumber(allMoney,setuyakuBorder){
  setuyakuNumber = null;
  today = new Date();

  if(allMoney == 0){
    //さぼっているとき
    setuyakuNumber = "2"
    if(checkSupecialDaySubmit(today)){
      //SpecialDay
      setuyakuNumber = "3"
    }
  }
  //節約できたとき
  else if (allMoney <= setuyakuBorder){
    setuyakuNumber = "0"
  //節約失敗したとき
  }else if (setuyakuBorder < allMoney) {
    setuyakuNumber = "1"
  }

  return setuyakuNumber
}

function getSetuyakuString(setuyakuNumber){
  setuyakuString = ""
  //節約できたとき
  if(setuyakuNumber == 0){
    setuyakuString = `節約成功\n`
  }
  //節約失敗したとき
  else if (setuyakuNumber == 1){
    setuyakuString = `節約失敗\n`
  //入力をさぼったとき
  }else if (setuyakuNumber == 2) {
    setuyakuString = `入力をさぼっていますね\n 明日からちゃんと入力してくださいね！`
  //例外処理
  }else if (setuyakuNumber == 3) {
    setuyakuString = "SpecialDay\n 楽しんでください。"
  }

  return setuyakuString
}


function recordSavingsStatus(date, setuyakuNumber) {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName("節約可否Log"); // 節約記録用のシートを指定
  
  // 日付と節約成功フラグを記録
  sheet.appendRow([date, setuyakuNumber]);
}

function getSavingsSummary(startDate, finalDate) {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName("節約可否Log");
  var data = sheet.getDataRange().getValues();
  
  var weeklyData = data.filter(row => {
    var recordDate = new Date(row[0]);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate >= startDate && recordDate <= finalDate;
  });
  
  var successfulDays = weeklyData.filter(row => row[1] == "0" || row[1] == 0).length;
  var message = `節約成功日数は ${successfulDays} 日です。`;
  
  return message
}

function getStreaks() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName("節約可否Log");
  const data = sheet.getRange("A1:B" + sheet.getLastRow()).getValues(); // データを取得
  
  let currentZeroStreak = 0; // 現在の0の連続日数を追跡
  let currentOtherThanTwoStreak = 0; // 現在の2以外の連続日数を追跡

  for (let i = 0; i < data.length; i++) {
    let result = data[i][1];
    
    // 0の連続日数計算
    if (result == 0) {
      currentZeroStreak++;
    } else {
      currentZeroStreak = 0;
    }
    
    // 2以外の連続日数計算
    if (result != 2) {
      currentOtherThanTwoStreak++;
    } else {
      currentOtherThanTwoStreak = 0;
    }
  }

  console.log("0の連続日数: " + currentZeroStreak);
  console.log("2以外の連続日数: " + currentOtherThanTwoStreak);

  return [currentZeroStreak,currentOtherThanTwoStreak]
}

function checkSupecialDaySubmit(targetDate) {
  // ターゲットの日付（YYYY-MM-DD形式）をDateオブジェクトに変換
  var date = new Date(targetDate);
  date.setHours(0, 0, 0, 0); // ターゲットの日の0時0分0秒に設定

  // 次の日の日付を設定
  var nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  // スプレッドシートを開く
  var sheet = SpreadsheetApp.openById(SPECIALDAYSHEET_ID).getSheetByName("Form Responses 1");

  // スプレッドシートのすべてのデータを取得
  var data = sheet.getDataRange().getValues();

  // フォームが送信されたかどうかをチェックするフラグ
  var isSubmitted = false;

  // すべての行をループしてチェック（最初の行はヘッダーと仮定）
  for (var i = 1; i < data.length; i++) {
    var timestamp = new Date(data[i][0]); // タイムスタンプが最初の列にあると仮定

    // レスポンスの日付がターゲットの日付と一致するかチェック
    if (timestamp >= date && timestamp < nextDate) {
      isSubmitted = true;
      break;
    }
  }

  // 結果を返す
  if (isSubmitted) {
    Logger.log('指定された日付にフォームが送信されました。');
  } else {
    Logger.log('指定された日付にはフォームが送信されていません。');
  }
  
  return isSubmitted;
}
