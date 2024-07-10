const sqlite3 = require('better-sqlite3');
// 打开数据库
const db = sqlite3('example.db');
// 创建表
db.prepare(
  'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT,task TEXT)' //创建users表 如果存在就不创建
).run();
const insert = db.prepare('INSERT INTO users (id, name) VALUES (@id, @name)');
const insertMany = db.transaction((users) => {
  for (const user of users) insert.run(user);
});
insertMany([
  {
    id: '12312dsaf3',
    name: '管理员2',
  },
]);
