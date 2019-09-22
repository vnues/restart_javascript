function Foo() {
this.name = "vnues";
Foo.b = function() {
console.log("b");
};
Foo.a = function() {
console.log(1);

};
this.a = function() {
console.log(2);
};
}
Foo.prototype.a = function() {
console.log(3);
};
Foo.a = function() {
console.log(4);
};

Foo.a();
let obj = new Foo(); // this 指向 被这样了 Foo.a.bind(obj) 所以我们理解的 this 还是没错而且还执行了 Foo()
// 注意这里打印出来的 obj 没有
console.log(obj);
obj.name = "vnues";
obj.a();
Foo.a();
对于每个执行上下文，都有三个重要属性：

变量对象(Variable object，VO)
作用域链(Scope chain)
this

执行上下文的代码会分成两个阶段进行处理：分析和执行，我们也可以叫做：

function bar() {
a = 1; // 相当于 window.a=1
console.log(a);
}
bar(); // ???
console.log(a)

执行环境(execution context，为简单起见，有时也称为“环境”)是 JavaScript 中最为重要的一个概 念。执行环境定义了变量或函数有权访问的其他数据

执行环境即执行上下文 执行上下文就是我们说的 js 引擎解析和执行代码是一段一段的 并不是一行一行顺序执行 这个一段一段就是我们说的执行上下文

执行环境或者说执行上下文有三个重要的属性
变量对象(Variable object，VO)
作用域链(Scope chain)
this

执行上下文或者执行环境定义了变量或函数有权访问的其他数据

在这个执行上下文中 js 引擎先去分析 通过对象变量查看是否有变量提升或者变量提升等

全局对象是预定义的对象，作为 JavaScript 的全局函数和全局属性的占位符。通过使用全局对象，可以访问所有其他所有预定义的对象、函数和属性

这段话的意思是因为有对象变量才能知道提升吗 对 https://www.jianshu.com/p/330b1505e41d

this 的是引用

JavaScript 代码的整个执行过程，分为两个阶段，代码编译阶段与代码执行阶段。编译阶段由编译器完成，将代码翻译成可执行代码，这个阶段作用域规则会确定。执行阶段由引擎完成，主要任务是执行可执行代码，执行上下文在这个阶段创建。
js 执行代码 -->编译==》执行==》执行上下文==》先解析===》再执行可执行的代码

有点绕

如果你在函数的执行上下文存在引用了这个函数 那么这个执行上下文的变量对象也会被保留下来
不会被 gc 回收

函数调用栈

在 JavaScript 中，理解队列数据结构的目的主要是为了清晰的明白事件循环（Event Loop）的机制到底是怎么回事。在后续的章节中我会详细分析事件循环机制。

JavaScript 的执行上下文生成之后，会创建一个叫做变量对象的特殊对象（具体会在下一篇文章与执行上下文一起总结），JavaScript 的基础数据类型往往都会保存在变量对象中。

a=value
value 是值
a=null 释放值 就会被回收 我们说的回收实际就是回收值
引用类型实际就是个地址 指向 值
而 a 是个标记标识符 回收值才是释放内存的 通常说的回收变量 a 就是回收它这个值 --- 这个得好好认清楚

在局部作用域中，当函数执行完毕，局部变量也就没有存在的必要了，因此垃圾收集器很容易做出判断并回收。但是全局变量什么时候需要自动释放内存空间则很难判断，因此在我们的开发中，需要尽量避免使用全局变量。

在学习内存空间之前，我们需要对三种数据结构有一个直观的认知。他们分别是堆(heap)，栈(stack)与队列(queue)。

内存有堆内存栈内存等 堆内存栈内存等 是一种数据结构

与其他语言不同，JS 的引用数据类型，比如数组 Array，它们值的大小是不固定的。引用数据类型的值是保存在堆内存中的对象。JavaScript 不允许直接访问堆内存中的位置，因此我们不能直接操作对象的堆内存空间。在操作对象时，实际上是在操作对象的引用而不是实际的对象。因此，引用类型的值都是按引用访问的。这里的引用，我们可以理解为保存在变量对象中的一个地址，该地址与堆内存的实际值相关联

