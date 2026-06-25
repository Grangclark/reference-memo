// popup.js (完全版・最終形態)

document.addEventListener("DOMContentLoaded", () => {
  renderMemos();
});

// ストレージからデータを読み込んで画面に出力する関数
function renderMemos() {
  chrome.storage.local.get(["savedMemos"], (result) => {
    const memos = result.savedMemos || [];
    const listContainer = document.getElementById("memo-list");
    const emptyMessage = document.getElementById("empty-message");

    listContainer.innerHTML = "";

    if (memos.length === 0) {
      emptyMessage.style.display = "block";
      return;
    }
    emptyMessage.style.display = "none";

    memos.forEach((memo, index) => {
      const li = document.createElement("li");
      li.className = "memo-card";
      
      // ★【今日の一撃】カード全体をクリックしたらテキストを自動コピーする設定
      li.style.cursor = "pointer";
      li.title = "クリックでテキストをコピー";
      li.addEventListener("click", (e) => {
        // 右上の×ボタンや引用元リンクがクリックされた時はコピーを無視する防衛策
        if (e.target.className === "delete-btn" || e.target.className === "memo-source") {
          return;
        }
        
        // クリップボードに文字を送り込む
        navigator.clipboard.writeText(memo.text).then(() => {
          // コピー成功時に一瞬カードをふわっと光らせる粋な演出（任意）
          const originalBg = li.style.backgroundColor;
          li.style.backgroundColor = "#e7f5ff";
          setTimeout(() => { li.style.backgroundColor = originalBg; }, 200);
          console.log("コピー成功:", memo.text);
        });
      });

      // ★【今日の一撃】個別削除用の×ボタンに命を吹き込む
      const deleteBtn = document.createElement("div");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerText = "×";
      deleteBtn.addEventListener("click", () => {
        deleteMemo(index); // 削除関数を呼び出す
      });

      const textDiv = document.createElement("div");
      textDiv.className = "memo-text";
      textDiv.innerText = memo.text;

      const sourceLink = document.createElement("a");
      sourceLink.className = "memo-source";
      sourceLink.href = memo.url;
      sourceLink.target = "_blank";
      sourceLink.innerText = `🔗 ${memo.title}`;

      li.appendChild(deleteBtn);
      li.appendChild(textDiv);
      li.appendChild(sourceLink);
      listContainer.appendChild(li);
    });
  });
}

// ★【今日の一撃】特定のメモをリストから排除する削除関数
function deleteMemo(index) {
  chrome.storage.local.get(["savedMemos"], (result) => {
    let memos = result.savedMemos || [];
    
    // 指定されたインデックスのメモを配列から1件削除
    memos.splice(index, 1);

    // ストレージを更新して再描画
    chrome.storage.local.set({ savedMemos: memos }, () => {
      renderMemos();
    });
  });
}