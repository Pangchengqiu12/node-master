async function main() {
  if (true) {
    let res = await demo();
    console.log(res);
  }
  console.log('hello world');
}
function demo() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('hello');
    }, 1000);
  });
}
main();
