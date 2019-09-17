这个周期会给很多时间：

1.一是为了解决现在的技术痛点 不知道怎么写基础组件 2.而是为了 review 下 mv 框架底层实现逻辑,vue 现在就是选择入手的好框架 3.以前的技术基础博客沉淀

那么就开始学习 一步一脚印
''

babel 优先级比较高 先搞 babel

上面的配置中，只有两个预设，并没有使用插件。首先加上插件的配置。由于是在本地开发，插件直接写的本地的相对地址。

{
"presets": [
["es2015"],
["stage-0"]
],
"plugins":["./my-import-babel-plugin"]
}

在一个 function 类 看到 this.xxx 属性 第一反映就是要知道这个就是实例化具有的属性！！！

如贺老
贺师俊
所言，只有 UI 控件 才存在双向，非 UI 控件 只有单向。

对于非 UI 控件来说，不存在双向，只有单向。只有 UI 控件才有双向的问题。单向绑定使得数据流也是单向的，对于复杂应用来说这是实施统一的状态管理（如 redux）的前提。双向绑定在一些需要实时反应用户输入的场合会非常方便（比如多级联动菜单）。但通常认为复杂应用中这种便利比不上引入状态管理带来的优势。注意，Vue 虽然通过 v-model 支持双向绑定，但是如果引入了类似 redux 的 vuex，就无法同时使用 v-model。参见 https://github.com/vuejs/vuex/blob/master/docs/zh-cn/forms.md

作者：贺师俊
链接：https://www.zhihu.com/question/49964363/answer/118715469
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

双向数据绑定可以理解为双向数据流

Vue.js 一个核心思想是数据驱动。所谓数据驱动，是指视图是由数据驱动生成的，我们对视图的修改，不会直接操作 DOM，而是通过修改数据。它相比我们传统的前端开发，如使用 jQuery 等前端库直接修改 DOM，大大简化了代码量。特别是当交互复杂的时候，只关心数据的修改会让代码的逻辑变的非常清晰，因为 DOM 变成了数据的映射，我们所有的逻辑都是对数据的修改，而不用碰触 DOM，这样的代码非常利于维护

Vue.js 另一个核心思想是组件化。所谓组件化，就是把页面拆分成多个组件 (component)，每个组件依赖的 CSS、JavaScript、模板、图片等资源放在一起开发和维护。组件是资源独立的，组件在系统内部可复用，组件和组件之间可以嵌套

组件才具有生命周期这种概念

MVVM 全称是 Model-View-ViewModel

数据流是针对于数据流向来说

流向谁也是一个问题

view viewModel 这是目标 互相流向就是双向

changeMsg() {
this.message = 'Hello World!'
}
这种操坐事件的本质也是双向数据流用法？？？？？

v-model 本身就是个语法糖吧 这个我目前同意 🤝

目前我觉得 review vue 源码先自己手动实现个简单版本的就行

但是不可能像 underscore 那样全程跟进或者仔细 reivew

现阶段只能囫囵吞枣

Object.defineProperty(obj, prop, descriptor)

Object.defineProperty 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象，先来看一下它的语法：

比较核心的是 descriptor，它有很多可选键值，具体的可以去参阅它的文档。这里我们最关心的是 get 和 set，get 是一个给属性提供的 getter 方法，当我们访问了该属性的时候会触发 getter 方法；set 是一个给属性提供的 setter 方法，当我们对该属性做修改的时候会触发 setter 方法。

一旦对象拥有了 getter 和 setter，我们可以简单地把这个对象称为响应式对象。那么 Vue.js 把哪些对象变成了响应式对象了呢，接下来我们从源码层面分析

要有耐心

坚持就是一种耐心的体现

沉住气

死磕死磕住就有收获

entry(src/platforms/web/entry-runtime-with-compiler.js)

在 entry 中，覆盖了\$mount 方法。

挂载 compile，compileToFunctions 方法是将 template 编译为 render 函数
Vue.compile = compileToFunctions

至此，我们完整的过了一遍在 web 中 Vue 的构造函数的变化过程:

通过 instance 对 Vue.prototype 进行属性和方法的挂载。
通过 core 对 Vue 进行静态属性和方法的挂载。
通过 runtime 添加了对 platform === 'web'的情况下，特有的配置、组件、指令。
通过 entry 来为\$mount 方法增加编译 template 的能力。

这里知道为什么在 created 时候，没法操作 DOM 了吗？因为在这里，还没有涉及到实际的 DOM 渲染。

vue.esm.js

esm --> esmodule

预编译是值经过编译 tenplate 的才可以用这个框架
https://zhuanlan.zhihu.com/p/25486761?refer=think-in-vue

https://segmentfault.com/q/1010000009031588

vue.js ： vue.js 则是直接用在<script>标签中的，完整版本，直接就可以通过 script 引用。

vue.common.js :预编译调试时，CommonJS 规范的格式，可以使用 require("")引用的 NODEJS 格式。
vue.esm.js：预编译调试时， EcmaScript Module（ES MODULE)，支持 import from 最新标准的。

     //----------------------------------------------------------------------

vue.runtime.js ：生产的运行时，需要预编译，比完整版小 30%左右，前端性能最优
vue.runtime.esm.js：生产运行时，esm 标准。
vue.runtime.common.js:生产运行时，commonJS 标准。

src 下的文件一般不都是要经过编译的吗

我们一般用的是 build 过的

也就是在包下看到 package.json 的入口

```javascript
new Vue({
  el: "#app",
   data: {
    msg: 'Hello, Vue.js.'
  },
  components: {
    MyComponent
  }
});


new Vue操作data是个对象而
第二种写法为啥data是个函数并且return一个对象
作用域还有引用类型的原因
export default {
  name: "app",
  data(){
      return{}
  }
  components: {
    HelloWorld
  }
};


```

export default {} 跟 var vm = new Vue({})
完全不是同一回事.
前者是 es6 的 module 中的语法,后者是创建一个 vue 实例.
我想引起你的误解是因为你用了 webpack 开发 vue 同时用了 vue-loader.
其实这最终会通过 vue-loader 处理成原生 js 代码.即无论如何都要 new Vue()

在生成、导出、导入、使用 Vue 组件的时候，常常被位于不同文件的  new Vue()  和  export default{} 。

首先，Vue 是什么？ po 主的理解是 Vue 就是一个构造函数，生成的实例是一个巨大的对象，可以包含数据、模板、挂载元素、方法、生命周期钩子等选项。

所以渲染的时候，可以使用构造 Vue 实例的方式来渲染相应的 html 页面：

new Vue({
el: '#app'
...
})

那么 export default {} 又是？
    在复用组件的时候用到的。

假设我们写了一个单页面组件 A 文件，而在另一个文件 B 里面需要用到它，那么就要用  ES6 的 import/export 语法  ，在文件 A 中定义输出接口  export **，在文件 B 中引入  import **，然后再生成一个 Vue 实例  new Vue (\*\*)，把引入的组件用起来，这样就可以复用组件 A 去配合文件 B 生成 html 页面了。
    所以在复用组件的时候，export  和  new Vue  缺一不可。

```javascript
new Vue({
  el: "#app",
  // 也可以这样写?
  data() {
    return {
      msg: "Hello, Vue.js."
    };
  },
  components: {
    MyComponent
  }
});
```

为什么组件中的 data 必须是一个函数，然后 return 一个对象，而 new Vue 实例里，data 可以直接是一个对象？

因为组件是用来复用的，且 JS 里对象是引用关系，如果组件中 data 是一个对象，那么这样作用域没有隔离，子组件中的 data 属性值会相互影响，如果组件中 data 选项是一个函数，那么每个实例可以维护一份被返回对象的独立的拷贝，组件实例之间的 data 属性值不会互相影响；而 new Vue 的实例，是不会被复用的，因此不存在引用对象的问题。

作者：我是你的超级英雄
链接：https://juejin.im/post/5d59f2a451882549be53b170
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

也就是这么理解 export default 出去的是 vue 组件

new Vue 是实例不存在引用的情况所以 data 可以是对象

好 👌 这个作为面试题不错

那么问题来了 vue 组件和 vue 实例的区别

但是看 vue 官方文档说所有的 Vue 组件都是 Vue 实例
一般我把组件分为三种：

根组件，内部可以含有子组件，是整个组件树的最上层。
子组件，非最上层的组件，当然内部也可以包含更低层的子组件。
游离组件：通过 new Vue('').\$mount(xx) 的方式向组件树之外的 body 中挂载新的实例（很多通知、弹窗性的组件都是这么实现的），一般是临时性质的，内部可以包含子组件，但是只有简单的功能和结构，其实也是本身这个小组件树的最上层。

没有实质性的区别，一个组件就是一个 vue 实例，只不过大多数情况下作为组件的实例是父级组件来初始化的。硬要说组件特殊的地方，无非是组件的 data 是一个方法，因为组件可以被生成多次，如果使用一个对象的话那么这个对象将被所有组件实例共享。另外在 Vue 2 中引入了 Functional Component 的概念，Functional Component 不再是一个 vue 实例了，它只渲染视图而不能进行逻辑操作，类似于 Vue 1 中 partial 的概念。

要想弄清楚它就来试试 Vue 实例

我们不用脚手架来写 直接引入 vue.js 来写

如果你还在阅读，说明你使用了诸如 Babel 和 webpack 的模块系统。在这些情况下，我们推荐创建一个 components 目录，并将每个组件放置在其各自的文件中。

然后你需要在局部注册之前导入每个你想使用的组件。例如，在一个假设的 ComponentB.js 或 ComponentB.vue 文件中

```javascript
new Vue({
  el: "#app",
  components: {
    "component-a": ComponentA,
    "component-b": ComponentB
  }
});
```

组件实际可以理解成 Vue 实例

只不过你真要对比就是组件的 data 是个函数

而实例 Vue 是 data

这个的知识点对我们 debug 代码很有用

因为后面就是实例 Vue 和组件

我倒要看看这两者是如何实现的

我们的 src 的 vue 代码是要经过编译的 比如 flow 类型注解
肯定不会麻烦开发者还有帮你编译

vue 和 react 区别

vue 把东西都封装的很好让你用

而 react 是没有封装让你随心所欲去发挥

比如 vue 的 template 模板还要编译成 render 函数，虽然 vue 也提供了 render 函数给开发者使用

帮我们封装了这一层 封装太多的意图就是为了简化开发 但是难以发现问题

这是自己领悟的重要一点 ❗️❗️❗️

### process.env.NODE_ENV

这个用于判断打包构建运行的 一般是 webpack 起的服务就有这个变量

但是你如果去查看 buid 代码后 vue.js 是没有这个东西的

