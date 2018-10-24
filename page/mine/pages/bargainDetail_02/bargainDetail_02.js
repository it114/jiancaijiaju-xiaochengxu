var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth : "",
    winHeight : "",
    isfriendBargain:false,
    isBargainPrice: 0,
    totalPrice: "",
    results: {},
    userId: "",
    rootUid:"",
    token:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        // console.log(res)
        // console.log(44)
        that.setData({
          token: res.data.data.token,
          userId: res.data.data.id,
          uid : res.data.data.id
        })


        if (res.data.data.rootUid) {
          that.setData({
            rootUid: res.data.data.rootUid,
          });
        }


        wx.request({
          url: config.getBargainInfoUrl,
          data: { token: res.data.data.token, bid: options.bid, friendUid: res.data.data.id},
          method: 'GET',
          success: function (res) {
            res.data.data.image = res.data.data.image.split(",")[0];
            var imgArr = [];
            var obj = util_js.getImgByThisSize(res.data.data.image, that.data.winWidth, 200);
            res.data.data.style = obj.style;
            res.data.data.image = obj.url;
            // }
            var isBargainPrice = 0;
            var isfriendBargain = false;
            if (res.data.data.participate){
              isfriendBargain = true;
              isBargainPrice = res.data.data.bargainPrice;
            }
            that.setData({
              isBargainPrice: isBargainPrice,
              isfriendBargain: isfriendBargain,
              results: res.data.data,
              bid: options.bid,
              totalPrice: res.data.data.price,
              bargainPrice_mine: that.toFixed(res.data.data.originalPrice - res.data.data.aimsPrice - res.data.data.price - that.data.isBargainPrice ,2)
            })
            var this_time = (res.data.data.ctime + 24 * 60 * 60 * 1000 - new Date().getTime()) / 1000;
            that.timeDown(this_time);
            // }
          }
        })
      }
    })
  },
  friendBargain:function(){
    var that = this;
    if (that.data.isfriendBargain){
      return;
    }
    wx.request({
      url: config.friendBargainUrl,
      data: { token: that.data.token, friendUid: that.data.uid, bid:that.data.bid},
      method: 'GET',
      success: function (res) {
        // console.log(res.data.money)
        that.setData({
          isfriendBargain: true,
          isBargainPrice: res.data.data.money,
          totalPrice: that.toFixed(that.data.totalPrice + res.data.data.money, 2),
          bargainPrice_mine: that.toFixed(that.data.results.originalPrice - that.data.results.aimsPrice - that.data.results.price - res.data.data.money,2)
        })
        wx.showToast({
          title: '砍价成功！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  toFixed:function(num, s) {
    var times = Math.pow(10, s)
    var des = num * times + 0.5
    des = parseInt(des, 10) / times
    return des + ''
  },
  bugGood: function () {
    var that = this;
    var price = that.data.results.originalPrice - that.data.totalPrice;
    wx.navigateTo({
      url: 'orderConfirm/orderConfirm?' + 'bid=' + that.data.bid + '&gid=' + that.data.token + '&image=' + that.data.results.image + '&style=' + that.data.results.style + '&price=' + price + '&goodName=' + that.data.results.goodName,
    })
  },
  timeDown: function (starttime, types) {
    var that = this;
    if (starttime < 1) {
      starttime = 0
    }
    var tim = setInterval(function () {
      var oDay = Math.floor(starttime / (60 * 60 * 24));
      var _oDay = starttime % (60 * 60 * 24);
      var oHour = Math.floor(_oDay / (60 * 60));
      var _oHour = _oDay % (60 * 60);
      var oMinutes = Math.floor(_oHour / (60));
      var _oMinutes = _oHour % (60);
      var oSecond = Math.floor(_oMinutes);
      starttime--;
      if (starttime > 0) {
        if (oHour <= 0) {
          oHour = "00"
        } else if (oHour < 10) {
          oHour = "0" + oHour.toString();
        }
        if (oMinutes <= 0) {
          oMinutes = "00"
        } else if (oMinutes < 10) {
          oMinutes = "0" + oMinutes.toString();
        }
        if (oSecond <= 0) {
          oSecond = "00"
        } else if (oSecond < 10) {
          oSecond = "0" + oSecond;
        }
      } else {
        clearInterval(tim);
        that.setData({
          oDay_crazyNowList: "00",
          oHour_crazyNowList: "00",
          oMinutes_crazyNowList: "00",
          oSecond_crazyNowList: "00"
        })
      }
      that.setData({
        oDay: oDay,
        oHour: oHour,
        oMinutes: oMinutes,
        oSecond: oSecond
      })
    }, 1000)
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
    var that = this;
    if (!that.data.token) {
      return;
    }
    wx.request({
      url: config.getBargainInfoUrl,
      data: { bid: that.data.bid, token: that.data.token, friendUid: that.data.userId },
      method: 'GET',
      success: function (res) {
        console.log(res)
        res.data.data.image = res.data.data.image.split(",")[0];
        var imgArr = [];
        var obj = util_js.getImgByThisSize(res.data.data.image, that.data.winWidth, 200);
        res.data.data.style = obj.style;
        res.data.data.image = obj.url;
        var isfriendBargain = false;
        if (res.data.data.participate) {
          isfriendBargain = true;
        }
        that.setData({
          isfriendBargain: isfriendBargain,
          results: res.data.data,
          isBargainPrice: res.data.data.bargainPrice,
          totalPrice: res.data.data.price,
          bargainPrice_mine: that.toFixed(res.data.data.originalPrice - res.data.data.aimsPrice - res.data.data.price - res.data.data.bargainPrice, 2)
        })
        var this_time = (res.data.data.ctime + 24 * 60 * 60 * 1000 - new Date().getTime()) / 1000;
        that.timeDown(this_time);
        // }
      }
    })
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
    var that = this;
    // console.log('/pages/bargainDetail_02/bargainDetail_02?uid=' + that.data.userId)
    return {
      title: '家居mall,兄弟快来帮忙砍一刀！',
      path: '/page/main/index/index?uid=' + that.data.userId + "&bid=" + that.data.bid + "&pagerId=bargainDetail_02&rootUid="+that.data.rootUid,
      success: function (res) {
        wx.request({
          url: config.shareUrl,
          data: { token: that.data.token },
          success: function (res) {
            console.log(565)
          }
        })
      }
    }
  }
})