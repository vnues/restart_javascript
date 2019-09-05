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