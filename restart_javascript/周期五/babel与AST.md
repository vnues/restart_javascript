Babel 是 JavaScript 编译器，更确切地说是源码到源码的编译器，通常也叫做“转换编译器（transpiler）”。 意思是说你为 Babel 提供一些 JavaScript 代码，Babel 更改这些代码，然后返回给你新生成的代码。



也就是说只要是有关用户操作输入的 就是双向数据绑定

视图层操作数据层

数据层操作视图层

双向的 

而用户输入的通常就是表单


Babel 编译 JS 文件的步骤分为解析（parse），转换（transform），生成（generate）三个步骤。



辨别节点(node)的方法 一个包含type的对象就是一个节点
```javascript

{
  "type": "Program",
  "start": 0,
  "end": 307,
  "body": [
    {
      "type": "BlockStatement",
      "start": 0,
      "end": 307,
      "body": [
        {
          "type": "ExpressionStatement",
          "start": 8,
          "end": 305,
          "expression": {
            "type": "CallExpression",
            "start": 8,
            "end": 305,
            "callee": {
              "type": "ArrowFunctionExpression",
              "start": 9,
              "end": 302,
              "id": null,
              "expression": false,
              "generator": false,
              "async": false,
              "params": [],
              "body": {
                "type": "BlockStatement",
                "start": 15,
                "end": 302,
  ...
```


你会留意到 AST 的每一层都拥有相同的结构：

{
  type: "FunctionDeclaration",
  id: {...},
  params: [...],
  body: {...}
}
{
  type: "Identifier",
  name: ...
}
{
  type: "BinaryExpression",
  operator: ...,
  left: {...},
  right: {...}
}
注意：出于简化的目的移除了某些属性

这样的每一层结构也被叫做 节点（Node）。 一个 AST 可以由单一的节点或是成百上千个节点构成。 它们组合在一起可以描述用于静态分析的程序语法。


❗️终于找到区分节点的方法了---->看是否有type


我们的一个jsx对象可以理解成就是一个大的节点

如果想要改变 替换掉或者更新

所以当创建访问者时你实际上有两次机会来访问一个节点。


有一个问题 属性为啥去遍历

Paths（路径）
AST 通常会有许多节点，那么节点直接如何相互关联呢？ 我们可以使用一个可操作和访问的巨大可变对象表示节点之间的关联关系，或者也可以用Paths（路径）来简化这件事情。.

Path 是表示两个节点之间连接的对象



路劲进入你这个节点   就相当于访问者一步一步敲门 到了你这个节点a了
此时path这个访问的节点path.node就是a了

节点有很多种类型  属性节点 文本节点等等....

属性也是一个节点 不是dom就是节点这样理解的

这是AST的节点

从上面的visitor对象中，可以看到每次访问节点方法时，都会传入一个path参数，这个path参数中包含了节点的信息以及节点和所在的位置，以供对特定节点进行操作。具体来说Path 是表示两个节点之间连接的对象。这个对象不仅包含了当前节点的信息，也有当前节点的父节点的信息，同时也包含了添加、更新、移动和删除节点有关的其他很多方法。具体地，Path对象包含的属性和方法主要如下：

`
── 属性      
  - node   当前节点
  - parent  父节点
  - parentPath 父path
  - scope   作用域
  - context  上下文
  - ...
── 方法
  - get   当前节点
  - findParent  向父节点搜寻节点
  - getSibling 获取兄弟节点
  - replaceWith  用AST节点替换该节点
  - replaceWithMultiple 用多个AST节点替换该节点
  - insertBefore  在节点前插入节点
  - insertAfter 在节点后插入节点
  - remove   删除节点
  - ...

`

Babel的工具集

当我们写Babel插件时候就可以引用上面的工具集的api

好像还不用我们引入这些插件

babel-traverse
babel-traverse用于维护操作AST的状态，定义了更新、添加和移除节点的操作方法。之前也说到，path参数里面的属性和方法都是在babel-traverse里面定义的。这里还是引用一个例子，将babel-traverse和Babylon一起使用来遍历和更新节点：

