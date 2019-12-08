const Koa = require('koa')
const app = new Koa()

app.use(async ctx => {
    console.log(ctx) // ctx上下文环境
    console.log(ctx.body)
    ctx.body = "Hello World"
})

app.listen(8888, () => {
    console.table("端口监听在8888...")
})