//index.js
//获取应用实例
var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
const app = getApp()
var data = {};
Page({
  data: {
    winHeight: 0,
    winWidth: 0
  },
  onLoad: function (opt) {
    var that = this;
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth*0.50,
          winHeight: res.windowHeight * 0.50
        });

        that.setData({
          originwinWidth: res.windowWidth ,
          originwinHeight: res.windowHeight 
        });
      }

    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    util_js.shareApp();
  }
})
