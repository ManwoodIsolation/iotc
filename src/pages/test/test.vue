<template>
  <view class="pageBg">
    <topMargin/>
    <!-- 顶部导航栏 -->
    <!-- <view class="flex items-center justify-between px-4 py-2 bg-gray-500 text-white">
      <text class="font-bold text-lg">声音分类系统</text>
    </view> -->

    <!-- 内容区域 -->
    <view class="px-4 space-y-4 h-full">
        <view
        v-if="!isConnected && blueDeviceList.length === 0"
        class="flex justify-center items-center h-full text-center text-gray-500 text-2xl font-bold"
      >
        <text>蓝牙设备列表为空，点击“开始扫描”获取可连接设备</text>
      </view>
      <view v-if="!isConnected && blueDeviceList.length">
        <view class="flex justify-between items-center mb-4 font-bold"> 可连接的蓝牙列表：</view>
        <view
          v-for="(device, index) in blueDeviceList"
        :key="index"
        class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mt-2"
      >
        <view class="flex flex-col">
          <text class="font-bold">{{ device.name }}</text>
          <view class="flex items-center text-gray-500">
            <view class="h-3 w-3 rounded-full bg-green-500"></view>
            <text class="ml-2">id: {{ device.deviceId }}</text>
          </view>
        </view>
        <view class="border border-gray-300 rounded-full px-6 py-2 text-gray-500 text-sm" style="border: 1px solid gray;" @click="connect(device)">连接</view>
      </view>
      </view>
     
      <view v-if="isConnected"> 
        <view class="mt-4 flex justify-center">
          <view  class=" border border-gray-300 rounded-lg px-6 py-2 text-gray-500 text-sm"  style="border: 1px solid gray;">
           已连接设备: {{ deviceName }}</view>
        </view>
        
        <view class="text-center text-gray-600 text-lg mt-4 h-full" @click="userStore.changeNickname" v-if="Result && confidence">
          <view class="text-xl font-bold">结果: {{ Result }}</view>
          <text class=" border border-gray-300 rounded-full px-6 py-2 text-gray-500 text-sm">置信度: {{ confidence }}</text>
        </view>

      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="fixed bottom-4 left-1/2 transform -translate-x-1/2">
      <view class="border border-gray-300 rounded-full px-6 py-2 text-gray-500 text-sm"
      @click="discovery" v-if="!isConnected && blueDeviceList.length === 0" style="border: 1px solid gray;">
        开始扫描
      </view>
    </view>
  </view>
</template>






<script setup >
import { ref } from 'vue'
import { onLoad, onShow} from '@dcloudio/uni-app';
import topMargin from '@/components/top-margin/top-margin.vue';
// 存储结果和置信度
const Result = ref('Speak')
const confidence = ref('0.91')
// 搜索到的蓝牙设备列表
const blueDeviceList = ref([])
const isConnected = ref(false)
const isListening = ref(false)
// 【1】初始化蓝牙
function initBlue() {
  uni.openBluetoothAdapter({
    success(res) {
      console.log('初始化蓝牙成功')
      uni.showToast({
        title: '初始化蓝牙成功',
        icon: 'success',
        duration: 1000
      })
      console.log(res)
    },
    fail(err) {
      console.log('初始化蓝牙失败')
      uni.showToast({
        title: '初始化蓝牙失败',
        icon: 'none',
        duration: 1000
      })
      console.error(err)
    }
  })
}

// 【2】开始搜寻附近设备
function discovery() {
  uni.startBluetoothDevicesDiscovery({
    success(res) {
      console.log('开始搜索')
      // 开启监听回调
      uni.onBluetoothDeviceFound(found)
    },
    fail(err) {
      console.log('搜索失败')
      console.error(err)
    }
  })
}

// 【3】找到新设备就触发该方法
function found(res) {
  console.log(res)
  blueDeviceList.value.push(res.devices[0])
}

// 蓝牙设备的id
const deviceId = ref('')
const deviceName = ref('')

