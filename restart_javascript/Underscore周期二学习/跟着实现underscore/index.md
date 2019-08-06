我们总是用!inistial代表true来表示条件
所以在表达式判断时候得具有这个思想
!!!这个开发中也是经常用到


不用那么复杂, compose拿原生reduce一行代码就实现了， 
export default function compose(...funcs) {
return funcs.reduce((a, b) => (...args) => a(b(...args)))
}


https://www.jianshu.com/p/eda918cf738a


reduce函数的实现compose
compose(d, c, b, a)


从上面的例子可以看出，假设f、g、h分别表示三个函数，则compose(f,g,h)返回的函数完成类似(...args) => f(g(h(...args)))的功能。即从右到左组合多个函数，前面函数的返回值作为下一个函数的参数;pipe(f,g,h)返回的函数完成类似(...args) => h(g(f(...args)))的功能，即从左到右组合多个函数，前面函数的返回值作为下一个函数的参数；预计最先执行的函数可以接受任意个参数，后面的函数预计只接受一个参数。把compose放在前面讲是因为其更加体现了数学含义上的从右到左的操作


var index = dir > 0 ? 0 : length - 1;

判断是从头开始还是从尾开始