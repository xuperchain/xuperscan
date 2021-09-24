# XuperScan 区块链浏览器

XuperScan 是 XuperChain 的区块链浏览器，支持通过浏览器以可视化的方式查看区块，交易，合约等链上信息。

## 本地构建

### 环境准备
1. [本地部署XuperChain 节点](https://github.com/xuperchain/xuperchain/blob/master/CONTRIBUTING_CN.md)
2. 安装 [node](https://nodejs.org/en/)和 [npm](https://www.npmjs.com/)，推荐使用的 nodejs 版本为 v11.15.0

### 启动浏览器后端服务

根据你的操作系统，选择合适的命令，启动浏览器后端服务

- MacOS

``` bash
  wget https://cms-store.bj.bcebos.com/xuperindexer-darwin-amd64.zip 
  unzip xuperindexer-darwin-amd64.zip -d xuperindexer
  cd xuperindexer
  bin/xindexer
```

- Linux:
```
  wget https://cms-store.bj.bcebos.com/xuperindexer-linux-amd64.zip 
  unzip xuperindexer-linux-amd64.zip
  cd xuperindexer
  bin/xindexer

``` 
<!-- - Windows: third_party/xuperindexer/bin/xindexer-win-amd64 -->
 
>  当前 浏览器后端服务只提供了 x86_64 的处理器支持，如果你使用其他处理器，请联系 XuperChain 官方适配

### 安装项目依赖
```
npm install
```

### 启动区块浏览器
```
npm run serve
```
  浏览器打开 http://127.0.0.1:3000 


## 联系我们
商务合作，请Email：xchain-help@baidu.com, 来源请注明Github。
如果你对XuperChain开源技术及应用感兴趣，欢迎添加“百度超级链·小助手“微信，回复“技术论坛进群”，加入“百度超级链开发者社区”，与百度资深工程师深度交流!微信二维码如下:

![微信二维码](https://github.com/ToWorld/xuperchain-image/blob/master/baidu-image-xuperchain.png)
