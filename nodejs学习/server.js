const http = require('http')

// https://www.ibm.com/developerworks/cn/linux/l-cn-edntwk/index.html
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': "text/plain" })
    res.end("hello world")
}).listen(3000, '127.0.0.1')
console.log("listening...")


// 非阻塞式I/O模型、异步与事件驱动  http://blog.huanghanlian.com/article/5c743905f9e4f842c4a3ff7f
/*
并非如此，虽然Nodejs线程不会被任何IO延迟所阻塞，普通的代码也可以迅速的被执行掉，但是不要忽略一个关键，虽然普通的计算代码可以迅速被执行掉，但如果用户的请求需要经过复杂的计算才能得出结果呢？大量计算所造成的阻塞是无法逃避的，
虽然这样的情况很少出现在Web请求中，但如果存在，那么Nodejs的单线程将疲于执行复杂的计算而无法处理后续的请求。对于这样的情况应该使用多线程分别去处理不同的请求，多线程也更容易充分利用多核处理器的运算能力。但Nodejs只有一个线程啊，
至少在不依赖特定的第三方包时是这样的，
这时前面被我们鄙视千百回的Apache服务器就可以扳回一局了。
*/

// 什么是事件驱动  比如文件的读取完成和中断就是一个事件


