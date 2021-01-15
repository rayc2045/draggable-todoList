'use strict';

class TodoApp {
	constructor() {
		this.todoList = JSON.parse(localStorage.getItem('todoList')) || [
			{
				task: '註記完成的任務會以刪除線表示',
				completed: true
			},
			{
				task: '可使用任務左側 ": :" 符號拖曳項目',
				completed: false
			},
			{
				task: '可使用任務右側 "✕" 符號刪除項目',
				completed: false
			},
			{
				task: '點擊任務後即可進行編輯，完成後按下 Enter 鍵將保存紀錄',
				completed: false
			},
			{
				task: '點擊此任務查看如何 [附加連結](https://rayc2045.github.io/raychang-space/)',
				completed: false
			},
			{
				task: '任何更動將自動儲存，關掉網頁也不丟失紀錄',
				completed: false
			},
			{
				task: '使用 [1-3-5 法則](https://www.themuse.com/advice/a-better-todo-list-the-135-rule) 聚焦您一天的重心，並開始新增第一項任務 🙂',
				completed: false
			}
		];
		this.itemsParentEl = document.querySelector('.items');
		this.itemEls = this.itemsParentEl.childNodes;
		this.newItemInputEl = document.querySelector('.new-item-input');
		this.maxTaskNumber = 10;
		this.confettiWrapper = document.querySelector('#confetti');
		this.confettiAnimation = bodymovin.loadAnimation({
			wrapper: this.confettiWrapper,
			animType: 'svg',
			loop: false,
			autoplay: false,
			path: 'https://raw.githubusercontent.com/rayc2045/draggable-todoList/master/animation/7893-confetti-cannons.json'
		});
		this.accomplishSound = new Audio('https://raw.githubusercontent.com/rayc2045/draggable-localStorage-todoList/master/audio/BOTW_Fanfare_SmallItem.wav');
		this.deleteSound = new Audio('https://raw.githubusercontent.com/rayc2045/draggable-localStorage-todoList/master/audio/BotW_Interact_sound.mp3');
		this.dragSound = new Audio('https://raw.githubusercontent.com/rayc2045/draggable-localStorage-todoList/master/audio/drag.mp3');
		this.dropSound = new Audio('https://raw.githubusercontent.com/rayc2045/draggable-localStorage-todoList/master/audio/drop.mp3');
		this.timer;
		this.events();
	}

	events() {
		this.updateTasks();
		this.accomplishSound.preload = 'auto';
		this.deleteSound.preload = 'auto';
		this.dragSound.preload = 'auto';
		this.dropSound.preload = 'auto';

		// Drag , drop and rearrange
		this.sortableJS();
		this.itemsParentEl.onchange = () => this.rearrangeTodoList(); // Using change event instead of dragend event makes tasks arrange when any task being dragged outside the parent element
		this.itemsParentEl.ondragstart = e => (e.target.style.height = `${e.target.scrollHeight}px`);
		this.itemsParentEl.ondragend = () => {
			this.itemEls.forEach(el => {
				el.removeAttribute('draggable');
				el.removeAttribute('style');
			});
		};

		// Handle sound and content edit
		this.itemsParentEl.onmousedown = e => {
			if (e.target.classList.contains('handle')) return this.playSound(this.dragSound);
			if (e.target.classList.contains('content')) {
				this.editEnable(e);
				// When mousedown on the handle, but not drag the item(or drag it outside the to-do list), the codes start from line 54 may not active
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
			if (e.target.classList.contains('content')) this.pastePlainText(e);
		};

		// Enter => blur => content save (line 69)
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
		this.newItemInputEl.onblur = e => {
			if (!e.target.value.trim()) e.target.value = '';
		}
	}

	pastePlainText(e) {
		e.preventDefault();
		let text = (e.clipboardData || window.clipboardData).getData('text/plain');

		document.queryCommandSupported('insertText')
			? document.execCommand('insertText', false, text)
			: document.execCommand('paste', false, text);
	}

	// testXSS() {
	// 	const xssScript = [
	// 		`><script>alert(document.cookie)</script>`,
	// 		`='><script>alert(document.cookie)</script>`,
	// 		`"><script>alert(document.cookie)</script>`,
	// 		`<script>alert(document.cookie)</script>`,
	// 		`<script>alert('vulnerable')</script>`,
	// 		`%3Cscript%3Ealert('XSS')%3C/script%3E`,
	// 		`<script>alert('XSS')</script>`,
	// 		`<img src="javascript:alert('XSS')">`,
	// 		`<img src="http://888.888.com/999.png" onerror="alert('XSS')">`,
	// 		`<div style="height:expression(alert('XSS'),1)"></div>`
	// 	];

	// 	xssScript.forEach((str, idx) => {
	// 		// str === str.replace(/(<([^>]+)>)/gi, '').replace(/%3C/gi, '')
	// 		str === str.replace(/(<\/?(?:a)[^>]*>)|<[^>]+>/gi, '$1').replace(/%3C/gi, '')
	// 			? console.log(`${idx}. failed: ${str}`)
	// 			: console.log(`${idx}. success`);;
	// 	});
	// }

	convertToAnchor(text) {
		// console.log('convertToAnchor()');
		return this.getFilteredText(text)
			.replace(/(<([^>]+)>)/gi, '') // Remove HTML tags
			.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>');
	}

	convertToMarkdown(anchor) {
		// console.log('convertToMarkdown()');
		return this.getFilteredText(anchor)
			.replace(/(<\/?(?:a)[^>]*>)|<[^>]+>/gi, '$1') // Remain <a> tags
			.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, '[$2]($1)');
	}

	getFilteredText(text) {
		return this.capitalizeFirstLetter(String(text))
			.replace(/%3C/gi, '')
			.replace(/%3E/gi, '')
			.replace(/&nbsp;/g, ' ')
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"');
	}

	capitalizeFirstLetter(str) {
		return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
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

		this.todoList.push({
			task: this.getFilteredText(input).replace(/(<([^>]+)>)/gi, ''),
			completed: false
		});

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
		this.fakeAudioCatch(this.accomplishSound, 3);
		if (!e.target.checked) return this.muteGradually(this.accomplishSound);
		this.playSound(this.accomplishSound, 0.35);
		this.confettiAnimation.goToAndPlay(0, true);
	}

	editEnable(e) {
		e.target.contentEditable = 'true';
		e.target.innerHTML = this.convertToMarkdown(e.target.innerHTML);
		// console.log('editEnable() => innerHTML: ', e.target.innerHTML);
	}

	editDisable(e) {
		e.target.removeAttribute('contenteditable');
		e.target.innerHTML = this.convertToAnchor(e.target.innerHTML);
		// console.log('editDisable() => innerHTML: ', e.target.innerHTML);
	}

	saveContent(e) {
		const index = e.target.closest('.item').id.replace('item_', '');
		this.todoList[index].task = this.convertToMarkdown(e.target.innerHTML);
		// console.log('saveContent() => task: ', this.todoList[index].task);
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

	fakeAudioCatch(audio, minute) {
		if (typeof this.timer !== 'undefined') clearTimeout(this.timer);
		// Make a timer to play audio in mute
		this.timer = setTimeout(() => {
			console.log(this.timer);
			audio.currentTime = 0;
			audio.volume = 0;
			audio.play();
			this.fakeAudioCatch(audio, minute);
		}, minute * 60 * 1000);
	}
}

new TodoApp();