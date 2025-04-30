"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const blueDeviceList = common_vendor.ref([]);
    function initBlue() {
      common_vendor.index.openBluetoothAdapter({
        success(res) {
          console.log("初始化蓝牙成功");
          console.log(res);
        },
        fail(err) {
          console.log("初始化蓝牙失败");
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
    function connect(data) {
      console.log(data);
      deviceId.value = data.deviceId;
      common_vendor.index.createBLEConnection({
        deviceId: deviceId.value,
        success(res) {
          console.log("连接成功");
          console.log(res);
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
      console.log("监听消息变化");
      common_vendor.index.onBLECharacteristicValueChange((res) => {
        console.log("监听消息变化", res);
        let resHex = ab2hex(res.value);
        let result = hexCharCodeToStr(resHex);
        console.log(result);
      });
    }
    function notify() {
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
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(blueDeviceList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.deviceId),
            b: common_vendor.t(item.name),
            c: common_vendor.o(($event) => connect(item))
          };
        }),
        b: common_vendor.o(initBlue),
        c: common_vendor.o(discovery),
        d: common_vendor.o(getServices),
        e: common_vendor.o(getCharacteristics),
        f: common_vendor.o(notify)
      };
    };
  }
};
wx.createPage(_sfc_main);
