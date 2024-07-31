const sqlite3 = require('better-sqlite3');
// 打开数据库
const DB = sqlite3('example.db');
// 启用外键约束
DB.exec('PRAGMA foreign_keys = ON;');
// 创建表
DB.prepare(
  'CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, name TEXT)' //创建users表 如果存在就不创建
).run();
DB.prepare(
  'CREATE TABLE IF NOT EXISTS tasks(id TEXT PRIMARY KEY,user_id TEXT,task_name TEXT,data_path TEXT,workspace TEXT,serial_number TEXT,camera_name TEXT,execute_type TEXT,install_time TEXT,install_place TEXT,getcard_time TEXT,remark TEXT,start_time TEXT,end_time TEXT,status TEXT,progress TEXT,task_type TEXT,FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)' //创建users表 如果存在就不创建
).run();
//创建图片路径表
DB.prepare(
  'CREATE TABLE IF NOT EXISTS assets_list(id INTEGER PRIMARY KEY AUTOINCREMENT,assets_id TEXT,file_name TEXT,file_path TEXT,is_recognition TEXT,recognition_file TEXT,FOREIGN KEY (assets_id) REFERENCES tasks (id) ON DELETE CASCADE)'
).run();
//创建识别结果表
DB.prepare(
  'CREATE TABLE IF NOT EXISTS recognition_result(id INTEGER PRIMARY KEY AUTOINCREMENT,recognition_id TEXT,class_id TEXT,class_name TEXT,confidence TEXT,identify TEXT,is_edit TEXT,point TEXT,FOREIGN KEY (recognition_id) REFERENCES assets_list (id) ON DELETE CASCADE)'
).run();
const insertTask = DB.prepare(
  'INSERT INTO tasks (id,user_id,task_name,data_path,workspace,serial_number,camera_name,execute_type,install_time,install_place,getcard_time,remark,start_time,end_time,status,progress,task_type) VALUES (@id,@user_id,@task_name,@data_path,@workspace,@serial_number,@camera_name,@execute_type,@install_time,@install_place,@getcard_time,@remark,@start_time,@end_time,@status,@progress,@task_type)'
);
const insert = DB.prepare('INSERT INTO  users (id,name) VALUES (@id, @name)');
const insertAssets = DB.prepare(
  'INSERT INTO  assets_list (assets_id,file_name,file_path,is_recognition,recognition_file) VALUES (@assets_id, @file_name, @file_path, @is_recognition, @recognition_file)'
);
const insertRecognition = DB.prepare(
  'INSERT INTO  recognition_result (id,recognition_id,class_id,class_name,confidence,identify,is_edit,point) VALUES (@id, @recognition_id, @class_id, @class_name, @confidence, @identify, @is_edit, @point)'
);
const find = DB.prepare(
  'SELECT users.id,* FROM users JOIN tasks ON users.id = tasks.user_id WHERE users.id = ?'
);

const insertFn = DB.transaction((user) => {
  //插入用户数据
  return insert.run(user);
});
const insertAssetsFn = DB.transaction((assets) => {
  // 插入图片路径
  return insertAssets.run(assets);
});
const insertRecognitionFn = DB.transaction((recognition) => {
  //插入识别结果
  return insertRecognition.run(recognition);
});
const insertTaskFn = DB.transaction((task) => {
  //插入任务数据
  return insertTask.run(task);
});
function main() {
  insertFn({
    id: '123',
    name: '张三',
  });
  insertTaskFn({
    id: '02',
    user_id: '123',
    task_name: 'test',
    data_path: 'test',
    workspace: 'test',
    serial_number: 'test',
    camera_name: 'test',
    execute_type: 'test',
    install_time: 'test',
    install_place: 'test',
    getcard_time: 'test',
    remark: 'test',
    start_time: 'test',
    end_time: 'test',
    status: 'test',
    progress: 'test',
    task_type: 'test',
  });
  insertAssetsFn({
    assets_id: '02',
    file_name: 'test666',
    file_path: 'test',
    is_recognition: 'test',
    recognition_file: 'test',
  });
  // insertRecognitionFn({
  //   recognition_id: 'sdfghsjdf',
  //   classId: 'test',
  //   className: 'test',
  //   confidence: 'test',
  //   identify: 'test',
  //   isEdit: 'test',
  //   point: 'test',
  // });
}
// main();
//
const findTask = DB.prepare(
  'SELECT users.id, tasks.* FROM users JOIN tasks ON users.id = tasks.user_id WHERE users.id = ?'
);
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
}
// 递归地将对象或数组的键转换为小驼峰格式
function convertToCamelCase(input) {
  if (Array.isArray(input)) {
    return input.map((item) => convertToCamelCase(item));
  } else if (input !== null && typeof input === 'object') {
    return Object.keys(input).reduce((acc, key) => {
      const camelCaseKey = toCamelCase(key);
      acc[camelCaseKey] = convertToCamelCase(input[key]);
      return acc;
    }, {});
  }
  return input;
}
// let res = findTask.all('123');
// console.log(convertToCamelCase(res));
// 获取表的字段信息
function getTableColumns(tableName) {
  const stmt = DB.prepare(`PRAGMA table_info(${tableName})`);
  const columns = stmt.all().map((column) => column.name);
  return columns;
}
const columns = getTableColumns('tasks');
console.log(columns);
