// function foo() {
//   var a = 2;
//   return function bar() {
//     var b = 9;
//     return function fn() {
//       console.log(b, a);
//     };
//   };
// }
// var bar = foo();
// var fn = bar();
// fn();

// (function() {
//   var a = 10;
//   var b = 20;

//   var test = {
//     m: 20,
//     add: function(x) {
//       return a + x;
//     },
//     sum: function() {
//       return a + b + this.m;
//     },
//     mark: function(k, j) {
//       return k + j;
//     }
//   };

//   window.test = test;
// })();

// test.add(100);
// test.sum();
// test.mark();

// var _mark = test.mark;
// _mark();

// 匿名函数没有函数名 所以显示闭包的名字就会怪怪的 为空
// 从chorme浏览器看到闭包包括函数和变量

function foo() {
  var a = 10;

  function fn1() {
    return a;
  }

  function fn2() {
    return 10;
  }

  fn2();
}

foo();
