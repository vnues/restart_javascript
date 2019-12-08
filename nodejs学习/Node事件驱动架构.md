Node中的绝大多数对象，比如HTTP请求，响应，流，都是实现了EventEmitter模块，所以它们可以触发或监听事件。

const EventEmitter = require('events');
能体现事件驱动机制本质的最简单形式就是函数的回调，比如Node中常用的fs.readFile。在这个例子中，事件仅触发一次（当Node完成文件的读取操作后），回调函数也就充当了事件处理者的身份。

让我们更深入地探究一下回调形式


想想golang的读取文件  好像直接返回读取的数据  并没有支持回调函数  回调算是js的特性了   -----> 突然开悟  这就是语言与语言之间的不同对比


# Node的回调

Node处理异步事件最开始使用的是回调。很久之后（也就是现在），原生JavaScript有了Promise对象和async／await特性来处理异步。

回调函数其实就是作为函数参数的函数，这个概念的实现得益于JavaScript语言中的函数是第一类对象(一等公民)。

`但我们必须要搞清楚，回调并不意味着异步。函数的回调可以是同步的，也可以是异步的。`

比如，下例中的主函数fileSize接受一个名为cb的回调函数。该回调函数可以根据判断条件来决定是同步执行还是异步执行回调。


```javascript
function fileSize (fileName, cb) {
  if (typeof fileName !== 'string') {
    return cb(new TypeError('argument should be string')); // 同步调用
  }
  fs.stat(fileName, (err, stats) => {
    if (err) { return cb(err); } // 异步调用
    cb(null, stats.size);        // 异步调用
  });
}
```

# EventEmitter模块

EventEmitter是促进Node中对象之间交流的模块，它是Node异步事件驱动机制的核心。Node中很多自带的模块都继承自事件触发模块。

概念很简单：触发器触发事件，该事件对应的监听函数被调用。也就是说，触发器有两个特征：

触发某个事件

注册／注销监听函数

