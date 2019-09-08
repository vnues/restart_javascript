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
前者是es6的module中的语法,后者是创建一个vue实例.
我想引起你的误解是因为你用了webpack开发vue同时用了vue-loader.
其实这最终会通过vue-loader处理成原生js代码.即无论如何都要new Vue()

在生成、导出、导入、使用 Vue 组件的时候，常常被位于不同文件的 new Vue() 和 export default{} 。


      首先，Vue 是什么？ po 主的理解是 Vue 就是一个构造函数，生成的实例是一个巨大的对象，可以包含数据、模板、挂载元素、方法、生命周期钩子等选项。


所以渲染的时候，可以使用构造 Vue 实例的方式来渲染相应的 html 页面：

new Vue({
    el: '#app'
    ...
})

那么 export default {} 又是？
   在复用组件的时候用到的。

   假设我们写了一个单页面组件 A 文件，而在另一个文件 B 里面需要用到它，那么就要用 ES6 的 import/export 语法 ，在文件 A 中定义输出接口 export **，在文件 B 中引入 import **，然后再生成一个 Vue 实例 new Vue (**)，把引入的组件用起来，这样就可以复用组件 A 去配合文件 B 生成 html 页面了。
    所以在复用组件的时候，export 和 new Vue 缺一不可。


```javascript
  new Vue({
  el: "#app",
  // 也可以这样写?
   data() {
    return{
          msg: 'Hello, Vue.js.'
    }
  },
  components: {
    MyComponent
  }
})
```

为什么组件中的 data 必须是一个函数，然后 return 一个对象，而 new Vue 实例里，data 可以直接是一个对象？

因为组件是用来复用的，且 JS 里对象是引用关系，如果组件中 data 是一个对象，那么这样作用域没有隔离，子组件中的 data 属性值会相互影响，如果组件中 data 选项是一个函数，那么每个实例可以维护一份被返回对象的独立的拷贝，组件实例之间的 data 属性值不会互相影响；而 new Vue 的实例，是不会被复用的，因此不存在引用对象的问题。

作者：我是你的超级英雄
链接：https://juejin.im/post/5d59f2a451882549be53b170
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

也就是这么理解 export default出去的是vue组件

new Vue是实例不存在引用的情况所以data可以是对象


好👌这个作为面试题不错


那么问题来了 vue组件和vue实例的区别



但是看vue官方文档说所有的Vue组件都是Vue实例
一般我把组件分为三种：

根组件，内部可以含有子组件，是整个组件树的最上层。
子组件，非最上层的组件，当然内部也可以包含更低层的子组件。
游离组件：通过 new Vue('').$mount(xx) 的方式向组件树之外的 body中挂载新的实例（很多通知、弹窗性的组件都是这么实现的），一般是临时性质的，内部可以包含子组件，但是只有简单的功能和结构，其实也是本身这个小组件树的最上层。


没有实质性的区别，一个组件就是一个 vue 实例，只不过大多数情况下作为组件的实例是父级组件来初始化的。硬要说组件特殊的地方，无非是组件的 data 是一个方法，因为组件可以被生成多次，如果使用一个对象的话那么这个对象将被所有组件实例共享。另外在 Vue 2 中引入了 Functional Component 的概念，Functional Component 不再是一个 vue 实例了，它只渲染视图而不能进行逻辑操作，类似于 Vue 1 中 partial 的概念。

要想弄清楚它就来试试Vue实例


我们不用脚手架来写 直接引入vue.js来写


如果你还在阅读，说明你使用了诸如 Babel 和 webpack 的模块系统。在这些情况下，我们推荐创建一个 components 目录，并将每个组件放置在其各自的文件中。

然后你需要在局部注册之前导入每个你想使用的组件。例如，在一个假设的 ComponentB.js 或 ComponentB.vue 文件中



```javascript
 
   new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})

```
组件实际可以理解成Vue实例

只不过你真要对比就是组件的data是个函数