所以我们就理解成这个东西是用来判断所处于的环境就行 只要明白这点就行

还 🈶 注意什么情况下才会取到

### new Vue 发生了什么

Vue 初始化主要就干了几件事情，合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化 data、props、computed、watcher 等等。

❗️❗️❗️ 注意我们的用的包使用到底是什么文件 如果有 pakcage.json 就看它的入口

否则就是 index.js 作为入口这点认知很重要 决定你 debugger 有没有效果

### 数据如何渲染成 dom 的

接下来我们重点分析带 compiler 版本的 \$mount 实现，因为抛开 webpack 的 vue-loader，我们在纯前端浏览器环境分析 Vue 的工作原理，有助于我们对原理理解的深入。 --- 数据如何渲染成 dom 的

这段代码首先缓存了原型上的 $mount 方法，再重新定义该方法，我们先来分析这段代码。首先，它对 el 做了限制，Vue 不能挂载在 body、html 这样的根节点上。接下来的是很关键的逻辑 —— 如果没有定义 render 方法，则会把 el 或者 template 字符串转换成 render 方法。这里我们要牢记，在 Vue 2.0 版本中，所有 Vue 的组件的渲染最终都需要 render 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 el 或者 template 属性，最终都会转换成 render 方法，那么这个过程是 Vue 的一个“在线编译”的过程，它是调用 compileToFunctions 方法实现的，编译过程我们之后会介绍。最后，调用原先原型上的 $mount 方法挂载。

生命周期源码是怎么去实现的

监听触发

noop 编程界常用于表示空函数

Vue 的 watch 就是观察者模式

### Vue 的响应式系统

Vue 最独特的特性之一，是其非侵入性的响应式系统。数据模型仅仅是普通的 JavaScript 对象，而当你修改它们时，视图会进行更新，这使得状态管理非常简单直接，我们可以只关注数据本身，而不用手动处理数据到视图的渲染，避免了繁琐的 DOM 操作，提高了开发效率。

vue 的响应式系统依赖于三个重要的类：Dep 类、Watcher 类、Observer 类，然后使用发布订阅模式的思想将他们揉合在一起（不了解发布订阅模式的可以看我之前的文章发布订阅模式与观察者模式）。

Observe 是对数据进行监听，Dep 是一个订阅器，每一个被监听的数据都有一个 Dep 实例，Dep 实例里面存放了 N 多个订阅者（观察者）对象 watcher。

事件的设计模式本来就是发布和订阅

### 观察者模式（Observer Pattern）

观察者模式定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新。观察者模式属于行为型模式，行为型模式关注的是对象之间的通讯，观察者模式就是观察者和被观察者之间的通讯。

比如一个变量依赖于 c=a+b a 变化了 b 也应该响应变化 就是要考虑这种场景

设计模式之前用于面向对象的术语 ❗️❗️❗️

什么是收集依赖，通知观察者

Watcher 扮演的角色是订阅者/观察者，他的主要作用是为观察属性提供回调函数以及收集依赖（如计算属性 computed，vue 会把该属性所依赖数据的 dep 添加到自身的 deps 中），当被观察的值发生变化时，会接收到来自 dep 的通知，从而触发回调函数。，

normal-watcher
我们在 watch 中定义的，都属于这种类型，即只要监听的属性改变了，都会触发定义好的回调函数
computed-watcher
每一个 computed 属性，最后都会生成一个对应的 watcher 对象，但是这类 watcher 有个特点，我们拿上面的 b 举例：
属性 b 依赖 a，当 a 改变的时候，b 并不会立即重新计算，只有之后其他地方需要读取 b 的时候，它才会真正计算，即具备 lazy（懒计算）特性
render-watcher
每一个组件都会有一个 render-watcher, function () {↵ vm.\_update(vm.\_render(), hydrating);↵ }, 当 data/computed
中的属性改变的时候，会调用该 render-watcher 来更新组件的视图

访问对象属性时候 就会触发 get
修改就是 set

观察者模式和发布订阅模式最大的区别就是发布订阅模式有个事件调度中心。❗️❗️❗️

get---->收集依赖
set---->触发更新

触发更新我知道 收集依赖是什么 难道是收集那些订阅者 ❗️❗️❗️ 我觉得应该没错

为什么要收集依赖 因为比如 a 订阅了发布者 b 也订阅了发布者 但是 c 没有 c 是 a+b 这显然需要收集

我的理解就是这样继续深入学习了解

面试问：vue 中有收集依赖，但是在哪里收集依赖的？？
是执行 render 函数生产 vnode 的时候，这时候才触发 get

~~Vue 是一个实现数据驱动视图的框架~~（废话，大家都知道，说重点） 我们都知道，Vue 能够实现当一个数据变更时，视图就进行刷新，而且用到这个数据的其他地方也会同步变更；而且，这个数据必须是在有被依赖的情况下，视图和其他用到数据的地方才会变更。 所以，Vue 要能够知道一个数据是否被使用，实现这种机制的技术叫做依赖收集根据 Vue 官方文档的介绍，其原理如下图所

就是有没有使用它 谁依赖了它
而且，这个数据必须是在有被依赖的情况下，视图和其他用到数据的地方才会变更

不然我写了一大堆数据 视图没有依赖数据的地方还要去更新就浪费资源了

依赖收集 就是收集视图依赖 data 的地方

https://juejin.im/entry/5bdab35d6fb9a0224e0e5794

Vue 的 \_render 方法是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node。它的定义在 src/core/instance/render.js 文件中：

Proxy 对象的所有用法，都是上面这种形式，不同的只是 handler 参数的写法。其中，new Proxy()表示生成一个 Proxy 实例，target 参数表示所要拦截的目标对象，handler 参数也是一个对象，用来定制拦截行为。

提出问题的一点

<div id="app">
  {{ message }}
</div>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})

弄清楚模板和数据如何渲染成最终的 DOM。

dom ---> render 那么到底对这个 render 做了什么

```javascript

  render(createElement) {
    // 这样写直接替换到app1整个
    return createElement('div',{
        attrs:{
          id:'app'
        }
    })
  },

```

执行这个 render 函数 call 调用 createElement 到底做了啥 \$mount--> \_render uppdate -->最后把数据映射到 dom 上

肯定是生成虚拟 Vnode 此时的数据也是生成好的配置在 Vnode 上了 至于模板或者数据合法不由 render 函数那块去控制排查

isPrimitive 方法判断是否为基础类型

❗️❗️❗️ 注意认清楚什么是文本节点

```javascript

   render(createElement) {
    // 这样写直接替换到app1整个
    return createElement('div',{
        attrs:{
          id:'app'
        }
    },['1231231',createElement('div',["hello review vue h1",createElement('h3',"hello review vue h3")]),createElement('h2',"hello review vue h2")])
  }

```

### render 函数的三个参数

/\*\*
_ createElement 本身也是一个函数，它有三个参数
_ 返回值: VNode，即虚拟节点
_ 1. 一个 HTML 标签字符串，组件选项对象，或者解析上述任何一种的一个 async 异步函数。必需参数。{String | Object | Function} - 就是你要渲染的最外层标签
_ 2. 一个包含模板相关属性的数据对象你可以在 template 中使用这些特性。可选参数。{Object} - 1 中的标签的属性
_ 3. 子虚拟节点 (VNodes)，由 `createElement()` 构建而成，也可以使用字符串来生成“文本虚拟节点”。可选参数。{String | Array} - 1 的子节点，可以用 createElement() 创建，文本节点直接写就可以
_/
————————————————
版权声明：本文为 CSDN 博主「\_\_Amy」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/sansan_7957/article/details/83014838

突然想到为什么要扁平处理数组？？？？？

https://juejin.im/post/59b53a595188257e7406fe3d

目前来说， \_createElement 比较重要的点是 normalizeChildren(children) 和 simpleNormalizeChildren(children)方法。

simpleNormalizeChildren 把二维数组拍平。([1,2,[3,4],5])

为什么需要拍平 使用 v-for 的情况

simpleNormalizeChildren 方法调用场景是 render 函数是编译生成的。理论上编译生成的 children 都已经是 VNode 类型的，但这里有一个例外，就是 functional component 函数式组件返回的是一个数组而不是一个根节点，所以会通过 Array.prototype.concat 方法把整个 children 数组打平，让它的深度只有一层。

normalizeChildren 方法的调用场景有 2 种，一个场景是 render 函数是用户手写的，当 children 只有一个节点的时候，Vue.js 从接口层面允许用户把 children 写成基础类型用来创建单个简单的文本节点，这种情况会调用 createTextVNode 创建一个文本节点的 VNode；另一个场景是当编译 slot、v-for 的时候会产生嵌套数组的情况，会调用 normalizeArrayChildren 方法，接下来看一下它的实现：

### vue 的函数式组件

然后再对应的节点遍历其 children 会发现是个数组当然得打平来

理论上编译生成的 children 都已经是 VNode 类型的，但这里有一个例外，就是 functional component 函数式组件返回的是一个数组而不是一个根节点，所以会通过 Array.prototype.concat 方法把整个 children 数组打平

只在一层做打平 为什么是这样 因为
because functional components already normalize their own children.

那么问题来了

vue 的函数式组件怎么写

export default {
name: 'functional-button',
functional: true,
render(createElement, context) {
return createElement('button', 'click me')
}
}

https://blog.csdn.net/xuchaobei123/article/details/75195522

在 2.5.0 及以上版本中，如果你使用了单文件组件，那么基于模板的函数式组件可以这样声明：

<template functional>
  <div class="cell">
    <div v-if="props.value" class="on"></div>
    <section v-else class="off"></section>
  </div>
</template>

<script>
export default {
  props: ['value']
}
</script>

我们标记组件为 functional，这意味它是无状态 (没有响应式数据)，无实例 (没有 this 上下文)。

提示：函数式组件比普通组件性能更好，缺点是定义的数据没有响应式。
————————————————
版权声明：本文为 CSDN 博主「前端精髓」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/wu_xianqiang/article/details/88891701

首先 vnode 和 oldVnode 都是之前定义好的，所以并不成立 if (isUndef(vnode)) {}

因为 isRealElement 为 true，所以进入 if (isRealElement) {}，进而 if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {}也不成立，因为 hydrating 为 false，所以 if (isTrue(hydrating)) {} 为 false。之后执行到 oldVnode = emptyNodeAt(oldNode)
在 emptyNodeat 中执行的实际上是将把真实的 dom 转化为 vnode

Virtual DOM 除了它的数据结构的定义，映射到真实的 DOM 实际上要经历 VNode 的 create、diff、patch 等过程。那么在 Vue.js 中，VNode 的 create 是通过之前提到的 createElement 方法创建的，我们接下来分析这部分的实现。

