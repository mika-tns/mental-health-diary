let speechRec;
let speechSynth;
let currentText = "";

// 音声認識初期化
function initSpeechRec() {
  speechRec = new p5.SpeechRec('ja-JP', gotSpeech);
  speechRec.continuous = false; // 連続認識OFF
  speechRec.interimResults = false; // 中間結果OFF
}

initSpeechRec();

// 音声認識開始
document.getElementById("start-recognition").addEventListener("click", () => {
  console.log("🎙 マイク開始要求");
  speechRec.start(); // ここでマイク許可を要求
  document.getElementById("recognized-text").innerText = "聞き取り中...";
});

function gotSpeech() {
  if (speechRec.resultValue) {
    currentText = speechRec.resultString;
    console.log("✅ 認識結果:", currentText);
    document.getElementById("recognized-text").innerText = currentText;
  } else {
    console.log("❌ 音声が認識されませんでした");
    document.getElementById("recognized-text").innerText = "（音声が認識されませんでした）";
  }
}

// 記録を保存
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

// 昨日の気分を音声読み上げ
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