// 【4】连接设备
function connect(data) {
  console.log(data)

  deviceId.value = data.deviceId
  deviceName.value = data.name

  uni.createBLEConnection({
    deviceId: deviceId.value,
    success(res) {
      // console.log('连接成功')
      uni.showToast({
        title: '连接成功,开启消息监听',
        icon: 'none',
        duration: 1500
      })
      console.log(res)
      // 停止搜索
      isConnected.value = true
      stopDiscovery()
      // 开启消息监听
      notify()
     uni.pageScrollTo({
    scrollTop: 0
  })
    },
    fail(err) {
      // console.log('连接失败')
      uni.showToast({
        title: '连接失败',
        icon: 'none',
        duration: 1500
      })
      console.error(err)
    }
  })
}

// 【5】停止搜索
function stopDiscovery() {
  uni.stopBluetoothDevicesDiscovery({
    success(res) {
      console.log('停止成功')
      console.log(res)
    },
    fail(err) {
      console.log('停止失败')
      console.error(err)
    }
  })
}
// 【6】获取服务
function getServices() {
  uni.getBLEDeviceServices({
    deviceId: deviceId.value, // 设备ID，在上一步【4】里获取
    success(res) {
      console.log(res)
    },
    fail(err) {
      console.error(err)
    }
  })
}
// 【7】获取特征值
function getCharacteristics() {
  uni.getBLEDeviceCharacteristics({
    deviceId: deviceId.value, // 设备ID，在【4】里获取到
    serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB', // 服务UUID，在【6】里能获取到
    success(res) {
      console.log(res)
    },
    fail(err) {
      console.error(err)
    }
  })
}
// 【9】监听消息变化
function listenValueChange() {
  // console.log('监听消息变化');
  uni.showToast({
    title: '监听消息变化已开启',
    icon: 'none',
    duration: 1000
  })
  uni.onBLECharacteristicValueChange(res => {
    // 结果
    console.log('监听消息变化res:', res)

    // 结果里有个value值，该值为 ArrayBuffer 类型，所以在控制台无法用肉眼观察到，必须将该值转换为16进制
    let resHex = ab2hex(res.value)
    console.log("监听到的消息resHex:",resHex)

    // 最后将16进制转换为ascii码，就能看到对应的结果
    let result = hexCharCodeToStr(resHex)
    console.log("监听到的消息result:",result)
    // 显示结果和置信度
    // 使用正则表达式提取result和confidence的值
    const resultMatch = result.match(/Result :\s*(.*?)(?:,\s*confidence|\s*confidence)\s*(\d+\.\d+)/)

    if (resultMatch) {
      Result.value = resultMatch[1]
      confidence.value = parseFloat(resultMatch[2])
      console.log('提取的结果:', Result.value)
      console.log('提取的置信度:', confidence.value)
    } else {
      console.log('无法提取结果和置信度')
    }
  })

}

// 【8】开启消息监听
function notify() {
  getServices()
  getCharacteristics()
  send()
  uni.notifyBLECharacteristicValueChange({
    deviceId: deviceId.value, // 设备ID，在【4】里获取到
    serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB', // 服务UUID，在【6】里能获取到
    characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB', // 特征值，在【7】里能获取到
    state: true,
    success(res) {
      console.log("开启消息监听成功", res)
      // 接受消息的方法
      listenValueChange()
      isListening.value = true
    },
    fail(err) {
      console.error("开启消息监听error", err)
    }
  })
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('')
}

// 将16进制的内容转成我们看得懂的字符串内容
function hexCharCodeToStr(hexCharCodeStr) {
  var trimedStr = hexCharCodeStr.trim();
  var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    alert("存在非法字符!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16);
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}
// 【10】发送数据
function send() {

  let msg = 'set_smode=3\n'

  const buffer = new ArrayBuffer(msg.length)
  const dataView = new DataView(buffer)


  for (var i = 0; i < msg.length; i++) {
    dataView.setUint8(i, msg.charAt(i).charCodeAt())
    // dataView.setUint8(i, msg.charAt(i))
  }

  uni.writeBLECharacteristicValue({
    deviceId: deviceId.value, // 设备ID，在【4】里获取到
    serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB', // 服务UUID，在【6】里能获取到
    characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB', // 特征值，在【7】里能获取到
    value: buffer,
    success(res) {
      console.log("发送数据成功", res)
      console.log("发送的数据(buffer):", buffer);
      
    },
    fail(err) {
      console.error("发送数据失败", err)
    }
  })
}
onLoad(()=>{
  initBlue()
})
onShow(()=>{
  //滚动到顶部
  uni.pageScrollTo({
    scrollTop: 0
  })
})
</script>

<style>

</style>