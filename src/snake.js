export class Snake {
      constructor(gridWidth, gridHeight, gridSize, images) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.gridSize = gridSize;
        this.images = images;
        
        // 初始化蛇的位置在中间
        const startX = Math.floor(gridWidth / 2);
        const startY = Math.floor(gridHeight / 2);
        
        // 蛇的身体，每个部分是一个{x, y}对象
        this.body = [
          { x: startX, y: startY },       // 头部
          { x: startX - 1, y: startY },   // 身体
          { x: startX - 2, y: startY }    // 尾部
        ];
        
        // 初始方向向右
        this.direction = 'right';
        this.nextDirection = 'right';
        
        // 是否刚吃了食物
        this.justAte = false;
        
        // 头部旋转角度
        this.headRotation = 0;
      }
      
      getBody() {
        return this.body;
      }
      
      changeDirection(newDirection) {
        // 防止180度转向
        if (
          (this.direction === 'up' && newDirection === 'down') ||
          (this.direction === 'down' && newDirection === 'up') ||
          (this.direction === 'left' && newDirection === 'right') ||
          (this.direction === 'right' && newDirection === 'left')
        ) {
          return;
        }
        
        this.nextDirection = newDirection;
      }
      
      move() {
        // 更新方向
        this.direction = this.nextDirection;
        
        // 根据方向更新头部旋转角度
        switch (this.direction) {
          case 'up':
            this.headRotation = -Math.PI / 2;
            break;
          case 'down':
            this.headRotation = Math.PI / 2;
            break;
          case 'left':
            this.headRotation = Math.PI;
            break;
          case 'right':
            this.headRotation = 0;
            break;
        }
        
        // 获取当前头部位置
        const head = { ...this.body[0] };
        
        // 根据方向移动头部
        switch (this.direction) {
          case 'up':
            head.y -= 1;
            break;
          case 'down':
            head.y += 1;
            break;
          case 'left':
            head.x -= 1;
            break;
          case 'right':
            head.x += 1;
            break;
        }
        
        // 将新头部添加到身体前面
        this.body.unshift(head);
        
        // 如果没有吃到食物，移除尾部；否则保持尾部
        if (!this.justAte) {
          this.body.pop();
        } else {
          this.justAte = false;
        }
      }
      
      grow() {
        this.justAte = true;
      }
      
      checkCollisionWithFood(food) {
        const head = this.body[0];
        return head.x === food.position.x && head.y === food.position.y;
      }
      
      checkCollisionWithWall() {
        const head = this.body[0];
        return (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= this.gridWidth ||
          head.y >= this.gridHeight
        );
      }
      
      checkCollisionWithSelf() {
        const head = this.body[0];
        // 从第二个身体部分开始检查，因为头部不能与自己碰撞
        for (let i = 1; i < this.body.length; i++) {
          if (head.x === this.body[i].x && head.y === this.body[i].y) {
            return true;
          }
        }
        return false;
      }
      
      draw(ctx) {
        // 绘制身体
        for (let i = this.body.length - 1; i > 0; i--) {
          const segment = this.body[i];
          const x = segment.x * this.gridSize;
          const y = segment.y * this.gridSize;
          
          // 使用橘子图像作为身体
          ctx.drawImage(
            this.images.body,
            x,
            y,
            this.gridSize,
            this.gridSize
          );
        }
        
        // 绘制头部（龙头）
        const head = this.body[0];
        const headX = head.x * this.gridSize;
        const headY = head.y * this.gridSize;
        
        // 保存当前上下文状态
        ctx.save();
        
        // 移动到头部中心
        ctx.translate(headX + this.gridSize / 2, headY + this.gridSize / 2);
        
        // 旋转
        ctx.rotate(this.headRotation);
        
        // 绘制头部图像，注意调整位置使其以中心点旋转
        ctx.drawImage(
          this.images.head,
          -this.gridSize / 2,
          -this.gridSize / 2,
          this.gridSize,
          this.gridSize
        );
        
        // 恢复上下文状态
        ctx.restore();
      }
    }
