<template>
  <view class="pageBg">
    <topMargin/>
     <!-- 头部 -->
    <view class="bg-transparent px-4 py-2 flex justify-between items-center border-b border-gray-200">
       <view class="flex items-center justify-center w-full">
       
         <text class="text-xl font-bold text-black-500">历史记录</text>
          <!-- 添加“清除记录”按钮 -->
        <uni-icons type="trash" size="30" @click="historyStore.clearRecords"></uni-icons>
       </view>
    </view>

    <!-- 历史记录列表 -->
    <view class="px-4">
      <template v-for="(record, index) in historyRecords" :key="index">
        <view class="bg-white mb-4 rounded-lg">
          <!-- 时间栏 -->
          <view v-if="!record.danger" class="bg-blue-300 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
            <text>last time : {{ record.date }}</text>
          </view>
          <view v-else class="bg-red-300 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
            <text>last time : {{ record.date }}</text>
          </view>

             <!-- 数据栏 -->
          <view class="px-4 py-2 flex justify-between">
            <!-- result -->
            <view class="text-center">
              <!-- 设置 max-w-xx 或固定宽度 -->
              <text class="text-xl font-bold text-ellipsis break-all">{{ record.result }}</text>
              <text class="text-sm ml-1">result</text>
            </view>

            <!-- confidence -->
            <view class="text-center">
              <!-- 设置 max-w-xx 或固定宽度 -->
              <text class="text-xl font-bold text-ellipsis break-all">{{ record.confidence }}</text>
              <text class="text-sm ml-1">confidence</text>
            </view>
          </view>

          <!-- 时长和环境 -->
          <view class="flex items-center justify-between px-4 py-2 border-t border-gray-200">
            <view class="flex-1" />
            <text class="text-sm text-right">累计次数 ：{{ record.num }}</text>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>






<script setup>
// 模拟的历史记录数据
import { ref } from "vue";
import { useHistoryStore } from "@/stores/history";
import topMargin from '@/components/top-margin/top-margin.vue';
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
const historyStore = useHistoryStore();
const historyRecords = historyStore.historyRecords;

</script>

<style>

</style>