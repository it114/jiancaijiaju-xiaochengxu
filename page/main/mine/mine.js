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

  /**
   * 生命周期函数--监听页面加载
   */
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
            rootUid: res.data.data.rootUid,
          });
        }


      
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
    console.log("出发")
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
          rootUid: res.data.rootUid,
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


              console.log(res)

              util_js.setStrg("userInfo", res.data, function () {

              });
            }

          }
        });
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
    console.log('/page/main/index/index?uid=' + that.data.userId + ",rootUid=" + that.data.rootUid)
    return {
      title: '家居mall',
      path: '/page/main/index/index?uid=' + that.data.userId +"&rootUid="+that.data.rootUid,
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