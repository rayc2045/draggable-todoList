[![Photo](https://cdn.dribbble.com/users/3800131/screenshots/6757018/_____2019-07-09___11.03.44_4x.png)](https://dribbble.com/raychangdesign)

# Draggable LocalStorage To-do List

> 原本預計做一個和 Todo MVC 類似的簡易待辦事項清單，但做到後面，不斷調整和優化外觀設計、使用 SortableJS 做出拖拉排序的功能，並且將 To-do List 與 LocalStorage 結合，做出了可在瀏覽器上儲存資料的版本。最後再加入了《薩爾達 — 荒野之息》的經典音效，讓你達成任務時充滿成就感！

- 使用預處理器 Pug、Sass 撰寫 HTML、CSS
- 使用 JavaScript 物件導向式開發
- 使用 [LocalStorage](https://developer.mozilla.org/zh-TW/docs/Web/API/Window/localStorage) 儲存 To-do List 資料，再搭配模板和三元運算子輸出，關掉瀏覽器也不怕任務丟失！
- 使用 HTML 屬性 `contenteditable='true'` 做出即時編輯功能
- 設計上讓文字編輯時加入底線，提升使用者操作流暢度
- 淡化勾選方塊顏色，讓視線更集中於任務
- 使用 [SortableJS](https://github.com/SortableJS/Sortable) 做出任務拖拉功能，並搭配演算法做出 To-do List 資料排序
- 加入《薩爾達 — 荒野之息》經典音效，達成任務時給你滿滿的成就感！
- [CodePen 連結](https://codepen.io/raychang2017/full/pXqRLo)（因安全疑慮，CodePen 無法使用 LocalStorage，包含 LocalStorage 的完整程式碼可參考 [GitHub 連結](https://github.com/raychang2017/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/js/class.js)）