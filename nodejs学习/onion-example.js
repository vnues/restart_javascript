const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
// 中间件的概念是框架提出来的，并不是nodejs的概念
// Koa是Web框架，所以针对的也是Web领域，所以就是req,res
app.use(async (ctx, next) => {
    console.log(1, "请求前")
    await next()
    // console.log(1, "请求后")
})
app.use(async (ctx, next) => {
    console.log(2, '请求前')
    await next()
    // console.log(2, "请求后")
})
router.get('/users', async (ctx, next) => {
    ctx.body = "hello koa"
    console.log("users")
    await next()

})
// app.use就是会使用中间件
// 注意了我访问一个路由就是访问他这个特定的路由 不会溢出一层经过/ /list...这样的 
app.use(router.routes())

app.use(async (ctx, next) => {
    console.log(4)
})

app.listen(3100, () => {
    console.log("端口监听在3100")
})
