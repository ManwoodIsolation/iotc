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

<script setup>
import { onMounted, ref } from 'vue';
import qiunVueUcharts from './components/qiun-vue-ucharts/qiun-vue-ucharts.vue'

const chartData = ref({});
const opts = ref({
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
        });

onMounted(() => {
    getServerData();
})

function getServerData() {
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
    chartData.value = JSON.parse(JSON.stringify(res));
  }, 500);
}

</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
