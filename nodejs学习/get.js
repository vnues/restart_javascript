const http = require('http')
const querystring = require('querystring')
const { SuccessModel } = require('./class')
const server = http.createServer((req, res) => {
    // console.log(req)
    // res.writeHead(500, { 'Content-Type': 'text/plain' });
    // console.log(process.env)
    console.log(process.NODE_ENV)
    res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
    console.log(req.method)
    const url = req.url
    req.query = querystring.parse(url.split("?")[1])
    res.end(JSON.stringify(new SuccessModel([], '成功')))
})


server.listen(8000, () => {
    console.log('server listening in port:8000')
})


// 什么是Node的数据流(stream) 比如post请求