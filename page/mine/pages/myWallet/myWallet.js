// pages/mine/mine.js
var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money : 0,
    isClickPay:false,
    token: "",
    getMoney:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        console.log(res)
        that.setData({
          token: res.data.data.token,
          money: res.data.data.money,
          getMoney: res.data.data.money
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  bindMoney: function (e) {
    this.setData({
      getMoney: e.detail.value
    })
  },
  withdrawMoney :function(){
    var that = this;
    if (that.data.isClickPay) {
      return;
    }
    if (that.data.getMoney < 4.8){
      util_js.lessFive("提现金额不满4.8元", 1000);
      return;
    }
    console.log({ token: that.data.token, money: that.data.getMoney })
    if (that.data.getMoney <= 0){
      util_js.lessFive("提现金额不合法", 1000);
      return;
    }
    if (that.data.money <= that.data.getMoney) {
      util_js.lessFive("余额不足", 1000);
    }else{
      that.setData({
        isClickPay: true
      })
      wx.request({
        url: config.cashMoneyUrl,
        data: { token: that.data.token, money: that.data.getMoney },
        method: 'GET',
        success: function (res) {
          console.log(res)
          wx.request({
            url: config.loadUserInfoUrl,
            data: { token: that.data.token },
            method: 'GET',
            success: function (res) {
              console.log(res);
              that.setData({
                isClickPay: false
              })
              wx.showToast({
                title: '已提交申请',
                icon: 'success',
                duration: 2000
              })
              util_js.setStrg("userInfo", res.data, function () {

              });
              that.setData({
                money: res.data.data.money,
                getMoney: res.data.data.money
              })
            },
            fail:function(){
              that.setData({
                isClickPay: true
              })
            }
          })
        },
        fail: function () {
          that.setData({
            isClickPay: true
          })
        }
      })
    }
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