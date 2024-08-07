const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const ort = require('onnxruntime-node');

const sessionOptions = {
  executionProviders: ['cuda'],
};
console.log(ort, 'tf');

// 读取和处理图片
async function processImage(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const imageTensor = tf.node
    .decodeImage(imageBuffer, 3)
    .resizeNearestNeighbor([640, 640]) // 调整图片大小以匹配模型的输入大小
    .toFloat()
    .div(tf.scalar(255.0)) // 归一化
    .expandDims();

  return imageTensor;
}
// 加载ONNX模型并进行推理
async function runInference(imagePath) {
  const imageTensor = await processImage(imagePath);
  console.log(imageTensor, 'imageTensor');

  // 加载ONNX模型
  const session = await ort.InferenceSession.create('./yolov8s.onnx');
  const tensor = new ort.Tensor(
    'float32',
    imageTensor.dataSync(),
    [1, 3, 640, 640]
  );
  console.log(tensor, 'tensor');
  // 构建ONNX输入
  // const input = {
  //   input: new ort.Tensor('float32', imageTensor.dataSync(), [1, 3, 640, 640]),
  // };

  // 运行推理
  const output = await session.run({ images: tensor });
  postprocess(output.output0);
  // 获取结果
  // const result = output.output;
  console.log('Inference result:', output);
}
runInference('./test.jpg');
/**
 * @description 获取模型的预测结果
 * @param {object} output 模型的输出
 */
function postprocess(output) {
  const [batchSize, numBoxes, numAttributes] = output.dims;
  const data = output.data;
  let arr = reshapeArray(data, numBoxes, numAttributes);
  let result = transposeArray(arr);
  const boxes = isOverThreshold(result, 0.5);
  return boxes;
}
