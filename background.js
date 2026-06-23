// background.js

// 1. 拡張機能インストール時に右クリックメニューを登録（既存のまま）
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-memo",
    title: "リファレンスに保存 📝",
    contexts: ["selection"] 
  });
  console.log("ReferenceMemo: 右クリックメニューが正常に登録されました。");
});

// 2. ★【今日の一撃】メニューがクリックされたらストレージに保存する
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-memo" && info.selectionText) {
    
    // 保存したい3つの情報を1つの「メモオブジェクト」に美しくまとめる
    const newMemo = {
      text: info.selectionText,      // 選択された文字
      url: tab.url,                 // 元ページのURL
      title: tab.title || "無題のページ", // 元ページのタイトル
      timestamp: Date.now()         // あとで並び替えたりする用のタイムスタンプ
    };

    // ストレージから現在のメモ配列を取得する
    chrome.storage.local.get(["savedMemos"], (result) => {
      let memos = result.savedMemos || [];

      // 新しいメモを配列の「先頭」に追加（新しい順に並べるため）
      memos.unshift(newMemo);

      // ストレージを更新！
      chrome.storage.local.set({ savedMemos: memos }, () => {
        console.log("📥 メモをストレージに保存しました！", newMemo);
      });
    });
  }
});