const sharp = require('sharp');
let info = {
  className: '小鹿',
  point: [1959, 694, 2652, 1557], //x1 y1 x2 y2
  score: 0.98,
};
async function rectangle(img, item) {
  // let data = await sharp(img).toBuffer();
  let data1 = await sharp(img)
    .composite([
      {
        //左边竖线
        input: {
          create: {
            width: 10,
            height: item.point[3] - item.point[1],
            channels: 4,
            background: { r: 255, g: 0, b: 0, alpha: 1 },
          },
        },
        left: item.point[0],
        top: item.point[1],
      },
      {
        //右边竖线
        input: {
          create: {
            width: 10,
            height: item.point[3] - item.point[1],
            channels: 4,
            background: { r: 255, g: 0, b: 0, alpha: 1 },
          },
        },
        left: item.point[2],
        top: item.point[1],
      },
      {
        //下边横线
        input: {
          create: {
            width: item.point[2] - item.point[0],
            height: 10,
            channels: 4,
            background: { r: 255, g: 0, b: 0, alpha: 1 },
          },
        },
        left: item.point[0],
        top: item.point[3],
      },
      {
        //上边横线
        input: {
          create: {
            width: item.point[2] - item.point[0],
            height: 10,
            channels: 4,
            background: { r: 255, g: 0, b: 0, alpha: 1 },
          },
        },

        left: item.point[0],
        top: item.point[1],
      },
      {
        //文字
        input: {
          text: {
            width: 1000,
            height: 60,
            rgba: true,
            align: 'left',
            text: `<span foreground="red">${
              item.className + ' ' + item.score * 100 + '%'
            }</span>`,
          },
        },
        left: item.point[0],
        top: item.point[1] - 70,
      },
    ])
    .toFile('./combined.jpg');
  return data1;
}
rectangle('./test.jpg', info);
