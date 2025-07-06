"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_map = require("../../utils/map.js");
const stores_history = require("../../stores/history.js");
if (!Math) {
  topMargin();
}
const topMargin = () => "../../components/top-margin/top-margin.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const Result = common_vendor.ref("Speak");
    const confidence = common_vendor.ref("0.91");
    const imageName = common_vendor.ref("Speech");
    const blueDeviceList = common_vendor.ref([]);
    const isConnected = common_vendor.ref(false);
    const isListening = common_vendor.ref(false);
    const historyStore = stores_history.useHistoryStore();
    function initBlue() {
      common_vendor.index.openBluetoothAdapter({
        success(res) {
          console.log("初始化蓝牙成功");
          common_vendor.index.showToast({
            title: "初始化蓝牙成功",
            icon: "success",
            duration: 1e3
          });
          console.log(res);
        },
        fail(err) {
          console.log("初始化蓝牙失败");
          common_vendor.index.showToast({
            title: "初始化蓝牙失败",
            icon: "none",
            duration: 1e3
          });
          console.error(err);
        }
      });
    }
    function discovery() {
      common_vendor.index.startBluetoothDevicesDiscovery({
        success(res) {
          console.log("开始搜索");
          common_vendor.index.onBluetoothDeviceFound(found);
        },
        fail(err) {
          console.log("搜索失败");
          console.error(err);
        }
      });
    }
    function found(res) {
      console.log(res);
      blueDeviceList.value.push(res.devices[0]);
    }
    const deviceId = common_vendor.ref("");
    const deviceName = common_vendor.ref("");
    function connect(data) {
      console.log(data);
      deviceId.value = data.deviceId;
      deviceName.value = data.name;
      common_vendor.index.createBLEConnection({
        deviceId: deviceId.value,
        success(res) {
          common_vendor.index.showToast({
            title: "连接成功,开启消息监听",
            icon: "none",
            duration: 1500
          });
          console.log(res);
          isConnected.value = true;
          stopDiscovery();
          notify();
          common_vendor.index.pageScrollTo({
            scrollTop: 0
          });
        },
        fail(err) {
          common_vendor.index.showToast({
            title: "连接失败",
            icon: "none",
            duration: 1500
          });
          console.error(err);
        }
      });
    }
    function stopDiscovery() {
      common_vendor.index.stopBluetoothDevicesDiscovery({
        success(res) {
          console.log("停止成功");
          console.log(res);
        },
        fail(err) {
          console.log("停止失败");
          console.error(err);
        }
      });
    }
    function getServices() {
      common_vendor.index.getBLEDeviceServices({
        deviceId: deviceId.value,
        // 设备ID，在上一步【4】里获取
        success(res) {
          console.log(res);
        },
        fail(err) {
          console.error(err);
        }
      });
    }
    function getCharacteristics() {
      common_vendor.index.getBLEDeviceCharacteristics({
        deviceId: deviceId.value,
        // 设备ID，在【4】里获取到
        serviceId: "0000FFE0-0000-1000-8000-00805F9B34FB",
        // 服务UUID，在【6】里能获取到
        success(res) {
          console.log(res);
        },
        fail(err) {
          console.error(err);
        }
      });
    }
    function listenValueChange() {
      common_vendor.index.showToast({
        title: "监听消息变化已开启",
        icon: "none",
        duration: 1e3
      });
      common_vendor.index.onBLECharacteristicValueChange((res) => {
        console.log("监听消息变化res:", res);
        let resHex = ab2hex(res.value);
        console.log("监听到的消息resHex:", resHex);
        let result = hexCharCodeToStr(resHex);
        console.log("监听到的消息result:", result);
        const resultMatch = result.match(/Result :\s*(.*?)(?:,\s*confidence|\s*confidence)\s*(\d+\.\d+)/);
        if (resultMatch) {
          Result.value = resultMatch[1];
          confidence.value = parseFloat(resultMatch[2]);
          console.log("提取的结果:", Result.value);
          console.log("提取的置信度:", confidence.value);
          imageName.value = utils_map.imageMap[Result.value] || "default";
          historyStore.addRecord({
            date: (/* @__PURE__ */ new Date()).toLocaleString(),
            result: utils_map.imageMap[Result.value] || Result.value,
            // 结果
            confidence: confidence.value,
            // 置信度
            num: 1,
            // 出现次数
            danger: utils_map.isDanger(imageName.value)
            // 是否危险
          });
          console.log("Result:", Result.value);
          console.log("影射", utils_map.imageMap[Result.value]);
          console.log("图片名称:", imageName.value);
        } else {
          console.log("无法提取结果和置信度");
        }
      });
    }
    function notify() {
      getServices();
      getCharacteristics();
      send();
      common_vendor.index.notifyBLECharacteristicValueChange({
        deviceId: deviceId.value,
        // 设备ID，在【4】里获取到
        serviceId: "0000FFE0-0000-1000-8000-00805F9B34FB",
        // 服务UUID，在【6】里能获取到
        characteristicId: "0000FFE1-0000-1000-8000-00805F9B34FB",
        // 特征值，在【7】里能获取到
        state: true,
        success(res) {
          console.log("开启消息监听成功", res);
          listenValueChange();
          isListening.value = true;
        },
        fail(err) {
          console.error("开启消息监听error", err);
        }
      });
    }
    function ab2hex(buffer) {
      const hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function(bit) {
          return ("00" + bit.toString(16)).slice(-2);
        }
      );
      return hexArr.join("");
    }
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
    function send() {
      let msg = "set_smode=3\n";
      const buffer = new ArrayBuffer(msg.length);
      const dataView = new DataView(buffer);
      for (var i = 0; i < msg.length; i++) {
        dataView.setUint8(i, msg.charAt(i).charCodeAt());
      }
      common_vendor.index.writeBLECharacteristicValue({
        deviceId: deviceId.value,
        // 设备ID，在【4】里获取到
        serviceId: "0000FFE0-0000-1000-8000-00805F9B34FB",
        // 服务UUID，在【6】里能获取到
        characteristicId: "0000FFE1-0000-1000-8000-00805F9B34FB",
        // 特征值，在【7】里能获取到
        value: buffer,
        success(res) {
          console.log("发送数据成功", res);
          console.log("发送的数据(buffer):", buffer);
        },
        fail(err) {
          console.error("发送数据失败", err);
        }
      });
    }
    common_vendor.onLoad(() => {
      initBlue();
    });
    common_vendor.onShow(() => {
      common_vendor.index.pageScrollTo({
        scrollTop: 0
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !isConnected.value && blueDeviceList.value.length === 0
      }, !isConnected.value && blueDeviceList.value.length === 0 ? {} : {}, {
        b: !isConnected.value && blueDeviceList.value.length
      }, !isConnected.value && blueDeviceList.value.length ? {
        c: common_vendor.f(blueDeviceList.value, (device, index, i0) => {
          return {
            a: common_vendor.t(device.name),
            b: common_vendor.t(device.deviceId),
            c: common_vendor.o(($event) => connect(device), index),
            d: index
          };
        })
      } : {}, {
        d: isConnected.value
      }, isConnected.value ? {
        e: common_vendor.t(deviceName.value),
        f: `../../static/${imageName.value}.png`,
        g: common_vendor.t(common_vendor.unref(utils_map.imageMap)[Result.value] || Result.value),
        h: common_vendor.t(confidence.value)
      } : {}, {
        i: !isConnected.value && blueDeviceList.value.length === 0
      }, !isConnected.value && blueDeviceList.value.length === 0 ? {
        j: common_vendor.o(discovery)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
