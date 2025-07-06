## 初始化
在已创建好的小程序项目根目录下执行npm init来初始化项目

## 安装包
安装所需的包 npm i @qiun/my-ucharts


## 使用组件
然后在页面的json配置文件中配置如下：
{
  "usingComponents": {
    "qiun-my-ucharts": "@qiun/my-ucharts"
  }
}

配置好后即可在axml文件中使用

<view class="charts">
  <qiun-my-ucharts type="column" opts="{{opts}}" chartData="{{chartData}}" />
</view>

注：示例中uCharts组件仅做演示，实际使用请用码云或者npmjs中最新版本

## 组件参数详见官网组件文档或在线演示中的代码

[https://www.ucharts.cn](https://www.ucharts.cn)

## 注意
目前没找到组件传递事件的方法，暂不能用组件事件方法