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
    token:"",
    list:[],
    list_used:[],
    list_timed : []
  },
  showtip(){
    util_js.errorModel("下单时使用");
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
          url: config.getCouponUrl,
          data: {token: res.data.data.token,status:0},
          method: 'POST',
          success: function (res) {
            // for (var i = 0; i < res.data.data.length; i++) {
            //   res.data.data[i].startTime = util_js.formatTimeToDay(res.data.data[i].startTime)
            //   res.data.data[i].endTime = util_js.formatTimeToDay(res.data.data[i].endTime)
            // }
            that.setData({
             list : res.data
            })
          }
        })
      }
    })
  },
  handleLoadMore: function () {
    var that = this;
    this.setData({
      showLoading: true
    })

    //模拟加载
    setTimeout(function () {
      that.setData({
        showLoading: false
      })
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      // wx.stopPullDownRefresh() //停止下拉刷新
    }, 3500);
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == 1) {
        wx.request({
          url: config.getCouponUrl,
          // data: { token: that.data.token, status: 1},
          method: 'GET',
          success: function (res) {
            // for (var i = 0; i < res.data.data.length; i++) {
            //   res.data.data[i].startTime = util_js.formatTimeToDay(res.data.data[i].startTime)
            //   res.data.data[i].endTime = util_js.formatTimeToDay(res.data.data[i].endTime)
            // }
            that.setData({
              list_used: res.data
            })
          }
        })
      } else if (e.target.dataset.current == 2) {
        wx.request({
          url: config.getCouponUrl,
          // data: { token: that.data.token, status: 2 },
          method: 'GET',
          success: function (res) {
            // for (var i = 0; i < res.data.data.length; i++) {
            //   res.data.data[i].startTime = util_js.formatTimeToDay(res.data.data[i].startTime)
            //   res.data.data[i].endTime = util_js.formatTimeToDay(res.data.data[i].endTime)
            // }
            that.setData({
              list_timed: res.data
            })
          }
        })
     }
      that.setData({
        currentTab: e.target.dataset.current
      })
  }
},
  onShareAppMessage: function () {
    util_js.shareApp();
  }
})