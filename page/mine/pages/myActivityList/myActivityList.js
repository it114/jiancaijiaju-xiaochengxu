// pages/index/activityList/activityList.wxml.js
var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      activityList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    var data = {};
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        data = {token: res.data.data.token};
        wx.request({
          url: config.getMyActivityPagerUrl,
          data: data,
          method: 'GET',
          success: function (res) {
            for(var i = 0;i < res.data.data.length;i++){
              res.data.data[i].startDate = util_js.formatTimeToDay(res.data.data[i].startDate)
              res.data.data[i].endDate = util_js.formatTimeToDay(res.data.data[i].endDate)
            }
            that.setData({
              activityList: res.data.data
            })
          }
        })
      }
    });
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