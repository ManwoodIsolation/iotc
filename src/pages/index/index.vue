<template>
  <view>
    <scroll-view scroll-y class="box" v-if="!isConnected">
      <view class="item" v-for="item in blueDeviceList" @click="connect(item)">
        <view>
          <text>id: {{ item.deviceId }}</text>
        </view>
        <view>
          <text>name: {{ item.name }}</text>
        </view>
      </view>
    </scroll-view>
    <view v-if="isConnected">
      <text>已连接设备: {{ deviceId }}</text>
      <!-- <button @click="getServices">获取服务</button> -->
      <!-- 显示结果和置信度 -->
      <view v-if="Result && confidence">
        <text class="result-text">结果: {{ Result }}</text>
        <text class="confidence-text">置信度: {{ confidence }}</text>
      </view>
    </view>
    <button @click="initBlue" v-if="!isConnected">初始化蓝牙</button>

    <button @click="discovery" v-if="!isConnected">搜索附近蓝牙设备</button>
    <!-- <button @click="getServices">获取蓝牙服务</button>
    <button @click="getCharacteristics">获取特征值</button> -->
    <button @click="notify" v-if="!isListening && isConnected">开启消息监听</button>
    <button @click="isListening = false" v-if="isListening && isConnected">关闭消息监听</button>
    <!-- <button @click="send">发送数据</button> -->
  </view>
</template>

<script setup>
import { ref } from 'vue'
// 存储结果和置信度
const Result = ref('')
const confidence = ref('')
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
  // deviceId.value = data.deviceId

  uni.createBLEConnection({
    deviceId: deviceId.value,
    success(res) {
      console.log('连接成功')
      console.log(res)
      // 停止搜索
      isConnected.value = true
      stopDiscovery()
    },
    fail(err) {
      console.log('连接失败')
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
    const resultMatch = result.match(/Result :\s*(.*?)\s*confidence \s*(\d+\.\d+)/)
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



// function send() {
//   let msg = 'set_smode=3';

//   // 计算16进制字符串的长度（每个字符对应两个16进制字符）
//   const hexLength = msg.length * 2;
//   const buffer = new ArrayBuffer(hexLength);
//   const dataView = new DataView(buffer);

//   for (var i = 0; i < msg.length; i++) {
//     const charCode = msg.charAt(i).charCodeAt();
//     const highByte = charCode >> 8; // 高字节
//     const lowByte = charCode & 0xFF; // 低字节

//     // 将高字节和低字节分别存入DataView
//     dataView.setUint8(i * 2, highByte);
//     dataView.setUint8(i * 2 + 1, lowByte);
//   }

//   uni.writeBLECharacteristicValue({
//     deviceId: deviceId.value, // 设备ID，在【4】里获取到
//     serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB', // 服务UUID，在【6】里能获取到
//     characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB', // 特征值，在【7】里能获取到
//     value: buffer,
//     success(res) {
//       console.log("发送数据成功", res);
//       // console.log("发送的数据(buffer):", buffer);
//     },
//     fail(err) {
//       console.error("发送数据失败", err);
//     }
//   });
// }

</script>

<style>
.box {
  width: 100%;
  height: 400rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;
  border: 2px solid dodgerblue;
}

.item {
  box-sizing: border-box;
  padding: 10rpx;
  border-bottom: 1px solid #ccc;
}

button {
  margin-bottom: 20rpx;
}
</style>