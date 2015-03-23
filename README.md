# requirejs-components-combine
一个简单的组件组合工具。

## 使用场景
一个网站总会有某一部分是在多个页面上用到的，最简单的例子就是用来取代浏览器默认的 `alert()`、'confirm()' 样式的弹层组件--我把这些由css、html与js组合起来的部分叫做_*组件*_，虽然我不知道是否准确。

Requirejs 自身可以加载 js 脚本，然后提供了各种插件来帮助我们加载 css 和 html，如 [require-css](https://github.com/guybedford/require-css) 与 [requirejs/text](https://github.com/requirejs/text)，最后还提供了 [r.js](https://github.com/jrburke/r.js)来组合模块，即使这样，我还是自己写了这个简单的组件组合工具，因为 r.js 配置起来太麻烦 - -

如果你有这样结构的组件：（可以在 test 文件夹下查看此工具适用的文件结构及完成之后的文件内容）
```
components/
     |
     |------module1/
     |         |
     |         |
     |         |------index.js
     |         |
     |         |------css.css
     |         |
     |         |------template.html
     |
     |-------module2/ // 结构同上，不再列出
```
那么此工具能自动分析 components 文件夹下的所有子文件夹，并根据里面的 index.js（或其它名字，可自行配置）分析出对 `text!` 的引用，然后将这些内容组合成一个文件，这样就可以减少几次 http 请求了。

## 注意事项
这个工具假设你是应用于已精简过后的组件的，这意味着我假设你的 css 、 html 与 js 都只有一行；它不像 r.js 那样附带 css 与 js 精简工具。

## 工作原理
以上面展示的 module1 文件夹结构为例：

1. 读取 index.js 的内容保存在变量里，下面称做 `fileContent`
2. 根据正则分析出 `text!` 的引用
3. 分析 `text!` 引用的文件名，并将文本内容像这样 `define("_module1/css.css",function(){return'这里是css文本'});` 包裹起来并追加到 `fileContent` 的前面，然后更新 `fileContent` 里原本的引用名（例如将`define(['module1/css.css'])`变成`define(['_module1/css.css'])`）
4. 当所有 `text!` 都处理完毕后，默认会将最终的 fileContent 写入 module1.js （这个文件与 module1 文件夹同名，并且同级）

## 许可
MIT
