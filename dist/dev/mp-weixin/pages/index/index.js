"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const Result = common_vendor.ref("");
    const confidence = common_vendor.ref("");
    const blueDeviceList = common_vendor.ref([]);
    const isConnected = common_vendor.ref(false);
    const isListening = common_vendor.ref(false);
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
          console.log("连接成功");
          console.log(res);
          isConnected.value = true;
          stopDiscovery();
        },
        fail(err) {
          console.log("连接失败");
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
        const resultMatch = result.match(/Result :\s*(.*?)\s*confidence \s*(\d+\.\d+)/);
        if (resultMatch) {
          Result.value = resultMatch[1];
          confidence.value = parseFloat(resultMatch[2]);
          console.log("提取的结果:", Result.value);
          console.log("提取的置信度:", confidence.value);
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
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !isConnected.value
      }, !isConnected.value ? {
        b: common_vendor.f(blueDeviceList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.deviceId),
            b: common_vendor.t(item.name),
            c: common_vendor.o(($event) => connect(item))
          };
        })
      } : {}, {
        c: isConnected.value
      }, isConnected.value ? common_vendor.e({
        d: common_vendor.t(deviceId.value),
        e: Result.value && confidence.value
      }, Result.value && confidence.value ? {
        f: common_vendor.t(Result.value),
        g: common_vendor.t(confidence.value)
      } : {}) : {}, {
        h: !isConnected.value
      }, !isConnected.value ? {
        i: common_vendor.o(initBlue)
      } : {}, {
        j: !isConnected.value
      }, !isConnected.value ? {
        k: common_vendor.o(discovery)
      } : {}, {
        l: !isListening.value && isConnected.value
      }, !isListening.value && isConnected.value ? {
        m: common_vendor.o(notify)
      } : {}, {
        n: isListening.value && isConnected.value
      }, isListening.value && isConnected.value ? {
        o: common_vendor.o(($event) => isListening.value = false)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
