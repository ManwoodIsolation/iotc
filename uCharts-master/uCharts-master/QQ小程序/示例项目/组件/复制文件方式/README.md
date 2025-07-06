## 使用说明
请将项目根目录 QQ小程序/uCharts-组件/qiun-qq-ucharts/src 下全部文件复制到指定位置，例如该项目的components/qiun-qq-uchart目录下，然后在页面的json配置文件中配置如下：
{
  "usingComponents": {
    "qiun-qq-ucharts": "/components/qiun-qq-ucharts/index"
  }
}

配置好后即可在qml文件中使用

<view class="charts">
  <qiun-qq-ucharts type="column" opts="{{opts}}" chartData="{{chartData}}" bindcomplete="complete"/>
</view>

注：示例中uCharts组件仅做演示，实际使用请用码云或者npmjs中最新版本

## 组件参数详见官网组件文档或在线演示中的代码

[https://www.ucharts.cn](https://www.ucharts.cn)