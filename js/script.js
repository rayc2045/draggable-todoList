'use strict';

class TodoApp {
	constructor() {
		this.todoList = JSON.parse(localStorage.getItem('todoList')) || [
			{
				task: '可使用任務左側 ": :" 符號拖曳項目',
				completed: false
			},
			{
				task: '可使用任務右側 "✕" 符號刪除項目',
				completed: false
			},
			{
				task: '點擊任務後可自由進行編輯，編輯完成後輸入 "Enter" 將保存紀錄',
				completed: false
			},
			{
				task: '自動儲存機制將保留任何更動',
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
		this.accomplishSound = new Audio(
			'https://github.com/rayc2045/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/audio/BOTW_Fanfare_SmallItem.wav?raw=true'
		); // ../audio/BOTW_Fanfare_SmallItem.wav
		this.deleteSound = new Audio(
			'https://github.com/rayc2045/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/audio/BotW_Interact_sound.mp3?raw=true'
		); // ../audio/BotW_Interact_sound.mp3
		this.dragSound = new Audio(
			'https://github.com/rayc2045/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/audio/drag.mp3?raw=true'
		); // ../audio/drag.mp3
		this.dropSound = new Audio(
			'https://github.com/rayc2045/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/audio/drop.mp3?raw=true'
		); // ../audio/drop.mp3
		this.events();
	}

	events() {
		this.updateTasks();

		// Drag and rearrange
		this.sortableJS();
		this.itemsParentEl.onchange = () => this.rearrangeTodoList();

		// Handle sound and content edit
		this.itemsParentEl.onmousedown = (e) => {
			if (e.target.classList.contains('handle')) return this.playSound(this.dragSound);
			if (e.target.classList.contains('content')) {
				this.editEnable(e);
				e.target.onblur = (e) => this.saveContent(e);
			}
		};

		// Enter/blur => content save
		this.itemsParentEl.onkeydown = (e) => {
			if (e.target.classList.contains('content')) {
				if (e.which === 13) return e.target.blur();
				if (e.which === 8 && !e.target.textContent) this.deleteTask(e);
			}
		};
		// Only fire once, resolution: line 58
		// this.itemEls.forEach((el) => {
		// 	el.childNodes[7].onblur = (e) => {
		// 		this.saveContent(e);
		// 		console.log('blur')
		// 	}
		// });

		// Complete and delete task
		this.itemsParentEl.onclick = (e) => {
			if (e.target.type === 'checkbox') return this.toggleComplete(e);
			if (e.target.classList.contains('delete')) this.deleteTask(e);
		};

		// Add task
		this.newItemInputEl.onkeydown = (e) => {
			if (this.itemEls.length >= this.maxTaskNumber) return this.inputDisable(e);
			if (e.which === 13) this.addTask();
		};
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
        <div class="content">${this.todoList[i].task}</div>
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
		if (!input) return;
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
		const index = item.id.replace(/item_/g, '');

		this.todoList.splice(index, 1);
		this.todoList.length
			? this.setLocalStorage('todoList', this.todoList)
			: this.removeFromLocalStorage('todoList');

		this.updateTasks();
		this.playSound(this.deleteSound);
	}

	toggleComplete(e) {
		e.preventDefault(); // Prevent trigging itemsParentEl onchange event
		const index = e.target.closest('.item').id.replace(/item_/g, '');
		this.todoList[index].completed = !this.todoList[index].completed;
		this.setLocalStorage('todoList', this.todoList);
		this.updateTasks();
		if (!e.target.checked) return this.turnDownGradually(this.accomplishSound);
		this.playSound(this.accomplishSound, 0.35);
	}

	editEnable(e) {
		e.target.contentEditable = 'true';
	}

	saveContent(e) {
		const index = e.target.closest('.item').id.replace(/item_/g, '');
		this.todoList[index].task = e.target.textContent.trim();
		this.setLocalStorage('todoList', this.todoList);
		this.updateTasks();
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
			this.todoList[i].task = this.itemEls[i].childNodes[7].textContent;
			this.setLocalStorage('todoList', this.todoList);
			this.itemEls[i].id = `item_${i}`;
			this.playSound(this.dropSound);
		}
	}

	setLocalStorage(title, data) {
		localStorage.setItem(title, JSON.stringify(data));
	}

	removeFromLocalStorage(title) {
		localStorage.removeItem(title); // It's not localStorage.clear()
	}

	playSound(audio, volume = 1) {
		audio.currentTime = 0;
		audio.volume = volume;
		audio.play();
	}

	turnDownGradually(audio) {
		for (let i = 1; i <= 5; i ++) {
			let delay = 0;
			setTimeout(() => audio.volume /= 1.45, delay * i);
			delay = 0.2;
		}
	}
}

new TodoApp();