const sharp = require('sharp');
const fs = require('fs');
const ort = require('onnxruntime-node');
const sessionOptions = {
  executionProviders: ['cuda'],
};
const session = new ort.InferenceSession('./yolov8s.onnx');
console.log(session);
async function runModel(img) {
  let orimg = sharp(img);
  const { data, info } = await orimg
    .clone()
    .jpeg({ quality: 100 }) //高质量输出图片
    .resize(640, 640) // 调整图像大小以匹配模型输入大小
    .raw()
    .toBuffer({ resolveWithObject: true });
  let originInfo = await orimg.toBuffer({ resolveWithObject: true }); //获取原始图片信息
  let { width, height } = originInfo.info; //原始图片的宽高
  const tensor = createTensor2({ data, info });
  console.log(tensor);
  let output = await session.run({ images: tensor });
  console.log(output);
}
function createTensor2({ data, info }) {
  const { width, height, channels } = info;
  const floatArray = new Float32Array(data.length);
  for (let i = 0; i < data.length; i++) {
    floatArray[i] = data[i] / 255.0;
  }
  // 将图片数据转换为NCHW格式
  const [r, g, b] = [
    new Float32Array(width * height),
    new Float32Array(width * height),
    new Float32Array(width * height),
  ];
  for (let i = 0; i < width * height; i++) {
    r[i] = floatArray[i * 3];
    g[i] = floatArray[i * 3 + 1];
    b[i] = floatArray[i * 3 + 2];
  }
  const nchwData = new Float32Array(3 * width * height);
  nchwData.set(r, 0);
  nchwData.set(g, width * height);
  nchwData.set(b, 2 * width * height);
  const tensor = new ort.Tensor('float32', nchwData, [
    1,
    channels,
    width,
    height,
  ]);
  return tensor;
}
runModel('./test.jpg');
