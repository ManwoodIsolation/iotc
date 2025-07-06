<template>
  <div id="app">
    <canvas ref="CanvasDom" id="YqOzZGsGMcWzKpWmoWIdwFfiRyteklYx" :width="cWidth" :height="cHeight" class="charts" @click="tap"/>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
// 需要在您的项目内执行 npm i @qiun/ucharts
import uCharts from '@qiun/ucharts';

var uChartsInstance = {};
const CanvasDom = ref();
const cWidth = ref(750);
const cHeight = ref(500);

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
    drawCharts('YqOzZGsGMcWzKpWmoWIdwFfiRyteklYx',res);
  }, 500);
}

function drawCharts(id,data){
  const ctx = CanvasDom.value.getContext("2d");
  uChartsInstance[id] = new uCharts({
    type: "column",
    context: ctx,
    width: cWidth.value,
    height: cHeight.value,
    categories: data.categories,
    series: data.series,
    animation: true,
    background: "#FFFFFF",
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
}

// 转换点击事件的坐标
function getH5Offset(e) {
  e.mp = {
    changedTouches: []
  };
  e.mp.changedTouches.push({
    x: e.offsetX,
    y: e.offsetY
  });
  return e;
}

function tap(e){
  uChartsInstance[e.target.id].touchLegend(getH5Offset(e));
  uChartsInstance[e.target.id].showToolTip(getH5Offset(e));
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
.charts{
  width: 750px;
  height: 500px;
}
</style>
