if(!self.__appxInited) {
self.__appxInited = 1;
require('@alipay/appx-compiler/lib/sjsEnvInit');

require('./config$');


      function getUserAgentInPlatformWeb() {
        return typeof navigator !== 'undefined' ? navigator.swuserAgent || navigator.userAgent || '' : '';
      }
      if(getUserAgentInPlatformWeb() && (getUserAgentInPlatformWeb().indexOf('LyraVM') > 0 || getUserAgentInPlatformWeb().indexOf('AlipayIDE') > 0) ) {
        var AFAppX = self.AFAppX.getAppContext ? self.AFAppX.getAppContext().AFAppX : self.AFAppX;
      } else {
        importScripts('https://appx/af-appx.worker.min.js');
        var AFAppX = self.AFAppX;
      }
      self.getCurrentPages = AFAppX.getCurrentPages;
      self.getApp = AFAppX.getApp;
      self.Page = AFAppX.Page;
      self.App = AFAppX.App;
      self.my = AFAppX.bridge || AFAppX.abridge;
      self.abridge = self.my;
      self.Component = AFAppX.WorkerComponent || function(){};
      self.$global = AFAppX.$global;
      self.requirePlugin = AFAppX.requirePlugin;
    

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}

if(AFAppX.compilerConfig){ AFAppX.compilerConfig.component2 = true; }

function success() {
require('../../app');
require('../../components/qiun-my-ucharts/error?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/qiun-my-ucharts/loading1?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/qiun-my-ucharts/loading2?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/qiun-my-ucharts/loading3?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/qiun-my-ucharts/loading4?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/qiun-my-ucharts/loading5?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/qiun-my-ucharts/loading?hash=0bb98753a13f3a17af2932fa2f2ad7627c18e154');
require('../../components/qiun-my-ucharts/index?hash=e08e16c5af1b621e715aad4b2bfaa596648114c3');
require('../../pages/index/index?hash=f10c4498a0ca3dc4b33c0e6fa1d8a8b5a4452783');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}