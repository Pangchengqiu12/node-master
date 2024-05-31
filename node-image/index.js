const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function canvasPart(url, point) {
  // 加载图片
  const image = await loadImage('./test.jpg');

  // 获取图片宽度和高度
  const width = image.width;
  const height = image.height;

  // 创建画布
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 绘制图片
  ctx.drawImage(image, 0, 0, width, height);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 5;
  point.forEach((item) => {
    ctx.strokeRect(
      item.point[0],
      item.point[1],
      item.point[2] - item.point[0],
      item.point[3] - item.point[1]
    ); //x,y,宽，高
    //下面是文字
    //设置填充文字样式
    ctx.font = '50px serif';
    ctx.fillStyle = 'red';
    // 描边
    let score = item.score * 100 + '%';
    ctx.fillText(
      item.className + '' + score,
      item.point[0],
      item.point[1] - 10
    );
  });
  // 保存画布为图片
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFile('D:\\browserDown\\workspace\\output.jpg', buffer, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('图片保存成功');
  });
}
let img = fs.readFileSync('./test.jpg');

canvasPart(img, [
  {
    className: '小鹿',
    point: [1959, 694, 2652, 1557],
    score: 0.98,
  },
]);
