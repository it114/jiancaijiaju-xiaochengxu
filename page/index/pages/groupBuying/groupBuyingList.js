// page/index/pages/groupBuying/groupBuyingList.js
var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"",
    groupBuyingList: [
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util_js.setStrg("chooseVoucher", {}, function () { });
    util_js.setStrg("chooseEdAddress", {}, function () { });
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          token: res.data.data.token
        })
        //统计次数
        wx.request({
          url: config.getNumsUrl + '?token=' + encodeURIComponent(res.data.data.token) + '&eventType=3',
          method: 'post',
          success: function (res) {
          }
        })

        wx.request({
          url: config.getGroupByPagerUrl,
          data: { token: res.data.data.token},
          method: 'GET',
          success: function (res) {
            if (res.data.data.length) {

              for(var i = 0;i < res.data.data.length;i++){
                res.data.data[i].percent = that.toFixed(res.data.data[i].buyNum / res.data.data[i].num * 100,2);
                // res.data.data[i].isHaveGood = 'N';
              }
              
              that.setData({
                groupBuyingList: res.data.data
              })
            }
          }
        })
      }
    })
  },
  toFixed : function(num, s) {
    var times = Math.pow(10, s)
	    var des = num * times + 0.5
	    des = parseInt(des, 10) / times
	    return des + ''
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    util_js.shareApp();
  }
})