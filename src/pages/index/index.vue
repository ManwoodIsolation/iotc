<template>
  <view>
      <scroll-view
          scroll-y
          class="box"
      >
          <view class="item" v-for="item in blueDeviceList" @click="connect(item)">
              <view>
                  <text>id: {{ item.deviceId }}</text>    
              </view>
              <view>
                  <text>name: {{ item.name }}</text>  
              </view>
          </view>
      </scroll-view>
      
      <button @click="initBlue">初始化蓝牙</button>
      
      <button @click="discovery">搜索附近蓝牙设备</button>
      <button @click="getServices">获取蓝牙服务</button>
      <button @click="getCharacteristics">获取特征值</button>
      <button @click="notify">开启消息监听</button>
      <!-- <button @click="send">发送数据</button> -->
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 搜索到的蓝牙设备列表
const blueDeviceList = ref([])

// 【1】初始化蓝牙
function initBlue() {
  uni.openBluetoothAdapter({
      success(res) {
          console.log('初始化蓝牙成功')
          console.log(res)
      },
      fail(err) {
          console.log('初始化蓝牙失败')
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

// 【4】连接设备
function connect(data) {
  console.log(data)

  deviceId.value = data.deviceId

  uni.createBLEConnection({
      deviceId: deviceId.value,
      success(res) {
          console.log('连接成功')
          console.log(res)
          // 停止搜索
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
  console.log('监听消息变化');
  
    uni.onBLECharacteristicValueChange(res => {
        // 结果
        console.log('监听消息变化',res)
        
        // 结果里有个value值，该值为 ArrayBuffer 类型，所以在控制台无法用肉眼观察到，必须将该值转换为16进制
        let resHex = ab2hex(res.value)
        // console.log(resHex)

        // 最后将16进制转换为ascii码，就能看到对应的结果
        let result = hexCharCodeToStr(resHex)
        console.log(result)
    })

}

// 【8】开启消息监听
function notify() {
    uni.notifyBLECharacteristicValueChange({
        deviceId: deviceId.value, // 设备ID，在【4】里获取到
        serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB', // 服务UUID，在【6】里能获取到
        characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB', // 特征值，在【7】里能获取到
        state: true,
        success(res) {
            console.log("开启消息监听成功", res)
            // 接受消息的方法
            listenValueChange()
        },
        fail(err) {
            console.error("开启消息监听error",err)
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
    // 向蓝牙设备发送一个0x00的16进制数据
    
    let msg = 'hello'
    
    const buffer = new ArrayBuffer(msg.length)
    const dataView = new DataView(buffer)
    // dataView.setUint8(0, 0)
    
    for (var i = 0; i < msg.length; i++) {
      dataView.setUint8(i, msg.charAt(i).charCodeAt())
    }
    
    uni.writeBLECharacteristicValue({
      deviceId: deviceId.value, // 设备ID，在【4】里获取到
      serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB', // 服务UUID，在【6】里能获取到
      characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB', // 特征值，在【7】里能获取到
      value: buffer,
      success(res) {
        console.log("发送数据成功",res)
      },
      fail(err) {
        console.error("发送数据失败",err)
      }
    })
}

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