因此在一个 JavaScript 程序中，必定会产生多个执行上下文，在我的上一篇文章中也有提到，JavaScript 引擎会以栈的方式来处理它们，这个栈，我们称其为函数调用栈(call stack)。栈底永远都是全局上下文，而栈顶就是当前正在执行的上下文

--- 函数调用栈

为什么出现栈的概念-->内存

以栈的方式去管理上下文

js 普通对象的 this 和函数对象的 this
let a={
name:string
fn:function(){console.log(this)}
}

为什么闭包的变量 a 还存在 //是因为 A 函数栈还没有被弹出回收吗 不是的是弹出了？？？已经弹出的
然后根据作用域链去找对应的变量 这下就清楚啦 ---闭包变量 a 没有被清除

因此在一个 JavaScript 程序中，必定会产生多个执行上下文，在我的上一篇文章中也有提到，JavaScript 引擎会以栈的方式来处理它们，这个栈，我们称其为函数调用栈(call stack)。栈底永远都是全局上下文，而栈顶就是当前正在执行的上下文。

闭包用于模块化和柯里化

内存有栈内存 堆内存 等 栈内存 堆内存又是一种数据结构

内存的管理机制 ---> gc 垃圾回收机制 自动回收

用 word 打开 pdf 效果更好

上下文的生命周期:创建周期+ 执行周期
执行周期 --->this 就是在这里被确定的 this 也是个引用
执行阶段 --> VO --> AO
function sound(name,age){
console.log(arguments)
}

sound("vnues","age")

## 变量对象的创建，依次经历了以下几个过程

1. Chrome 浏览器中，变量对象会首先获得函数的参数变量及其值；在 Firefox 浏览器中，是
   直接将参数对象 arguments 保存在变量对象
2. 依次获取当前上下文中所有的函数声明，也就是使用也 nctio 关键宇声明的函数 在变量
   对象中会以函数名建立一个属性，属性值为指向该函数所在的内存地址引用 如果函数名
   的属性已经存在，那么该属性的值会被新的引用覆盖
3. 依次获取当前上下文中的变量声明，也就是使用 var 关键字声明的变量 每找到 个变量声
   明，就在变量对象中就以变量名建立一个属性，属性值为 undefined 如果该变盐名的属
   已经存在，为了防止同名的函数被修改为 undefined ，则会直接跳过，原属性值不会被

作用域与执行上下文的关系
作用域是个概念 跟上下文没多大关系 但是作用域链的形成和产生跟执行上下文有超级大的关系
从执行上下文的生命周期可以看到它的重要性，其中涉及了变量对象、作用域链、 this 等许
重要但并不那么容易搞清楚的概念，这些概念有助于我们真正理解 JavaScript 代码的运行

ES6 以前， ECMAScript 没有块级作用域，因此使用时需要特别注意，一定是在函数环境
才能生成新的作用域，下面的情况则不会有作用域的限制
举个例子：

```javacript
   function a(){
     let a=1
      for(let i=0;i<10;i++){
         console.log(i)
      }
   }
```

分析:
这里 a 与 for 循环的块行成新的作用域 而 let a 的变量作用域就是函数 a 的作用域 这样的声明没有形成新的 所以说可能

模拟块级作用域：
立即执行函数模拟块级作用域
(function(){})()
原理解释下就是立即执行函数也是个函数 其他函数想访问它的变量和方法是访问不到的 但是它自己可以暴露出来 用 window 添加属性暴露出来

作用域链与执行上下文的关系:

作用域链（ Scope Chain ）是由当前执行环境与上层执行环境的一系列变量对象组成的，它保
证了当前执行环境对符合访问权限的变量和函数的有序访问

