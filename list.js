// list.js

document.addEventListener("DOMContentLoaded", () => {
  renderMemos();
});

// ストレージからデータを読み込んで大画面に出力する関数
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
      
      // カードクリックでコピー
      li.style.cursor = "pointer";
      li.title = "クリックでテキストをコピー";
      li.addEventListener("click", (e) => {
        if (e.target.className === "delete-btn" || e.target.className === "memo-source") {
          return;
        }
        
        navigator.clipboard.writeText(memo.text).then(() => {
          const originalBg = li.style.backgroundColor;
          li.style.backgroundColor = "#e7f5ff";
          setTimeout(() => { li.style.backgroundColor = originalBg; }, 200);
        });
      });

      // 個別削除用の×ボタン
      const deleteBtn = document.createElement("div");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerText = "×";
      deleteBtn.addEventListener("click", () => {
        deleteMemo(index);
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

// メモ削除関数
function deleteMemo(index) {
  chrome.storage.local.get(["savedMemos"], (result) => {
    let memos = result.savedMemos || [];
    memos.splice(index, 1);

    chrome.storage.local.set({ savedMemos: memos }, () => {
      renderMemos();
    });
  });
}