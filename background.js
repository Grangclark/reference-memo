// background.js

// 1. 右クリックメニュー登録（既存のまま）
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-memo",
    title: "リファレンスに保存 📝",
    contexts: ["selection"] 
  });
  console.log("ReferenceMemo: 右クリックメニューが正常に登録されました。");
});

// 2. メニュークリック時のイベント
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-memo" && info.selectionText) {
    
    const newMemo = {
      text: info.selectionText,
      url: tab.url,
      title: tab.title || "無題のページ",
      timestamp: Date.now()
    };

    chrome.storage.local.get(["savedMemos"], (result) => {
      let memos = result.savedMemos || [];
      memos.unshift(newMemo);

      chrome.storage.local.set({ savedMemos: memos }, () => {
        console.log("📥 メモをストレージに保存しました！", newMemo);

        // 👑【画像の壁をすり抜ける一撃】
        // iconUrl に「1ピクセル分の透明な画像データ」を直接指定することで、ファイルがなくてもエラーを完璧に回避します
        chrome.notifications.create({
          type: "basic",
          iconUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", 
          title: "ReferenceMemo 📝",
          message: "リファレンスを保存しました！"
        });

      });
    });
  }
});

// 3. ★【今日の一撃】拡張機能アイコンがクリックされたら大画面タブを開く
chrome.action.onClicked.addListener((tab) => {
  // 自分の拡張機能内にある「list.html」のフルURLをブラウザに作らせる
  const listPageUrl = chrome.runtime.getURL("list.html");

  // そのURLを新しいタブとしてバックグラウンドではなく「前面（アクティブ）」で開く
  chrome.tabs.create({ url: listPageUrl, active: true });
});