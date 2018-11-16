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
      },
      fail:function(){
        //用户信息丢失，重新登录获取token存入本地缓存
        that.toLogin();


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