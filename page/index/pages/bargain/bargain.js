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
  //用户登录
  toLogin(){
    let that=this;
    wx.login({
      success: function (res) {
        var obj = {code:res.code};  
        wx.request({
            url: config.registerUserByWeixinUrl,
            data:obj,
            success: function (res) {
              if(!res.data.data.token||!res.data.data.id){
                wx.showModal({
                  title: '登录已过期',
                  content: '小程序将无法正常使用,点击确定重新登录。',
                  success: function (res) {
                    if (res.confirm) {
                      that.toLogin();
                    }
                  }
                })
              
              }else{
                  that.setData({
                    token : res.data.data.token,
                    userId: res.data.data.id
                  });
                  if (res.data.data.rootUid) {
                    that.setData({
                      rootUid: res.data.data.rootUid,
                    });
                  }
                  //更新缓存信息
                  util_js.setStrg("userInfo", res.data, function () {

                  });
                that.onLoad();
              }

            },
            fail: function (res) {
              wx.showToast({
                title: res,
                icon: 'none',
                duration: 2000
              });
            }
          })
        // }, 500)
      }
    });
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        if(!res.data.data.token){
          //token不合法或者丢失，重新登录缓存token
          that.toLogin();

        }else{
           that.setData({
          token: res.data.data.token
        })
        }
       
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
              if(res.data.success){
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
              }else{
                 //用户信息丢失或者token失效，重新登录获取token存入本地缓存
                 that.toLogin();
              }

          }
        })
      },
      fail:function(){
        
      }
    })
  },

  addBargain:function(e){
    var that = this;
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