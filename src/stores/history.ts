// src/stores/history.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useHistoryStore = defineStore('history',()=> {
  const historyRecords:any = ref([]);
  // 定义 actions，用于操作 historyRecords
   const addRecord = (record: any) => {
    // 判断 record.result 是否已存在于数组中
    const existingRecordIndex = historyRecords.value.findIndex(
      (item:any) => item.result === record.result
    );

    if (existingRecordIndex !== -1) {
      // 如果已存在，则更新对应的记录
      const existingRecord = historyRecords.value[existingRecordIndex];

      // 更新 num、confidence 和 date
      existingRecord.num += 1;
      existingRecord.confidence = record.confidence; // 更新置信度
      existingRecord.date = record.date; // 更新时间

      // 将该记录移动到数组头部
      historyRecords.value.splice(existingRecordIndex, 1); // 移除原位置
      historyRecords.value.unshift(existingRecord); // 添加到头部
    } else {
      // 如果不存在，则直接将新记录添加到头部
      historyRecords.value.unshift(record);
    }

    //确保数组按照时间降序排序
   const dangerousRecords = historyRecords.value.filter((record:any) => record.danger);

    // 将 danger: false 的项过滤出来
    const normalRecords = historyRecords.value.filter((record:any) => !record.danger);

    // 将 danger: true 的项拼接到数组头部
    // 清空原数组
    historyRecords.value.splice(0, historyRecords.value.length);

    // 动态添加危险项和普通项
    dangerousRecords.forEach((record:any) => {
      historyRecords.value.push(record);
    });
    normalRecords.forEach((record:any) => {
      historyRecords.value.push(record);
    });

  
  };

 // 清空历史记录数组的方法
  const clearRecords = () => {
    historyRecords.value.splice(0, historyRecords.value.length); // 清空数组
  };
  return {
    historyRecords,
    addRecord,
    clearRecords
  }
    
},{
  persist: {
    storage: {
      setItem(key, value) {
        uni.setStorageSync(key, value);
      },
      getItem(key) {
        return uni.getStorageSync(key);
      },

    }
  }
})
