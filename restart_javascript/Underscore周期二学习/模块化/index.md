```javascript
(function(window){
	//代码 
	window.jQuery = window.$ = jQuery;//通过给window添加属性而暴漏到全局
})(window);
```
虽然jQuery的风格灵活，写法简单，但是并未从根本上解决模块化本身需要解决的问题

如何优雅封装代码不污染并优雅地将API暴露出去
如何唯一标志一个模块并优雅地导入进行使用



这只是模块化中的一个雏形


为了解决这些问题，Commonjs社区的很多大神们开始了他们的不懈地努力和探索（这里应该向前辈们致敬）

    这段历史的节点出现在了2009年的一个很平常的一天，nodejs横空出世了，人们终于可以用JavaScript来写服务器代码了，为了能使node更好地进行服务器端的开发，随之附带的JavaScript服务器端开发模块化开发规范Commonjs也在社区大神们的研究下随之诞生了，JavaScript进入了全栈语言以及模块化开发的时代。从那时起在服务器端或者本地化开发我们定义模块以及导入模块的方式开始变成了这样



//a.js
    export.a = function(){
        console.log('module a');
    }
    
    //b.js
    var a = require('a');
    export.b = function(){
        a.a();
        console.log(module b);

> 注意了为什么我们前端项目中可以使用require module.exports 那是因为前端项目处于webpack中也就是Nodejs环境 当然可以使用Commonjs规范   讲清楚  要彻底明白自己的前端项目处于什么环境中，为什么可以运行localhost:8080  这个就是位于一个node服务中了  webpack的作用就是打包构建   注意打包  


但是，这个规范只适用于nodejs服务器端的模块化开发，在浏览器端是无法直接使用的（主要是服务器加载是同步的，浏览器加载是异步的）； 那浏览器端怎么办呢?社区大神们很快意识到这也是个急需待解决的问题，经过又一段规范研究制定的艰辛历程，AMD/Requirejs异军突起，逐渐被广大开发者认可，但是因为Requirejs一开始存在的一些问题，如预先执行，模块依赖写法冗余等问题，后期更好的浏览器模块化方案CMD/Seajs成为后起之秀，也就是我们国内大神玉伯的产品，开始流行起来，后期RequireJs也进行优化，就造就了两雄争霸的局面，至此到2015前，JavaScript流行的浏览器端模块化开发方式类似下面这样


 历史的年轮总是向前推进，官网的EMAC看到社区大神们吵得如火如荼，也开始有所行动并制定了属于官方的模块化方案，并在2015年6月发布了ES6的正式版本，但是这个标准还只是雏形，只是定义了模块的如何加载/执行的内容，所以我们现在使用过程中需要将其转换为ES5才能进行运行，不过从此我们就模块化开发的方式又多了一种选择import/export。


简单了解了JavaScript模块化的历史发展进程，下面就可以更好地理解import/export以及require/exports（注意这个s）之间的区别了。


"野生"规范 与 正统规范
    两种方式的第一个区别就是规范的出处不同，其实这种区别我们从上面的历史简览就可以看出“野生”规范以及正统规范的意义，require/exports从2010年前后nodejs开始发布之后，在JavaScript的Commonjs社区中的开发者自发草拟的规则，后期逐渐成为大家公认的事实上的标准，一直沿用至今，不过随着ES6的发布，正统的模块化规范被提出，前者的使用也是有在被渐渐替代的趋势，随着ES6模块化标准的完善以及各大浏览器厂商对ES6的支持度的不断攀升，相信不久将来作为正统的import/export就会替代“野生”的require/export,不过当前因为有webpack,babel等模块化管理以及ES转换工具，所以目前来说两种方式的写法同样流行并可以并行存在，在使用感知上并不存在明显的区别。


在index.html你拿不到require的  只有node环境才有 那么浏览器端要怎么操作呢


模块化的核心就是能提供导入导出  一个js文件引入另一个js文件  而不是通过HTML页面的script标签 还得依赖顺序的

这就是我们要理解为什么使用模块化


来看看浏览器是怎么使用模块化的吧


另外学好nodejs现阶段更重要 go先放下 反正有学mysql不亏 爬虫思想在哪里了  语法差异而已

为什么先把Node搞完  就目前分析的来说 我已经需要用到它的知识 而且webpack就是node起的服务 想学好webpack就把node搞好



CommonJS规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD规范则是非同步加载模块，允许指定回调函数。由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用AMD规范。

https://justineo.github.io/singles/writing-modular-js/
https://requirejs.org/

Commonjs Requirejs

注意叫法  CommonJs规范 Node环境

CMD Seajs AMD Requirejs   要用这个规范就使用了到对应的库 （seajs,Requirejs）  ----> 现在才是真正意义上的了解  反正这两个已经不用了

而看Node和commonjs的发展历史  node已经内置支持Commonjs所以才不用引入
> 为了能使node更好地进行服务器端的开发，随之附带的JavaScript服务器端开发模块化开发规范Commonjs也在社区大神们的研究下随之诞生了

2009年，美国程序员Ryan Dahl创造了node.js项目，将javascript语言用于服务器端编程。
这标志”Javascript模块化编程”正式诞生。前端的复杂程度有限，没有模块也是可以的，但是在服务器端，一定要有模块，与操作系统和其他应用程序互动，否则根本没法编程。
node编程中最重要的思想之一就是模块，而正是这个思想，让JavaScript的大规模工程成为可能。模块化编程在js界流行，也是基于此，随后在浏览器端，requirejs和seajs之类的工具包也出现了，可以说在对应规范下，require统治了ES6之前的所有模块化编程，即使现在，在ES6 module被完全实现之前，还是这样。

https://zhuanlan.zhihu.com/p/32112925


es6推出了模块化写法

来实验下吧

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <script>
      import {c} from "./c.js";
       window.alert(c)
      console.log(c)
  </script>
</body>
</html>
```
显然在浏览器中是不支持的 

实际上我们在babel这样输入
import {d} from './d.js'
编译后的结果为
var _d = require("./d.js");

export const a ={name:"vnues"}

var a = {
  name: "vnues"
};
exports.a = a;

编译成commonJS规范 这是为啥 这明明是node服务端的支持 关我们在浏览器端的什么关系


首先我们得清洗掉这个概念 就是前端====浏览器


前端项目的构建依赖weboack webpack起的服务是Node服务


依靠它帮我们找到依赖关系然后引入  这一步在编译打包都会进行  

这时候打包出来的项目webpack已经把依赖文件都自动弄好了 而不是你认为打包好后出来的dist文件还有require自动  这样去执行 ---->实际不是的 打包后的已经都引好了   ----->这一点想好  浏览器是通过script标签加载执行脚本的  我们最后的字段绝对是这样  而且 我们的浏览器端没有require这样的方法 --->所以打包是已经安排好了引入关系 所需依赖

## 什么是打包？
这个概念
https://www.zhihu.com/question/30220505

这就更加证实了我的说法   打包这一步就是已经把所有的依赖都弄好了 打包后运行的代码绝对是没有require这种语法  node已经根据这个语义把依赖都弄好了  我们浏览器直接运行就行  你以为像浏览器遇到require语法就去找 这一步是通过webpack (node)帮我们的    而且我们开发阶段实际也是运行的（类似打包文件的）很明显一点
浏览器客户端运行打包后的文件  ---->认准这个  


#### webpack干了什么

想想在没有webpack中 我们的项目都是file打开的网页 而不是localhost:8080
图片的压缩就不说了
你不能在本地的html文件使用导入导出
因为浏览器不支持 你需要webpack帮你去找对应的依赖 
打包阶段把所有的依赖都弄好  就可以了

注意一点 打包后的文件跟你开发的文件完全不一样  webpack通过require去解析引入好文件  也就是打包后的文件是再也没有require的

这部分的认知得强调下



所以浏览器端可以借助node服务帮我们处理模块化  

❗️
❗️
❗️
❗️
打包好的文件是可以直接在浏览器运行 不需要任何环境 只需要客户端浏览器环境  ---> 注意这个认知

通过上面学习更加了解webpack



### 彻底搞清楚 exports module.exports

甚至了解模块化如何实现的

exports module.exports都是对象吧

因为模块化  node提供exports对象去完成模块操作

Node中，每个模块都有一个exports接口对象，我们需要把公共的方法或者字符串挂载在这个接口对象中，其他的模块才可以使用。

Node.js中只有模块作用域，默认两个模块之间的变量，方法互不冲突，互不影响，这样就导致一个问题，我们怎样使用加载进来的模块中的方法呢？这就需要在另外一个模块exports接口对象中挂载模块中公共的方法。

对于1中的例子，我们同样可以利用module.exports来写，只需把暴露的方式改成如下：



区别好一个问题 ：import require export export default module module.exports exports

先看是不是 es6模块化规范  还是commonjs规范再来比较
es6模块的实现应该不是requirejs 或者seajs
webpack 本身维护了一套模块系统，这套模块系统兼容了所有前端历史进程下的模块规范，包括 amd commonjs es6 等，本文主要针对 commonjs es6 规范进行说明。模块化的实现其实就在最后编译的文件内。

https://www.jqhtml.com/10110.html

### webpack打包问后的样子 --->如何实现模块化
https://juejin.im/post/5a2e5f0851882575d42f5609#heading-0


### node编译？



### Node.js模块里exports与module.exports的区别?

用一句话来说明就是，require方能看到的只有module.exports这个对象，它是看不到exports对象的，而我们在编写模块时用到的exports对象实际上只是对module.exports的引用。

https://www.zhihu.com/question/26621212

实际就是考引用的知识点

默认情况下 require只会引入module.exports的

而exports是对module.exports的引用  ---默认情况下

所以它们指向的内存都一样
但是exports=function(){}
函数是引用类型 所以指向的地址不一样了

还有你会觉得module.exports怪怪的 这样理解 mudule对象里面有个exports属性
这里的exports属性和exports对象没有任何联系

只是exports是module.exports的引用

有个问题 单单打印出来module是什么东西

```javascript
module.exports.a = { name: "vnues" };

console.log(module);

console.log(exports); // { a: { name: 'vnues' } }
console.log(module.exports);// { a: { name: 'vnues' } }

```

这样比较下就知道了 注意是默认  不是我们自己操作的

我现在想问的问题是module是啥 跟module.exports的区别

https://www.cnblogs.com/dolphinX/p/3485260.html
module 模块的意思 在nodejs中 一个文件就是一个模块    
反过来这样想：
用module对象表示一个js文件


注意错误的认知es6支持require 之所以会这样认为 他们不知道是起node服务
是webpack在安排
而不是你以前在写js就认为es6支持require ❗️❗️❗️


### 立即执行函数和模块化的关系

简单说：模块化的实现离不开立即执行函数


来看看模块化是怎么实现的
```javascript
(function(modules) {

  
  function __webpack_require__(moduleId) {
    var module =  {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    return module.exports;
  }

  return __webpack_require__(0);
})([
  (function (module, __webpack_exports__, __webpack_require__) {

    // 引用 模块 1
    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__c__ = __webpack_require__(1);

/* harmony default export */ __webpack_exports__["default"] = ('a.js');
console.log(__WEBPACK_IMPORTED_MODULE_0__c__["a" /* default */]);

  }),
  (function (module, __webpack_exports__, __webpack_require__) {

    // 输出本模块的数据
    "use strict";
    /* harmony default export */ __webpack_exports__["a"] = (333);
  })
]);


```


❗️❗️❗️module.exports也是个对象 require就是require这个对象



为什么使用
exports = module.exports = _ 呢？

这是因为在 nodejs 中，exports 是 module.exports 的一个引用，当你使用了 module.exports = function(){}，实际上覆盖了 module.exports，但是 exports 并未发生改变，为了避免后面再修改 exports 而导致不能正确输出，就写成这样，将两者保持统一。


地址解析
exports默认是module.exports的引用

module.exports-->ox123123
exports-->ox123123

module.exports=function(){}
===> module.exports--->ox2342342

早期版本exports

现在是module.exports


所以我们现在用的es6模块化是？
也会编译成Commonjs规范吗？ 这个问题得理清楚

在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性


实现es6的竟然还是Commonjs实现  babel编译就是这样

所以才为啥可以require   ---->本质原因

不要脑子里想着es6模块化由AMD实现

所以按道理我们用module导出的可以用import引入？
// 得经过babel编译
// import最终编译是require babel编译

```javascript
if (typeof exports != "undefined" && !exports.nodeType) {
    if (typeof module != "undefined" && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }
```
这个是开发版本的  if是判断node环境 else为浏览器环境这没错

❗️对  我们的脚手架就是一个webpack起的node服务 当然可以import 不信来验证下




 认知有错误吗

 es6模块化最后编译是

 我们希望我们也是支持import export但是浏览器不支持 
 通过module.exports实现？




```javascript
//config.js
module.exports = [
  {
    name: '首页',
    path: '/home'
  },
  {
    name: '同步页面',
    path: '/sync'
  }
]
// index.js

 //const config = require('./config.js')
import config from "./config.js"
console.log(config)
```

通过👆的代码我想验证的就是我们用module导出 支不支持import导入

等下来实验下

```javascript

// const config = require('./config.js')
import config from "./config.js"
import under from "./under.js"
console.log(config)
console.log(under)
console.log(under.each)
```
脚手架有babel 帮你配置了 所以支持import

但是浏览器什么时候支持import

还是那个问题 localhost:8080是运行完后打包后的
可以这样理解



但是为什么我在页面打印出module没有

react组件下

那是因为这个不是在node环境我知道了

webpack相当于是个脚本 把这些页面去编译  就是webpack服务 在编译这个页面  页面本身不是处于node环境


一搞清楚 文件是谁运行  浏览器对吧 当然没有module


那么为什么可以引入require 或者import export编译
webpack到底干了什么

前端为什么可以用module.exports  这点得知道


http://es6.ruanyifeng.com/#docs/module

好好分析


处于谁的环境
看谁在运行这个文件


我们上面分析的是对的 究其原因还是webpack到底干了什么

想想在前端项目为什么可以这样写

```javascript
//config.js
module.exports = [
  {
    name: '首页',
    path: '/home'
  },
  {
    name: '同步页面',
    path: '/sync'
  }
]
// index.js

 //const config = require('./config.js')
import config from "./config.js"
console.log(config)
```


我们看看别人的库怎么导出的 我猜估计是export就行 webpack会帮它编译的

果然是export

然后想想为什么是npm安装  逻辑理清楚了



处于谁的环境
看谁在运行这个文件
------>这句话很重要❗️❗️❗️❗️❗️


```javascript
if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _; // node环境 require  import xxxx....xxxx走这步
    } else {
        root._ = _; // script 
    }
```
注意这个文件我猜中间会经过webpack的运行  中间有一段是处于Node环境 所以require才可以用❗️❗️❗️❗️❗️ ----->我觉得这个说法错误的

但是最后输入localhosy:8080是过了中间最终的 浏览器执行的文件
所以是浏览器文件❗️❗️❗️❗️❗️


webpack是负责构建打包  反正不管什么 最后输出的文件浏览器是可执行的

至于webpack干了什么  想想 一个模块化的方法按道理是不是需要库的支持 早期是通过AMD CMD （浏览器端） 那么webpack构建完肯定也是引入类似的库（可能它里面内置了库）  这个工具可以输出很多库去实现模块化 但是webpack的的确确是个大型Node应用

所以原理啊 道理得清楚


论证

得看webpack


搜搜 impor编译后和commonjs的依赖

还有最重要的一点就是 require import 相当于你引入了所需代码


require怎么引入我所需的代码的？？？？？？值得深究
这样吗
```javascript
//a.js
module.exports = [
  {
    name: '首页',
    path: '/home'
  },
  {
    name: '同步页面',
    path: '/sync'
  }
]
//b.js
require.....
console.log("b.js")

👇
//b.js
 [
  {
    name: '首页',
    path: '/home'
  },
  {
    name: '同步页面',
    path: '/sync'
  }
]


console.log("b.js")

```

```javascript
// const a = module
console.log(module)
// console.log(a)
```

```javascript
// const a = module
console.log(module)
// console.log(a)
```
竟然有打印出来


用commonjs的方法去实现import export   --维超说的


### webpack开发环境和生产环境的区别




实现import export可以有多种形式



我想知道开发环境下webpack怎么运行的

怎么执行的


明天主要理解这个

不理解放到下次看webpack书籍也行

明天继续实现工具函数

先把暂时webpack不懂的搞清楚先 后面再抽出一个周期系统学

最主要的问题不懂的先理解完