而实例Vue是data


这个的知识点对我们debug代码很有用

因为后面就是实例Vue和组件

我倒要看看这两者是如何实现的

我们的src的vue代码是要经过编译的 比如flow类型注解
肯定不会麻烦开发者还有帮你编译



vue和react区别

vue把东西都封装的很好让你用

而react是没有封装让你随心所欲去发挥

比如vue的template模板还要编译成render函数，虽然vue也提供了render函数给开发者使用

帮我们封装了这一层  封装太多的意图就是为了简化开发 但是难以发现问题

这是自己领悟的重要一点❗️❗️❗️


### process.env.NODE_ENV

这个用于判断打包构建运行的 一般是webpack起的服务就有这个变量

但是你如果去查看buid代码后vue.js是没有这个东西的

所以我们就理解成这个东西是用来判断所处于的环境就行  只要明白这点就行

还🈶注意什么情况下才会取到



### new Vue发生了什么

Vue 初始化主要就干了几件事情，合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化 data、props、computed、watcher 等等。


❗️❗️❗️注意我们的用的包使用到底是什么文件 如果有pakcage.json就看它的入口

否则就是index.js作为入口这点认知很重要  决定你debugger有没有效果


### 数据如何渲染成dom的


接下来我们重点分析带 compiler 版本的 $mount 实现，因为抛开 webpack 的 vue-loader，我们在纯前端浏览器环境分析 Vue 的工作原理，有助于我们对原理理解的深入。 --- 数据如何渲染成dom的


这段代码首先缓存了原型上的 $mount 方法，再重新定义该方法，我们先来分析这段代码。首先，它对 el 做了限制，Vue 不能挂载在 body、html 这样的根节点上。接下来的是很关键的逻辑 —— 如果没有定义 render 方法，则会把 el 或者 template 字符串转换成 render 方法。这里我们要牢记，在 Vue 2.0 版本中，所有 Vue 的组件的渲染最终都需要 render 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 el 或者 template 属性，最终都会转换成 render 方法，那么这个过程是 Vue 的一个“在线编译”的过程，它是调用 compileToFunctions 方法实现的，编译过程我们之后会介绍。最后，调用原先原型上的 $mount 方法挂载。


生命周期源码是怎么去实现的

监听触发


noop编程界常用于表示空函数


Vue的watch就是观察者模式


### Vue的响应式系统

Vue 最独特的特性之一，是其非侵入性的响应式系统。数据模型仅仅是普通的JavaScript 对象，而当你修改它们时，视图会进行更新，这使得状态管理非常简单直接，我们可以只关注数据本身，而不用手动处理数据到视图的渲染，避免了繁琐的 DOM 操作，提高了开发效率。

vue 的响应式系统依赖于三个重要的类：Dep 类、Watcher 类、Observer 类，然后使用发布订阅模式的思想将他们揉合在一起（不了解发布订阅模式的可以看我之前的文章发布订阅模式与观察者模式）。


Observe是对数据进行监听，Dep是一个订阅器，每一个被监听的数据都有一个Dep实例，Dep实例里面存放了N多个订阅者（观察者）对象watcher。


事件的设计模式本来就是发布和订阅


### 观察者模式（Observer Pattern）

观察者模式定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新。观察者模式属于行为型模式，行为型模式关注的是对象之间的通讯，观察者模式就是观察者和被观察者之间的通讯。



比如一个变量依赖于c=a+b  a变化了 b也应该响应变化  就是要考虑这种场景


设计模式之前用于面向对象的术语❗️❗️❗️


什么是收集依赖，通知观察者

Watcher扮演的角色是订阅者/观察者，他的主要作用是为观察属性提供回调函数以及收集依赖（如计算属性computed，vue会把该属性所依赖数据的dep添加到自身的deps中），当被观察的值发生变化时，会接收到来自dep的通知，从而触发回调函数。，



