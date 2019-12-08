const connect = require('connect')
const http = require('http')
const querystring = require('querystring')
const app = connect()

app.use((req, res, next) => {
    console.log(querystring.parse(req.url.split("?")[1]))
    console.log("middleware 1")
    next()
})

app.use((req, res, next) => {
    console.log("middleware 2")
    next()
})

app.use((req, res, next) => {
    console.log("middleware 3")
    next()
})


app.use((req, res, next) => {
    console.log("middleware 4")
    res.end("hello from connect!\n")
})


http.createServer(app).listen(8080, () => {
    console.log("启动服务器...")
})