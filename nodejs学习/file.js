const fs = require('fs')

// fs.readFile('./hellonode.txt', (err, file) => {
//     console.log('读取文件完成')
//     console.log(file)
// })

// console.log("发起读取文件📃")


async function a() {
    console.log("读取前")
    const res = await fs.readFileSync('./hellonode.txt')
    console.log("读取后")
}

a()

console.log("发起读取文件📃")
