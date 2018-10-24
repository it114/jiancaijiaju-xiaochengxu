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
            console.log(res);
          }
        })

        
        console.log(res.data.data.token);
        wx.request({
          url: config.getGroupByPagerUrl,
          data: { token: res.data.data.token},
          method: 'GET',
          success: function (res) {
            console.log(res);
            if (res.data.data.length) {
              console.log(res.data.data);
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