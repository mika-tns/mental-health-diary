let recognition;
let currentText = "";

// 音声認識初期化
function initRecognition() {
  recognition = new webkitSpeechRecognition(); // Chrome専用
  recognition.lang = "ja-JP";
  recognition.interimResults = false; // 中間結果OFF
  recognition.continuous = false;     // 単発認識

  recognition.onstart = function () {
    console.log("🎙 音声認識を開始しました");
    document.getElementById("recognized-text").innerText = "聞き取り中...";
  };

  recognition.onresult = function (event) {
    currentText = event.results[0][0].transcript;
    document.getElementById("recognized-text").innerText = currentText;
    console.log("✅ 認識結果:", currentText);
  };

  recognition.onerror = function (event) {
    console.error("❌ 音声認識エラー:", event.error);
    document.getElementById("recognized-text").innerText = "（認識できませんでした）";
  };

  recognition.onend = function () {
    console.log("🛑 音声認識を終了しました");
  };
}

// マイク開始ボタン
document.getElementById("start-recognition").addEventListener("click", () => {
  initRecognition();
  recognition.start(); // クリック直後に開始
});

// 記録を保存
document.getElementById("save-entry").addEventListener("click", () => {
  if (!currentText) {
    alert("まず気分を話してください！");
    return;
  }
  const today = new Date().toISOString().split("T")[0];
  const diary = JSON.parse(localStorage.getItem("moodDiary") || "{}");
  diary[today] = currentText;
  localStorage.setItem("moodDiary", JSON.stringify(diary));
  alert("保存しました！今日: " + today + " 内容:" + currentText);
});

// 昨日の気分を音声読み上げ
document.getElementById("read-yesterday").addEventListener("click", () => {
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];
  const diary = JSON.parse(localStorage.getItem("moodDiary") || "{}");
  if (diary[yesterday]) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(
      `昨日の気分は ${diary[yesterday]} です`
    );
    utter.lang = "ja-JP";
    synth.speak(utter);
  } else {
    alert("昨日の記録はありません。");
  }
});

// グラフ表示
document.getElementById("show-graph").addEventListener("click", () => {
  const diary = JSON.parse(localStorage.getItem("moodDiary") || "{}");
  const labels = Object.keys(diary);
  const data = Object.values(diary).map((mood) => mood.length);

  const ctx = document.getElementById("moodChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "気分の記録（文字数）",
          data: data,
          backgroundColor: "#4a6572",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
});
