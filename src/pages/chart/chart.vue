<template>
  <view class="charts-box">
    <topMargin/>
    <view class="bg-transparent px-4 py-2 flex justify-between items-center border-b border-gray-200">
       <view class="flex items-center justify-center w-full">
         <text class="text-xl font-bold text-black-500">chart</text>
          <!-- 添加“清除记录”按钮 -->
       </view>
    </view>
    <qiun-data-charts type="pie" :chartData="chartDataPie" />
    <qiun-data-charts type="column" :chartData="chartDataColumn" />
  </view>
</template>

<script>
import { useHistoryStore } from '@/stores/history'
import topMargin from '@/components/top-margin/top-margin.vue'

export default {
  data() {
    return {
      chartDataPie: {},
      chartDataColumn: {},
      pieKey: 0,
      columnKey: 0,
      refreshTimer: null
    }
  },
  components: {
    topMargin
  },
  mounted() {
    this.getServerData()
    this.unsubscribe = useHistoryStore().$subscribe(() => {
      this.refreshCharts()
    })
  },
  beforeDestroy() {
    this.unsubscribe()
    clearTimeout(this.refreshTimer)
  },
  methods: {
    filterRecords(records) {
      // 分离danger=true项和其他项
      const dangerItems = records.filter(r => r.danger)
      const otherItems = records.filter(r => !r.danger)
      
      // 对其他项按频数降序排序
      const sortedOthers = [...otherItems].sort((a, b) => b.num - a.num)
      
      // 合并数据并限制最多10项
      const maxItems = 10
      const merged = [
        ...dangerItems,
        ...sortedOthers.slice(0, Math.max(0, maxItems - dangerItems.length))
      ]
      
      // 去重处理（按result字段）
      const uniqueMap = new Map()
      merged.forEach(item => uniqueMap.set(item.result, item))
      return Array.from(uniqueMap.values()).slice(0, 10)
    },

    async getServerData() {
      const historyStore = useHistoryStore()
      await this.$nextTick()
      
      // 获取并过滤数据
      const rawRecords = historyStore.historyRecords
      const filteredRecords = this.filterRecords(rawRecords)

      // 处理饼图数据（添加危险标识）
      this.chartDataPie = {
        series: [{
          name: '检测结果',
          data: filteredRecords.map(r => ({
            name: `${r.result}${r.danger ? ' (危险)' : ''}`,
            value: r.num
          }))
        }]
      }

      // 处理柱状图数据
      this.chartDataColumn = {
        categories: filteredRecords.map(r => r.result),
        series: [{
          name: '出现频次',
          data: filteredRecords.map(r => r.num)
        }]
      }

      // 强制图表重新渲染
      this.pieKey += 1
      this.columnKey += 1
    },

    refreshCharts() {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = setTimeout(() => {
        this.getServerData()
      }, 300) // 优化防抖时间为300ms
    }
  }
}
</script>


<style scoped>
.charts-box {
  width: 100%;
  height: 600px; 
 background:
  linear-gradient(to bottom, transparent,white),
  linear-gradient(to right, #8ee6ed, #f0b1b1);
}
</style>