normal-watcher
我们在 watch 中定义的，都属于这种类型，即只要监听的属性改变了，都会触发定义好的回调函数
computed-watcher
每一个 computed 属性，最后都会生成一个对应的 watcher 对象，但是这类 watcher 有个特点，我们拿上面的 b 举例：
属性 b 依赖 a，当 a 改变的时候，b 并不会立即重新计算，只有之后其他地方需要读取 b 的时候，它才会真正计算，即具备 lazy（懒计算）特性
render-watcher
每一个组件都会有一个 render-watcher, function () {↵ vm._update(vm._render(), hydrating);↵ }, 当 data/computed
中的属性改变的时候，会调用该 render-watcher 来更新组件的视图



访问对象属性时候 就会触发get
修改就是set


观察者模式和发布订阅模式最大的区别就是发布订阅模式有个事件调度中心。❗️❗️❗️


get---->收集依赖
set---->触发更新

触发更新我知道 收集依赖是什么  难道是收集那些订阅者❗️❗️❗️我觉得应该没错

为什么要收集依赖 因为比如 a订阅了发布者 b也订阅了发布者 但是c没有 c是a+b 这显然需要收集

我的理解就是这样继续深入学习了解



面试问：vue中有收集依赖，但是在哪里收集依赖的？？
是执行render函数生产vnode的时候，这时候才触发get


~~Vue是一个实现数据驱动视图的框架~~（废话，大家都知道，说重点） 我们都知道，Vue能够实现当一个数据变更时，视图就进行刷新，而且用到这个数据的其他地方也会同步变更；而且，这个数据必须是在有被依赖的情况下，视图和其他用到数据的地方才会变更。 所以，Vue要能够知道一个数据是否被使用，实现这种机制的技术叫做依赖收集根据Vue官方文档的介绍，其原理如下图所


就是有没有使用它 谁依赖了它
而且，这个数据必须是在有被依赖的情况下，视图和其他用到数据的地方才会变更

不然我写了一大堆数据 视图没有依赖数据的地方还要去更新就浪费资源了

依赖收集 就是收集视图依赖data的地方

https://juejin.im/entry/5bdab35d6fb9a0224e0e5794


Vue 的 _render 方法是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node。它的定义在 src/core/instance/render.js 文件中：


Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。


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


dom ---> render  那么到底对这个render做了什么  

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

执行这个render函数 call调用  createElement到底做了啥   $mount--> _render uppdate  -->最后把数据映射到dom上

肯定是生成虚拟Vnode此时的数据也是生成好的配置在Vnode上了  至于模板或者数据合法不由render函数那块去控制排查



isPrimitive方法判断是否为基础类型



❗️❗️❗️注意认清楚什么是文本节点

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

### render函数的三个参数

/**
    * createElement 本身也是一个函数，它有三个参数
    * 返回值: VNode，即虚拟节点
    * 1. 一个 HTML 标签字符串，组件选项对象，或者解析上述任何一种的一个 async 异步函数。必需参数。{String | Object | Function} - 就是你要渲染的最外层标签
    * 2. 一个包含模板相关属性的数据对象你可以在 template 中使用这些特性。可选参数。{Object} - 1中的标签的属性
    * 3. 子虚拟节点 (VNodes)，由 `createElement()` 构建而成，也可以使用字符串来生成“文本虚拟节点”。可选参数。{String | Array} - 1的子节点，可以用 createElement() 创建，文本节点直接写就可以
    */
————————————————
版权声明：本文为CSDN博主「__Amy」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/sansan_7957/article/details/83014838

突然想到为什么要扁平处理数组？？？？？


https://juejin.im/post/59b53a595188257e7406fe3d

目前来说， _createElement 比较重要的点是normalizeChildren(children) 和 simpleNormalizeChildren(children)方法。

simpleNormalizeChildren把二维数组拍平。([1,2,[3,4],5])





为什么需要拍平 使用v-for的情况


