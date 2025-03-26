import { Game } from './game.js';
    import { loadImages } from './imageLoader.js';

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const scoreElement = document.getElementById('score');

    // 方向控制按钮
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');

    let game = null;
    let images = {};

    // 加载游戏所需图片
    async function init() {
      try {
        images = await loadImages({
          head: 'src/assets/dragon-head.png',
          body: 'src/assets/orange.png',
          food: 'src/assets/orange.png'
        });
        
        // 创建游戏实例
        game = new Game(canvas, ctx, images, updateScore);
        
        // 添加游戏控制按钮事件监听器
        startBtn.addEventListener('click', () => {
          game.start();
          startBtn.disabled = true;
        });
        
        restartBtn.addEventListener('click', () => {
          game.reset();
          game.start();
          startBtn.disabled = true;
          scoreElement.textContent = '0';
        });
        
        // 添加方向控制按钮事件监听器
        upBtn.addEventListener('click', () => {
          game.handleKeyPress('ArrowUp');
        });
        
        downBtn.addEventListener('click', () => {
          game.handleKeyPress('ArrowDown');
        });
        
        leftBtn.addEventListener('click', () => {
          game.handleKeyPress('ArrowLeft');
        });
        
        rightBtn.addEventListener('click', () => {
          game.handleKeyPress('ArrowRight');
        });
        
        // 添加触摸事件支持
        addTouchSupport();
        
        // 监听键盘事件
        window.addEventListener('keydown', (e) => {
          game.handleKeyPress(e.key);
        });
        
        // 初始绘制游戏
        game.draw();
        
      } catch (error) {
        console.error('加载图片失败:', error);
      }
    }

    // 为方向按钮添加触摸支持
    function addTouchSupport() {
      // 防止触摸滑动时页面滚动
      const directionBtns = document.querySelectorAll('.direction-btn');
      directionBtns.forEach(btn => {
        btn.addEventListener('touchstart', (e) => {
          e.preventDefault();
        });
        
        btn.addEventListener('touchmove', (e) => {
          e.preventDefault();
        });
      });
      
      // 长按支持
      let pressTimer = null;
      
      function startPressTimer(direction) {
        if (pressTimer === null) {
          pressTimer = setInterval(() => {
            game.handleKeyPress(direction);
          }, 150);
        }
      }
      
      function clearPressTimer() {
        if (pressTimer !== null) {
          clearInterval(pressTimer);
          pressTimer = null;
        }
      }
      
      // 上按钮
      upBtn.addEventListener('touchstart', () => {
        game.handleKeyPress('ArrowUp');
        startPressTimer('ArrowUp');
      });
      
      upBtn.addEventListener('touchend', clearPressTimer);
      
      // 下按钮
      downBtn.addEventListener('touchstart', () => {
        game.handleKeyPress('ArrowDown');
        startPressTimer('ArrowDown');
      });
      
      downBtn.addEventListener('touchend', clearPressTimer);
      
      // 左按钮
      leftBtn.addEventListener('touchstart', () => {
        game.handleKeyPress('ArrowLeft');
        startPressTimer('ArrowLeft');
      });
      
      leftBtn.addEventListener('touchend', clearPressTimer);
      
      // 右按钮
      rightBtn.addEventListener('touchstart', () => {
        game.handleKeyPress('ArrowRight');
        startPressTimer('ArrowRight');
      });
      
      rightBtn.addEventListener('touchend', clearPressTimer);
    }

    function updateScore(score) {
      scoreElement.textContent = score.toString();
    }

    // 初始化游戏
    init();
