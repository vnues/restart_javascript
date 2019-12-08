# 媒体类型（通常称为 Multipurpose Internet Mail Extensions 或 MIME 类型 ）

媒体类型（通常称为 Multipurpose Internet Mail Extensions 或 MIME 类型 ）是一种标准，用来表示文档、文件或字节流的性质和格式。它在IETF RFC 6838中进行了定义和标准化。

## 通用结构

MIME的组成结构非常简单；由类型与子类型两个字符串中间用'/'分隔而组成。不允许空格存在。type 表示可以被分多个子类的独立类别。subtype 表示细分后的每个类型。

### 独立类型

```javascript
text/plain
text/html
image/jpeg
image/png
audio/mpeg
audio/ogg
audio/*
video/mp4
application/*
application/json
application/javascript
application/ecmascript
application/octet-stream
…
```

text/plain
文本文件默认值。即使它意味着未知的文本文件，但浏览器认为是可以直接展示的。
