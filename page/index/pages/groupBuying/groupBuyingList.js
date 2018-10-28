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
    loadingHidden: false

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
            console.log(res)
          }
        })

        wx.request({
          url: config.getGroupByPagerUrl,
          data: { token: that.data.token},
          method: 'GET',
          success: function (res) {

 
            if (res.statusCode==200) {              
              // getCurrentPages()[getCurrentPages().length - 1].onLoad();
              let listData=res.data.data;
              for(var i = 0;i < listData.length;i++){
                listData[i].percent = (listData[i].buyNum / listData[i].num * 100).toFixed(2);
              }
             that.setData({
                groupBuyingList: listData,
                loadingHidden:true
              });
            }else{
              that.setData({
                loadingHidden:true
              })
              wx.showToast({
                title: '拼团列表出错了，请稍后再试～！',
                icon: 'none',
                duration: 2000
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