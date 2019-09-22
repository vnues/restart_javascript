<!-- BFC,IFC,GFC和FFC -->

resume/pause script execution
我们手动写了个 debugger 相当于在这里打了断点 原来是这样的意思 然后就是如果执行到这里就会发生 resume/pause script execution
就挺到这里 我们就可以进行单步调试了 （resume/pause script execution）就是暂停的状态，你可以在看看每次 debug 的时候是不是有暂停按钮 点击它就自动执行了
如果自动执行再遇到这个断点又停下来了

What's FC？
一定不是 KFC，FC 的全称是：Formatting Contexts，是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。

BFC
BFC(Block Formatting Contexts)直译为"块级格式化上下文"。Block Formatting Contexts 就是页面上的一个隔离的渲染区域，容器里面的子元素不会在布局上影响到外面的元素，反之也是如此。如何产生 BFC？
float 的值不为 none。
overflow 的值不为 visible。
position 的值不为 relative 和 static。
display 的值为 table-cell, table-caption, inline-block 中的任何一个。
那 BFC 一般有什么用呢？比如常见的多栏布局，结合块级别元素浮动，里面的元素则是在一个相对隔离的环境里运行。

BFC 是一种特性

a)、不和浮动元素重叠，清除外部浮动，阻止浮动元素覆盖 本身是个浮动元素，如果其他元素不是 BFC 那么就会被影响
就是兼容 并不是具备 BFC 它就不是浮动元素

当对一个文档进行布局（lay out）的时候

可以认为每个 html 标签都是一个方块，然后这个方块又包着几个小方块，如同盒子一层层的包裹着，这就是所谓的盒模型。

盒子模型都具有哪些特点 border margin padding 等等

1. W3C 标准盒模型：
   属性 width,height 只包含内容 content，不包含 border 和 padding。
2. IE 盒模型：
   属性 width,height 包含 border 和 padding，指的是 content+padding+border。

你可以想象为块级元素就想是水流一样充满容器，而内联元素就是漂浮在水里按照从左到右排列的物体。

在项目中会经常碰到 display：block 这个属性。但注意，它与块级元素不是同一个东西。display：table，也属于块级元素。

文档流（正常流）：是引导网页中的元素排列和布局的，它默认的方向是从左向右，从上而下。

而「流」具有最大的一个特点就是自适应性。你可以把它想象成像水流一样，当水流倒入一个容器时，它会自动充满整个容器。而 CSS 中的文档流，其表现是一致的，有异曲同工之妙。

不仅如此，你也经常会听到「脱离文档流」，比如浮动，绝对定位等都可以脱离文档流，而脱离文档流不是本文要说的重点，所以就不展开多说，今天主要是聊一聊「流的自适应性」。

文档流中有两个比较重要的概念：块级元素（block）、内联元素（inline），对应到最具代表性的元素就是<div>、<span>。

块级元素默认会充满整个屏幕，具有自适应性，而内联元素默认则是水平排列。

块级元素默认会充满整个屏幕，具有自适应性，而内联元素默认则是水平排列。
css2.1 时候一直被流体布局统治 BFC 只不过是流体布局里面的特征而已
到了 css3.0 网页的复杂性导致新生出很多布局方式 比如弹性布局

自适应的概念和功能很重要

就是水倒入容器就会自动铺满 -- >这就是流 原来是这样啊
也就是 css 中 文档以流形式存在 块级元素相当于水 内联元素相当于木头 都放入这个流就有显而易见的效果

元素的类型 和 display 属性，决定了这个 Box 的类型。不同类型的 Box 会参与不同的 Formatting Context。

Formatting Context 是页面的一块渲染区域，并且有一套渲染规则，决定了其子元素将如何定位，以及和其它元素的关系和相互作用。

这套规则，比如 BFC B 就是这套规则 FC 是渲染区域

BFC 布局 IFC 布局 FFC 布局
B 我可以理解成规则 理解为我这个元素具备这个规则

BFC(Block formatting context)直译为”块级格式化上下文”。它是一个独立的渲染区域，只有 Block-level box 参与， 它规定了内部的 Block-level Box 如何布局，并且与这个区域外部毫不相干。

BFC 布局规则：
内部的 Box 会在垂直方向，一个接一个地放置。
Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
BFC 的区域不会与 float box 重叠。
BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
计算 BFC 的高度时，浮动元素也参与计算

哪些元素会生成 BFC
根元素
float 属性不为 none
position 为 absolute 或 fixed
display 为 inline-block, table-cell, table-caption, flex, inline-flex
overflow 不为 visible

BFC ------>双飞翼和圣杯布局

为什么老是对 this 迷糊 是因为不清楚 this 的几种场景

并没有什么规范或一组需求指定 console.\* 方法族如何工作 -->异步 I/O

到底什么时候控制台 I/O 会延迟，甚至是否能够被观察到，这都是游移不定的。如果在调
试的过程中遇到对象在 console.log(..) 语句之后被修改，可你却看到了意料之外的结果，
要意识到这可能是这种 I/O 的异步化造成的。
