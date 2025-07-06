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
        v-if="connectStatus === '未连接'"
        class="flex justify-center items-center h-full text-center text-gray-500 text-2xl font-bold"
      >
        <text>请确认手动连接至wifi模块热点后，点击“开始连接”即可连接到设备</text>
      </view>
     
      <view v-if="connectStatus === '已连接'"> 
        <view class="mt-4 flex justify-center">
          <view  class=" border border-gray-300 rounded-lg px-6 py-2 text-gray-500 text-sm"  style="border: 1px solid gray;">
           已连接设备: {{ moduleIP }}</view>
        </view>
        
        <view class="flex flex-col items-center justify-center mt-4 h-full" >
          <image class="w-[40vw]  rounded-full mb-4" :src="`../../static/${imageName}.png`" mode="aspectFit"></image>
          <view class="text-center">
            <view class="text-xl font-bold">Result: {{ imageMap[Result]||Result }}</view>
            <text class="border border-gray-300 rounded-full px-6 py-2 text-gray-500 text-sm mt-2">confidence: {{ confidence }}</text>
          </view>
        </view>


      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="fixed bottom-4 left-1/2 transform -translate-x-1/2">
      <view class="border border-gray-300 rounded-full px-6 py-2 text-gray-500 text-sm"
      @click="connectModule" v-if="connectStatus === '未连接'" style="border: 1px solid gray;">
        开始连接
      </view>
    </view>
  </view>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { onLoad, onShow} from '@dcloudio/uni-app';
import topMargin from '@/components/top-margin/top-margin.vue';
import {imageMap,isDanger} from '@/utils/map'
import { useHistoryStore } from '@/stores/history';
// 数据部分
const moduleIP = ref('192.168.4.1');
const modulePort = ref(9000);
const connectStatus = ref('未连接');
const receiveData = ref('');
const sendData = ref('set_smode=3\n');
const logList = ref([]);
const TcpSocket = ref(null);
const tcpSocket = wx.createTCPSocket();
const Result = ref('Speak')
const confidence = ref('0.91')
const imageName=ref('Speech')
const historyStore = useHistoryStore()

// 方法部分
const connectModule = () => {
  // #ifdef MP-WEIXIN
  // 使用微信原生API创建TCP Socket

  // 监听连接成功
  tcpSocket.onConnect(() => {
    updateLog('TCP连接成功');
    connectStatus.value = '已连接';
    TcpSocket.value = tcpSocket;

    // 连接成功后发送测试指令
    sendModuleData(sendData.value);
  });

  // 监听接收到的数据
  tcpSocket.onMessage((res) => {
    const resHex = ab2hex(res.message);
    let result = hexCharCodeToStr(resHex);

    console.log('收到数据data', result);
    // updateLog(`收到数据: ${result}`);

    receiveData.value = result;
    const resultMatch = result.match(/Result :\s*(.*?)(?:,\s*confidence|\s*confidence)\s*(\d+\.\d+)/)

    if (resultMatch) {
      Result.value = resultMatch[1]
      confidence.value = parseFloat(resultMatch[2])
      console.log('提取的结果:', Result.value)
      console.log('提取的置信度:', confidence.value)
      // 显示图片
      imageName.value = imageMap[Result.value]||'default'
      historyStore.addRecord({
        date: new Date().toLocaleString(),
        result: imageName.value||Result.value, // 结果
        confidence: confidence.value, // 置信度
        num: 1, // 出现次数
        danger: isDanger(imageMap[Result.value]) // 是否危险

      })
      console.log("Result:", Result.value);
      console.log("影射", imageMap[Result.value]);
      console.log('图片名称:', imageName.value);
      
    } else {
      console.log('无法提取结果和置信度')
    }
  });

  // 监听连接关闭
  tcpSocket.onClose(() => {
    updateLog('TCP连接已关闭');
    connectStatus.value = '未连接';
    TcpSocket.value = null;
  });

  // 监听错误
  tcpSocket.onError((err) => {
    updateLog(`TCP错误: ${JSON.stringify(err)}`, 'error');
    connectStatus.value = `连接失败(${err.errMsg})`;
  });

  // 发起连接
  updateLog(`正在连接 ${moduleIP.value}:${modulePort.value}...`);
  tcpSocket.connect({
    address: moduleIP.value,
    port: modulePort.value,
    success: () => {
      updateLog('连接请求已发送');
    },
    fail: (err) => {
      updateLog(`连接失败: ${err.errMsg}`, 'error');
    }
  });
  // #endif

  // #ifndef MP-WEIXIN
  uni.showToast({
    title: '此功能仅支持微信小程序',
    icon: 'none'
  });
  // #endif
};

const sendModuleData = (data) => {
  console.log('发送数据data', data)
  // #ifdef MP-WEIXIN
  const buffer = str2ab(data);
  console.log('发送数据buffer', buffer);
  console.log('验证是否直接return', tcpSocket);
  
  if (!TcpSocket.value) return;

  tcpSocket.write(buffer);
  // #endif
};

const disconnect = () => {
  // #ifdef MP-WEIXIN
  if (TcpSocket.value) {
    tcpSocket.close();
    TcpSocket.value = null;
    connectStatus.value = '未连接';
  }
  // #endif
};

const str2ab = (str) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new DataView(buf);
  for (let i = 0; i < str.length; i++) {
        bufView.setUint8(i, str.charAt(i).charCodeAt())

  }
  return buf;
};

const ab2str = (buf) => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

const ab2hex = (buffer) => {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2);
    }
  );
  return hexArr.join('');
};

const hexCharCodeToStr = (hexCharCodeStr) => {
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
};

const updateLog = (message, type = 'info') => {
  const time = new Date().toLocaleTimeString();
  const logItem = { time, message, type };
  logList.value.push(logItem);

  // 限制日志数量
  if (logList.value.length > 50) {
    logList.value.shift();
  }

  console.log(`[${time}] ${message}`);
};

</script>

