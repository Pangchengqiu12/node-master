const sharp = require('sharp');
const fs = require('fs');
const ort = require('onnxruntime-node');
let info = {
  className: '21',
  point: [864, 659, 587, 872], //x1 y1 width height
  score: 0.8872634768486023,
};
let data = [
  {
    confidence: 0.7,
    index: 2,
  },
  {
    confidence: 0.8,
    index: 2,
  },
  {
    confidence: 0.1,
    index: 2,
  },
  {
    confidence: 0.3,
    index: 3,
  },
  {
    confidence: 0.4,
    index: 3,
  },
];

async function rectangle(img, item, line = 5) {
  let data1 = await sharp(img)
    .jpeg({ quality: 100 }) //高质量输出图片
    .composite([
      {
        //左边竖线
        input: {
          create: {
            width: item.point[2], // 改用红色方框 用线框请用参数line
            height: item.point[3],
            channels: 4,
            background: { r: 255, g: 0, b: 0, alpha: 0.2 },
          },
        },
        left: item.point[0] - Math.floor(item.point[2] / 2),
        top: item.point[1] - Math.floor(item.point[3] / 2),
      },
      // {
      //   //右边竖线
      //   input: {
      //     create: {
      //       width: line,
      //       height: item.point[3],
      //       channels: 4,
      //       background: { r: 255, g: 0, b: 0, alpha: 1 },
      //     },
      //   },
      //   left: item.point[0] + Math.floor(item.point[2] / 2),
      //   top: item.point[1] - Math.floor(item.point[3] / 2),
      // },
      // {
      //   //下边横线
      //   input: {
      //     create: {
      //       width: item.point[2],
      //       height: line,
      //       channels: 4,
      //       background: { r: 255, g: 0, b: 0, alpha: 1 },
      //     },
      //   },
      //   left: item.point[0] - Math.floor(item.point[2] / 2),
      //   top: item.point[1] + Math.floor(item.point[3] / 2),
      // },
      // {
      //   //上边横线
      //   input: {
      //     create: {
      //       width: item.point[2],
      //       height: line,
      //       channels: 4,
      //       background: { r: 255, g: 0, b: 0, alpha: 1 },
      //     },
      //   },

      //   left: item.point[0] - Math.floor(item.point[2] / 2),
      //   top: item.point[1] - Math.floor(item.point[3] / 2),
      // },
      {
        //文字
        input: {
          text: {
            width: 1000,
            height: 25,
            rgba: true,
            align: 'left',
            text: `<span foreground="white">${
              item.className + ' ' + (item.score * 100).toFixed(2) + '%'
            }</span>`,
          },
        },
        left: item.point[0] - Math.floor(item.point[2] / 2),
        top: item.point[1] - Math.floor(item.point[3] / 2) - 30,
      },
    ])
    .toFile('./combined2.jpg');
  return data1;
}
rectangle('./test2.jpg', info);
