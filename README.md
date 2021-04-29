# Draggable To-Do List

[![Photo](https://raw.githubusercontent.com/rayc2045/draggable-todoList/master/demo/draggable_todo_list.png)](https://chrome.google.com/webstore/detail/draggable-to-do-list%EF%BD%9C%E5%8F%AF%E6%8B%96%E6%9B%B3%E7%9A%84/pndehpgkgbajinooeiebnjikfdfgoogi)

### 簡介
一開始的版本是和 Todo MVC 類似的簡易待辦事項清單，由於本身的使用需求，不斷調整和優化 Todo 清單的外觀與功能，如使用 SortableJS 做出拖拉排序、結合 LocalStorage 做出儲存機制、Markdown link 語法的支持，以及對 XSS 跨網站指令程式碼的防禦處理。最後再加上動畫和互動音效，讓你達成任務時成就感滿滿！現在就前往 [Chrome 應用程式商店](https://chrome.google.com/webstore/detail/draggable-to-do-list%EF%BD%9C%E5%8F%AF%E6%8B%96%E6%9B%B3%E7%9A%84/pndehpgkgbajinooeiebnjikfdfgoogi) 或使用 [網頁版](https://rayc2045.github.io/draggable-todoList/) 開始規劃你的一天 🙂。

### 外觀與互動設計
- 設計上淡化勾選方塊顏色，並選用較密集的 [Roboto Condensed](https://fonts.google.com/specimen/Roboto+Condensed) 字體，讓視線更集中於任務
- 加入任務拖曳與排序功能
- 加入 [Markdown Link 轉譯](https://dev.to/mattkenefick/regex-convert-markdown-links-to-html-anchors-f7j) 功能，讓使用者能夠輕鬆地使用 Markdown 語法創造附帶網址連結的任務
- 針對新增任務框 (input) 做優化，使其在任何操作後自動集中 (focus)，避免為了新增任務的額外點擊
- 任務超過十項時，鎖住新增任務框的輸入：好的待辦事項在於清楚、必要和可完成性，重新檢視待辦事項清單讓我們能更適切地為一整天規劃安排
- 加入新增、拖移、刪除互動音效、甚至是達成任務時的《薩爾達：荒野之息》經典音效；當取消勾選任務時，音效於 0.5 秒內逐步靜音，優化使用體驗
- 加入 [LottieFiles](https://lottiefiles.com/) 的 SVG 彩蛋動畫，達成任務時成就感滿滿！

### 開發紀錄
- 使用預處理器 Sass 撰寫 CSS
- 使用 JavaScript `class` 物件導向開發
- 使用 HTML 屬性 `contenteditable` 達成即時編輯，並且在貼上文字時使用 [`HTML DOM execCommand()` 方法](https://www.w3schools.com/jsref/met_document_execcommand.asp) 達成純文字貼上
- 對使用者輸入和輸出做 [過濾處理](https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/)，[避免 XSS 跨網站指令碼注入](https://gomakethings.com/preventing-cross-site-scripting-attacks-when-using-innerhtml-in-vanilla-javascript/)
- 使用 [LocalStorage](https://developer.mozilla.org/zh-TW/docs/Web/API/Window/localStorage) 儲存任務資料，關掉瀏覽器也不怕任務丟失！
- 使用 [SortableJS](https://github.com/SortableJS/Sortable) 實現任務拖曳 (drag) 功能，並在移動任務的同時達成任務排序和資料儲存
- 透過設定計時器無聲播放音檔進行緩存，音效永不延遲