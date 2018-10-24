var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    showLoading: false,
    allResults: "",
    token:"",
    list:[],
    list_used:[],
    list_timed : []
  },
  onLoad: function () {
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          token: res.data.data.token
        })
        wx.request({
          url: config.getCanUseCouponCountUrl,
          data: { token: res.data.data.token, money:0},
          method: 'GET',
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].startTime = util_js.formatTimeToDay(res.data.data[i].startTime)
              res.data.data[i].endTime = util_js.formatTimeToDay(res.data.data[i].endTime)
            }
            var allResults = {};
            for (var i = 0; i < res.data.data.length; i++) {
              allResults[res.data.data[i].id] = res.data.data[i]
            }
            that.setData({
              list: res.data.data,
              allResults: allResults
            })
          }
        })
      }
    })
  },
  chooseAddress: function (e) {
    var that = this;
    console.log(that.data.allResults[e.currentTarget.id])
    util_js.setStrg("chooseVoucher", that.data.allResults[e.currentTarget.id], function () {
      setTimeout(function () {
        wx.hideLoading();
        wx.navigateBack({
          delta: 1
        })
      }, 500)
    });
  },
  onShareAppMessage: function () {
    util_js.shareApp();
  }
})