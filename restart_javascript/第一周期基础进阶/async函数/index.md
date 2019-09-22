## Async 函数

一比较就会发现，async 函数就是将 Generator 函数的星号（\*）替换成 async，将 yield 替换成 await，仅此而已。

## Generator 函数

Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。本章详细介绍 Generator 函数的语法和 API，它的异步编程应用请看《Generator 函数的异步应用》一章

## Generator 函数---遍历器生成函数

上一章说过，任意一个对象的 Symbol.iterator 方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象。

由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的 Symbol.iterator 属性，从而使得该对象具有 Iterator 接口。

## Iterator（遍历器）也叫迭代器吧
