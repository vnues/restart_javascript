this.name = "vnues";
function Person() {
  console.log(this);
  this.alert = function () {
    console.log(this);
    console.log(this.name);
  };
  this.alert();
}
// function alert() {
//   console.log("alert");
// }
// 还是new操作做了什么操作
// 有时候又不是当做构造函数使用
Person();
// Person.alert(); //肯定报错啊，都没有这个指向

alert();

let name = "vnues";
function Person() {
  console.log(this);

  this.alert = function () {
    console.log(this);
    console.log(this.name);
  };
  this.alert();
}
debugger;
Person();
alert();
Person.alert(); //肯定报错啊，都没有这个指向

let name = "vnues";
function Person() {
  console.log(this);

  this.alert = function () {
    console.log(this);
    console.log(this.name);
    console.log(name);
  };
  this.alert();
}
Person();
alert();
Person.alert();
console.log(window.name);

//  let在全局声明的变量不会挂载在window对象，this.name==》window.name自然打印出空
//  let在全局声明还是存在于全局变量对象 所以在作用域链中找到
/*


大家都知道在全局作用域中用var声明的变量，保存在window对象中

但是用ES6的const或者let在全局作用域中声明的变量，却不在window对象中



*/
// scope 范围 作用域的意思 在这里
// scope理由Local Script Global这些作用域
// script字段是什么意思 在debug调试工具
// 调试工具篇：https://blog.csdn.net/ole_triangle_java/article/details/80249650
// https://blog.csdn.net/bianliuzhu/article/details/82385851
// https://leeon.gitbooks.io/devtools/content/learn_basic/tips_and_tricks_part_console.html超重要
//  具备BFC特性的元素, 就像被一个容器所包裹, 容器内的元素在布局上不会影响外面的元素，同时也不受外面的元素影响。自适应两栏布局中container类属性无需设置width为100%
// BFC FFC?


