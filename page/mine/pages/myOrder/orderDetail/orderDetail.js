var config = require('../../../../../config.js');
var util_js = require('../../../../../util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userIcon:"",
    orderInfo : {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = decodeURIComponent(options.id);
    wx.getStorage({
      key: "userInfo", 
      success: function (res) {
        that.setData({
          userIcon: res.data.data.icon
        })
        wx.request({
          url: config.getGoodOrderInfoUrl,
          data: { token: res.data.data.token, oid:id },
          method: 'GET',
          success: function (res) {
            console.log(res)
            res.data.data.payTime = util_js.formatTimeToDate(res.data.data.payTime);
            res.data.data.image = res.data.data.image.split(",")[0];
            if (res.data.data.status == 0){
              res.data.data.statusName = "待支付"
            } else if (res.data.data.status == 1) {
              res.data.data.statusName = "等待发货"
            } else if (res.data.data.status == 2) {
              res.data.data.statusName = "已发货"
            } else if (res.data.data.status == 3) {
              res.data.data.statusName = "已确认收货"
            } else if (res.data.data.status == 4) {
              res.data.data.statusName = "已评价"
            } else if (res.data.data.status == 5) {
              res.data.data.statusName = "已取消"
            }
            that.setData({
              orderInfo: res.data.data
            })
          }
        })
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    util_js.shareApp();
  }
})