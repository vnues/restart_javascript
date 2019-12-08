const fs = require('fs')
const file = fs.readFileSync('./网络编程.md')
console.log(file.toString())