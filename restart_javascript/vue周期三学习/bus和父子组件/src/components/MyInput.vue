<template>
  <div class="input">
    <input type="text" @keyup="handleKeyUp" @getChange="HandleGetChange" />
  </div>
</template>

<script>
export default {
  name: "Input",
  created() {
    // 实现监听
    // this.$on("getChange", function(value) {
    //   console.log("value", value);
    // });
    // 监听当前实例上的自定义事件。事件可以由vm.$emit触发。回调函数会接收所有传入事件触发函数的额外参数。
    this.$on("getChange1", function(value) {
      console.log("value", value);
    });
  },
  methods: {
    handleKeyUp(e) {
      this.$bus.$emit("getValue", e.target.value);
      // 演示一种特殊情况 就是我自定义的事件想要在自己的组件去触发
      // 确实可以啊 这样想 本来我们以前自定义事件目的是为了给子组件触发
      // 我们触发了这个方法 但是HandleGetChange并不会被执行 是因为我们还没对这个事件做监听
      // 我猜父子组件（理解好父子组件的概念）
      // @getChange="HandleGetChange" 跟this.$emit("getChange", e.target.value);❗️❗️❗️毫无任何联系
      // 题外话：我觉得这样写this.$emit(xxxx）已经帮我们注册好自定义事件了
      // this.$emit("getChange", e.target.value); // 真的有触发这个自定义事件 想清楚啊 这个写法bus异曲同工的思想
      // 触发当前实例上的事件。附加参数都会传给监听器回调。
      // 当前实例是MyInput组件 getChange是其MyInput的自定义事件
      // <input type="text" @keyup="handleKeyUp" @getChange="HandleGetChange" />而这样子的写法表示
      // getChange是input组件实例的方法 也就是只有input组件才能拿到这个自定义事件 我们父组件提供事件回调去监听
      // @getChange="HandleGetChange"这样子的写法把发布和监听一起做了
      // 题外话：我觉得这样写this.$emit(xxxx）已经帮我们注册好自定义事件了 ❗️❗️❗️
      // @getChange="HandleGetChange"现在才知道是绑定给组件的
      // ❗️❗️❗️那么突然想到以前的想法是错误的了还有刚刚上面 而我以为是<input type="text" @keyup="handleKeyUp" @getChange="HandleGetChange" />是父组件
      // 同步这个概念以前错误的认知<input type="text" @keyup="handleKeyUp" @getChange="HandleGetChange" />是子组件 父组件才是Myinput 之所以会出现这样的错误认识是
      // 是因为@keyup="handleKeyUp" @getChange="HandleGetChange" :value="value"
      // 尤其是@getChange="HandleGetChange"认为这是父组件 input里面的文件才是子组件   ❗️❗️❗️恶心的想法
      // 而父组件MyInput是给子组件传递值 绑定函数 怎么传值 父组件直接给子组件绑定个变量就能传递了
      // 还有我们的组件是Input这样的 而不是文件代码
      /*
        
          <template>
            <div id="app">
              <MyInput />
              <MyText />
            </div>
         </template>
        ❗️❗️❗️重新整理下结构 这里有两个子组件MyInput 这个父组件是app.vue
        父组件如何给子组件传递值<SelectInput :value=value/> 这块:value=value就是父组件对子组件的操作  直接给子组件绑定
        SelectInput以前是怎么认为它是父组件 乱来的逻辑  纠正 ❗️❗️❗️ 要注意绑定
      */
      // 比如
      this.$emit("getChange1", e.target.value); //
    },
    // 触发当前实例上的事件。附加参数都会传给监听器回调。
    // 理解这句话很重要 首先来解决父子组件 以MyInput为例子 APP是父组件 MyInput是子组件
    // 而我以为是<input type="text" @keyup="handleKeyUp" @getChange="HandleGetChange" />是父组件
    // 实际上也没错 因为<input type="text" @keyup="handleKeyUp" @getChange="HandleGetChange" />这块确实是属于父组件的代码块
    // 也就是以后叫法跟范围认知要同步
    // 那么父子组件实现通信的做法是<input type="text" @keyup="handleKeyUp" @getChange="HandleGetChange" />这样的
    // 想想这块是子组件触发的
    // 难道是 <input type="text" @keyup="handleKeyUp" @getChange="HandleGetChange" />这样写是说明
    // 🈶一个问题 就是@getChange="HandleGetChange"这样写是直接绑定给子组件的
    // 你说说getChange是子组件的自定义事件 还是父组件的自定义事件
    HandleGetChange(params) {
      console.log("params", params);
    }
  }
};
</script>
