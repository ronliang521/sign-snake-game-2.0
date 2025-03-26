export function loadImages(imageUrls) {
      return new Promise((resolve, reject) => {
        const images = {};
        let loadedCount = 0;
        const totalImages = Object.keys(imageUrls).length;
        
        // 如果没有图片需要加载，直接返回空对象
        if (totalImages === 0) {
          resolve(images);
          return;
        }
        
        // 创建临时图像
        const createTempImages = () => {
          const tempImages = {};
          
          // 创建龙头图像
          tempImages.head = createDragonHeadImage();
          
          // 创建橘子图像（用于身体和食物）
          tempImages.body = createOrangeImage();
          tempImages.food = createOrangeImage();
          
          resolve(tempImages);
        };
        
        // 尝试加载图片，如果失败则创建临时图像
        for (const [key, url] of Object.entries(imageUrls)) {
          const img = new Image();
          
          img.onload = () => {
            images[key] = img;
            loadedCount++;
            
            if (loadedCount === totalImages) {
              resolve(images);
            }
          };
          
          img.onerror = () => {
            console.warn(`无法加载图片: ${url}，将使用生成的图像替代`);
            createTempImages();
          };
          
          img.src = url;
        }
        
        // 5秒后如果图片还没加载完，使用生成的图像
        setTimeout(() => {
          if (loadedCount < totalImages) {
            console.warn('图片加载超时，使用生成的图像替代');
            createTempImages();
          }
        }, 5000);
      });
    }

    // 创建龙头图像
    function createDragonHeadImage() {
      const canvas = document.createElement('canvas');
      canvas.width = 30;
      canvas.height = 30;
      const ctx = canvas.getContext('2d');
      
      // 橙色背景
      ctx.fillStyle = '#ff8c00';
      ctx.beginPath();
      ctx.arc(15, 15, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // 龙头特征
      // 眼睛
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(20, 10, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(22, 10, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // 鼻子/嘴
      ctx.fillStyle = '#ff4500';
      ctx.beginPath();
      ctx.moveTo(30, 15);
      ctx.lineTo(25, 12);
      ctx.lineTo(25, 18);
      ctx.closePath();
      ctx.fill();
      
      // 角
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(10, 5);
      ctx.lineTo(5, 0);
      ctx.lineTo(12, 8);
      ctx.closePath();
      ctx.fill();
      
      return canvas;
    }

    // 创建橘子图像
    function createOrangeImage() {
      const canvas = document.createElement('canvas');
      canvas.width = 30;
      canvas.height = 30;
      const ctx = canvas.getContext('2d');
      
      // 橘子主体
      ctx.fillStyle = '#ff8c00';
      ctx.beginPath();
      ctx.arc(15, 15, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // 橘子纹理
      ctx.strokeStyle = '#ff6b00';
      ctx.lineWidth = 1;
      
      // 水平线
      ctx.beginPath();
      ctx.moveTo(8, 15);
      ctx.lineTo(22, 15);
      ctx.stroke();
      
      // 垂直线
      ctx.beginPath();
      ctx.moveTo(15, 8);
      ctx.lineTo(15, 22);
      ctx.stroke();
      
      // 对角线
      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(20, 20);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(20, 10);
      ctx.lineTo(10, 20);
      ctx.stroke();
      
      // 叶子
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.ellipse(15, 5, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      return canvas;
    }