babel-types是一个强大的用于处理AST节点的工具库，“它包含了构造、验证以及变换AST节点的方法。该工具库包含考虑周到的工具方法，对编写处理AST逻辑非常有用。”这个工具库的具体的API可以参考Babel官网： babeljs.io/docs/en/bab…



对 以前我们只要操作一个属性节点就行 然后找到这个就行然后用上对应的方法
现在两个节点用上了同一个节点  当然遍历啊


Babel 实际上是一组模块的集合。本节我们将探索一些主要的模块，解释它们是做什么的以及如何使用它们。

注意：本节内容不是详细的 API 文档的替代品，正式的 API 文档将很快提供出来。


写babel插件可以用上types、traverse的插件的api


react双向数据绑定得考虑两种情况

- state嵌套属性怎么赋值

```javascript

// 我喜欢的写法是这样
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {
                name: {
                    type: 'str',
                    value: 'Joe'
                },
                age: {
                    type: 'int',
                    value: 21
                }
            }
        }
    }

this.setState({
   profile:{...this.state.profile,age:xxx}
})
// 但是还有另外一种写法就是
this.setState({ this.state.profile.name.value: e.target.value)

// 当然你会考虑到这种情况 const {profile.name} = this.satte

// 但这没什么影响  这种操作是读值

```

- onChange覆盖问题



这个让我重新认识了下babel插件如何写 还有执行过程

节点概念 以及为什么可以使用这些api 从何而来




还有一点就是使用r-model关键的一步就是r-model ---> value 不然都不起作用  


注意原生表单的写法
<input type="radio" name="sex" value="male">Male<br>
也是有value属性的 并不是react范畴



join 返回一个字符串。该字符串是通过把 arrayObject 的每个元素转换为字符串，然后把这些字符串连接起来，在两个元素之间插入 separator 字符串而生成的

是在两个字符之间插入的 如果只有一个字符 就不插入 因为都没有之间这个概念的    ---->可以当做面试题尝试问



babel插件的写法

就是根据AST树里面的type 一般一个type类型的节点对应一个api  还有注意该节点下所需要的属性 通常下@babel/types有对应的api 就是首字母大小写区分 其他完全一样的 如果不确定就去该文档查看




babel的工作流程由各个包负责的


访问节点，可以使用的参数是 path 参数，path 这个参数并不直接等同于节点，path 的属性有几个重要的组成，如下


一些 AST 树的创建方法
在写插件的过程中，经常要创建一些 AST 树，常用的方法如下

使用 babel-types 定义的创建方法创建
比如创建一个 var a = 1;


对  这个必须要很清楚的了解和知道

### babel-types 定义的创建方法创建 ❗️ ❗️ ❗️



Babel 的中序工作——Babel-traverse、遍历 AST 树，插件体系
遍历的方法
一旦按照 AST 中的定义，解析成一颗 AST 树之后，接下来的工作就是遍历树，并且在遍历的过程中进行转换



## path 的api 方法

!()[./babel.jpeg]

如果不确定是否存在可在控制台打印出来console.log(path.xxx)


