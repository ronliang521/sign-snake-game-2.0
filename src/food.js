export class Food {
      constructor(gridWidth, gridHeight, gridSize, images) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.gridSize = gridSize;
        this.images = images;
        this.position = { x: 0, y: 0 };
        this.spawn();
      }
      
      spawn(snakeBody = []) {
        let newPosition;
        let overlapsWithSnake;
        
        // 生成不与蛇身重叠的随机位置
        do {
          overlapsWithSnake = false;
          newPosition = {
            x: Math.floor(Math.random() * this.gridWidth),
            y: Math.floor(Math.random() * this.gridHeight)
          };
          
          // 检查是否与蛇身重叠
          if (snakeBody) {
            for (const segment of snakeBody) {
              if (segment.x === newPosition.x && segment.y === newPosition.y) {
                overlapsWithSnake = true;
                break;
              }
            }
          }
        } while (overlapsWithSnake);
        
        this.position = newPosition;
      }
      
      reset() {
        this.spawn();
      }
      
      draw(ctx) {
        const x = this.position.x * this.gridSize;
        const y = this.position.y * this.gridSize;
        
        // 使用橘子图像作为食物
        ctx.drawImage(
          this.images.food,
          x,
          y,
          this.gridSize,
          this.gridSize
        );
      }
    }