simpleNormalizeChildren 方法调用场景是 render 函数是编译生成的。理论上编译生成的 children 都已经是 VNode 类型的，但这里有一个例外，就是 functional component 函数式组件返回的是一个数组而不是一个根节点，所以会通过 Array.prototype.concat 方法把整个 children 数组打平，让它的深度只有一层。

normalizeChildren 方法的调用场景有 2 种，一个场景是 render 函数是用户手写的，当 children 只有一个节点的时候，Vue.js 从接口层面允许用户把 children 写成基础类型用来创建单个简单的文本节点，这种情况会调用 createTextVNode 创建一个文本节点的 VNode；另一个场景是当编译 slot、v-for 的时候会产生嵌套数组的情况，会调用 normalizeArrayChildren 方法，接下来看一下它的实现：

### vue的函数式组件

然后再对应的节点遍历其children 会发现是个数组当然得打平来

理论上编译生成的 children 都已经是 VNode 类型的，但这里有一个例外，就是 functional component 函数式组件返回的是一个数组而不是一个根节点，所以会通过 Array.prototype.concat 方法把整个 children 数组打平

只在一层做打平 为什么是这样 因为
because functional components already normalize their own children.



那么问题来了


vue的函数式组件怎么写

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
版权声明：本文为CSDN博主「前端精髓」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/wu_xianqiang/article/details/88891701



首先vnode和oldVnode都是之前定义好的，所以并不成立 if (isUndef(vnode)) {}

因为isRealElement为true，所以进入if (isRealElement) {}，进而 if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {}也不成立，因为hydrating 为false，所以 if (isTrue(hydrating)) {} 为false。之后执行到oldVnode = emptyNodeAt(oldNode)
在emptyNodeat中执行的实际上是将把真实的dom转化为vnode



Virtual DOM 除了它的数据结构的定义，映射到真实的 DOM 实际上要经历 VNode 的 create、diff、patch 等过程。那么在 Vue.js 中，VNode 的 create 是通过之前提到的 createElement 方法创建的，我们接下来分析这部分的实现。

diff算法是在createElement阶段

--->就是render阶段



怎么做到数据驱动



当你看一个项目代码的时候，最好是能找到一条主线，先把大体流程结构摸清楚，再深入到细节，逐项击破，拿Vue举个栗子：假如你已经知道Vue中数据状态改变后会采用virtual DOM的方式更新DOM，这个时候，如果你不了解virtual DOM，那么听我一句“暂且不要去研究内部具体实现，因为这会是你丧失主线”，而你仅仅需要知道virtual DOM分为三个步骤：

一、createElement(): 用 JavaScript对象(虚拟树) 描述 真实DOM对象(真实树)
二、diff(oldNode, newNode) : 对比新旧两个虚拟树的区别，收集差异
三、patch() : 将差异应用到真实DOM树

重点啊❗️❗️❗️


