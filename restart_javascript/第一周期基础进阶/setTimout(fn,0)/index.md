
https://juejin.im/post/59c25c936fb9a00a3f24e114
思考 setTimeOut0是什么作用
   【 js 基础 】 setTimeout(fn, 0) 的作用
    总结：setTimeout(fn,0)的含义是，指定某个任务在主线程最早可得的空闲时间执行，也就是说，尽可能早得执行。它在"任务队列"的尾部添加一个事件，因此要等到主线程把同步任务和"任务队列"现有的事件都处理完，才会得到执行。在某种程度上，我们可以利用setTimeout(fn,0)的特性，修正浏览器的任务顺序。
    🤔：
    零延迟 (Zero delay) 并不是意味着回调会立即执行。在零延迟调用 setTimeout 时，其并不是过了给定的时间间隔后就马上执行回调函数。其等待的时间基于队列里正在等待的消息数量。也就是说，setTimeout()只是将事件插入了任务队列，必须等到当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。要是当前代码耗时很长，有可能要等很久，所以并没有办法保证回调函数一定会在setTimeout()指定的时间执行。
    也就是意思是等待同步函数执行完以后就执行
    延迟调用function直到当前调用栈清空为止❓❓❓ 函数调用栈吧 并不是任务（消息）队列
    举个🌰：
    (function(){console.log(1)})()
    for(var i=0;i<1000;i++){
      console.log(i)
    }
     setTimeout(function(){console.log("setTimeout")}, 0)
    (function(){console.log(2)})()
```javascript
   (function () { console.log(1) })()
  for (var i = 0; i < 1000; i++) {
    console.log(i)
  }
  setTimeout(function () { console.log("setTimeout") }, 0)
    (function () { console.log(2) })()

```

