### 再谈闭包

很多时候我们会写着写着就会写出闭包 但是我们可能没有注意 所以来补充下

第一步外部的引用：如果你一个内部对象函数存在 return 一个函数或者对其有引用这个函数 以供外部使用的 那么就要看看这个是不是闭包了 通过判断第二步：判断是否使用父级函数或者对象的变量

`注意了只有外部有引用才会发生闭包操作！！！ 所以我们使用函数时候看看是否是对象（函数也是对象）的函数 的引用 如果是再分析第二部来确定闭包 ！！！很重要`

## 函数绑定 bind

> 有时候我们希望绑定 this
> 函数绑定要创建一个函数，可以在特定的 this 环境中以指定参数调用另一个函数，该技巧常常和回调函数与事件处理程序一起使用

来看有趣的现象

### 箭头函数绑定 this

```javascript
var handler = {
  message: "Event handler",
  handlerClick: function(event) {
    console.log(this); // window对象  也没错   注意this是动态绑定的 不是像词法作用域那样 声明了就定在那里

    alert(this.message);
  }
};
var bth = document.getElementById("my-btn");
EventUtil.addHandler(btn, "click", function(event) {
  handler.handlerClick(event);
});
```

## this

this 很多时候我们想代表自身这个对象 有这种理解意思 但它是动态绑定的 并不是像词法作用域那样就知道了 this 指向

为什么说是动态的
`只有在被调用的时候这时候才确定this是什么指向谁`

## 闭包绑定 this

> this 本来就是变量 所以闭包保存变量保存 this 就没有那么难了

❗️❗️❗️this 实际就是一个变量 而且运行才确定值（确定指向）

除了 call apply bind new 来操作 this 闭包也可以 因为闭包保存变量 this 实际就是个变量 -----> 脑海记住 this 和 this 操作的几种方式啊 ❗️❗️❗️

handler.handlerClick(event); // 这个也是一个闭包 同时也表示 handler 对象调用 handlerClick(event)方法 所以 this 这时候指向就是 handler

注意到了一点就是重要的 this 是动态绑定的 也就是只有运行时候才绑定上去 ！！！！！！

##箭头函数
箭头函数的没有 this 所以内部 this 指向上一级环境

### EventUtil 扩展

前言：什么是 EventUtil？
在 JavaScript 中，DOM0 级、DOM2 级与旧版本 IE(8-)为对象添加事件的方法不同

为了以跨浏览器的方式处理事件，需要编写一段“通用代码”，即跨浏览器的事件处理程序

习惯上，这个方法属于一个名为 EventUtil 的对象

编写并使用该对象后，可保证处理事件的代码能在大多数浏览器下一致的运行

本文将围绕着 EventUtil 对象展开，并提供该通用对象代码以作参考分享

文章主要内容参考书籍为《JavaScript 高级程序设计》（[美]Nicholas C.Zakas）
https://www.cnblogs.com/hykun/p/EventUtil.html
