const Koa = require('koa')
const path = require('path')
const static = require('koa-static') // 正常获取到静态资源就返回 如果异常 执行下个中间件（上个中间件也行）（就是我们自己处理的，相当于暴露一个方法）
// 所以这个洋葱模型确实绕
// 假设在获取中间件之前我们想自己处理逻辑 -- 完全可以
// 现在理解下 
// 一个中间件执行以后的操作可在上个操作或者下个操作就行❗️❗️❗️
// 不懂req--->res流向
const app = new Koa()

const staticPath = './static'

app.use(async (ctx, next) => {
    ctx.body = 'hello world'
    console.log("获取静态资源之前所要操作的逻辑")
    await next() // 等待这个中间件执行完 
    console.log("获取静态资源之后所要操作的逻辑")
})
app.use(static(
    path.join(__dirname, staticPath)
))
app.use(async (ctx, next) => {
    console.log("我是下个中间件")
})

app.listen(3000, () => {
    console.log('[demo] static-use-middleware is starting at port 3000')
})


/*
从上面可以知道，如果没有koa-router，其实每个路由使用的koa注册中间件的形式来进行处理的，这样不利于松耦合和模块化，所以将所有路由的处理逻辑抽离出来组合成一个大的中间件koa-router来处理，最后将大的中间件注册到koa上，如果关于koa中间件原理还不了解，可以参考另一篇文章koa框架会用也会写—(koa的实现)

koa-router的原理
既然koa-router也是大的中间件，里面拥有许多小的中间件，那么里面必然也需要用到洋葱模型，洋葱模型的特点：

middles：存放中间件的容器，用来存放注册的中间件
get(path,fn)：用来注册中间件，往middles中存放，由于是路由中间件这里多了一个参数path
compose()：用来组合中间件，让路由中间件按顺序执行
routes()：用来将koa-router中间件注册到app的中间件上，主要作用是调用路由中间件匹配请求的路径ctx.path

如果对于中间件和洋葱模型有疑问的，可以参考koa框架会用也会写—(koa的实现)


*/
// express中间件顺序执行也可以做到
// koa中间件洋葱模型也是可以做到
// 实际不懂中间件就是不懂其原理 但是洋葱模型那样理解是对的
// 知道什么情况下使用next

/*
  koa-router虽然是koa的一个中间件，但是其内部也包含众多的中间件，这些中间件通过Layer对象根据路由路径的不同进行划分，使得它们不再像koa的中间件那样每次请求都执行，而是针对每次请求采用match方法匹配出相应的中间件，再利用koa-compose形成一个中间件执行链。
*/

/*
koa-router虽然是koa的一个中间件，但是其内部也包含众多的中间件，这些中间件通过Layer对象根据路由路径的不同进行划分，使得它们不再像koa的中间件那样每次请求都执行，而是针对每次请求采用match方法匹配出相应的中间件，再利用koa-compose形成一个中间件执行链。
*/

// https://cnodejs.org/topic/578a19866d3f2b2014113edd

// 先用熟悉再分析原理

/*
koa 的级联使得所有中间件的逻辑关系变成了 callback 关系。如果项目简单，没问题；如果有高手坐镇，也没问题。当项目业务变庞大变复杂后，当不断有新人进入后，想让所有的开发人员掌握整个项目业务逻辑关系，应该就不是那么简单了
*/

// 洋葱模型与async await

// Koa本身做的工作仅仅是定制了中间件的编写规范，而不内置任何中间件。

// ????
/*
而 Koa 是在所有中间件中使用 ctx.body 设置响应数据，但是并不立即响应，而是在所有中间件执行结束后，再调用 res.end(ctx.body) 进行响应，这样就为响应前的操作预留了空间，所以是请求与响应都在最外层，中间件处理是一层层进行，所以被理解成洋葱模型，个人拙见。
*/


// https://blog.csdn.net/qq_24884955/article/details/80332816

// 不再深究 到时候写完再好好分析 review源码○
// https://www.cnblogs.com/cckui/p/10991062.html