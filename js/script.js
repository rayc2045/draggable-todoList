'use strict';

class TodoApp {
	constructor() {
		this.todoList = JSON.parse(localStorage.getItem('todoList')) || [
			{
				task: '可使用任務左側 ": :" 符號拖曳項目、右側 "✕" 符號刪除項目',
				completed: false
			},
			{
				task: '點擊任務後即可進行編輯，完成後按下 "Enter" 鍵將保存紀錄',
				completed: false
			},
			{
				task: '點擊任務查看如何 "<a href="https://github.com/rayc2045" target="_blank" rel="noreferrer noopener">附加網址</a>"',
				completed: false
			},
			{
				task: '任何更動將自動儲存，關掉網頁也不丟失紀錄',
				completed: false
			},
			{
				task: '開始新增您的第一項任務 🙂',
				completed: false
			}
		];
		this.itemsParentEl = document.querySelector('.items');
		this.itemEls = this.itemsParentEl.childNodes;
		this.newItemInputEl = document.querySelector('.new-item-input');
		this.maxTaskNumber = 10;
		this.accomplishSound = new Audio('https://raw.githubusercontent.com/rayc2045/draggable-localStorage-todoList/master/audio/BOTW_Fanfare_SmallItem.wav');
		this.deleteSound = new Audio('https://raw.githubusercontent.com/rayc2045/draggable-localStorage-todoList/master/audio/BotW_Interact_sound.mp3');
		this.dragSound = new Audio('https://raw.githubusercontent.com/rayc2045/draggable-localStorage-todoList/master/audio/drag.mp3');
		this.dropSound = new Audio('https://raw.githubusercontent.com/rayc2045/draggable-localStorage-todoList/master/audio/drop.mp3');
		this.events();
	}

	events() {
		this.updateTasks();

		// Drag , drop and rearrange
		this.sortableJS();
		this.itemsParentEl.onchange = () => this.rearrangeTodoList(); // Using change event instead of dragend event makes tasks arrange when any task being dragged outside the parent element
		this.itemsParentEl.ondragstart = e => (e.target.style.height = `${e.target.scrollHeight}px`);
		this.itemsParentEl.ondragend = () => {
			this.itemEls.forEach(el => {
				el.removeAttribute('draggable');
				el.removeAttribute('style'); // .item's default height is auto, so directly remove inline-css attributes
			});
		};

		// Handle sound and content edit
		this.itemsParentEl.onmousedown = e => {
			if (e.target.classList.contains('handle')) return this.playSound(this.dragSound);
			if (e.target.classList.contains('content')) {
				this.editEnable(e);
				// When mousedown on the handle, but not drag the item(or drag it outside the to-do list), the codes start from line 53 may not active
				e.target.closest('.item').removeAttribute('draggable');
				e.target.closest('.item').removeAttribute('style');
				e.target.onblur = e => {
					if (!e.target.textContent.trim()) return this.deleteTask(e);
					this.saveContent(e);
					this.editDisable(e);
				};
			}
		};

		// Paste with clean text
		this.itemsParentEl.onpaste = e => {
			if (e.target.classList.contains('content')) this.pasteCleanText(e);
		};

		// Enter => blur => content save (line 68)
		this.itemsParentEl.onkeydown = e => {
			if (e.target.classList.contains('content') && e.which === 13) {
				// e.target.blur();
				this.newItemInputEl.focus();
			}
		};

		// Complete and delete task
		this.itemsParentEl.onclick = e => {
			if (e.target.type === 'checkbox') return this.toggleComplete(e);
			if (e.target.classList.contains('delete')) this.deleteTask(e);
		};

		// Add task
		this.newItemInputEl.onkeydown = e => {
			if (this.itemEls.length >= this.maxTaskNumber) return this.inputDisable(e);
			if (e.which === 13) this.addTask();
		};
	}

	pasteCleanText(e) {
		e.preventDefault();
		let paste = (e.clipboardData || window.clipboardData).getData('text');
		const selection = window.getSelection();
		if (!selection.rangeCount) return false;
		selection.deleteFromDocument();
		selection.getRangeAt(0).insertNode(document.createTextNode(paste));
		if (selection.empty) return selection.empty(); // Chrome
		if (selection.removeAllRanges) selection.removeAllRanges(); // Firefox
	}

	convertToAnchor(text) {
		return String(text).replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2"  target="_blank" rel="noreferrer noopener">$1</a>');
	}

