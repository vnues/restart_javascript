var app = new Vue({
    el: '#app',
    data: {
        firstName: 'Foo',
        lastName: 'Bar',
        message: 'Hello Vue!'
    },
    // computed也有自动监听更新功能 也就是变量一变化 它里面的函数也会跟着变化  这就是跟方法的不同
    // 很多情况下使用到computed我们要把computed里的函数当做data内的属性理解才能弄明白  实际上它确实被当做data内的属性对待
    // 只要这个data内的属性一改变 就会自动更新到模板 这就是跟方法最大的不同
    computed: {
        fullName: function () {
            return this.firstName + ' ' + this.lastName
        }
    },
    methods:{
        handleClick(){
             console.log("click")
             this.firstName="vnues"

        }
    }
});

/*

我们首次得知道vue这一特性，才会真正去理解computed属性
 当一个 Vue 实例被创建时，它将 data 对象中的所有的属性加入到 Vue 的响应式系统中。
 当这些属性的值发生改变时，视图将会产生“响应”，即匹配更新为新的值。

 总结computed一句话：
   很多情况下使用到computed我们要把computed里的函数当做data内的属性理解才能弄明白  实际上它确实被当做data内的属性对待


*/
