const sharp = require('sharp');
const fs = require('fs');
const ort = require('onnxruntime-node');
let info = {
  className: '小鹿',
  point: [1959, 694, 2652, 1557], //x1 y1 x2 y2
  score: 0.98,
};

async function rectangle(img, item) {
  // const session = await ort.InferenceSession.create('./squeezenet1_1.onnx');
  // const { data, info } = await sharp(img)
  //   .resize(224, 224) // 调整图像大小以匹配模型输入大小
  //   .raw()
  //   .toBuffer({ resolveWithObject: true });
  // const { width, height, channels } = info;
  // const uint8Array = new Uint8Array(data);
  // console.log(width, height, channels);
  // const float32Array = new Float32Array(uint8Array.length);
  // for (let i = 0; i < uint8Array.length; i++) {
  //   float32Array[i] = uint8Array[i];
  // }
  // const tensor = new ort.Tensor('float32', float32Array, [
  //   1,
  //   channels,
  //   height,
  //   width,
  // ]);
  // console.log(tensor);
  // let outPut = await session.run({ data: tensor });
  // console.log(outPut.cpuData);
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
