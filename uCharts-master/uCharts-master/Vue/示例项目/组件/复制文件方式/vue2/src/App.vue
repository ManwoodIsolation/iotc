<template>
  <div id="app">
    <!-- 必须要有父元素包裹 -->
    <div class="charts-box">
      <qiun-vue-ucharts 
        type="column"
        :opts="opts"
        :chartData="chartData"
      />
    </div>
  </div>
</template>

<script>
import qiunVueUcharts from './components/qiun-vue-ucharts/qiun-vue-ucharts.vue'

export default {
  name: 'app',
  components: {
    qiunVueUcharts
  },
  data() {
      return {
        chartData: {},
        //您可以通过修改 config-ucharts.js 文件中下标为 ['column'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
        opts: {
          color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
          padding: [15,15,0,5],
          legend: {},
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            data: [
              {
                min: 0
              }
            ]
          },
          extra: {
            column: {
              type: "group",
              width: 30,
              activeBgColor: "#000000",
              activeBgOpacity: 0.08
            }
          }
        }
      };
    },
    mounted() {
      this.getServerData();
    },
    methods: {
      getServerData() {
        //模拟从服务器获取数据时的延时
        setTimeout(() => {
          //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
          let res = {
              categories: ["2016","2017","2018","2019","2020","2021"],
              series: [
                {
                  name: "目标值",
                  data: [35,36,31,33,13,34]
                },
                {
                  name: "完成量",
                  data: [18,27,21,24,6,28]
                }
              ]
            };
          this.chartData = JSON.parse(JSON.stringify(res));
        }, 500);
      },
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.charts-box{
  width: 50%;
  min-width: 375px !important;
  height: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style>
