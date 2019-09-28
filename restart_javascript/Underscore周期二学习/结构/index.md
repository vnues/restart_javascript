### 迭代方法

```javascript
function test(a) {
  var undefined = 1;
  console.log(undefined); // => 1
  if(a===undefined) {
    // ...
  }
}
```
可以看到，undefined 被轻易地修改为了 1，使得我们之后的对于 undefined 理解引起歧义。所以，在 JavaScript 中，把 undefined 直接解释为 “未定义” 是有风险的，因为这个标识符可能被篡改。

> 在 ES5 之前，全局的 undefined 也是可以被修改的，而在 ES5 中，该标识符被设计为了只读标识符, 假如你现在的浏览器不是太老，你可以在控制台中输入以下语句测试一下
```javascript

undefined = 1;
console.log(undefined); // => undefined

```

轻量版本的可以进行debug  也容易打断点

reduce() 方法对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。  意思是满足混合成单值就行

用来组合函数好像不错



突然想到函数式编程有这么些概念 纯函数 惰性函数  闭包  高阶函数等等


觉得到时候很有必要再重开总结归纳一波函数式编程  面向对象编程 里面有什么概念  好  先慢慢收集笔记吧

https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch5.html --->这份文档确实总结的不错 函数式编程



reduce传入的函数 必须具有合并的能力 ---- 理解这点很重要


看下组合函数在reduce的应用

indexOf() 方法返回调用  String 对象中第一次出现的指定值的索引，开始在 fromIndex进行搜索。

### 详解函数的参数

```javascript
   function cb(a,b,c,d){
      console.log(a) // 1
      console.log(b) // 2
      console.log(c) // 3
      console.log(d) // undefined  没有报错

   }
   cb(1,2,3)
   // 说明函数参数是事先声明好的函数遍历cb(1,2,3)是给函数参数赋值并执行函数
   // typeof undefined // undefined
```

some() 方法测试是否至少有一个元素可以通过被提供的函数方法。该方法返回一个Boolean类型的值。

这里用到undefined的判断真的很多

_.some(list, [predicate], [context])
some迭代函数如果不传 predicate 则默认也有处理的函数 



迭代函数  ---->  肯定有对应的处理的回调函数



函数式编程实现一切需求

Array(5) ====》这种定义数组长度的方法

闭包会使内存泄漏吗
