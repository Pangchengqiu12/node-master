const sqlite3 = require('better-sqlite3');
// 打开数据库
const DB = sqlite3('example.db');
// 创建表
DB.prepare(
  'CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, name TEXT,task TEXT)' //创建users表 如果存在就不创建
).run();
const insert = DB.prepare(
  'INSERT INTO users (id, name,task) VALUES (@id, @name, @task)'
);
const find = DB.prepare('SELECT task FROM users WHERE id = ?');

const insertMany = DB.transaction((user) => {
  return insert.run(user);
});
let task = [
  {
    id: 'sjlkfgj',
    taskName: '更新',
  },
];
console.log(
  insertMany({
    id: '12333',
    name: '管理员000',
    task: JSON.stringify(task),
  })
);
// function getUsers(id) {
//   let info = find.get(id);
//   console.log(info);
//   return info;
// }
// getUsers('12312dsaf8');
// const updateTask = DB.transaction((id, task) => {
//   DB.prepare('UPDATE users SET task = ? WHERE id = ?').run(task, id);
// });
// updateTask('12312dsaf8', JSON.stringify(task));
