## 初始化
在已创建好的项目根目录下执行npm init来初始化项目

## 安装包
安装所需的包 npm i @qiun/vue-ucharts

## 使用组件
请在vue文件中的<script></script>中引用组件：

<div class="charts">
  <qiun-vue-ucharts type="column" :opts="opts" :chartData="chartData" @complete="complete"/>
</div>

<script>
import qiunVueUcharts from '@qiun/vue-ucharts'
...
</script>


注：示例中uCharts组件仅做演示，实际使用请用码云或者npmjs中最新版本

## 组件参数详见官网组件文档或在线演示中的代码

[https://www.ucharts.cn](https://www.ucharts.cn)