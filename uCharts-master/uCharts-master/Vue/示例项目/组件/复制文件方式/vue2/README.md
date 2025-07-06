## 使用说明
请将项目根目录 Vue/uCharts-组件/qiun-vue-ucharts/src 下全部文件复制到指定位置，例如该项目的src/components/qiun-vue-uchart目录下，在vue文件中的<script></script>中引用并注册组件：

<div class="charts">
  <qiun-vue-ucharts type="column" :opts="opts" :chartData="chartData" @complete="complete"/>
</div>

<script>
import qiunVueUcharts from './components/qiun-vue-ucharts/qiun-vue-ucharts.vue'

export default {
  name: 'app',
  components: {
    qiunVueUcharts
  },
  ...
}
</script>


注：示例中uCharts组件仅做演示，实际使用请用码云或者npmjs中最新版本

## 组件参数详见官网组件文档或在线演示中的代码

[https://www.ucharts.cn](https://www.ucharts.cn)