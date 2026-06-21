// background.js

// 1. 拡張機能インストール時に右クリックメニューを登録
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-memo",
    title: "リファレンスに保存 📝",
    contexts: ["selection"] // ★超重要：画面上のテキストを選択している時だけ出す！
  });
  console.log("ReferenceMemo: 右クリックメニューが正常に登録されました。");
});

// 2. メニューがクリックされた時のイベント（ログ出しまで）
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-memo") {
    // info.selectionText の中に、マウスで選択された文字が自動で入ります
    console.log("選択されたテキスト:", info.selectionText);
    console.log("元のページのURL:", tab.url);
    console.log("元のページのタイトル:", tab.title);
  }
});