├── build --------------------------------- 构建相关的文件，一般情况下我们不需要动
├── dist ---------------------------------- 构建后文件的输出目录
├── examples ------------------------------ 存放一些使用Vue开发的应用案例
├── flow ---------------------------------- 类型声明，使用开源项目 [Flow](https://flowtype.org/)
├── package.json -------------------------- 不解释
├── test ---------------------------------- 包含所有测试文件
├── src ----------------------------------- 这个是我们最应该关注的目录，包含了源码
│   ├── entries --------------------------- 包含了不同的构建或包的入口文件
│   │   ├── web-runtime.js ---------------- 运行时构建的入口，输出 dist/vue.common.js 文件，不包含模板(template)到render函数的编译器，所以不支持 `template` 选项，我们使用vue默认导出的就是这个运行时的版本。大家使用的时候要注意
│   │   ├── web-runtime-with-compiler.js -- 独立构建版本的入口，输出 dist/vue.js，它包含模板(template)到render函数的编译器
│   │   ├── web-compiler.js --------------- vue-template-compiler 包的入口文件
│   │   ├── web-server-renderer.js -------- vue-server-renderer 包的入口文件
│   ├── compiler -------------------------- 编译器代码的存放目录，将 template 编译为 render 函数
│   │   ├── parser ------------------------ 存放将模板字符串转换成元素抽象语法树的代码
│   │   ├── codegen ----------------------- 存放从抽象语法树(AST)生成render函数的代码
│   │   ├── optimizer.js ------------------ 分析静态树，优化vdom渲染
│   ├── core ------------------------------ 存放通用的，平台无关的代码
│   │   ├── observer ---------------------- 反应系统，包含数据观测的核心代码
│   │   ├── vdom -------------------------- 包含虚拟DOM创建(creation)和打补丁(patching)的代码
│   │   ├── instance ---------------------- 包含Vue构造函数设计相关的代码
│   │   ├── global-api -------------------- 包含给Vue构造函数挂载全局方法(静态方法)或属性的代码
│   │   ├── components -------------------- 包含抽象出来的通用组件
│   ├── server ---------------------------- 包含服务端渲染(server-side rendering)的相关代码
│   ├── platforms ------------------------- 包含平台特有的相关代码
│   ├── sfc ------------------------------- 包含单文件组件(.vue文件)的解析逻辑，用于vue-template-compiler包
│   ├── shared ---------------------------- 包含整个代码库通用的代码




// initMixin(Vue)    src/core/instance/init.js **************************************************
Vue.prototype._init = function (options?: Object) {}

// stateMixin(Vue)    src/core/instance/state.js **************************************************
Vue.prototype.$data
Vue.prototype.$set = set
Vue.prototype.$delete = del
Vue.prototype.$watch = function(){}

// renderMixin(Vue)    src/core/instance/render.js **************************************************
Vue.prototype.$nextTick = function (fn: Function) {}
Vue.prototype._render = function (): VNode {}
Vue.prototype._s = _toString
Vue.prototype._v = createTextVNode
Vue.prototype._n = toNumber
Vue.prototype._e = createEmptyVNode
Vue.prototype._q = looseEqual
Vue.prototype._i = looseIndexOf
Vue.prototype._m = function(){}
Vue.prototype._o = function(){}
Vue.prototype._f = function resolveFilter (id) {}
Vue.prototype._l = function(){}
Vue.prototype._t = function(){}
Vue.prototype._b = function(){}
Vue.prototype._k = function(){}

// eventsMixin(Vue)    src/core/instance/events.js **************************************************
Vue.prototype.$on = function (event: string, fn: Function): Component {}
Vue.prototype.$once = function (event: string, fn: Function): Component {}
Vue.prototype.$off = function (event?: string, fn?: Function): Component {}
Vue.prototype.$emit = function (event: string): Component {}

// lifecycleMixin(Vue)    src/core/instance/lifecycle.js **************************************************
Vue.prototype._mount = function(){}
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {}
Vue.prototype._updateFromParent = function(){}
Vue.prototype.$forceUpdate = function () {}
Vue.prototype.$destroy = function () {}



为什么review vue源码  就跟我之前review underscore的目标一样  review underscore的目标是为了了解函数式编程的实现


那么review vue的目标就是为了了解mvvm框架的实现


然后，调用了四个 init* 方法分别为：initLifecycle、initEvents、initState、initRender，且在 initState 前后分别回调了生命周期钩子 beforeCreate 和 created，而 initRender 是在 created 钩子执行之后执行的，看到这里，也就明白了为什么 created 的时候不能操作DOM了。因为这个时候还没有渲染真正的DOM元素到文档中。created 仅仅代表数据状态的初始化完成


 Object.defineProperty(target, key, sharedPropertyDefinition)

 为什么data里面的数据,可以用this.message表示

   function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

 因为这样vue源码是这样处理的

  Object.defineProperty(target, key, sharedPropertyDefinition)
  
  Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
  
  vue在这一步做了proxy handle处理


  ### 给我自己写个mvvm框架怎么写？
  
