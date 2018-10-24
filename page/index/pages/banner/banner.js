// page/index/pages/banner/banner.js
var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerlist:[],
    token:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getnums(e){
    let that=this;
    let eventType=e.currentTarget.dataset.type;
    let typeid='';
    if(eventType=='秒杀'){
      typeid=1;

    }else if(eventType=='预约'){
      typeid=3;
    }else{
      typeid=2
    }
    //统计次数
    wx.request({
      url: config.getNumsUrl + '?token=' +encodeURIComponent(that.data.token)+'&eventType='+typeid,
      // data:{
      //   username:username
      // },
      method: 'post',
      success: function (res) {
    console.log(res);

      }

    })



  },
  onLoad: function (options) {
    console.log(options)
    var that = this;

      //获取token
      wx.getStorage({
        key: "userInfo",
        success: function (res) {
          that.setData({
            // uid: res.data.data.id,
            // phone: res.data.data.phone,
            token:res.data.data.token
          });
          let id=options.banId;
          wx.request({
            url: config.getsecondbannerUrl + '?token=' + encodeURIComponent(that.data.token)+'&bannerParentId='+id,
            // data:{
            //   username:username
            // },
            method: 'post',
            success: function (res) {
              console.log(res);
              if(res.data.success){
                //跳转到红包雨界面
                    that.setData({
                      bannerlist:res.data.data
                })
      
              }
      
            }
      
          })
      }
    })

    // that.setData({
    //   text: options.text,
    //   image: options.image,
    //   url: options.url
    // })
      console.log(this.data)
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
  
  }
})