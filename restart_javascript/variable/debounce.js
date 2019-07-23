// var count = 1;
// var container = document.getElementById('container');
//
// function getUserAction(e) {
//     console.log("我被触发了")
//     container.innerHTML = count++;
//     // return "1232"
// };
//
// container.onmousemove = getUserAction;
//
// // 第一版
// // function debounce(func, wait) {
// //     var timeout;
// //     return function () {
// //         // console.log(this)
// //         clearTimeout(timeout)
// //         timeout = setTimeout(func, wait);
// //     }
// // }
//
//  container.onmousemove = debounce(getUserAction, 1000);
//
// // 第二版 解决this指向
// function debounce(func, wait) {
//     var timeout;
//     let context = this // 绑定this
//     // 与变量形成闭包
//     return function () {
//         clearTimeout(timeout)
//         timeout = setTimeout(function(){
//               func.apply(context)
//         }, wait);
//     }
// }
//
// // 第三版解决event
// function debounce(func,wait){
//     var timeout;
//     let context=this
//     return function(){
//         clearTimeout(timeout)
//         var args = arguments;
//         timeout=setTimeout(function(){
//             func.apply(context,args)
//         },wait)
//     }
// }
//
// let result = container.onmousemove = debounce(getUserAction, 1000);
// console.log(result)
//
// // 第四版解决新需求，如果想要立即执行，然后在n秒走完后才触发
// // 立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。意思是你如果中途继续触发会重新计算一直等到停止触发
// function debounce(func,wait,immediate){
//     var timeout;
//     let context=this
//     return function(){
//         // 进来清空一次定时器 如果存在才清空
//         if (timeout) clearTimeout(timeout);
//         var args = arguments;
//         var callNow=!timeout
//         if(immediate){
//             // 第二次执行 第三次执行会先清空计时器再执行
//             timeout=setTimeout(function(){
//                 timeout=null
//             },wait)
//             // 为真 说明timeout为null 说明还没触发
//             if(callNow){
//                 func.apply(context,args)
//             }
//         }else{
//             timeout=setTimeout(function(){
//                 func.apply(context,args)
//             },wait)
//         }
//
//     }
// }
//
//
//
// container.onmousemove = debounce(getUserAction, 1000,true);
//
//
// // 第五版解决result getUserAction可能有返回结果
//
//
//
//
// function debounce(func,wait,immediate){
//     var timeout,result;
//     let context=this
//     return function(){
//         // 进来清空一次定时器 如果存在才清空
//         if (timeout) clearTimeout(timeout);
//         var args = arguments;
//         var callNow=!timeout
//         if(immediate){
//             // 第二次执行 第三次执行会先清空计时器再执行
//             timeout=setTimeout(function(){
//                 timeout=null
//             },wait)
//             // 为真 说明timeout为null 说明还没触发
//             if(callNow){
//                 result=func.apply(context,args)
//             }
//         }else{
//             timeout=setTimeout(function(){
//                 result=func.apply(context,args)
//             },wait)
//         }
//         return result
//
//     }
// }
//
//
//
// container.onmousemove = debounce(getUserAction, 1000,true);
//


// 最后我们再思考一个小需求，我希望能取消 debounce 函数，比如说我 debounce 的时间间隔是 10 秒钟，
// immediate 为 true，这样的话，我只有等 10 秒后才能重新触发事件，现在我希望有一个按钮，点击后，取消防抖，这样我再去触发，就可以又立刻执行啦，是不是很开心？


function debounce(func, wait, immediate) {
    var timeout, result;
    var debounced = function () {
        let context = this
        // 进来清空一次定时器 如果存在才清空
        if (timeout) clearTimeout(timeout);
        var args = arguments;
        var callNow = !timeout
        if (immediate) {
            // 第二次执行 第三次执行会先清空计时器再执行
            timeout = setTimeout(function () {
                timeout = null
            }, wait)
            // 为真 说明timeout为null 说明还没触发
            if (callNow) {
                result = func.apply(context, args)
            }
        } else {
            timeout = setTimeout(function () {
                // <!--result的存在实际没啥意义-->
                result = func.apply(context, args)
            }, wait)
        }
        return result //先返回这个 后面的再执行异步 所以可能才返回undefined
    }

    // 注意不要用this.cancel 如果要用本对象尽量用对象的名称  因为这个this不是指向function
    // 函数也是对象也可以添加(a.b)属性
    debounced.cancel = function () {
        clearTimeout(timeout)
        timeout = null
    }
    return debounced
}


// container.onmousemove = debounce(getUserAction, 1000,true);


//防抖的特点就是一个事件重复触发时间会重新计算 ----- 这是他的特点 直到停止触发再计算走完  -- 知识点得加深理解啊


// applay ：argsArray
// 可选的。一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 func 函数。
// 如果该参数的值为 null 或  undefined，则表示不需要传入任何参数。
// 从ECMAScript 5 开始可以使用类数组对象。 浏览器兼容性 请参阅本文底部内容。
// 这个数组的参数传给function就是拆开的多个参数


// mdn真的是宝 Function.prototype.apply() 就是继承于这里的
// 所以每个函数都有apply方法


// 防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，
// 如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，
// n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!

// 为什么是打印出的是window对象 因为虽然我这个setTimeout函数是在function(）这个匿名函数 但我这个函数不调用它啊
// 具体调用的是window.se...实际我们的setTimeout方法就是window对象  弄清楚谁调用我 window.a 一定要有那种调用的概念
// 不然弄不清楚this指向
// 等下回调函数对this是指向上一级吗

//  function say() {
//             console.log('setTimeout:'+this);
//         }let obj = {
//     print :　function () {
//         setTimeout(say,0);
//     }
// };
// obj.print()


// 所以有回调函数的都用箭头函数表示 指向this 这也是箭头函数的由来


/*
var a = 1;
function func(){
       // let a = 2;
        setTimeout(function(){
            console.log(a);
            console.log(this.a);
    },0)
}
func(); //输出1 1

function函数就不是在func里面声明的 我猜测 就是全局的 所以没有权限
// setTimeout中的第一个参数就是一个单纯的函数的引用而已，它的指向跟我们一般的函数调用时一样取决于被调用时所处的环境
// 判断有没有权限访问变量 你得先注意先在哪里声明？
setTimeout方法的回调函数this指向this --->为啥 ？说明这个回调函数最终放在window执行的
*/

// var a = 1;
// function func(){
//     let a = 2;
//     debugger
//     setTimeout(function(){
//
//         console.log(a);
//         console.log(this.a);
//     },0)
// }
// func(); //输出2 1


// 概念
// 函数节流: 频繁触发,但只在特定的时间内才执行一次代码
// 函数防抖: 频繁触发,但只在特定的时间内没有触发执行条件才执行一次代码
// 两者区别在于函数节流是固定时间做某一件事，比如每隔1秒发一次请求。而函数防抖是在频繁触发后，只执行一次（两者的前提都是频繁触发

// 运行到这一步timeout = setTimeout timeout就有值 而不是等到20过后才赋值 而是马上赋值 这也符合正常的赋值吧
timeout = setTimeout(function () {
    timeout = null;

}, 20)


/*
在前端开发中会遇到一些频繁的事件触发，比如：

window 的 resize、scroll
mousedown、mousemove
keyup、keydown

*/

// 防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，
// 那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!

// 防抖：触发一个事件n秒后才执行 如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行 搜索框功能非常适用
// 节流: 一个事件在一个时间段内才发生一次（稀释频率） 如果你持续触发事件，每隔一段时间，只执行一次事件。
