首先webpack是这样引入的

```javascript
  
    plugins: [
    new ProgressBarPlugin(),
    new HappyPack({
      id: 'tsx',
      threadPool: happyThreadPool,
      use: [
        { loader: 'babel-loader' },
        {
          loader: 'ts-loader',
          options: { transpileOnly: true, happyPackMode: true }
        }
      ]
    }),

```

引入babel-loader  然后我们需要去配置.babelrc这个文件 

在我们告诉 Babel 该做什么之前，我们需要创建一个配置文件。你需要做的就是在项目的根路径下创建 .babelrc 文件。然后输入以下内容作为开始：


Babel 是一个通用的多用途 JavaScript 编译器。通过 Babel 你可以使用（并创建）下一代的 JavaScript，以及下一代的 JavaScript 工具。

作为一种语言，JavaScript 在不断发展，新的标准／提案和新的特性层出不穷。 在得到广泛普及之前，Babel 能够让你提前（甚至数年）使用它们。

Babel 把用最新标准编写的 JavaScript 代码向下编译成可以在今天随处可用的版本。 这一过程叫做“源码到源码”编译， 也被称为转换编译（transpiling，是一个自造合成词，即转换＋编译。以下也简称为转译）。

也就是代码会先经过babel编译  但是我们的项目还引入了ta-loader 也就是它也可以进行编译



.babelrc配置了诸多编译插件 使他如何编译 而babel-loader是告诉webpack 任何tsx文件都要经过我这个babel编译 如何编译由.babelrc 文件决定

loader官方解释是文件预处理器，通俗点说就是webpack在处理静态文件的时候，需要使用 loader 来加载各种文件，比如： html文件需要使用html-loader ,css 需要使用css-loader 、 style-loader 等等。

今天我们来认识的是 babel-loader，用来处理ES6语法，将其编译为浏览器可以执行的js语法。

babel-loader
前面提过 babel 的三种使用方法，并且已经介绍过了 babel-cli。但一些大型的项目都会有构建工具 (如 webpack 或 rollup) 来进行代码构建和压缩 (uglify)。理论上来说，我们也可以对压缩后的代码进行 babel 处理，但那会非常慢。因此如果在 uglify 之前就加入 babel 处理，岂不完美？

所以就有了 babel 插入到构建工具内部这样的需求。以(我还算熟悉的) webpack 为例，webpack 有 loader 的概念，因此就出现了 babel-loader。

和 babel-cli 一样，babel-loader 也会读取 .babelrc 或者 package.json 中的 babel 段作为自己的配置，之后的内核处理也是相同。唯一比 babel-cli 复杂的是，它需要和 webpack 交互，因此需要在 webpack 这边进行配置。比较常见的如下：

babel-loader --> 可以理解成也即是babel



babel-core 相当于是编程的方式去使用 babel，是把代码以字符串的形式从文件或者网络请求等读入，调用它的 transform 方法，转化为新的字符串，再写回文件或者网络返回，算是我文章提的三种用法之外的第四种吧。

但这个说实话我自己项目中从来没实际使用过，所以觉得太冷门了，就没说……你们一般是在什么情景下会用这个呀？


https://zhuanlan.zhihu.com/p/43249121



Babel 是一个 JavaScript 编译器
Babel 工具链是由大量的工具组成的，无论你是 “最终用户” 还是在集成 Babel，这些工具都简化了 Babel 的使用。本文是对这些工具的使用方法的快速介绍，你可以在文档的 “用法” 章节了解到更多信息。



怎么实现babel编译 就是通过插件去读取

当用webpack打包构建时候 webpack会去读babel-loader --->babel-loader再根据.babelrc文件去编译

https://juejin.im/post/59ec657ef265da431b6c5b03


转换的时候，是插件开始起作用的时候，但是如何进入到这个过程呢，babel给我们提供了一个Visitor的规范。我们可以通过Visitor来定义我们的访问逻辑。大概就是下面这个样子


每个节点就是一个字段对吗 比如 name字段 区分字段是以空格来区分的

我们要做的就是替换这些字段

当我们向下遍历这颗树的每一个分支时我们最终会走到尽头，于是我们需要往上遍历回去从而获取到下一个节点。 向下遍历这棵树我们进入每个节点，向上遍历回去时我们退出每个节点。



编写babel插件
plugin和preset
plugin和preset共同组成了babel的插件系统，写法分别为

Babel-plugin-XXX
Babel-preset-XXX

preset和plugin在本质上同一种东西，preset是由plugin组成的，和一些plugin的集合

使用visitor来遍历语法树的时候，对特定的节点进行操作的时候，可能会修改节点的信息，所以还需要拿到节点的信息以及和其他节点的关系，visitor的执行函数会传入一个path参数，用来记录节点的信息。

