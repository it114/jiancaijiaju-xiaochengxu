var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModel : false,
    bid:"",
    swiper:[
      { img : '../../images/tu.png' },  
    ],
    bargainList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

   

    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        // console.log(res)
        that.setData({
          token: res.data.data.token
        })


        //统计次数
        wx.request({
          url: config.getNumsUrl + '?token=' + encodeURIComponent(that.data.token) + '&eventType=2',
          method: 'post',
          success: function (res) {
            console.log(res);
          }
        })



        wx.request({
          url: config.getBargainPagerUrl,
          data: { token: that.data.token },
          method: 'GET',
          success: function (res) {
   
            if (res.data.data.length) {
              for (var i = 0; i < res.data.data.length; i++) {
                res.data.data[i].image = res.data.data[i].image.split(",")[0]
                var imgArr = [];
                var obj = util_js.getImgByThisSize(res.data.data[i].image, 100, 100);
                res.data.data[i].style = obj.style;
                res.data.data[i].image = obj.url;
              }
              that.setData({
                bargainList: res.data.data
              })
            }
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
  addBargain:function(e){
    var that = this;
    console.log(e)
    console.log({ token: that.data.token, bid: e.target.dataset.bid })
    wx.request({
      url: config.addBargainUrl,
      data: { token: that.data.token, bid: e.target.dataset.bid},
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.data.type == 2){
          wx.navigateTo({
            url: "../bargainDetail_02/bargainDetail_02?bid=" + res.data.data.bid
          })
        } else if (res.data.data.type == 1){
          that.setData({
            bid: res.data.data.bid,
            showModel: true
          })
        }
      }
    })
  },
  cancelThis:function(){
    this.setData({
      showModel: false
    })
    wx.navigateTo({
      url: "../bargainDetail_02/bargainDetail_02?bid=" + this.data.bid
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  toFixed:function(num, s) {
    var times = Math.pow(10, s)
    var des = num * times + 0.5
    des = parseInt(des, 10) / times
    return des + ''
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