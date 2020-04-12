'use strict';

class TodoApp {
	constructor() {
		this.todolist = JSON.parse(localStorage.getItem('todolist')) || [];
		this.maxTaskNumber = 10;
		// this.nightMode = false;
		this.accomplishSound = new Audio(
			'https://github.com/raychang2017/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/audio/BOTW_Fanfare_SmallItem.wav?raw=true'
		); // ../audio/BOTW_Fanfare_SmallItem.wav
		this.deleteSound = new Audio(
			'https://github.com/raychang2017/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/audio/BotW_Interact_sound.mp3?raw=true'
		); // ../audio/BotW_Interact_sound.mp3
		this.dragSound = new Audio(
			'https://github.com/raychang2017/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/audio/drag.mp3?raw=true'
		); // ../audio/drag.mp3
		this.dropSound = new Audio(
			'https://github.com/raychang2017/f2e-portfolio/blob/master/06%20-%20%E5%8F%AF%E6%8B%96%E6%8B%89%E4%BB%BB%E5%8B%99%E7%9A%84%20LocalStorage%20%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85%E6%B8%85%E5%96%AE/audio/drop.mp3?raw=true'
		); // ../audio/drop.mp3
		this.events();
	}

	events() {
		// this.debug();
		// this.demo_f2eLearning();
		this.updateTasks();
		this.addTask();
		this.toggleComplete();
		this.editTask();
		this.deleteTask();
		// jQueryUISortable();
		this.sortablejs();
		this.rearrangeTodolist();
		// setInterval(this.toggleNightMode(), 60000);
	}

	debug() {
		const self = this;

		$('#todolist').on('click', function() {
			console.log(self.todolist);
		});

		$('.new-item input').keydown(function(e) {
			if (e.which === 13) {
				console.log('"' + $(this).val() + '" is added.');
			}
		});

		$('.items').on('click', '.delete', function() {
			console.log('"' + $(this).closest('.item').find('.content').text() + '" is deleted.');
		});

		$('.items').change(function() {
			console.log('.items changed');
		});
	}

	demo_f2eLearning() {
		localStorage.setItem(
			'todolist',
			JSON.stringify([
				{
					task: 'HTML + CSS 網頁基礎',
					completed: false
				},
				{
					task: 'Flexbox + CSS Grid 響應式佈局',
					completed: false
				},
				{
					task: 'JavaScript + DOM 操作',
					completed: false
				},
				{
					task: 'Git/Github 版本控制',
					completed: false
				},
				{
					task: '搭建網站/Github page',
					completed: false
				},
				{
					task: 'Node.js + NPM 套件管理',
					completed: false
				},
				{
					task: 'React.js/Vue.js 前端框架',
					completed: false
				},
				{
					task: 'HTTP + AJAX/JSON API 服務整合',
					completed: false
				},
				{
					task: '作品集 + 一頁式履歷',
					completed: false
				},
				{
					task: '尋找、取得 offer',
					completed: false
				}
			])
		);
	}

	updateTasks() {
		$('.items').empty();

		for (let i = 0; i < this.todolist.length; i++) {
			$('.items').append(`
        <div class="item" id="item_${i}">
          <div class="handle">: :</div>
          <input type="checkbox"${this.todolist[i].completed ? ' checked' : ''}>
          <div class="check">✓</div>
          <div class="content">${this.todolist[i].task}</div>
          <div class="delete">✕</div>
        </div>`);
		}

		this.changePlaceholder(this.maxTaskNumber);
	}

	addTask() {
		const self = this;

		$('.new-item input').keydown(function(e) {
			// Lock to-do list
			if ($('.item').length > (self.maxTaskNumber - 1)) return e.preventDefault();

			if (e.which === 13) {
				const input = $(this).val().trim();
				// input, select, textarea 用 val；其他使用 text()
				// val() 取值，如果在括號中輸入值會變為輸出
				// trim() 刪除首尾空格

				if (!input) return;

				self.todolist.push({ task: input, completed: false });
				localStorage.setItem('todolist', JSON.stringify(self.todolist));
				self.updateTasks();
				$(this).val('');
				self.soundPlay(self.dropSound);
			}
		});
	}

	toggleComplete() {
		const self = this;

		$('.items').on('click', 'input', function() {
			const index = $(this).closest('.item').attr('id').replace(/item_/g, '');

			self.todolist[index].completed = !self.todolist[index].completed;
			localStorage.setItem('todolist', JSON.stringify(self.todolist));
			$('.content').blur();

			if ($(this).is(':checked')) {
				// $('.accomplishSound')[0].play();
				self.soundPlay(self.accomplishSound);
			}
		});
	}

	editTask() {
		const self = this;

		$('.items').on('mousedown', '.content', function() {
			$(this).prop('contenteditable', true);
		});

		$('.items').on('keydown', '.content', function(e) {
			if (e.which === 13) $(this).blur();
		});

		$('.items').on('blur', '.content', function() {
			const index = $(this).closest('.item').attr('id').replace(/item_/g, '');

			self.todolist[index].task = $(this).text().trim();
			localStorage.setItem('todolist', JSON.stringify(self.todolist));
			$(this).prop('contenteditable', false);
			self.updateTasks();
		});
	}

