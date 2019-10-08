盒子的类型取决于CSS display 属性。

块级元素

当元素的display 为 block、list-item 或 table 时，它就是块级元素。



格式化上下文（Formatting Context）
Formatting Context，既格式化上下文。用于决定如何渲染文档的一个区域。

不同的盒子使用不同的格式化上下文来布局。

每个格式化上下文都拥有一套不同的渲染规则，他决定了其子元素将如何定位，以及和其他元素的关系和相互作用。

不明白没关系，你可以简单理解为格式化上下文就是为盒子准备的一套渲染规则。

常见的格式化上下文有这样几种：

【Block formatting context】(BFC)

【Inline formatting context】(IFC)

【Grid formatting context】(GFC)

【Flex formatting context】(FFC)


