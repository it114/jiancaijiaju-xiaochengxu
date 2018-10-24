var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    results:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        // console.log(options.bid)
        that.setData({
          token: res.data.data.token
        })
        wx.request({
          url: config.getBargainInfoUrl,
          data: { token: res.data.data.token, bid: options.bid},
          method: 'GET',
          success: function (res) {
            // console.log(res.data.data)
            // if (res.data.data.length) {
              // for (var i = 0; i < res.data.data.length; i++) {
                res.data.data.image = res.data.data.image.split(",")[0]
                var imgArr = [];
                var obj = util_js.getImgByThisSize(res.data.data.image, 100, 100);
                res.data.data.style = obj.style;
                res.data.data.image = obj.url;
              // }
              that.setData({
                results: res.data.data
              })
              console.log(that.data.results)
            // }
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