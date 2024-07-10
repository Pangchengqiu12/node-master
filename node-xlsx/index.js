const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
// 读取txt文件内容
const filePath = path.join(__dirname, 'data.txt'); // 请将data.txt替换为你的txt文件路径
const fileContent = fs.readFileSync(filePath, 'utf8');

// 将txt文件内容按行分割
const lines = fileContent.trim().split('\n');

// 提取表头
const headers = lines[0].split(',');

// 提取数据行
const data = lines.slice(1).map((line) => line.split(','));

// 创建一个新的工作簿
const workbook = xlsx.utils.book_new();

// 创建一个工作表
const worksheet = xlsx.utils.aoa_to_sheet([headers, ...data]);

// 将工作表添加到工作簿中
xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

// 将工作簿写入Excel文件
const outputFilePath = path.join(__dirname, 'output.xlsx');
xlsx.writeFile(workbook, outputFilePath);

console.log(`Excel file created at ${outputFilePath}`);
