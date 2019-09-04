> 学习目标学会vue组件化 学会怎么去封装一个基础组件 学会使用vue的高级用法 了解vue的底层逻辑

### (computed)计算属性

模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的。在模板中放入太多的逻辑会让模板过重且难以维护。例如：

```HTML
    
    <div id="example">
     {{ message.split('').reverse().join('') }}
   </div>

```

在这个地方，模板不再是简单的声明式逻辑。你必须看一段时间才能意识到，这里是想要显示变量 message 的翻转字符串。当你想要在模板中多次引用此处的翻转字符串时，就会更加难以处理。

所以，对于任何复杂逻辑，你都应当使用计算属性。

```HTML
    
    <div id="example">
        <p>Original message: "{{ message }}"</p>
        <p>Computed reversed message: "{{ reversedMessage }}"</p>
   </div>

```
```javascript
  
  var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
})

```

### 计算属性缓存 vs 方法
❗️❗️但会想到methd也能实现

区别就是缓存

我们为什么需要缓存？假设我们有一个性能开销比较大的计算属性 A，它需要遍历一个巨大的数组并做大量的计算。然后我们可能有其他的计算属性依赖于 A 。如果没有缓存，我们将不可避免的多次执行 A 的 getter！如果你不希望有缓存，请用方法来替代。

3.1 computed特性
1.是计算值，
2.应用：就是简化tempalte里面{{}}计算和处理props或$emit的传值
3.具有缓存性，页面重新渲染值不变化,计算属性会立即返回之前的计算结果，而不必再次执行函数

3.2 watch特性
1.是观察的动作，
2.应用：监听props，$emit或本组件的值执行异步操作
3.无缓存性，页面重新渲染时值不变化也会执行


我们首次得知道vue这一特性，才会真正去理解computed属性
 当一个 Vue 实例被创建时，它将 data 对象中的所有的属性加入到 Vue 的响应式系统中。
 当这些属性的值发生改变时，视图将会产生“响应”，即匹配更新为新的值。

 总结computed一句话：
 很多情况下使用到computed我们要把computed里的函数当做data内的属性理解才能弄明白  实际上它确实被当做data内的属性对待


实际上我觉得用watch跟computed做比较没什么意义，因为我使用watch监听变量 是为了使用它的回调函数 而computed内的方法你要把它完完全全理解成data内的属性
一旦改变 自动响应到view层
