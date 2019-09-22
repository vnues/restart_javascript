// 首先创建 一个专门用来管理全局状态的模块 这个模块中有 个私有变量保存了所有的状态值，并对外提供了访问与设置这个私有变 的方法
var module_status = (function() {
  var status = {
    number: 0,
    color: null
  };
  var get = function(prop) {
    return status[prop];
  };
  var set = function(prop, value) {
    status[prop] = value;
  };
  return {
    get: get,
    set: set
  };
})();

// 再来创建 个模块，这个模块专门负责 body 景颜色的改变

var module_color = (function() {
  // 类似于import state from ’module_status'   这个就是导出的名字 module_color   实际各个文件也就是各个模块都是全局函数 --- 记住这个概念
  var state = module_status;
  var colors = ["orange", "#ccc", "pink"];
  function render() {
    var color = colors[state.get("number") % 3];
    console.log(color);
    document.body.style.backgroundColor = color;
  }
  return {
    render: render
  };
})();

// 接下来我 还要 建另外 个模块来负责显示当前的 numb 值，用于参考与对比
var module_context = (function() {
  var state = module_status;
  function render() {
    //  console.log(state.get("number"));
    document.body.innerHTML = "this Number is" + state.get("number");
  }
  return {
    render: render
  };
})();

var module_main = (function() {
  var state = module_status;
  var color = module_color;
  var context = module_context;
  setInterval(function() {
    var newNumber = state.get("number") + 1;
    console.log(newNumber);
    state.set("number", newNumber);
    color.render();
    context.render();
  }, 2000);
})();

// 出Bug的原因是编码吧 或者粘贴下来有错误的编码形式
