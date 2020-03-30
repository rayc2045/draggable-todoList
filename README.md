[![Photo](https://cdn.dribbble.com/users/3800131/screenshots/6757018/_____2019-07-09___11.03.44_4x.png)](https://dribbble.com/raychangdesign)

# Draggable LocalStorage To-do List

> 原本預計做一個和 Todo MVC 類似的簡易待辦事項清單，但做到後面，不斷調整和優化外觀設計、使用 SortableJS 做出拖拉排序的功能，並且將 To-do List 與 LocalStorage 結合，做出了可在瀏覽器上儲存資料的版本。最後再加入了操作音效和快取，讓你達成任務時充滿成就感！

- 使用預處理器 Pug、Sass 撰寫 HTML、CSS
- 使用 JavaScript 物件導向式開發
- 使用 [LocalStorage](https://developer.mozilla.org/zh-TW/docs/Web/API/Window/localStorage) 儲存 To-do List 資料，再搭配模板和三元運算子輸出，關掉瀏覽器也不怕任務丟失！
- 使用 HTML 屬性 `contenteditable` 做出即時編輯功能，並藉由 JS 切換 `true'` 與 `false` 值，解決任何複製貼上的格式問題
- 設計上讓文字編輯時加入底線，提升使用者操作流暢度
- 淡化勾選方塊顏色，讓視線更集中於任務
- 任務超過十項鎖住輸入：好的代辦事項在於清楚、必要和可完成性，所以將清單塞滿不見得是好事；鎖住輸入讓使用者能更適切地為一整天規劃安排
- 使用 [SortableJS](https://github.com/SortableJS/Sortable) 做出任務拖拉功能，並搭配演算法做出 To-do List 資料排序
- 加入新增、拖移、刪除任務，甚至達成任務時出現的《薩爾達 — 荒野之息》經典音效，讓操作體驗更有感！
- 使用 Cache 對資源進行緩存，音效播放不延遲！
- [線上版](https://raychang2017.github.io/draggable-localStorage-todoList/) / [CodePen 連結](https://codepen.io/raychang2017/full/pXqRLo)（因安全疑慮，CodePen 無法使用 LocalStorage）