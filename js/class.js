'use strict';

class TodoApp {
  constructor() {
    this.todolist = JSON.parse(localStorage.getItem('todolist')) || [];
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
  }

  debug() {
    const self = this;

    $('#todolist').on('click', function() {
      console.log(self.todolist);
    });

    $('.newItem input').keydown(function(e) {
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
    localStorage.setItem('todolist', JSON.stringify([
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
          <input type="checkbox" ${this.todolist[i].completed ? 'checked' : ''}>
          <div class="check">✓</div>
          <div class="content">${this.todolist[i].task}</div>
          <div class="delete">☓</div>
        </div>`);
    }
  }

  addTask() {
    const self = this;

    $('.newItem input').keydown(function(e) {
      if (e.which === 13) {
        // input, select, textarea 用 val；其他使用 text()
        // val() 會抓取內容，如果輸入值到括號中會變為輸出
        // trim() 刪除首尾空格
        const input = $(this).val().trim(); 

        if (!input) return;

        self.todolist.push({task: input, completed: false});
        localStorage.setItem('todolist', JSON.stringify(self.todolist));
        self.updateTasks();
        $(this).val('');
      }
    });
  }

  toggleComplete() {
    const self = this;

    $('.items').on('click', 'input', function() {
      const index = $(this).closest('.item').attr('id').replace(/item_/g, '');
      const accomplishSound = new Audio(
        // 'http://noproblo.dayjo.org/ZeldaSounds/BOTW/BOTW_Fanfare_SmallItem.wav' // 使用 html 載入 audio 方式能在第一次播放無延遲，但播放中的其他操作無法播放音效
        '../audio/BOTW_Fanfare_SmallItem.wav' // 使用 js 載入 audio 在第一次播放會有明顯延遲，但播放中的其他操作仍可繼續播放音效
      );

      self.todolist[index].completed = !self.todolist[index].completed;
      localStorage.setItem('todolist', JSON.stringify(self.todolist));
      $('.content').blur();

      if ($(this).is(':checked')) {
        // $('.accomplishSound')[0].play();
        accomplishSound.play();
      }
    });
  }

  editTask() {
    const self = this;

    $('.items').on('mousedown', '.content', function() {
      $(this).prop('contenteditable', true);
    });

    $('.items').on('keydown', '.content', function(e) {
      if (e.which === 13) {
        $(this).blur();
      }
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
      const deleteSound = new Audio('../audio/BotW_Interact_sound.mp3');

      self.todolist.splice(index, 1);
      localStorage.setItem('todolist', JSON.stringify(self.todolist));
      item.remove();
      if (!self.todolist.length) localStorage.clear();
      self.updateTasks();
      deleteSound.play();
    });
  }

  jQueryUISortable() {
    $('#todolist .items').sortable({
      items: '.item',
      cancel: '.content',
      placeholder: 'dragging'
    });
  }

  sortablejs() {
    Sortable.create(sortable, {
      // disabled: false, // 關閉 Sortable
      animation: 100, // 物件移動時間(單位:毫秒)
      handle: '.handle', // 可拖曳的區域
      draggable: '.item', // 可拖曳的物件
      // filter: ".newItem",  // 過濾器，不能拖曳的物件
      // preventOnFilter: true, // 當過濾器啟動的時候，觸發 event.preventDefault()
      ghostClass: 'dragging' // 拖曳時，給予物件的類別
      // chosenClass: "dragging",  // 選定時，給予物件的類別
    });
  }

  rearrangeTodolist() {
    const self = this;

    $('.items').change(function() {
      for (let i = 0; i < self.todolist.length; i++) {
        // 將 TodoApp.todolist 中的資料，複寫為 html 中順序對應的項目值
        self.todolist[i].task = $('.item').eq(i).find('.content').text();
        self.todolist[i].completed = $('.item').eq(i).find('input').prop('checked');
        
        localStorage.setItem('todolist', JSON.stringify(self.todolist));

        // 重置 html 中項目的 id 值
        $('.item').eq(i).attr('id', 'item_' + i);
      }
    });
  }
}

let todoApp = new TodoApp();