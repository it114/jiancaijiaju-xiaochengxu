// page/mine/pages/infoRegist/cardSales/cardSales.js
var config = require('../../../../../config.js');
var util_js = require('../../../../../util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    time: '请选择日期',
    weixin: "",
    weixinId: "",
    phone: "",
    brandsId: "",
    shopping: "",
    form: "",
    token: ""
  },

  bindDateChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          token: res.data.data.token
        })
      }
    });
  },
  watchUserWeixin: function (event) {
    const that = this;
    that.setData({
      weixin: event.detail.value
    })
  },
  watchUserWeixinId: function (event) {
    const that = this;
    that.setData({
      weixinId: event.detail.value
    })
  },
  watchUserPhone: function (event) {
    const that = this;
    that.setData({
      phone: event.detail.value
    })
  },
  watchBrand: function (event) {
    const that = this;
    that.setData({
      brandsId: event.detail.value
    })
  },

  watchForm: function (event) {
    const that = this;
    that.setData({
      form: event.detail.value
    })
  },
  watchShopping: function (event) {
    const that = this;
    that.setData({
      shopping: event.detail.value
    })
  },
  
  submitInfo: function () {
    var that = this;
    console.log(that.data)
    for (var i in that.data) {
      if (!that.data[i] && i != "weixinId" && i !="phone") {
        util_js.lessFive("请补全信息！");
        return;
      }
    }
    if (that.data["time"] == "请选择日期") {
      util_js.lessFive("请选择日期！", 1000);
      return;
    }
    if (that.data.phone.length != 11) {
      util_js.lessFive("手机号不正确！");
      return;
    }
    that.data["time"] = (new Date(that.data["time"])).getTime()
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        console.log(that.data)
        wx.request({
          url: config.addGroupEntryInfoUrl,
          data: that.data,
          method: 'GET',
          success: function (res) {
            console.log(res)
            util_js.lessFive("提交成功！",1500);
            that.setData({
              time: '请选择日期',
              weixin: "",
              weixinId: "",
              phone: "",
              brandsId: "",
              shopping: "",
              form: ""
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