闭包和执行上下文的关系:
先来学习下调试:
debugger

```javascript
var fn;
function foo() {
  var a = 2;
  debugger;
  function baz() {
    console.log(this);
    console.log(a);
  }
  fn = baz; // 存在引用
}
function bar() {
  fn();
}
foo();
bar();
```

注意：这里的 this 指向显示为 Object 或者 Window，大写开头，他们表示的是实例的构造函数，实际上 this 是指向的具体实例

## closure 闭包

断点 breakPoint 浏览器调试工具上看的 在那处打断点

首先应该得清楚一点 变量是在变量对象里的

chorme 浏览器中的 local 表示是现在正在执行的函数栈

这个 debug 可以让我看到一个函数执行上下文的时候 this 以及闭包 当然 debug 还可以让我清楚的看到我在执行哪个函数

debugger 字段 的作用是快速定位执行的代码块 实际监控运行我们得通过打断点 ---> 这个理解很重要

也就是你如果可以定位要调试的代码块 我们可以不用写 debugger 字段

anonymous -- 匿名

所以闭包还有形式 就是引用

可惜 debug 看不到作用域链 实际也是词法作用域已经规定了访问权限啦 写代码的时候自己就应该意识到

如果想在所有的地方都能访问同 个变量，那么应该怎么办呢？在实践中这种场景很多，比
如全局的状态管理

但前面我们介绍过，在实际开发中，不要轻易使用全局变量，那又该怎么办呢？模块化的思维
能够帮助我们解决这个问题

GOF 里的 23 种设计模式, 也是在软件开发中早就存在并反复使用的模式. 如果程序员没有明确意识到他使用过某些模式, 那么下次他也许会错过更合适的设计 (这段话来自《松本行弘的程序世界》).

还有一点就是你使用到了立即执行函数来模块化 但是普通函数实际也行 的 因为都是函数 写法不一样而已 记住这种情况

单例模式：保证一个类仅有一个实例，并提供一个访问它的全局访问点
单例模式是一种常用的模式，有一些对象我们往往只需要一个，比如线程池、全局缓存、浏
览器中的 window 对象等。在 JavaScript 开发中，单例模式的用途同样非常广泛。试想一下，当我
们单击登录按钮的时候，页面中会出现一个登录浮窗，而这个登录浮窗是唯一的，无论单击多少
次登录按钮，这个浮窗都只会被创建一次，那么这个登录浮窗就适合用单例模式来创建

还有一点你要把 return 也当做一种引用的形式 ---->很重要！！！

```javascript
function b() {
  console.log("ok");
}
function a() {
  return b; // 还有一点你要把 return 也当做一种引用的形式 就是等同于 全局定义个 let c =b // 这种是正常引用
}
let c = a;
```

nstance ---实例的意思

## 透明的单例模式

```javascript
var CreateDiv = (function() {
  var instance;
  var CreateDiv = function(html) {
    if (instance) {
      return instance;
    }
    this.html = html;
    this.init();
    return (instance = this);
  };
  // 这里有一个问题 可以写成this.init=function(){}因为也是会继承下来的  不过每次new一次就会拷贝一份吗 ？？就是浪费内存对吗？ 得还是看看new到底怎么继承  来验证一下
  CreateDiv.prototype.init = function() {
    var div = document.createElement("div");
    div.innerHTML = this.html;
    document.body.appendChild(div);
  };
  return CreateDiv; // 这是个引用 就考虑是不是闭包了
})();
var a = new CreateDiv("sven1");
console.log(a);
var b = new CreateDiv("sven2");
alert(a === b); // true
```

## 不用原型

