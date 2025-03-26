import { Snake } from './snake.js';
    import { Food } from './food.js';

    export class Game {
      constructor(canvas, ctx, images, updateScoreCallback) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.images = images;
        this.updateScoreCallback = updateScoreCallback;
        this.gridSize = 30;
        this.gridWidth = Math.floor(canvas.width / this.gridSize);
        this.gridHeight = Math.floor(canvas.height / this.gridSize);
        this.snake = new Snake(this.gridWidth, this.gridHeight, this.gridSize, images);
        this.food = new Food(this.gridWidth, this.gridHeight, this.gridSize, images);
        this.score = 0;
        this.gameOver = false;
        this.gameLoop = null;
        this.speed = 150; // 初始速度，毫秒
      }

      start() {
        if (this.gameLoop) return;
        this.gameOver = false;
        this.gameLoop = setInterval(() => this.update(), this.speed);
      }

      stop() {
        if (this.gameLoop) {
          clearInterval(this.gameLoop);
          this.gameLoop = null;
        }
      }

      reset() {
        this.stop();
        this.snake = new Snake(this.gridWidth, this.gridHeight, this.gridSize, this.images);
        this.food.reset();
        this.score = 0;
        this.gameOver = false;
        this.speed = 150;
        this.updateScoreCallback(this.score);
      }

      update() {
        if (this.gameOver) return;

        // 移动蛇
        this.snake.move();

        // 检查是否吃到食物
        if (this.snake.checkCollisionWithFood(this.food)) {
          this.snake.grow();
          this.food.spawn(this.snake.getBody());
          this.score += 10;
          this.updateScoreCallback(this.score);
          
          // 每得100分加速一次
          if (this.score % 100 === 0 && this.speed > 50) {
            this.speed -= 10;
            this.stop();
            this.gameLoop = setInterval(() => this.update(), this.speed);
          }
        }

        // 检查是否撞墙或自己
        if (this.snake.checkCollisionWithWall() || this.snake.checkCollisionWithSelf()) {
          this.gameOver = true;
          this.stop();
          this.drawGameOver();
        }

        // 绘制游戏
        this.draw();
      }

      draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格背景
        this.drawGrid();
        
        // 绘制食物
        this.food.draw(this.ctx);
        
        // 绘制蛇
        this.snake.draw(this.ctx);
        
        // 如果游戏结束，绘制游戏结束信息
        if (this.gameOver) {
          this.drawGameOver();
        }
      }

      drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 140, 0, 0.1)';
        this.ctx.lineWidth = 1;
        
        // 绘制垂直线
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
          this.ctx.beginPath();
          this.ctx.moveTo(x, 0);
          this.ctx.lineTo(x, this.canvas.height);
          this.ctx.stroke();
        }
        
        // 绘制水平线
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
          this.ctx.beginPath();
          this.ctx.moveTo(0, y);
          this.ctx.lineTo(this.canvas.width, y);
          this.ctx.stroke();
        }
      }

      drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = '48px Arial';
        this.ctx.fillStyle = '#ff8c00';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('游戏结束!', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText('点击"重新开始"按钮再来一局', this.canvas.width / 2, this.canvas.height / 2 + 70);
      }

      handleKeyPress(key) {
        switch (key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            this.snake.changeDirection('up');
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            this.snake.changeDirection('down');
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            this.snake.changeDirection('left');
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            this.snake.changeDirection('right');
            break;
          case ' ':
            if (this.gameOver) {
              this.reset();
              this.start();
            } else if (this.gameLoop) {
              this.stop();
            } else {
              this.start();
            }
            break;
        }
      }
    }