diff 算法是在 createElement 阶段

--->就是 render 阶段

怎么做到数据驱动

当你看一个项目代码的时候，最好是能找到一条主线，先把大体流程结构摸清楚，再深入到细节，逐项击破，拿 Vue 举个栗子：假如你已经知道 Vue 中数据状态改变后会采用 virtual DOM 的方式更新 DOM，这个时候，如果你不了解 virtual DOM，那么听我一句“暂且不要去研究内部具体实现，因为这会是你丧失主线”，而你仅仅需要知道 virtual DOM 分为三个步骤：

一、createElement(): 用 JavaScript 对象(虚拟树) 描述 真实 DOM 对象(真实树)
二、diff(oldNode, newNode) : 对比新旧两个虚拟树的区别，收集差异
三、patch() : 将差异应用到真实 DOM 树

重点啊 ❗️❗️❗️

├── build --------------------------------- 构建相关的文件，一般情况下我们不需要动
├── dist ---------------------------------- 构建后文件的输出目录
├── examples ------------------------------ 存放一些使用 Vue 开发的应用案例
├── flow ---------------------------------- 类型声明，使用开源项目 [Flow](https://flowtype.org/)
├── package.json -------------------------- 不解释
├── test ---------------------------------- 包含所有测试文件
├── src ----------------------------------- 这个是我们最应该关注的目录，包含了源码
│ ├── entries --------------------------- 包含了不同的构建或包的入口文件
│ │ ├── web-runtime.js ---------------- 运行时构建的入口，输出 dist/vue.common.js 文件，不包含模板(template)到 render 函数的编译器，所以不支持 `template` 选项，我们使用 vue 默认导出的就是这个运行时的版本。大家使用的时候要注意
│ │ ├── web-runtime-with-compiler.js -- 独立构建版本的入口，输出 dist/vue.js，它包含模板(template)到 render 函数的编译器
│ │ ├── web-compiler.js --------------- vue-template-compiler 包的入口文件
│ │ ├── web-server-renderer.js -------- vue-server-renderer 包的入口文件
│ ├── compiler -------------------------- 编译器代码的存放目录，将 template 编译为 render 函数
│ │ ├── parser ------------------------ 存放将模板字符串转换成元素抽象语法树的代码
│ │ ├── codegen ----------------------- 存放从抽象语法树(AST)生成 render 函数的代码
│ │ ├── optimizer.js ------------------ 分析静态树，优化 vdom 渲染
│ ├── core ------------------------------ 存放通用的，平台无关的代码
│ │ ├── observer ---------------------- 反应系统，包含数据观测的核心代码
│ │ ├── vdom -------------------------- 包含虚拟 DOM 创建(creation)和打补丁(patching)的代码
│ │ ├── instance ---------------------- 包含 Vue 构造函数设计相关的代码
│ │ ├── global-api -------------------- 包含给 Vue 构造函数挂载全局方法(静态方法)或属性的代码
│ │ ├── components -------------------- 包含抽象出来的通用组件
│ ├── server ---------------------------- 包含服务端渲染(server-side rendering)的相关代码
│ ├── platforms ------------------------- 包含平台特有的相关代码
│ ├── sfc ------------------------------- 包含单文件组件(.vue 文件)的解析逻辑，用于 vue-template-compiler 包
│ ├── shared ---------------------------- 包含整个代码库通用的代码

// initMixin(Vue) src/core/instance/init.js ************************\*\*************************
Vue.prototype.\_init = function (options?: Object) {}

// stateMixin(Vue) src/core/instance/state.js ************************\*\*************************
Vue.prototype.$data
Vue.prototype.$set = set
Vue.prototype.$delete = del
Vue.prototype.$watch = function(){}

// renderMixin(Vue) src/core/instance/render.js ************************\*\*************************
Vue.prototype.\$nextTick = function (fn: Function) {}
Vue.prototype.\_render = function (): VNode {}
Vue.prototype.\_s = \_toString
Vue.prototype.\_v = createTextVNode
Vue.prototype.\_n = toNumber
Vue.prototype.\_e = createEmptyVNode
Vue.prototype.\_q = looseEqual
Vue.prototype.\_i = looseIndexOf
Vue.prototype.\_m = function(){}
Vue.prototype.\_o = function(){}
Vue.prototype.\_f = function resolveFilter (id) {}
Vue.prototype.\_l = function(){}
Vue.prototype.\_t = function(){}
Vue.prototype.\_b = function(){}
Vue.prototype.\_k = function(){}

// eventsMixin(Vue) src/core/instance/events.js ************************\*\*************************
Vue.prototype.$on = function (event: string, fn: Function): Component {}
Vue.prototype.$once = function (event: string, fn: Function): Component {}
Vue.prototype.$off = function (event?: string, fn?: Function): Component {}
Vue.prototype.$emit = function (event: string): Component {}

// lifecycleMixin(Vue) src/core/instance/lifecycle.js ************************\*\*************************
Vue.prototype.\_mount = function(){}
Vue.prototype.\_update = function (vnode: VNode, hydrating?: boolean) {}
Vue.prototype.\_updateFromParent = function(){}
Vue.prototype.$forceUpdate = function () {}
Vue.prototype.$destroy = function () {}

为什么 review vue 源码 就跟我之前 review underscore 的目标一样 review underscore 的目标是为了了解函数式编程的实现

那么 review vue 的目标就是为了了解 mvvm 框架的实现

然后，调用了四个 init\* 方法分别为：initLifecycle、initEvents、initState、initRender，且在 initState 前后分别回调了生命周期钩子 beforeCreate 和 created，而 initRender 是在 created 钩子执行之后执行的，看到这里，也就明白了为什么 created 的时候不能操作 DOM 了。因为这个时候还没有渲染真正的 DOM 元素到文档中。created 仅仅代表数据状态的初始化完成

Object.defineProperty(target, key, sharedPropertyDefinition)

为什么 data 里面的数据,可以用 this.message 表示

function proxy(target, sourceKey, key) {
sharedPropertyDefinition.get = function proxyGetter() {
return this[sourceKey][key]
};
sharedPropertyDefinition.set = function proxySetter(val) {
this[sourceKey][key] = val;
};
Object.defineProperty(target, key, sharedPropertyDefinition);
}

因为这样 vue 源码是这样处理的

Object.defineProperty(target, key, sharedPropertyDefinition)

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

vue 在这一步做了 proxy handle 处理

### 给我自己写个 mvvm 框架怎么写？

### vue 和实例 vm 和 Vnode 有什么联系

因为 vm 的\$options 属性是个配置属性 核心属性

注意 vue 里面的编程模式还是面向对象的

代理对象是 es6 的新特性，它主要用来自定义对象一些基本操作（如查找，赋值，枚举等）。

有空的话顺便就把之前写的 babel 插件发包 然后总结

```javascript
  <div id="app">
  {{ message }}
</div>
render: function (createElement) {
  return createElement('div', {
     attrs: {
        id: 'app'
      },
  }, this.message)
}
```

你会发现就算不在 webpack 上运行 我们单纯引入了 vue.js 还是可以运行 那是因为 dom 操作覆盖 所以说 {{ message }}的实现不难 也即是 template 语法，没有 mv 框架出来之前,库也可以实现

面试的时候问起 vue 的原理，大部分的人都会说通过 Object.defineProperty 修改属性的 get, set 方法，从而达到数据改变的目的。然而作为 vue 的 MVVM 驱动核心，从数据的改变到视图的改变，远远不止这句话就能解释

我们其实很少去操作 dom 因为 mvvm 框架已经帮我们操作了

组件才会有生命周期吧

在 new Vue() 之后。 Vue 会调用 \_init 函数进行初始化，也就是这里的 init 过程，它会初始化生命周期、事件、 props、 methods、 data、 computed 与 watch 等。其中最重要的是通过 Object.defineProperty 设置 setter 与 getter 函数，用来实现「响应式」以及「依赖收集」

初始化之后调用 \$mount 会挂载组件，如果是运行时编译，即不存在 render function 但是存在 template 的情况，需要进行「编译」步骤

compile 编译可以分成 parse、optimize 与 generate 三个阶段，最终需要得到 render function。

https://zhuanlan.zhihu.com/p/40537941

需求 🤔？

component 组件怎么生存 vnode

components 的解析方法 createComponent：根据 vnode 生成 VueComponent(继承 Vue)对象

过程是 init –> \$mount(挂载) –> render(参生虚拟 DOM) –> path (映射真实 DOM)

Vue.extend 的作用就是构造一个 Vue 的子类，它使用一种非常经典的原型继承的方式把一个纯对象转换一个继承于 Vue 的构造器 Sub 并返回，然后对 Sub 这个对象本身扩展了一些属性，如扩展 options、添加全局 API 等；并且对配置中的 props 和 computed 做了初始化工作；最后对于这个 Sub 构造函数做了缓存，避免多次执行 Vue.extend 的时候对同一个子组件重复构造。

1.创建子类构造器 2.组件 data 都会有 hook，与 installComponentHooks 合并 3.生成组件 VNode

可以看到，createComponent 的逻辑也会有一些复杂，但是分析源码比较推荐的是只分析核心流程，分支流程可以之后针对性的看，所以这里针对组件渲染这个 case 主要就 3 个关键步骤

构造子类构造函数，安装组件钩子函数和实例化 vnode

我们在编写一个组件的时候，通常都是创建一个普通对象，还是以我们的 App.vue 为例，代码如下：

```javascript
import HelloWorld from "./components/HelloWorld";
export default {
  name: "app",
  components: {
    HelloWorld
  }
};
```

这里 export 的是一个对象，所以 createComponent 里的代码逻辑会执行到 baseCtor.extend(Ctor)，在这里 baseCtor 实际上就是 Vue，这个的定义是在最开始初始化 Vue 的阶段，在 src/core/global-api/index.js 中的 initGlobalAPI 函数有这么一段逻辑：

最后一步非常简单，通过 new VNode 实例化一个 vnode 并返回。需要注意的是和普通元素节点的 vnode 不同，组件的 vnode 是没有 children 的，这点很关键，在之后的 patch 过程中我们会再提。

为什么要构造子类构造函数

因为需要实例化对象呗

Vue.extend 返回一个构造函数

创建组件构造函数的意义是什么？？？

### vue 组件解析

1.创建子类构造器 2.组件 data 都会有 hook，与 installComponentHooks 合并 3.生成组件 VNode

需要经过这三个步骤，但是我很好奇就是为什么组件需要构造函数，解决这个问题的疑惑点就是
当我们使用组件时候的 Vue 的做法就是需要去实例化它 想想也是我们写单文件组件经过 Vue 就会渲染成构造器

想要使用它就去使用它 你想想你不同路由使用这个组件 如果共用同一个对象难免会冲突 解决办法就去实例各个子对象

5.2 组件 Vnode 创建
组件注册过后，会在实例 options.component 增加一个组件的配置属性，这个属性是一个子的 Vue 构造器。然而这个组件何时创建，何时进行实例化，何时渲染，何时挂载基础钩子是这一小节分析的核心。

Vue 根实例初始化会执行 vm.$mount(vm.$options.el)实例挂载的过程，按照之前深入剖析 Vue 源码 - 完整渲染过程所讲的逻辑，完整流程会经历 render 函数生成 Vnode,以及 Vnode 生成真实 DOM 的过程。

render 函数生成 Vnode 过程中，子会优先父执行生成 Vnode 过程,子执行过程中遇到子组件占位符如(<test></test>)时,会判断该占位符是否是注册过的组件标签，如果符合条件，则进入 createComponent 创建子组件的过程，如果为一般标签，则执行 new Vnode 过程。

createComponent 是创建组件 Vnode 的过程，创建过程会合并子和父构造器的选项配置，并安装组件相关的钩子，最后通过 new Vnode()生成以 vue-component 开头的 Virtual DOM

render 函数执行过程也是一个循环递归调用创建 Vnode 的过程，执行 3，4 步之后，完整的生成了一个包含各个子组件的 Vnode tree

然后就是来分析全局注册和局部注册

其中核心是在判断该子组件的占位符是否为已注册过的组件，在介绍全局注册时我们已经知道了，一个组件全局注册后，Vue 实例的 options.component 对象上会新增一个带有构造器的组件选项。因此`是否拥有这个选项也成为判断组件是否注册的标准`

5.2.3 局部注册和全局注册的区别
在说到全局注册和局部注册的用法时留下了一个问题，局部注册和全局注册两者的区别在哪里。上文源码分析讲到全局注册却没有提及局部注册，其实局部注册的原理同样简单，我们使用局部注册组件时会通过在父组件选项配置中的 component 添加子组件的对象配置，这和全局注册后在 Vue 的 options.component 添加子组件构造器的结果很相似。区别在于：

1.局部注册添加的对象配置是在某个组件下，而全局注册添加的子组件是在根实例下。 2.局部注册添加的是一个子组件的配置对象，而全局注册添加的是一个子类构造器。

因此局部注册中缺少了一步构建子类构造器的过程，这个过程放在哪里进行呢？ 回到 createComponent 的源码,源码中根据传入对象和构造器的分类区分局部和全局注册组件，而局部注册依然会调用 父类的 extend 方法去创建子类构造器。

> 前提：组件是 Vue 的一个重要核心，我们在进行项目工程化时，会将页面的结构组件化，组件化意味着独立和共享 ❗️

如何做到独立和共享 ----> 构造函数--->实例化对象

### (局部和全局)注册过程（暂时不分析）

### 组件 Vnode 创建

组件注册过后，会在实例`options.component增加一个组件的配置属性`，`这个属性是一个子的Vue构造器`。然而这个组件何时创建，何时进行实例化，何时渲染，何时挂载基础钩子是这一小节分析的核心

![image](https://user-gold-cdn.xitu.io/2019/5/29/16b02e11b6b1c23a?imageslim)

我们将上图的流程简单概括为以下几点：

Vue 根实例初始化会执行 vm.$mount(vm.$options.el)实例挂载的过程，按照之前深入剖析 Vue 源码 - 完整渲染过程所讲的逻辑，完整流程会经历 render 函数生成 Vnode,以及 Vnode 生成真实 DOM 的过程。

render 函数生成 Vnode 过程中，子会优先父执行生成 Vnode 过程,子执行过程中遇到子组件占位符如(<test></test>)时,会判断该占位符是否是注册过的组件标签，如果符合条件，则进入 createComponent 创建子组件的过程，如果为一般标签，则执行 new Vnode 过程。

createComponent 是创建组件 Vnode 的过程，创建过程会合并子和父构造器的选项配置，并安装组件相关的钩子，最后通过 new Vnode()生成以 vue-component 开头的 Virtual DOM

render 函数执行过程也是一个循环递归调用创建 Vnode 的过程，执行 3，4 步之后，完整的生成了一个包含各个子组件的 Vnode tree

局部注册-->创建子类构造器--->经过 new Vnode

#### 构造子类构造函数

```javacript

   const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

```

我们在编写一个组件的时候，通常都是创建一个普通对象，还是以我们的 App.vue 为例，代码如下：

```javascript
import HelloWorld from "./components/HelloWorld";

export default {
  name: "app",
  components: {
    HelloWorld
  }
};
```

这里 export 的是一个对象，所以 createComponent 里的代码逻辑会执行到 baseCtor.extend(Ctor)，在这里 baseCtor 实际上就是 Vue，这个的定义是在最开始初始化 Vue 的阶段，在 src/core/global-api/index.js 中的 initGlobalAPI 函数有这么一段逻辑：

Vue.extend 的作用就是构造一个 Vue 的子类，它使用一种非常经典的原型继承的方式把一个纯对象转换一个继承于 Vue 的构造器 Sub 并返回，然后对 Sub 这个对象本身扩展了一些属性，如扩展 options、添加全局 API 等；并且对配置中的 props 和 computed 做了初始化工作；最后对于这个 Sub 构造函数做了缓存，避免多次执行 Vue.extend 的时候对同一个子组件重复构造。

这样当我们去实例化 Sub 的时候，就会执行 this.\_init 逻辑再次走到了 Vue 实例的初始化逻辑，实例化子组件的逻辑在之后的章节会介绍

vue 渲染先渲染子再渲染父

注意，局部注册和全局注册不同的是，只有该类型的组件才可以访问局部注册的子组件，而全局注册是扩展到 Vue.options 下，`所以在所有组件创建的过程中，都会从全局的 Vue.options.components 扩展到当前组件的 vm.$options.components 下，这就是全局注册的组件能被任意使用的原因`。

在 Vue.js 中，除了它内置的组件如 keep-alive、transition、transition-group 等，其它用户自定义组件在使用前必须注册。很多同学在开发过程中可能会遇到如下报错信息：

### 总结

通过这一小节的分析，我们对组件的注册过程有了认识，并理解了全局注册和局部注册的差异。其实在平时的工作中，当我们使用到组件库的时候，往往更通用基础组件都是全局注册的，而编写的特例场景的业务组件都是局部注册的。了解了它们的原理，对我们在工作中到底使用全局注册组件还是局部注册组件是有这非常好的指导意义的。

局部和全局注册的不同就是`全局注册是扩展到 Vue.options 下`

所以组件抓住 options 去分析

#### Vue 组件剖析

接下来我们会用 Vue-cli 初始化的代码为例，来分析一下 Vue 组件初始化的一个过程。

```javascript
import Vue from "vue";
import App from "./App.vue";

var app = new Vue({
  el: "#app",
  // 这里的 h 是 createElement 方法
  render: h => h(App)
});
```

这段代码相信很多同学都很熟悉，它和我们上一章相同的点也是通过 render 函数去渲染的，不同的这次通过 createElement 传的参数是一个组件而不是一个原生的标签，那么接下来我们就开始分析这一过程。

如果我们传入了一个组件 render 函数怎么去处理以及渲染

上一章我们在分析 createElement 的实现的时候，它最终会调用 \_createElement 方法，其中有一段逻辑是对参数 tag 的判断，如果是一个普通的 html 标签，像上一章的例子那样是一个普通的 div，则会实例化一个普通 VNode 节点，否则通过 createComponent 方法创建一个组件 VNode

通过 tag 这个字段对标签进行判断 是不是组件或者 html 标签 ❗️

render 函数生成 Vnode 如果遇到 html 原生标签直接走 new Vnode 方法 如果遇到 component 类型 vnode = createComponent(tag, data, context, children)

createElement 的实现的时候，它最终会调用 \_createElement 方法，其中有一段逻辑是对参数 tag 的判断，如果是一个普通的 html 标签，像上一章的例子那样是一个普通的 div，则会实例化一个普通 VNode 节点，否则通过 createComponent 方法创建一个组件 VNode

###### mergeOptions

mergeOptions 的实现我们会在后续章节中具体分析，现在只需要理解它的功能是把 Vue 构造函数的 options 和用户传入的 options 做一层合并，到 vm.\$options 上

❗️ 对象属性指向这个属性 这种操作并不会觉得新奇 也不会造成回环死循环的 不要觉得新奇 很常见的做法 比如原型 老外的思想真是令人佩服

为什么要对 option 做操作

来鉴别作为全局或者局部

怎么又将组建转化为 Vnode 话说我们如果我们在单文件.vue 文件写了 导出的对象 会经过 vue-loader 处理 不然你想想 html dom 怎么带过去 是要经过 vue-loader 处理的 ❗️
所以我猜 template 模板标签会带带过去的 Ctor 属性的 debug 看看吧

❗️ 什么时候走\_render 函数 是不是编译过 template 模板成为 render 函数 或者是直接有 render 函数的 -- 对没错 所以如果有 template 就走编译 -->render 函数-->走\_render

❗️ 所以你会看到 createComponent 函数内 Ctor 带有 render 属性函数

💎 我觉得接下来最重要的应该是去分析或者了解 new VNode 这步操作 为啥需要 Ctor Ctor 是一个构造子类构造函数

```javascript
     // 组件
     vnode = createComponent(Ctor, data, context, children, tag)--->const vnode = new VNode(`vue-component-${Ctor.cid}${name ? `-${name}` : ''}`data, undefined, undefined, undefined, context,{ Ctor, propsData, listeners, tag, children },asyncFactory)  所以这就是为啥需要Ctor的原因
    // HTML标签
     vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )

```

#### 看看 Vue 的 new Vnode

> 但是这样的 javascript 操作 Dom 进行重绘整个视图层是相当消耗性能的，我们是不是可以每次只更新它的修改呢？所以 Vue.js 将 Dom 抽象成一个以 javascript 对象为节点的虚拟 Dom 树，以 VNode 节点模拟真实 Dom，可以对这颗抽象树进行创建节点、删除节点以及修改节点等操作，在这过程中都不需要操作真实 Dom，只需要操作 javascript 对象，大大提升了性能。修改以后经过 diff 算法得出一些需要修改的最小单位，再将这些小单位的视图进行更新。这样做减少了很多不需要的 Dom 操作，大大提高了性能。

https://segmentfault.com/a/1190000011102921 


用js对象表示好像确实不难  但是diff去比较好像确实就有难度了


❗️createElement用来创建一个虚拟节点。当data上已经绑定__ob__的时候，代表该对象已经被Oberver过了，所以创建一个空节点。tag不存在的时候同样创建一个空节点。当tag不是一个String类型的时候代表tag是一个组件的构造类，直接用new VNode创建。当tag是String类型的时候，如果是保留标签，则用new VNode创建一个VNode实例，`如果在vm的option的components找得到该tag，代表这是一个组件，否则统一用new VNode创建。`

组件Vnode创建过程


⚠️ Vue.extend是什么？

👉 extend创建的是一个组件构造器，而不是一个具体的组件实例，需要通过Vue.components注册


我们需要实例化对象才可以❗️ mount的操作就是需要实例化对象

使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。

data 选项是特例，需要注意 - 在 Vue.extend() 中它必须是函数



注意组件❗️注意组件❗️ 我们怎么去实例化这个组件 也就是需要再触发一个init方法再去执行

像我们开发的项目 以

```javascript

new Vue({
  render: h => h(App),
}).$mount('#app')


```
为起点 但是 我们一遇到传入的是组件dom改怎么办  html原生标签夹杂着dom 

我们肯定要让组件走render函数的


Vue.extend有什么作用

Vue.extend有用到原型继承知识

```js
// 这一步做了new Vue操作

// 注意这种直接调用mount方法的
// 生成一个实例vm调用$mount方法初始化
new Vue({
  render: h => h(App),
}).$mount('#app')


// extend创建的是一个组件构造器
// 如果我想自定义这个Vue构造函数可以 可以的 extend就帮你实现这个操作----❗️❗️❗这个认知很重要 
// 反过来我们这样思考 我们所写的组件就是基于原理的Vue构造函数再加东西 比如html js逻辑等等
// Vue的组件就是这么实现的  因为组件需要复用 必须得有构造函数❗️ 这句话很重要
// 然后就是我们最后生成一坨html（组件）直接可以插入父节点就行 

Vue的操作就是把组件也当做特殊vm实例化对象  对象有对应的内置方法去做些操作❗️❗️❗️ Vue的操作就是把组件也当做特殊vm实例化对象这句认知很重要


```

❗️下面该研究实例化子类构造器 

也就是vm实例化对象该走的流程  vue的组件也同样走  

这个设计很同步啊同级啊感觉🤔


❗️面试问你如何看待Vue组件：我会这样答 实际上Vue组件就是个特殊的vm对象 vm所要做的流程 组件也会跟着走一遍 ---你把传进去的是标签跟传进去是组件想成同级就行了

```javascript
    
    new Vue({
    el: '#app',
    data: {

      text: '学习 Vue',
    },
  })

```
当我们一开始传入的是标签的时候new出一个vm实例时候 就会启动一大部分流程 然后假设这个实例上还有子组件  子组件走的流程跟这个标签父元素走的流程一样❗️❗️

构造器用来实例化对象

所以当我们来写组件时候 自己应该要开始意识到自己写的是Vue组件构造函数的部分（底层源码还会帮你extend一下）


`由于组件初始化的时候是不传 el 的，因此组件是自己接管了 $mount 的过程，这个过程的主要流程在上一章介绍过了，回到组件 init 的过程，componentVNodeHooks 的 init 钩子函数，在完成实例化的 _init 后，接着会执行 child.$mount(hydrating ? vnode.elm : undefined, hydrating) 。这里 hydrating 为 true 一般是服务端渲染的情况，我们只考虑客户端渲染，所以这里 $mount 相当于执行 child.$mount(undefined, false)，它最终会调用 mountComponent 方法，进而执行 vm._render() 方法`


### 总结



那么到此，一个组件的 VNode 是如何创建、初始化、渲染的过程也就介绍完毕了。在对组件化的实现有一个大概了解后，接下来我们来介绍一下这其中的一些细节。`我们知道编写一个组件实际上是编写一个 JavaScript 对象，对象的描述就是各种配置`，之前我们提到在 _init 的最初阶段执行的就是 merge options 的逻辑，那么下一节我们从源码角度来分析合并配置的过程。


你把传进去的是标签跟传进去是组件想成同级就行了


```javascript
  
     const Sub = function VueComponent(options) {
      this._init(options)
    }

```
⚠️不是组件化会重新走一遍init的流程 而是这个组件的构造器有init的方法 我们其实都可以new 组件构造器 所走的流程跟new Vue一样的 ❗️应该要这样理解

再继续理解 感觉也不是这样的

所以子组件的实例化实际上就是在这个时机执行的，并且它会执行实例的 _init 方法，这个过程有一些和之前不同的地方需要挑出来说，代码在 src/core/instance/init.js 中
子组件会执行一次Init 还有注意单页（应用就是一张页面吗可以这样理解 原理一样）或者一张页面只有☝vm实例 这点可以保证  ❗️❗️❗️这个理解很重要

通过oop思想封装框架有点独特 不像是面向执行过程的 实际也就是执行方法  只不过多封装一层而已



现在应该研究怎么去实例化组件构造器



我们只保留关键部分的代码，这里的 _parentVnode 就是当前组件的父 VNode，而 render 函数生成的 vnode 当前组件的渲染 vnode，vnode 的 parent 指向了 _parentVnode，也就是 vm.$vnode，它们是一种父子的关系


我们知道在执行完 vm._render 生成 VNode 后，接下来就要执行 vm._update 去渲染 VNode 了。来看一下组件渲染的过程中有哪些需要注意的，vm._update 的定义在 




所以子组件还是会走init--->mount

<<----再回去vm渲染吗>>

在完成组件的整个 patch 过程后，最后执行 insert(parentElm, vnode.elm, refElm) 完成组件的 DOM 插入，如果组件 patch 过程中又创建了子组件，那么DOM 的插入顺序是先子后父


注意子组件的实例-init是发生在vm过程的patch阶段？？？？？



组件里面还是套有组件怎么办


还有vue怎么检查标签的合法性 是不是存在或者闭合了没❗️


vue-loader事先编译好了render函数 但是我们这里之所以有render那是因为`有配置了render函数`这个属性

```javascript

new Vue({
  render: h => h(App),
}).$mount('#app')
// 执行完new Vue里面的操作以后出来再来执行$mount('#app')
// 此时相当于vm.$mount('#app')===>$mount函数里的this指向vm
```

```javascript

 else {
      // 是这一步把render函数放到$options属性里面吗
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
  }
  // 的确如此
```

原先原型上的 $mount 方法在 src/platform/web/runtime/index.js 中定义，之所以这么设计完全是为了复用，因为它是可以被 runtime only 版本的 Vue 直接使用的。


实际上Vue实例挂载也是方法函数去操作dom覆盖或者生成 你可以这样抽出来简单的认为


  return mount.call(this, el, hydrating)是什么东西？？？？


  递归调用吗  


  由于构建的不同，如果我们采用webpack这种构建vue项目，webpack会提前将.vue文件预编译为带render函数的js文件，就将省去compile这个过程，但是为了利于我们分析vue的整个过程，我们采用带compile版本的构建，还原浏览器渲染的整个过程。如上图说的它的vue的初始化大概是这样的：


  https://zhuanlan.zhihu.com/p/48954878



  #### vue组件化原来是这样子

  ```javascript

  <template>
      <div id="app">
          <span>{{message}}</span>
          <Test/>
      </div>
  </template>

  ```

  如例子🌰中的 我们经过_render函数会转化渲染成Vnode 对应的有组件Vnode其实就是个占位符
  等到update中的patch过程重新new 组件构造器()重新走_init方法 过程的是这样的

  那为什么要这样子做嘞 回到一开始这种 我们假设一开始就传入组件标签  那么new Vue肯定这样操作

  ```javascript
        new Vue({
        render: h => h(App),
      }).$mount('#app')
  ```
  我们传入的是个组件App #app是它父级  其它子组件的渲染过程肯定跟APP的渲染过程

  这期间可能没有el属性 我们置为undefined就行


  还有根元素是不做进去Vnode比较的 Vnode是根元素下的子元素

  为什么init 因为实例化对象了



  ❗️❗️❗️
  注意，这里我们传入的 vnode 是组件渲染的 vnode，也就是我们之前说的 vm._vnode，如果组件的根节点是个普通元素，那么 vm._vnode 也是普通的 vnode，这里 createComponent(vnode, insertedVnodeQueue, parentElm, refElm) 的返回值是 false。接下来的过程就和我们上一章一样了，先创建一个父节点占位符，然后再遍历所有子 VNode 递归调用 createElm，在遍历的过程中，如果遇到子 VNode 是一个组件的 VNode，则重复本节开始的过程，这样通过一个递归的方式就可以完整地构建了整个组件树。

  Vnode是一个节点而不是一个Vnode Tree所以得注意了  但是想想节点包括很多子节点啊 

  所有想到傻逼的解释或者幼稚化的 就是知识点不足
  
  这也注定了 我们在update过程中需要去遍历每个Vnode  具体怎么去遍历Vnode 找找vue源码怎么写的吧❗️❗️❗️


  vue好像是对一个一个Vnode去循环的  如果子节点再存在组价Vnode还是进去再次循环

  那么HTML标签节点呢



  所以我觉得分析Vnode各个节点的遍历应该是在patch过程  就在这个过程上看 ❗️❗️❗️


  render里面怎么给每个组件生成构造函数的 肯定也是遍历的

  我就想看看是怎么遍历的

  render-->vnode-->patch


  还真的是先子后父❗️❗️❗️



  App组件 --> patch 走组件逻辑 经过init-->render

  我们来分析这个Vnode树是怎么经过patch(如何遍历的)

  分析树之前 来看我们写的模板结构是怎么样的 
  先是大的App组件为一个大的应用 里面包裹住其它(这也是为啥叫单应用 因为本身只有一个app包裹 但是可以存在多个app 多页面就是)


  所以Vue这种mvvm框架就是这种限定  只有一个闭合标签 或者一个App 包裹住

  所以一开始我们在render函数传入的是App组件

  结构是这样的

  ```javascript
    
  <div id="app">
    <span>{{ message }}</span>
    <Test />
  </div>

  ```
也就是没有跟App同级的组件  New Vue也只会发生一次 app也只有一个  这些也得重新认识清楚

也就是我以前会认为有多个new Vue操作  甚至觉得还有多个app类似组件

你要认清楚什么是单页应用


来清楚认识这个ap结构 一个大APP-->....--->...这样的结构


### 如何遍历Vnode

首先从render来看 如何遍历生成Vnode   如果tag是组件就生成占位符


再来看update---> update过程中我们已经拿到Vnode树(虚拟dom)然后已经可以遍历了,具体子Vnode生成真实的dom是走这个流程
`Vue处理组件的时候render那里先生成一个组件占位符 等到update的时候 执行一遍new 构造子类构造函数()-->init -->render-->update`
`同样的 如果组件里面还是存在组件 也是在render时候生成占位符`❗️❗️❗️  子Vnode生成完真实的dom再return回去最大的update函数 轮到父级生成真实的dom 先子后父

```javascript
  
    function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(children)
      }
      for (let i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
    }
  }

```

那么来看看render函数如何循环遍历拿到Vnode的


这里它是创建一个大的Vnode节点

    vnode = new VNode(
      tag, data, children,
      undefined, undefined, context
    )

怎么确定传入的children children过后传入的？？

```javascript

// is needed to cater to all possible types of children values.
export function normalizeChildren (children: any): ?Array<VNode> {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

```

children是经过这步递归处理


我们写的template语法 包括jsx会被编译成js对象---->然后这个js对象编译肯定是跟dom有层次关系  这样也就映射成Vnode是这样的❗️❗️❗️



### mounted过程中怎么先子后父 --- destroy这个过程也是     每个过程都有对应的hook函数

render函数执行中 怎么生成组件占位符的


首先我们需要知道，在创建 VNode 节点对应的 DOM 节点后，会先递归创建子虚拟节点的子 DOM 节点，之后再将该 DOM 节点插入到父元素上


哎呀基础不扎实  一个节点要渲染出来    我们还是应该想到  节点的创建还要有对应的插入❗️❗️❗️

如果在一个知识点老是出现不扎实情况 有必要回去系统再刷一下 但是如果只是单纯一个 那就是没有注意到  当做新知识点学习就行  不必太在意 以为三年级的被除数？？

> 首先我们需要知道，在创建 VNode 节点对应的 DOM 节点后，会先递归创建子虚拟节点的子 DOM 节点，之后再将该 DOM 节点插入到父元素上，因此：在由 VNode Tree 转化为 DOM Tree 的过程中，DOM 节点的创建是自上而下的，即先创建父 DOM 节点，再创建子 DOM 节点，最后创建孙 DOM 节点；但是将` DOM 节点插入到父 DOM 节点的过程是自下而上的，即孙 DOM 节点先插入到子 DOM 节点之下，子 DOM 节点再插入到父 DOM 节点之下` 什么是先子后父  这个概念针对于哪个过程

注意，这里我们传入的 vnode 是组件渲染的 vnode，也就是我们之前说的 vm._vnode，如果组件的根节点是个普通元素，那么 vm._vnode 也是普通的 vnode，这里 createComponent(vnode, insertedVnodeQueue, parentElm, refElm) 的返回值是 false。接下来的过程就和我们上一章一样了，先创建一个父节点占位符，然后再遍历所有子 VNode 递归调用 createElm，在遍历的过程中，如果遇到子 VNode 是一个组件的 VNode，则重复本节开始的过程，这样通过一个递归的方式就可以完整地构建了整个组件树。


每个 Vue 实例在被创建之前都要经过一系列的初始化过程。例如需要设置`数据监听、编译模板、挂载实例到 DOM`、在`数据变化时更新 DOM` 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，给予用户机会在一些特定的场景下添加他们自己的代码。




review vue源代码 我了解到了Vue实例是什么 new Vue到底发生了什么  ---> 编译模板、挂载实例到 DOM

也明白了render update

等下再debugger


在我们实际项目开发过程中，会非常频繁地和 Vue 组件的生命周期打交道，接下来我们就从源码的角度来看一下这些生命周期的钩子函数是如何被执行的。

mvvm框架 底层帮我们创建dom 当然有对应的周期阶段

在上一节中，我们详细地介绍了 Vue.js 合并 options 的过程，各个阶段的生命周期的函数也被合并到 vm.$options 里，并且是一个数组。因此 callhook 函数的功能就是调用某个生命周期钩子注册的所有回调函数。



相当于这样子  内部实际定义了（定死了）生命周期函数的名字，不是定死 而是调用定死  它调用了我们写的created函数 实际callHook是这样调用的

也就是我们在export default{
  ...
}
对象内写的函数 （对象里面的函数属性 我们之前说过 类似于外部的函数声明） 所以实际上我们按照官方给出的名字去定义函数  然后给Vue底层源码调用 设计是这样设计的


```javascript

  export function callHook (vm: Component, hook: string) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm)
      } catch (e) {
        handleError(e, vm, `${hook} hook`)
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}

```


我们可以看到，每个子组件都是在这个钩子函数中执行 mounted 钩子函数，并且我们之前分析过，insertedVnodeQueue 的添加顺序是先子后父，所以对于同步渲染的子组件而言，mounted 钩子函数的执行顺序也是先子后父


这一节主要介绍了 Vue 生命周期中各个钩子函数的执行时机以及顺序，通过分析，我们知道了如在 created 钩子函数中可以访问到数据，在 mounted 钩子函数中可以访问到 DOM，在 destroy 钩子函数中可以做一些定时器销毁工作，了解它们有利于我们在合适的生命周期去做不同的事情


对象本身还充当对变量不对外污染的功能

callHook的作用就是执行用户自定义的钩子函数，并将钩子中this指向指为当前组件实例。

callHook 函数的逻辑很简单，根据传入的字符串 `hook`，去拿到 vm.$options[hook] `对应的回调函数数组`，然后遍历执行，执行的时候把 vm 作为函数执行的上下文


突然想到一个问题 就是为什么handlers是一个数组  不是一个回调函数吗  好拓展吗❗️❗️



注意了vue的内置三个全局组件

```javascript
 
 在 Vue.js 中，除了它内置的组件如 keep-alive、transition、transition-group

```


组件注册实际就是为了拿到构造函数  --- 这个构造函数已经包含了我们组件所需要的信息 不需要我们再传入（options）

其实理解了全局注册的过程，局部注册是非常简单的。在组件的 Vue 的实例化阶段有一个合并 option 的逻辑，之前我们也分析过，所以就把 components 合并到 vm.$options.components 上，这样我们就可以在 resolveAsset 的时候拿到这个组件的构造函数，并作为 createComponent 的钩子的参数。



##### 全局注册


```javascript
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// ... 全局注册代码
// 注意这些Vue配置调用api是发生new Vue操作前❗️❗️

new Vue({
  render: h => h(App),
}).$mount('#app')

```

也就是说它会把 Vue.options 合并到 Sub.options，也就是组件的 options 上， 然后在组件的实例化阶段，会执行 merge options 逻辑，把 Sub.options.components 合并到 vm.$options.components 上



在 new Vue() 之后。 Vue 会调用 _init 函数进行初始化，也就是这里的 init 过程，它会初始化生命周
期、事件、 props、 methods、 data、 computed 与 watch 等。其中最重要的是通过
Object.defineProperty 设置 setter 与 getter 函数，用来实现「 响应式」以及「 依赖收集」，后面会详
细讲到，这里只要有一个印象即可。


其实前端开发最重要的 2 个工作，一个是把数据渲染到页面，另一个是处理用户交互。Vue 把数据渲染到页面的能力我们已经通过源码分析出其中的原理了，但是由于一些用户交互或者是其它方面导致数据发生变化重新对页面渲染的原理我们还未分析。

在分析前，我们先直观的想一下，如果不用 Vue 的话，我们会通过最简单的方法实现这个需求：监听点击事件，修改数据，手动操作 DOM 重新渲染。这个过程和使用 Vue 的最大区别就是多了一步“手动操作 DOM 重新渲染”。这一步看上去并不多，但它背后又潜在的几个要处理的问题：


可能很多小伙伴之前都了解过 Vue.js 实现响应式的核心是利用了 ES5 的 Object.defineProperty，这也是为什么 Vue.js 不能兼容 IE8 及以下浏览器的原因，我们先来对它有个直观的认识。

Object.defineProperty给这个对象添加属性

Object.defineProperty `方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象`，先来看一下它的语法：


有没有思考🤔过props传递过来的值可以直接用this.xxx访问得到

首先介绍一下代理，代理的作用是把 props 和 data 上的属性代理到 vm 实例上，这也就是为什么比如我们定义了如下 props，却可以通过 vm 实例访问到它。


proxy 方法的实现很简单，通过 Object.defineProperty 把 target[sourceKey][key] 的读写变成了对 target[key] 的读写。所以对于 props 而言，对 vm._props.xxx 的读写变成了 vm.xxx 的读写，而对于 vm._props.xxx 我们可以访问到定义在 props 中的属性，所以我们就可以通过 vm.xxx 访问到定义在 props 中的 xxx 属性了。同理，对于 data 而言，对 vm._data.xxxx 的读写变成了对 vm.xxxx 的读写，而对于 vm._data.xxxx 我们可以访问到定义在 data 函数返回对象中的属性，所以我们就可以通过 vm.xxxx 访问到定义在 data 函数返回对象中的 xxxx 属性了。

```javascript

```


思考🤔：我可以理解成通过Object.defineProperty给vm这个对象增加属性

```javascript

  const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

```


#### observe

observe 方法的作用就是给非 VNode 的对象类型数据添加一个 Observer，如果已经添加过则直接返回，否则在满足一定条件下去实例化一个 Observer 对象实例。接下来我们来看一下 Observer 的作用。



#### Observer

Observer 是一个类，它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新：


回去把组件化debug下就行理清楚一下

defineReactive 函数最开始初始化 Dep 对象的实例，接着拿到 obj 的属性描述符，然后对子对象递归调用 observe 方法，这样就保证了无论 obj 的结构多复杂，它的所有子属性也能变成响应式的对象，这样我们访问或修改 obj 中一个嵌套较深的属性，也能触发 getter 和 setter。最后利用 Object.defineProperty 去给 obj 的属性 key 添加 getter 和 setter。而关于 getter 和 setter 的具体实现，我们会在之后介绍。


🎸实际上用js原生操作dom的情况下我们会直接去操作设置dom 这是我们开发人员已经知道会发生哪里的 这部分dom为什么会改变 那是因为关联的数据变化了

所以通过数据操作dom  那怎么局部去修改  也就是diff比较

还有是重新生成的   <----理解这句话





### vue的依赖收集和派发更新

它使得当被设置的对象被读取的时候会执行 getter 函数，而在当被赋值的时候会执行 setter 函数。 

什么时候需要get就是我们模板渲染成真实dom的时候就是需要读取data对象的属性

什么是依赖收集：当你一个变量没有被使用的时候（使用的概念是有跟dom联系在一起） 如果它被改变了

就没必要去更新dom了吧 所以这时候得去收集依赖

当 render function 被渲染的时候，因为会读取所需对象的值，所以会触发 getter 函数进行「 依赖收
集」，「 依赖收集」的目的是将观察者 Watcher 对象存放到当前闭包中的订阅者 Dep 的 subs 中



❗️把一个对象具有getter setter的属性 称为响应式属性

Observer 是一个类，它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新：

defineReactive 的功能就是定义一个响应式对象，给对象动态添加 getter 和 setter

https://zhuanlan.zhihu.com/p/45081605

所以，Vue要能够知道一个数据是否被使用，实现这种机制的技术叫做依赖收集根据Vue官方文档的介绍
所以在getter里，我们进行依赖收集（所谓依赖，就是这个组件所需要依赖到的数据），当依赖的数据被设置时，setter能获得这个通知，从而告诉render()函数进行重新计算



观察者的作用：观察的目标发生改变，`通知`....

1、角色
Vue源码中实现依赖收集，实现了三个类： - Dep：扮演观察目标的角色，每一个数据都会有Dep类实例，它内部有个subs队列，subs就是subscribers的意思，保存着依赖本数据的观察者，当本数据变更时，调用dep.notify()通知观察者 - Watcher：扮演观察者的角色，进行观察者函数的包装处理。如render()函数，会被进行包装成一个Watcher实例 - Observer：辅助的可观测类，数组/对象通过它的转化，可成为可观测数据


我们会发现，上述vue依赖收集的场景，正是一种一对多的方式（一个数据变更了，多个用到这个数据的地方要能够做出处理），而且，依赖的数据变更了，就一定要做出处理，所以观察者模式天然适用于解决依赖收集的问题。 那么，在Vue依赖收集里：谁是观察者？谁是观察目标？ 显然： - 依赖的数据是观察目标 - 视图、计算属性、侦听器这些是观察者

Dep：扮演观察目标的角色，每一个数据都会有Dep类实例，它内部有个subs队列，subs就是subscribers的意思，保存着依赖本数据的观察者，当本数据变更时，调用dep.notify()通知观察者


Watcher：扮演观察者的角色，进行观察者函数的包装处理


Observer：辅助的可观测类，数组/对象通过它的转化，可成为可观测数据


总结来说就是： `只为对象/数组 实例一个Observer类的实例`，而且就只会实例化一次，并且需要数据是可配置的时候才会实例化Observer类实例。 那么，Observer类又干嘛了呢？且看以下源码：

Watcher扮演的角色是观察者，它关心数据，在数据变化后能够获得通知，并作出处理。一个组件里可以有多个Watcher类实例，Watcher类包装观察者函数，而观察者函数使用数据。 观察者函数经过Watcher是这么被包装的： - 模板渲染：this._watcher = new Watcher(this, render, this._update) - 计算属性：

computed: {
    name() {
        return `${this.firstName} ${this.lastName}`;
    }
}
/*
会形成
new Watcher(this, function name() {
    return `${this.firstName} ${this.lastName}`
}, callback);
*/
在Watcher类里做的事情，概括起来则是： 1、传入组件实例、观察者函数、回调函数、选项，然后我们先解释清楚4个变量：deps、depIds、newDeps、newDepIds，它们的作用如下： - deps：缓存上一轮执行观察者函数用到的dep实例 - depIds：Hash表，用于快速查找 - newDeps：存储本轮执行观察者函数用到的dep实例 - newDepIds：Hash表，用于快速查找

2、进行初始求值，初始求值时，会调用watcher.get()方法 3、watcher.get()会做以下处理：初始准备工作、调用观察者函数计算、事后清理工作 4、在初始准备工作里，会将当前Watcher实例赋给Dep.target，清空数组newDeps、newDepIds 5、执行观察者函数，进行计算。由于数据观测阶段执行了defineReactive()，所以计算过程用到的数据会得以访问，从而触发数据的getter，从而执行watcher.addDep()方法，将特定的数据记为依赖 6、对每个数据执行watcher.addDep(dep)后，数据对应的dep如果在newDeps里不存在，就会加入到newDeps里，这是因为一次计算过程数据有可能被多次使用，但是同样的依赖只能收集一次。并且如果在deps不存在，表示上一轮计算中，当前watcher未依赖过某个数据，那个数据相应的dep.subs里也不存在当前watcher，所以要将当前watcher加入到数据的dep.subs里 7、进行事后清理工作，首先释放Dep.target，然后拿newDeps和deps进行对比，接着进行以下的处理： - newDeps里不存在，deps里存在的数据，表示是过期的缓存数据。相应的，从数据对应的dep.subs移除掉当前watcher - 将newDeps赋给deps，表示缓存本轮的计算结果，这样子下轮计算如果再依赖同一个数据，就不需要再收集了

8、当某个数据更新时，由于进行了setter拦截，所以会对该数据的dep.subs这一观察者队列里的watchers进行通知，从而执行watcher.update()方法，而update()方法会重复求值过程（即为步骤3-7），从而使得观察者函数重新计算，而render()这种观察者函数重新计算的结果，就使得视图同步了最新的数据



computed-render -> normal-watcher -> render-watcher



观察者存在多种  也就是肯定存在多个watcher 计算属性 watch函数 还有渲染watch(render watch))

watch(er)就是我们所说的观察者  我们的目的就是观察到你变为作出通知反应 比如通知render改更新了

Dep--->dependence (依赖)


每个数据比如a他有哪些依赖(我们需要去收到这些依赖 通知观察者有这些依赖)


回顾一下，Vue响应式原理的核心就是Observer、Dep、Watcher。
Observer中进行响应式的绑定，在数据被读的时候，触发get方法，执行Dep来收集依赖，也就是收集Watcher。
在数据被改的时候，触发set方法，通过对应的所有依赖(Watcher)，去执行更新。比如watch和computed就执行开发者自定义的回调方法。

作者：苍耳QAQ
链接：https://juejin.im/post/5cf3cccee51d454fa33b1860
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


Observer是使数据变为响应式数据

Watcher是观察者（跟setter区分开来）

Dep-->Dependence是收集依赖

实际上这里为什么是要观察者模式 （是因为收集完依赖必定要需要观察者）


解释： 有些地方说观察者模式和发布/订阅模式是一样的，其实是不完全等同的，发布/订阅模式中，其解耦能力更近一步，发布者只要做好消息的发布，而不关心消息有没有订阅者订阅。而观察者模式则要求两端同时存在

https://zhuanlan.zhihu.com/p/45081605


上面我们说每一个数据都会有一个Dep类的实例，具体是什么意思呢？在讲解数据观测之前，我们先给个具体的例子，表明处理前后的变化，如下所示的对象（即为options.data）

{
    a: 1,
    b: [2, 3, 4],
    c: {
        d: 5
    }
}
在配置完数据观测后，会变成这样子：

{
    __ob__, // Observer类的实例，里面保存着Dep实例__ob__.dep => dep(uid:0)
    a: 1,   // 在闭包里存在dep(uid:1)
    b: [2, 3, 4], // 在闭包里存在着dep(uid:2)，还有b.__ob__.dep => dep(uid:4)
    c: {
        __ob__, // Observer类的实例，里面保存着Dep实例__ob__.dep => dep(uid:5)
        d: 5 // 在闭包里存在着dep(uid:6)
    }
}

如果是普通数据非引用数据类型？

总结来说就是： 只为对象/数组 实例一个Observer类的实例，而且就只会实例化一次，并且需要数据是可配置的时候才会实例化Observer类实例。 那么，Observer类又干嘛了呢？且看以下源码：



总结起来，就是： - 将Observer类的实例挂载在__ob__属性上，提供后续观测数据使用，以及避免被重复实例化。然后，实例化Dep类实例，并且将对象/数组作为value属性保存下来 - 如果value是个对象，就执行walk()过程，遍历对象把每一项数据都变为可观测数据（调用defineReactive方法处理） - 如果value是个数组，就执行observeArray()过程，递归地对数组元素调用observe()，以便能够对元素还是数组的情况进行处理



你要明白 数据驱动视图  的做法给我想会怎么做 不考虑diff 
我们这样很方便的想到  数据改变 重新生成视图  这样就不会顾及到 如何插入新建dom 小范围的

我们直接大范围的更新  他是这样思考dom操作的  哎呀不知道怎么讲


你想想 a和b兄弟 a改变了 b没有改变 那就可能会同事更新页面

不像我们直接操作dom 只操作b的dom

但是直接操作dom很容易引起回流和重绘

我们要通知那个使用到数据的地方，而使用这个数据的地方有很多，而且类型还不一样，有可能是模板，有可能是用户写的一个 watch，所以这个时候我们需要抽象出一个能集中处理这些不同情况的类，然后我们在依赖收集的阶段只收集这个封装好的类的实例进来，通知也只通知它一个，然后它在负责通知其他地方，所以我们要抽象的这个东西需要先起一个好听的名字，嗯，就叫它watcher吧~

所以现在可以回答上面的问题，收集谁？？收集 Watcher。


收集依赖实际就是去收集Watcher

收集到Dep中，Dep是专门用来存储依赖的。

收集谁，换句话说是当属性发生变化后，通知谁。

收集这些依赖的目的就是数据改变去通知这些依赖  Watcher就是干这种事 我们去通知Watcher我发生变化了 Watcher通知对应的目标去渲染


依赖和观察者

我手机的依赖就是这些观察者  观察者就是去观察这些被使用的数据 这样一想  我们去收集watcher就是我们要的依赖

你可以这样想 render函数需要我们的数据 他就是依赖 所以他派出render watcher去观察这些数据  一旦有变动就去通知

本来你可以这样想依赖肯定是render函数 因为render函数需要这些数据 但是它交给watcher去实现了 去观察这些数据

watcher 是一个中介的角色，数据发生变化通知给 watcher，然后watcher在通知给其他地方。

每个数据被get时候 就会收集依赖


我们定义了一个 Observer 类，他的职责是将 data 转换成可以被侦测到变化的 data，并且新增了对类型的判断，如果是 value 的类型是 Array 循环 Array将每一个元素丢到 Observer 中。


https://github.com/berwin/Blog/issues/17  <-----讲的太好了


Observer 类  -->包含了defineReactive方法 它是总的讲=将data数据转化为响应数据 当然单独的defineReactive也行

Observer 类它就是对defineReactive的封装


我们定义了一个 Observer 类，他的职责是将 data 转换成可以被侦测到变化的 data，并且新增了对类型的判断，如果是 value 的类型是 Array 循环 Array将每一个元素丢到 Observer 中。

并且在 value 上做了一个标记 __ob__，这样我们就可以通过 value 的 __ob__ 拿到Observer实例，然后使用 __ob__ 上的 dep.notify() 就可以发送通知啦。




响应式数据 --> 就是数据改变了 就会去通知依赖要准备作出操作了
所以这个数据具备通知依赖的方法


收集依赖的过程 肯定是我去访问使用这个数据 才会被这个数据收集到


也就是响应式数据具备收集依赖功能和派发更新的功能


Dep是存储依赖的地方sub放watcher


observe 是用来观察数据变化的


### methods
```javascript
 // 你应该要理解成methods是个方法对象 fn就相当于在外部的函数声明一样 只不过这里是对象 这个认知我提醒过很多次了⚠️
 // 这样一想确实突然醒悟
  methods:{

    fn(){

    }
  }
```

```javascript
Vue.prototype._initMethods = function () {
  var methods = this.$options.methods
  if (methods) {
    for (var key in methods) {
      this[key] = bind(methods[key], this)
    }
  }
}
```
想想我们为什么可以直接this.fn()  是因为经历过这个步骤了
this[key] = bind(methods[key], this)

this.$options 是初始化当前vue实例时传入的参数，举个栗子

```javascript
const vm = new Vue({
  data: data,
  methods: {},
  computed: {},
  ...
})
```
上面实例化Vue的时候，传递了一个Object字面量，这个字面量就是 this.$options

清楚了这些之后，我们看这个逻辑其实就是把 this.$options.methods 中的方法绑定到this上，这也就不难理解为什么我们可以使用 this.xxx 来访问方法了

⚠️就是以后写methods方法不会再傻傻那种死记单一理解成方法 实际就是写的methods对象 以前是没有这种认知的

### data

Data 跟 methods 类似，但是比 methods 高级点，主要高级在两个地方，proxy 和 observe

proxy

Data 没有直接写到 this 中，而是写到 this._data 中（注意：this.$options.data 是一个函数，data是执行函数得到的），然后在 this 上写一个同名的属性，通过绑定setter和getter来操作 this._data 中的数据


```javascript

Vue.prototype._proxy = function (key) {
  // isReserved 判断 key 的首字母是否为 $ 或 _
  if (!isReserved(key)) {
    var self = this
    Object.defineProperty(self, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter () {
        return self._data[key]
      },
      set: function proxySetter (val) {
        self._data[key] = val
      }
    })
  }
}

```
首先所有的data属性key都会经过proxy代理后 Object.defineProperty这里是给我self也就是vm添加属性

我访问这个属性就把self._data[key] return回去


我现在好奇_data是怎么来的
`Data 没有直接写到 this 中，而是写到 this._data 中`
`this.$options.data 是一个函数，data是执行函数得到的`

```javascript
   

function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }

```

proxy还顺便做下错误❌处理情况，很好用


### observe

observe 是用来观察数据变化的，先看一段源码：

```javascript

Vue.prototype._initData = function () {
  var dataFn = this.$options.data
  var data = this._data = dataFn ? dataFn() : {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object.',
      this
    )
  }
  var props = this._props
  // proxy data on instance
  var keys = Object.keys(data)
  var i, key
  i = keys.length
  while (i--) {
    key = keys[i]
    // there are two scenarios where we can proxy a data key:
    // 1. it's not already defined as a prop
    // 2. it's provided via a instantiation option AND there are no
    //    template prop present
    if (!props || !hasOwn(props, key)) {
      this._proxy(key)
    } else if (process.env.NODE_ENV !== 'production') {
      warn(
        'Data field "' + key + '" is already defined ' +
        'as a prop. To provide default value for a prop, use the "default" ' +
        'prop option; if you want to pass prop values to an instantiation ' +
        'call, use the "propsData" option.',
        this
      )
    }
  }
  // observe data
  observe(data, this)
}

```

上面源码中可以看到先处理 _proxy，之后把 data 传入了 observe 中， observe 会把 `data 中的key`(就是data的属性成员)转换成getter与setter（变为响应式数据），当触发getter时会收集依赖，当触发setter时会触发消息，更新视图，具体可以看之前写的一篇文章《深入浅出 - vue之深入响应式原理》,


什么是响应式数据 自带getter setter getter是数据具有收集依赖的能力 setter是具有派发更新的能力⚠️

那么问题来了什么是oberve和observer

总结起来 data 其实做了两件事

让this.$options.data 中的数据可以在 this 中访问
观察数据的变化做出不同的响应




### computed

想想computed里面的函数我们直接这样this.xxx就能访问到（函数必定具有return


计算属性在vue中也是一个非常常用的功能，而且好多同学搞不清楚它跟watch有什么区别，这里就详细说说计算属性到底是什么，以及它是如何工作的

简单点说，Computed 其实就是一个 getter 和 setter，(这句话的意思Computed里面的key就是vue响应式对象)经常使用 Computed 的同学可能知道，Computed 有几种用法）


```javascript

var vm = new Vue({
  data: { a: 1 },
  computed: {
    // 用法一： 仅读取，值只须为函数
    aDouble: function () {
      return this.a * 2
    },
    // 用法二：读取和设置
    aPlus: {
      get: function () {
        return this.a + 1
      },
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})

```

当依赖的数据发生变化时 watcher 可以帮助我们接收到消息


先说上面那两种用法，一种 value 的类型是function，一种 value 的类型是对象字面量，对象里面有get和set两个方法，talk is a cheap, show you a code...

```javascript

function noop () {}
Vue.prototype._initComputed = function () {
  var computed = this.$options.computed
  if (computed) {
    for (var key in computed) {
      var userDef = computed[key]
      var def = {
        enumerable: true,
        configurable: true
      }
      if (typeof userDef === 'function') {
        def.get = makeComputedGetter(userDef, this)
        def.set = noop
      } else {
        def.get = userDef.get
          ? userDef.cache !== false
            ? makeComputedGetter(userDef.get, this)
            : bind(userDef.get, this)
          : noop
        def.set = userDef.set
          ? bind(userDef.set, this)
          : noop
      }
      Object.defineProperty(this, key, def) // 添加属性 属性自带了getter setter 这样一分析确实轻松很多
    }
  }
}

```

可以看到对两种不同的类型做了两种不同的操作，function 类型的会把函数当做 getter 赋值给 def.get

而 object 类型的直接取 def.get 当做 getter 取def.set 当做 setter。

#### 理解Computed对象的缓存作用是什么❓

我们说过了Computed对象成员属性本质上就是响应式对象 当我们访问这个对象 实际就是经过了getter属性  它内部返回一个函数

假设这个函数是个复杂的计算的函数 那我们每次都访问就要经历一次计算 这样是浪费性能的 所以这是与methods区别的原因 <---这就是问题的本质啊

所以，对于任何复杂逻辑，你都应当使用计算属性。❗️❗️❗️
复杂逻辑计算果断用Computed❗️❗️❗️ <----终于想明白了 以前斯懂非懂



那么他是怎么做缓存的？


当 watcher 接收到消息时，会执行 update 这个方法，这个方法因为我们的 watcher 是 lazy 为 true 的所以走第一个判断条件里的逻辑，里面很直接，就是把 this.dirty 设置了 true

这里就又引发了一个问题，我们怎么知道 getter 中到底有哪些依赖，毕竟使用Computed开发的人并不会告诉我们他用到了哪些依赖，那我们怎么知道他使用了哪些依赖？


依赖就是我们所说的watcher  一般的我认为vue里面有这三种依赖 render computed watch

Dep:就是用来存放依赖的

vue在全局弄了一个 Dep.target 用来存当前的watcher，全局只能同时存在一个





醒悟 ：所以我们已经研究了大部分为什么可以this.xxx





#### 响应式原理

但这就引发了一个问题，我们怎么知道当 setter 触发的时候更新哪个DOM？

对 这是我一直想表达的问题





我们要知道谁收集依赖？ 依赖是谁？依赖存在哪里?

谁收集依赖实际就是数据在收集 因为响应式数据需要知道谁在使用它

### 依赖收集放在哪？也就是依赖存在哪里?

但是这样写有点耦合，我们把依赖收集这部分代码封装起来，写成下面的样子：

Dep类专门存放依赖的

let dep = new Dep()        // 修改

这一次代码看起来清晰多了，顺便回答一下上面问的问题，依赖收集到哪？收集到Dep中，Dep是专门用来存储依赖的。

收集谁？

上面我们假装 window.target 是需要被收集的依赖，细心的同学可能已经看到，上面的代码 window.target 已经改成了 Dep.target，那 Dep.target是什么？我们究竟要收集谁呢？？

就是收集watcher

watcher 是一个中介的角色，数据发生变化通知给 watcher，然后watcher在通知给其他地方。



### 怎么收集依赖的

vue这样想的 当前下只有一个watcher（假设是render watcher 实际你就是这样认为当前模板准备要去读data的key,此时这个时候的全局Dep.target是render watcher）,这个watcher只要去读 我就把push到我这个响应式数据里的Dep类里的储存依赖之地sub


原来Dep.target是这样

这段代码可以把自己主动 push 到 data.a.b.c 的 Dep 中去。

因为我在 get 这个方法中，先把 Dep.traget 设置成了 this，也就是当前watcher实例，然后在读一下 data.a.b.c 的值。

因为读了 data.a.b.c 的值，所以肯定会触发 getter。

触发了 getter 上面我们封装的 defineReactive 函数中有一段逻辑就会从 Dep.target 里读一个依赖 push 到 Dep 中。

所以就导致，我只要先在 Dep.target 赋一个 this，然后我在读一下值，去触发一下 getter，就可以把 this 主动 push 到 keypath 的依赖中，有没有很神奇~

依赖注入到 Dep 中去之后，当这个 data.a.b.c 的值发生变化，就把所有的依赖循环触发 update 方法，也就是上面代码中 update 那个方法。

update 方法会触发参数中的回调函数，将value 和 oldValue 传到参数中。

所以其实不管是用户执行的 vm.$watch('a.b.c', (value, oldValue) => {}) 还是模板中用到的data，都是通过 watcher 来通知自己是否需要发生变化的。



oberve的功能就是用来监测数据的变化 observe而不是observer类 

observer类 是让数据转化为响应式数据 你可以理解是包装defineReactive

黄毅老师的理解
defineReactive 的功能就是定义一个响应式对象，给对象动态添加 getter 和 setter
Observer 是一个类，它的作用是给对象的属性添加 getter 和 setter

1、initData
现在我们重点分析下initData，这里主要做了两件事，一是将_data上面的数据代理到vm上，二是通过执行 *observe(data, true / asRootData */)**将所有data变成可观察的，即对data定义的每个属性进行getter/setter操作，这里就是Vue实现响应式的基础；observe的实现如下 src/core/observer/index.js

实际就是开始操作数据 -->变为响应式数据和检测  observe-->observer-->defineReactive

可以这样理解  哎呀就是一个函数  根本没有可比性  observe与observer没有可比性❗❗❗


### 计划

我们知道了原理还要知道怎么去实现
这个周期《深入浅出Vue.js》要跟着实现