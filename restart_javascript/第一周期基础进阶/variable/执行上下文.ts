
// 什么是执行上下文?
// 当执行到一个函数的时候，就会进行准备工作，这里的“准备工作”，让我们用个更专业一点的说法，就叫做"执行上下文(execution context)"。

/*
function a(){
var foo = function () {

    console.log('foo1');

}

foo();  // foo1

var foo = function () {

    console.log('foo2');

}

foo(); // foo2
}
a()
*/

// 执行到？


// 执行上下文栈?
// 接下来问题来了，我们写的函数多了去了，如何管理创建的那么多执行上下文呢？

// 所以 JavaScript 引擎创建了执行上下文栈（Execution context stack，ECS）来管理执行上下文

// 首先要明白 我们的js的执行不是顺序执行的 而是一段一段执行的 这个段就是上下文 上下文有三种全局函数eval



// 当javascript引擎执行到全局代码或者函数就会准备工作 -- 这个准备工作就是上下文
// 上下文 分为三种全局、函数、eval，
// 通过这个上下文 js引擎就会去解析（该是变量提升的就是变量提升等操作）和执行 -- 创建上下文栈去管理




var foo = function () {

    console.log('foo1');

}

foo();  // foo1

var foo = function () {

    console.log('foo2');

}

foo(); // foo2

/* 上面的这段代码js是怎么解析执行的 */
/*首先js的解析和执行并不是一行一行的，而是一段一段的,而这个一段一段的就是我们的上下文*/
/*上下文 分为三种全局、函数、eval，*/
/* 通过这个上下文 js引擎就会去解析（该是变量提升的就是变量提升等操作）和执行 -- 创建上下文栈去管理*/


/*比如上面的这个例子 就单纯来说就是在这个上下文中分析是否提升的行为而已*/

// 通过这个例子更让我知道以后如何去看待js代码的一段一段（执行上下文）分为三种情况去看这代码
