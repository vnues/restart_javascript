# 再精进的话就得学会写中间件了

## 洋葱模型原理


> 把后一个函数当做参数传递给前一个函数，从而实现把多个函数串起来执行的效果

Koa.js 最为人所知的是基于 洋葱模型 的HTTP中间件处理流程。 --- 对啊 因为koa本来就是Web框架

```javascript
const Koa = require('koa');

const app = new Koa();
const PORT = 3000;

// #1
app.use(async (ctx, next)=>{
    console.log(1)
    await next();
    console.log(1)
});
// #2
app.use(async (ctx, next) => {
    console.log(2)
    await next();
    console.log(2)
})

app.use(async (ctx, next) => {
    console.log(3)
})

app.listen(PORT);
console.log(`http://localhost:${PORT}`);

```

http://www.json119.com/li-jie-koa2de-yang-cong-mo-xing/