```javascript
var CreateDiv = (function() {
  var instance;
  var CreateDiv = function(html) {
    if (instance) {
      return instance;
    }
    // 突然想到与CreateDiv.init的区别 等下来实验下
    // this为什么可以添加属性 因为this指向的是对象 对象当然可以this.a --->很重要 实际最后就是相当于a.a
    // 但是this可以被替代 替代成别的对象但是你写错CreateDiv.a 那就没有this什么事啦
    this.html = html;
    this.init = function() {
      console.log(this);
      var div = document.createElement("div");
      div.innerHTML = this.html;
      document.body.appendChild(div);
    };
    this.init();
    return (instance = this);
  };

  return CreateDiv;
})();
var a = new CreateDiv("sven1");
console.log(a);
var b = new CreateDiv("sven2");
alert(a === b); // true
```

## 用 CreateDiv 代替 this?

```javascript
var CreateDiv = (function() {
  var instance;
  var CreateDiv = function(html) {
    if (instance) {
      return instance;
    }
    this.html = html;
    // 写外面写里面一样的效果 只要执行就行
    // 虽然效果出来 但是还是有差异的
    CreateDiv.init = function() {
      console.log(this); //注意这个this是代表构造函数了
      var div = document.createElement("div");
      console.log(this.html);
      div.innerHTML = this.html; //  this.htm拿不到 报undefined
      document.body.appendChild(div);
    };
    CreateDiv.init();
    return (instance = this);
  };
  return CreateDiv;
})();
var a = new CreateDiv("sven1");
console.log(a);
var b = new CreateDiv("sven2");
alert(a === b); // true
```

在 js 面向编程中 尤其是构造函数 或者类 我们希望的是这个 this 指向这个实例化对象 由 new 实现
我们只要看看判断 this 是不是指向实例化对象 ---- 这个理解很重要！！！

Animal.call(animal) 这个形式也是调用函数的一种形式 只不过改变 this 指向 -- 很重要

## 单例模式与模块化

每个单例就是一个模块
每个模块都是由对象创建 而且模块是唯一证明到对象是唯一的 也就是符合了单例的唯一特点，剩下利用闭包提供全局可访问接口

## this

this 的确立
当前函数的 this 是在数被调用执行的时候才确定

有价值的东西来啦 函数调用有独立调用还有调用者调用
如果是独立调用下非严格模式下指向 window 严格模式指向 undefined
如果是调用者就指向调用者 原先用执行上下文判断也不正确

```javascript
var a = 20;
function foo() {
  var a = 1;
  var obj = {
    a: 10,
    c: this.a + 20
  };
  return obj.c;
}
debugger;
console.log(window.foo()); // 40
console.log(foo());
```

对象字面量的写法并不会产生自己 作用 ，
问题一：理解对象字面量的写法并不会产生自己 作用 ，问题二 this 跟作用域有何关系
问题二是这样分析的如果产生新的作用域，那么说明就是创建了一个新的上下文 哪么就是产生 this 这就是 this 跟作用域
问题一：函数内还是可以通过 obj.a 访问属性 并没作用域 就跟 let b=1 这样的变量类型

开发中借助 debug 查看 this 是很好的效果

eval

```javascript
let a = [1, 2];
function b(num1, num2) {
  console.log(num1 + num2);
}
eval("b(" + a + ")");
```

##客户端和服务器
我们所说的客户端就是我们的网页浏览器（还有 app 的也是客户端 但原生 app 不是浏览器没有同源策略限制的），那么客户端是如何与服务器通信的呢 比如你输入https://www.baidu.com 那么就是客户端去请求这个接口 接口返回所需要的数据 你打开控制随便点开一个文件都是 get 200 这都是请求过来的
而不是我们浏览器就有的 这一点得认清楚 这就是客户端和服务端的区别
而你别认为客户端其实也是个服务端 以前这种模糊的说法是错误的
同源策略是针对于浏览器的

同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的重要安全机制。

## 同源策略的实质

浏览器的同源策略我可以这样理解：就是我客户端(这里指单个浏览器窗口)请求了 A 服务器通信 （这里 🤝 握手然后浏览器窗口就是这个源了） 然后又想跟 B 服务通信 但是 A 和 B 在不同的域 这样产生了跨域 源的不同是浏览器现在 A 基础上做了通信 认为这个源就是 A 不允许再与其他的服务端做通信了不然 A 和 B 就不同了

