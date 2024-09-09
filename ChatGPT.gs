// サンプルで使用する関数
function getStreakHomekotobaGPT(setuyakuNumber) {
  streaks = getStreaks()
  prompt = `家計簿入力継続日数${streaks[1]}日、節約継続日数${streaks[0]}日を褒めて`

  if (setuyakuNumber == 0) {
    var prompt = prompt + "今日は節約成功したことを踏まえて";
  } else if (setuyakuNumber == 1) {
    var prompt = prompt + "今日は浪費したことを踏まえて";
  } else if (setuyakuNumber == 2) {
    var prompt = prompt + "今日は入力をさぼったことを踏まえて";
  } else if (setuyakuNumber == 3) {
    var prompt = prompt + "今日はSpecialDayで楽しんだことを踏まえて";
  }
  prompt = prompt + " 50字以内"

  var response = callChatGPT(prompt);
  return response
}

// OpenAI APIを呼び出す関数
function callChatGPT(prompt) {
  var apiKey = GPT_APIKEY;
  var url = GPT_APIURL;

  // リクエストのペイロード
  var payload = {
    "model": "gpt-4o-mini",
    "messages": [
      { "role": "user", "content": prompt }
    ],
    "temperature": 1.0,
    "max_tokens": 100
  };

  // リクエストオプション
  var options = {
    'contentType': 'application/json',
    'headers': {
      'Authorization': 'Bearer ' + apiKey
    },
    'payload': JSON.stringify(payload)
  };

  // APIコール
  var response = UrlFetchApp.fetch(url, options);

  // レスポンスのパース
  var json = JSON.parse(response.getContentText());

  if (json.choices && json.choices.length > 0) {
    return json.choices[0].message.content.trim();
  } else {
    Logger.log("No valid response from API");
    return "APIから有効な応答が得られませんでした。";
  }
}