```javascript

const modelAtrrName = "r-model";
module.exports = function ({ types: t }) {
  function JSXAttributeVisitor(path) {

    if (path.node.name.name === modelAtrrName) {
      let modelStr = objExpression2Str(path.node.value.expression).split(".");
      console.log(modelStr);
      // 如果双向数据绑定的值不是 this.state 的属性，则不作处理
      // 这里存在一种情况就是不是this.state.name  因为有时候我们会这样简写 const {name} = this.state
      // if (modelStr[0] !== "this" || modelStr[1] !== "state") return;
      // 将 modelStr 从类似 ‘this.state.name.value’ 变为 ‘name.value’ 的形式
      // 如果是这种形式this.state.name ===>要改为name
      // if (modelStr.length >= 3 && modelStr[0] === "this" && modelStr[1] === "state") {
      //   modelStr = modelStr.slice(2, modelStr.length).join(".");
      // } else {
      //   modelStr = modelStr.join('.')
      //   console.log(modelStr)
      // }
      // 有很多种情况
      // this.state.name  this.state.name.age  所以我们不做截取
      // 但是会带来一个问题{this.state.name:"vnues"} 没有这种写法 属性名不能是个字符串
      // 可以转化成这种 { [`${types.changePushAssistant}`]:"vnues"}
      if (modelStr[0] === "this" && modelStr[1] === "state") {
        modelStr = modelStr.join(".");
      } else {
        // 我们给它拼接上`this.state`
        // 可能存在this.name这种字段
        modelStr[0] === "this" &&
          (modelStr = `this.state.${modelStr
            .slice(1, modelStr.length)
            .join(".")}`);
        modelStr = `this.state.${modelStr.join(".")}`;
      }
      // 将 model 属性名改为 value
      // 赋予value属性
      path.node.name.name = "value"; // 确实很重要这一步  >>>>>>>>>>>> r-model={this.state.name} --->转化成 value={this.state.name} 单单改变r-model就行
      // r-model={值} 值原来是怎么样 还是原来那样 我们不做操作的 这一步
      const setStateCall = t.callExpression(
        // 调用的方法为 ‘this.setState’
        t.memberExpression(t.thisExpression(), t.identifier("setState")),
        // 调用时传入的参数为一个对象
        // key 为刚刚拿到的 modelStr，value 为 e.target.value
        [t.objectExpression([objPropStr2AST(modelStr, "e.target.value", t)])]
      );

      const onChange = path.parent.attributes.filter(attr => (attr && attr.name && attr.name.name) === 'onChange')[0];
      if (onChange) {
        const callee = onChange.value.expression;
        onChange.value = t.JSXExpressionContainer(
          t.arrowFunctionExpression(
            [t.identifier('e')],
            t.blockStatement([
              t.expressionStatement(setStateCall),
              t.expressionStatement(
                t.callExpression(
                  callee,
                  [t.identifier('e')]
                )
              )
            ])
          )
        )
      } else {
        path.insertAfter(t.JSXAttribute(
          t.jSXIdentifier('onChange'),
          t.JSXExpressionContainer(
            t.arrowFunctionExpression(
              [t.identifier('e')],
              t.blockStatement([
                t.expressionStatement(setStateCall)
              ])
            )
          )
        ));
      }
    }
  }

  function JSXElementVisitor(path) {
    // We can use it alongside the babel parser to traverse and update nodes:
    // 这个方法是更新遍历子节点
    // 这个是对属性节点做操作
    console.log(path.traverse)
    console.log(path.get)
    // console.log(path.xxcc) // undefined
    path.traverse({
      JSXAttribute: JSXAttributeVisitor
    });
  }

  return {
    visitor: {
      JSXElement: JSXElementVisitor
    }
  };
};

// 把 expression AST 转换为类似 “this.state.name” 这样的字符串
function objExpression2Str(expression) {
  // 递归写法
  let objStr;
  if (expression.name) {
    objStr = expression.name;
    return objStr;
  } else {
    switch (expression.object.type) {
      case "MemberExpression":
        objStr = objExpression2Str(expression.object);
        break;
      case "Identifier":
        objStr = expression.object.name;
        break;
      case "ThisExpression":
        objStr = "this";
        break;
    }
    return objStr + "." + expression.property.name;
  }
}
// 把 key - value 字符串转换为 { key: value } 这样的对象 AST 节点
// 2是转换的意思 这里的表达
function objPropStr2AST(key, value, t) {
  console.log(value) // e.target.value
  console.log(objValueStr2AST(value, t))
  return t.objectProperty(t.templateLiteral([t.templateElement({ raw: '', cooked: '' }, true), t.templateElement({ raw: '', cooked: '' }, true)], [t.identifier(key)]), objValueStr2AST(value, t), true)
}

// 对类似e.target.value或者this.state.name.son.xxx转化为AST节点 -无限制
function objValueStr2AST(objValueStr, t) {
  const values = objValueStr.split(".");
  if (values.length === 1) return t.identifier(values[0]);
  // 递归写法
  return t.memberExpression(
    objValueStr2AST(values.slice(0, values.length - 1).join("."), t),
    objValueStr2AST(values[values.length - 1], t)
  );
}


```

要注意我们写这个插件的初始时候是不用引入babel其余插件的 这是因为它提供了会传入t