这个是彻底的认清楚 你要认为的一点 前端页面代码在服务端 客户端通过通信拿到这个文件在它哪里进行编译执行
还有一点就是 webpack 起的也是服务 你可以认为 webpack 起的就是服务端的 因为你 webpack 就是 Node 服务
你访问 localhost:8080 跟 www.baidu.com 一样 localhost:8080 你把它认为也是一个网址也行了

综合以上知识点 你再来看看为在本地文件写了 ajax 请求以 file 文件比如：file:///Users/vnues/restart_javascript/restart_javascript/%E5%8D%95%E4%BE%8B%E5%92%8C%E6%A8%A1%E5%9D%97%E5%8C%96/index.html

这样的怎么发送不了 ajax 请求 ajax 请求百度的接口 你觉得会报什么错误 跨域

为什么报跨域 浏览器这样认为 file:///Users/vnues/和 https://localprod.pandateacher.com不是同个域 不不不
本地打开的我认为应该是跟本地服务器握手
本地文件就是在电脑这个服务器下，所以页面可以打开
因为电脑的服务器与代码在一个源里

浏览器输入 url 握手的服务器是什么，就表示她确定了同源

你打开访问百度，是因为浏览器与远程的百度的服务器握手了

也就是说浏览器现在确定了跟百度是一个源了

这才是浏览器的同源策略

你以为 lclahost:8080 就是前端 然后前端跟 local.prod....请求
不不不不是这样的
实际上我们开了服务 localhost:8080 浏览器请求这个地址 拿到 这个数据

```javascript
var xhr = new XMLHttpRequest(),
  method = "GET",
  url = "https://localprod.pandateacher.com/goals-lab/gitlab-api/goals/project_cycles";

xhr.open(method, url, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
xhr.send();
```

```HTML
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body></body>
  <script >
       var xhr = new XMLHttpRequest(),
  method = "GET",
  url = "https://localprod.pandateacher.com/goals-lab/gitlab-api/goals/project_cycles";

xhr.open(method, url, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
xhr.send();

   </script>
</html>

```

这样子直接在本地打开 file 路径就会报跨域 401 不理它
这个时候就是浏览器窗口跟我们本地服务器是同个域了 得看看四次握手 🤝？

本地起个 node 服务

我觉得 postman 的本质就是一个服务 才不会有跨域的限制
发送请求客户端可以干 服务器也可以干

关于 http 网络知识层面放到 golang 后面去学 现在还没有必要 优先级不高 先搞好前端 --之所以需要学习 刚刚那种四次 握手 完全看不懂

”天龙八步“细说浏览器输入 URL 后发生了什么 - https://www.xuecaijie.com/it/157.html#1Q64p5DeC8dKFF
我们在浏览器输入网址，其实就是要向服务器请求我们想要的页面内容，所有浏览器首先要确认的是域名所对应的服务器在哪里。将域名解析成对应的服务器 IP 地址这项工作，是由 DNS 服务器来完成的。
这就为啥本地可以起假的百度网址 以前用 PHP 工作室弄的时候就是这个原理
客户端收到你输入的域名地址后，它首先去找本地的 hosts 文件，检查在该文件中是否有相应的域名、IP 对应关系，如果有，则向其 IP 地址发送请求，如果没有，再去找 DNS 服务器。一般用户很少去编辑修改 hosts 文件。

## 我的学习方法

1.学这个知识点干什么 2.不懂什么（具体的） 3.还有学习方法 文档方法 pad 文档打开 舒适的看很重要 --->注释 --->然后实际做笔记 或者草稿 （便利工具的使用）这才是高效的学习方法

2.学一个东西，先为了用它而用它 到后面自然而然我就知道怎么去使用它了 就像是 aync/await 也就是你就算知道但是不去使用也很快忘记的
