let speechRec;
let speechSynth;
let currentText = "";

// マイクボタンを押したとき
document.getElementById("start-recognition").addEventListener("click", () => {
  console.log("🎙 マイク認識開始（初期化）");

  // 毎回新しいインスタンスを生成
  speechRec = new p5.SpeechRec('ja-JP', gotSpeech);
  speechRec.continuous = false;
  speechRec.interimResults = false;

  // マイク権限要求 & 音声認識開始
  speechRec.start();

  document.getElementById("recognized-text").innerText = "聞き取り中...";
});

// 音声認識結果の処理
function gotSpeech() {
  if (speechRec.resultValue) {
    currentText = speechRec.resultString;
    document.getElementById("recognized-text").innerText = currentText;
    console.log("✅ 認識結果:", currentText);
  } else {
    document.getElementById("recognized-text").innerText = "（音声が認識されませんでした）";
    console.log("❌ 認識失敗");
  }
}

// 保存
document.getElementById("save-entry").addEventListener("click", () => {
  if (!currentText) {
    alert("まず気分を話してください！");
    return;
  }
  const today = new Date().toISOString().split('T')[0];
  const diary = JSON.parse(localStorage.getItem("moodDiary") || "{}");
  diary[today] = currentText;
  localStorage.setItem("moodDiary", JSON.stringify(diary));
  alert("今日の気分を保存しました！");
});

// 昨日の気分を読み上げ
document.getElementById("read-yesterday").addEventListener("click", () => {
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const diary = JSON.parse(localStorage.getItem("moodDiary") || "{}");
  if (diary[yesterday]) {
    speechSynth = new p5.Speech();
    speechSynth.setLang('ja-JP');
    speechSynth.speak(`昨日の気分は ${diary[yesterday]} です`);
  } else {
    alert("昨日の記録はありません。");
  }
});

// グラフ表示
document.getElementById("show-graph").addEventListener("click", () => {
  const diary = JSON.parse(localStorage.getItem("moodDiary") || "{}");
  const labels = Object.keys(diary);
  const data = Object.values(diary).map(mood => mood.length);

  const ctx = document.getElementById("moodChart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "気分の記録（文字数）",
        data: data,
        backgroundColor: '#4a6572'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
