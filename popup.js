// popup.js

document.addEventListener("DOMContentLoaded", () => {
  renderMemos();
});

// ストレージからデータを読み込んで画面に出力する関数
function renderMemos() {
  chrome.storage.local.get(["savedMemos"], (result) => {
    const memos = result.savedMemos || [];
    const listContainer = document.getElementById("memo-list");
    const emptyMessage = document.getElementById("empty-message");

    // リストをいったんリセット
    listContainer.innerHTML = "";

    // メモが1件もない場合の表示切り替え
    if (memos.length === 0) {
      emptyMessage.style.display = "block";
      return;
    }
    emptyMessage.style.display = "none";

    // 保存されているメモをループして、動的にHTML（カード）を生成
    memos.forEach((memo, index) => {
      const li = document.createElement("li");
      li.className = "memo-card";

      // 1. 個別削除用の×ボタン（機能は明日実装するので、今日は空のリスナーだけ）
      const deleteBtn = document.createElement("div");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerText = "×";

      // 2. メインの選択テキスト
      const textDiv = document.createElement("div");
      textDiv.className = "memo-text";
      textDiv.innerText = memo.text;

      // 3. 引用元のページへのリンク
      const sourceLink = document.createElement("a");
      sourceLink.className = "memo-source";
      sourceLink.href = memo.url;
      sourceLink.target = "_blank";
      sourceLink.innerText = `🔗 ${memo.title}`;

      // カードにパーツを詰め込む
      li.appendChild(deleteBtn);
      li.appendChild(textDiv);
      li.appendChild(sourceLink);

      // リスト全体に追加
      listContainer.appendChild(li);
    });
  });
}