	deleteTask() {
		const self = this;

		$('.items').on('click', '.delete', function() {
			const item = $(this).closest('.item');
			const index = item.attr('id').replace(/item_/g, '');

			self.todolist.splice(index, 1);
			localStorage.setItem('todolist', JSON.stringify(self.todolist));
			item.remove();
			if (!self.todolist.length) localStorage.removeItem('todolist'); // It's not same to clear()
			self.updateTasks();
			self.soundPlay(self.deleteSound);
		});
	}

	soundPlay(audio) {
		audio.currentTime = 0;
		audio.play();
	}

	changePlaceholder(maxTaskNumber) {
		if ($('.item').length > (maxTaskNumber - 1)) {
			$('.new-item input').attr('placeholder', 'Try to make tasks less...')
		} else {
			$('.new-item input').attr('placeholder', 'What needs to be done?');
		}
	}

	// jQueryUISortable() {
	// 	$('#todolist .items').sortable({
	// 		items: '.item',
	// 		cancel: '.content',
	// 		placeholder: 'dragging'
	// 	});
	// }

	sortablejs() {
		Sortable.create(sortable, {
			// disabled: false, // 關閉 Sortable
			animation: 100, // 物件移動時間(單位:毫秒)
			handle: '.handle', // 可拖曳的區域
			draggable: '.item', // 可拖曳的物件
			// filter: ".new-item",  // 過濾器，不能拖曳的物件
			// preventOnFilter: true, // 當過濾器啟動的時候，觸發 event.preventDefault()
			ghostClass: 'dragging' // 拖曳時，給予物件的類別
			// chosenClass: "dragging",  // 選定時，給予物件的類別
		});

		$('.items').on('mousedown', '.handle', () => {
			this.soundPlay(this.dragSound);
		});
	}

	rearrangeTodolist() {
		const self = this;

		$('.items').change(function() {
			for (let i = 0; i < self.todolist.length; i++) {
				// Overwrite data
				self.todolist[i].task = $('.item').eq(i).find('.content').text();
				self.todolist[i].completed = $('.item').eq(i).find('input').prop('checked');

				localStorage.setItem('todolist', JSON.stringify(self.todolist));

				// Update el id number
				$('.item').eq(i).attr('id', `item_${i}`);
				self.soundPlay(self.dropSound);
			}
		});
	}

	// checkNight() {
	// 	const hour = new Date().getHours();

	// 	// 6:00 - 17:59 視為日，其他為夜
	// 	hour > 6 && hour < 18 ? (this.nightMode = false) : (this.nightMode = true);
	// 	// console.log(this.nightMode);
	// }

	// toggleNightMode() {
	// 	this.checkNight();

	// 	if (this.nightMode) {
	// 		$('body').css({
	// 			backgroundColor: '#273238'
	// 		});
	// 		$('#todolist').addClass('night-mode');
	// 	} else {
	// 		$('body').css({
	// 			backgroundColor: '#ffc945'
	// 		});
	// 		$('#todolist').removeClass('night-mode');
	// 	}
	// }

	// adjustSpace() {
	// 	// 當可視畫面高 < 全文高
	// 	if (document.body.offsetHeight < document.body.scrollHeight) {
	// 		$('body').css({
	// 			'padding': '60px, 0'
	// 		});
	// 		// Scroll to (x, y)
	// 		// $('body').scrollTo(0, $('$todolist').scrollHeight);
	// 	} else {
	// 		$('body').css('padding', '0');
	// 	}
		
	// 	// 取頁面高度 https://dotblogs.com.tw/aquarius6913/2011/01/03/20538
	// 	// console.log(`
	// 	// 網頁可見區域寬：${document.body.clientWidth}
	// 	// 網頁可見區域高：${document.body.clientHeight}
	// 	// 網頁可見區域寬：${document.body.offsetWidth} (包括邊線和捲軸的寬)
	// 	// 網頁可見區域高：${document.body.offsetHeight} (包括邊線的寬)
	// 	// 網頁正文全文寬：${document.body.scrollWidth}
	// 	// 網頁正文全文高：${document.body.scrollHeight}
	// 	// 網頁被卷去的高(ff)：${document.body.scrollTop}
	// 	// 網頁被卷去的高(ie)：${document.documentElement.scrollTop}
	// 	// 網頁被卷去的左：${document.body.scrollLeft}
	// 	// 網頁正文部分上：${window.screenTop}
	// 	// 網頁正文部分左：${window.screenLeft}
	// 	// 螢幕解析度的高：${window.screen.height}
	// 	// 螢幕解析度的寬：${window.screen.width}
	// 	// 螢幕可用工作區高度：${window.screen.availHeight}
	// 	// 螢幕可用工作區寬度：${window.screen.availWidth}
	// 	// 螢幕設置為 ${window.screen.colorDepth} 位色彩
	// 	// 螢幕設置為 ${window.screen.deviceXDPI} 像素/英寸`);
	// }
}

let todoApp = new TodoApp();