	convertToMarkdown(anchor) {
		return anchor
			.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, '[$2]($1)')
			.replace(/&nbsp;/g, '')
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"');
	}

	updateTasks() {
		this.itemsParentEl.innerHTML = '';

		for (const i in this.todoList) {
			const item = document.createElement('li');
			item.id = `item_${i}`;
			item.classList.add('item');
			item.innerHTML = `
        <div class="handle">: :</div>
        <input type="checkbox"${this.todoList[i].completed ? ' checked' : ''}>
        <div class="check">✓</div>
        <div class="content">${this.convertToAnchor(this.todoList[i].task)}</div>
        <div class="delete">✕</div>`;
			this.itemsParentEl.appendChild(item);
		}

		this.setPlaceholder(this.maxTaskNumber);
	}

	setPlaceholder(maxNumber) {
		this.itemEls.length < maxNumber
			? (this.newItemInputEl.placeholder = 'What needs to be done?')
			: (this.newItemInputEl.placeholder = 'Try to make tasks less...');
	}

	addTask() {
		const input = this.newItemInputEl.value.trim();
		if (!input) return (this.newItemInputEl.value = '');
		this.todoList.push({ task: input, completed: false });
		this.setLocalStorage('todoList', this.todoList);
		this.updateTasks();
		this.newItemInputEl.value = '';
		this.playSound(this.dropSound);
	}

	inputDisable(e) {
		e.preventDefault();
		e.target.value = '';
	}

	deleteTask(e) {
		const item = e.target.closest('.item');
		const index = item.id.replace('item_', '');
		this.todoList.splice(index, 1);

		this.todoList.length
			? this.setLocalStorage('todoList', this.todoList)
			: this.removeFromLocalStorage('todoList');

		this.updateTasks();
		this.playSound(this.deleteSound);
	}

	toggleComplete(e) {
		e.preventDefault(); // Prevent trigging itemsParentEl onchange event sound
		const index = e.target.closest('.item').id.replace('item_', '');
		this.todoList[index].completed = !this.todoList[index].completed;
		this.setLocalStorage('todoList', this.todoList);
		this.updateTasks();
		if (!e.target.checked) return this.muteGradually(this.accomplishSound);
		this.playSound(this.accomplishSound, 0.35);
	}

	editEnable(e) {
		e.target.contentEditable = 'true';
		e.target.innerHTML = this.convertToMarkdown(e.target.innerHTML);
	}

	editDisable(e) {
		e.target.removeAttribute('contenteditable');
		e.target.innerHTML = this.convertToAnchor(e.target.innerHTML);
	}

	saveContent(e) {
		const index = e.target.closest('.item').id.replace('item_', '');
		this.todoList[index].task = e.target.innerHTML;
		this.setLocalStorage('todoList', this.todoList);
	}

	sortableJS() {
		Sortable.create(sortable, {
			// disabled: false, // Turn off Sortable
			animation: 100, // Animation time: 0.1s
			handle: '.handle', // Drag area
			draggable: '.item', // Draggable element
			// filter: ".new-item",  // Not draggable element
			// preventOnFilter: true, // If 'filter', e.preventDefault()
			ghostClass: 'dragging' // Give a class to dragged element
			// chosenClass: "dragging",  // Give a class to chosen element
		});
	}

	rearrangeTodoList() {
		for (const i in this.todoList) {
			this.todoList[i].completed = this.itemEls[i].childNodes[3].checked;
			this.todoList[i].task = this.convertToMarkdown(this.itemEls[i].childNodes[7].innerHTML);
			this.setLocalStorage('todoList', this.todoList);
			this.itemEls[i].id = `item_${i}`;
			this.playSound(this.dropSound);
		}
	}

	setLocalStorage(title, data) {
		localStorage.setItem(title, JSON.stringify(data));
	}

	removeFromLocalStorage(title) {
		localStorage.removeItem(title); // removeItem() deletes item, clear() empties item
	}

	playSound(audio, volume = 1) {
		audio.currentTime = 0;
		audio.volume = volume;
		audio.play();
	}

	muteGradually(audio) {
		for (let i = 0; i < 10; i++) {
			let delay = 50;

			setTimeout(() => {
				audio.volume /= 1.65;
				// console.log(audio.volume);
			}, delay * i);
		}
	}
}

new TodoApp();