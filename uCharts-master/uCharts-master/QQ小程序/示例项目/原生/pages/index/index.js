//index.js
import uCharts from '../../js_sdk/u-charts/u-charts.js';
var uChartsInstance = {};
Page({
  data: {
    cWidth: 0,
    cHeight: 0
  },
  onReady() {
    //这里的第一个 750 对应 css .charts 的 width
    const cWidth = 750 / 750 * qq.getSystemInfoSync().windowWidth;
    //这里的 500 对应 css .charts 的 height
    const cHeight = 500 / 750 * qq.getSystemInfoSync().windowWidth;
    this.setData({ cWidth, cHeight });
    this.getServerData();
  },
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
      this.drawCharts('afMCYQMEmXXVAjNQFJvvfxbLSHuxNEOL', res);
    }, 500);
  },
  drawCharts(id,data){
    const ctx = qq.createCanvasContext(id, this);
    uChartsInstance[id] = new uCharts({
            animation: true,
            background: "#FFFFFF",
            categories: data.categories,
            color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
            context: ctx,
            extra: {
              column: {
                type: "group",
                width: 30,
                activeBgColor: "#000000",
                activeBgOpacity: 0.08
              }
            },
            height: this.data.cHeight,
            legend: {},
            padding: [15,15,0,5],
            series: data.series,
            type: "column",
            width: this.data.cWidth,
            xAxis: {
              disableGrid: true
            },
            yAxis: {
              data: [
                {
                  min: 0
                }
              ]
            }
          });
  },
  tap(e){
    uChartsInstance[e.target.id].touchLegend(e);
    uChartsInstance[e.target.id].showToolTip(e);
  }
})