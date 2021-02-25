# Draggable To-do List

[![Photo](https://cdn.dribbble.com/users/3800131/screenshots/14907391/media/3dc70466a4601c6dc866c2adeca8d8c6.gif)](https://dribbble.com/raychangdesign)

> 一開始的版本是和 Todo MVC 類似的簡易待辦事項清單，由於本身的使用需求，不斷調整和優化 Todo 清單的外觀與功能，如使用 SortableJS 做出拖拉排序、結合 LocalStorage 做出儲存機制、Markdown link 語法的支持，以及對 XSS 跨網站指令程式碼的防禦處理。最後再加上動畫和互動音效，讓你達成任務時成就感滿滿！

- 使用預處理器 Sass 撰寫 CSS，使用 JavaScript `class` 物件導向式開發
- 設計上淡化勾選方塊顏色，並選用較密集的 [Roboto Condensed](https://fonts.google.com/specimen/Roboto+Condensed) 字體，讓視線更集中於任務
- 使用 HTML 屬性 `contenteditable` 達成即時編輯，並且在貼上文字時使用 [`HTML DOM execCommand()` 方法](https://www.w3schools.com/jsref/met_document_execcommand.asp) 達成純文字貼上
- 加入 [Markdown Link 轉譯](https://dev.to/mattkenefick/regex-convert-markdown-links-to-html-anchors-f7j) 功能，讓使用者能夠輕鬆地使用 Markdown 語法創造附帶網址連結的任務
- 對使用者輸入和輸出做 [過濾處理](https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/)，[避免 XSS 跨網站指令碼注入](https://gomakethings.com/preventing-cross-site-scripting-attacks-when-using-innerhtml-in-vanilla-javascript/)
- 任務超過十項鎖住輸入：好的待辦事項在於清楚、必要和可完成性，重新檢視待辦事項清單讓我們能更適切地為一整天規劃安排
- 使用 [SortableJS](https://github.com/SortableJS/Sortable) 做出任務拖拉功能，並在移動任務的同時達成任務排序和自動儲存
- 使用 [LocalStorage](https://developer.mozilla.org/zh-TW/docs/Web/API/Window/localStorage) 儲存任務資料，關掉瀏覽器也不怕任務丟失！
- 加入新增、拖移、刪除互動音效、甚至是達成任務時的《薩爾達：荒野之息》經典音效；當取消勾選任務時，音效於 0.5 秒內逐步靜音，優化使用體驗
- 透過設定計時器無聲播放音檔進行緩存，音效永不延遲
- 加入 [LottieFiles](https://lottiefiles.com/) SVG 彩蛋動畫，達成任務時成就感滿滿！
- [開始規劃你的一天 🙂](https://rayc2045.github.io/draggable-todoList/)