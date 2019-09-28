函数式编程库


链式调用

bind函数



表单 --->策略模式 if多层判断



vm表示组件实例，expOrFn表示要订阅的数据字段（字符串表示，例如a.b.c）或是一个要执行的函数，cb表示watcher运行后的回调函数，options是选项对象，包含deep、user、lazy等配置。


突然想到一个可以引用类型和值类型的面试问题

如果我data里面存在一个message 用window.a=this.messgage 赋值  然后通过{{window.a}}绑定在模板 会不会响应式


换做是Object对象






observe是一个函数 Observer是一个类

observe存在的意义就是检测一个数据是否是响应式数据 不是的话创建一个Observer类 是就直接返回

Observer这个类可以让传入的Object变为响应式Object


还有对面向对象思想重新认知下
❗️这个很重要

首先理解类的作用

你可以认为这个类是给对象增加能力或者基础 的能力  

类里面有constructor对象 就是来改造的



想想new fn()出来的对象 是不是像经过包装了 初始化 具有的某些能力和方法



鬼才啊



数组的收集依赖


我们对2外层包装一层原型方法a在a函数里面触依赖就行


清空数组操作

array.length=0
