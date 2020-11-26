[![Photo](https://cdn.dribbble.com/users/3800131/screenshots/6757018/_____2019-07-09___11.03.44_4x.png)](https://dribbble.com/raychangdesign)

# Draggable LocalStorage To-do List

> 原本預計做一個和 Todo MVC 類似的簡易待辦事項清單，但做到後面，不斷調整和優化外觀設計、使用 SortableJS 做出拖拉排序的功能，並且將 To-do List 與 LocalStorage 結合，做出了可在瀏覽器上儲存資料的版本。最後再加入了操作音效和快取，讓你達成任務時充滿成就感！

- 使用預處理器 Sass 撰寫 CSS，使用 JavaScript `class` 物件導向式開發
- 設計上淡化勾選方塊顏色，讓視線更集中於任務，以及讓文字編輯時加入底線，提升觀看直覺
- 使用 HTML 屬性 `contenteditable` 達成即時編輯，並且在貼上文字時 [清除複製來源的文字格式](https://developer.mozilla.org/zh-CN/docs/Web/Events/paste)
- 加入 [Markdown Link 轉譯](https://dev.to/mattkenefick/regex-convert-markdown-links-to-html-anchors-f7j) 功能，讓使用者能夠輕鬆地使用 Markdown 語法創造附帶網址連結的任務
- 對使用者輸入和輸出做[過濾處理](https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/)，[避免 XSS 跨網站指令碼注入](https://gomakethings.com/preventing-cross-site-scripting-attacks-when-using-innerhtml-in-vanilla-javascript/)
- 任務超過十項鎖住輸入：好的待辦事項在於清楚、必要和可完成性，重新檢視待辦事項清單讓我們能更適切地為一整天規劃安排
- 使用 [SortableJS](https://github.com/SortableJS/Sortable) 做出任務拖拉功能，並在移動任務的同時達成任務排序和自動儲存
- 使用 [LocalStorage](https://developer.mozilla.org/zh-TW/docs/Web/API/Window/localStorage) 儲存任務資料，關掉瀏覽器也不怕任務丟失！
- 加入新增、拖移、刪除互動音效、甚至是達成任務時的《薩爾達：荒野之息》經典音效；當取消勾選任務時，音效於 0.5 秒內逐步靜音，優化使用體驗
- 使用 Cache 對資源進行緩存，音效播放不延遲
- [開始規劃你的一天 🙂](https://rayc2045.github.io/draggable-localStorage-todoList/)