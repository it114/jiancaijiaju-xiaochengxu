// pages/mine/mine.js
var util_js = require('../../../util.js');
var config = require('../../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    token:"",
    userType:"",
    userId:"",
    rootUid:"",
  },


  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function (res) { 
          that.setData({
          uid: res.data.data.id,
          token: res.data.data.token,
          icon: res.data.data.icon,
          name: res.data.data.name,
          phone: res.data.data.phone,
          userType:res.data.data.type,
          userId: res.data.data.id,
        })     
        
        if (res.data.data.rootUid) {
          that.setData({
            rootUid: res.data.data.rootUid
          });
        }
        
  
      },fail:function(){
         ////用户信息丢失或者首页未授权直接进入，需要重新登录获取存入本地缓存
         wx.showToast({
          title: '缺少用户信息，请在首页授权后再试',
          icon: 'none',
          duration: 2000
        });


      }
    })
    
  
  },

  onShow: function () {
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          uid: res.data.data.id,
          token: res.data.data.token,
          icon: res.data.data.icon,
          name: res.data.data.name,
          phone: res.data.data.phone,
          userType: res.data.data.type,
          userId: res.data.data.id,
          rootUid: res.data.data.rootUid,
        })
        //要重新获取我的数据
        wx.request({
          url: config.loadUserInfoUrl,
          data: { token: res.data.data.token },
          method: 'GET',
          success: function (res) {
            if (res && res.data && res.data.success) {
              that.setData({
                uid: res.data.data.id,
                token: res.data.data.token,
                icon: res.data.data.icon,
                name: res.data.data.name,
                phone: res.data.data.phone,
                userType: res.data.data.type,
                userId: res.data.data.id,
              })


              if (res.data.data.rootUid) {
                that.setData({
                  rootUid: res.data.data.rootUid,
                });
              }


              util_js.setStrg("userInfo", res.data, function () {

              });
            }

          }
        });
      },fail:function(){
        wx.showToast({
          title: '缺少用户信息，请在首页授权后再试',
          icon: 'none',
          duration: 2000
        });
      }
    })

   
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '点我得红包，最高100元',
      path: '/page/main/index/index?uid=' + that.data.userId +"&rootUid="+that.data.rootUid,
      success: function (res) {
        wx.request({
          url: config.shareUrl,
          data: { token: that.data.token },
          success: function (res) {
          }
        })
      }
    }
  }
 
})