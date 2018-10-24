// pages/index/activityDetail/activityDetail.js
var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    phone : "",
    userPhone : "",
    code : "",
    top_bg:'../../images/detail_bg.png',
    p_name:'现代简约风格三居室客厅墙面装饰复古现代简约风格三居室客厅墙面装饰复古现代简约风格三居室客厅墙面装饰复古现代简约风格三居室客厅墙面装饰复古现代简约风格三居室客厅墙面装饰复古现代简约风格三居室客厅墙面装饰复古',
    a_count:'200',
    a_time:'2018.05.19',
    a_place:'北京',
    ai_text:'居然之家是以家居为主业，以家庭大消费为平台，业务范围涵盖室内设计和装修、家具建材销售、商业会展、跨境电商、儿童娱乐、体育健身、数码智能、居家养老、城市综合体开发等领域的大型商业连锁集团公司，截至2017年底，已在全国开设223家门店，市场销售额将超608亿元。',
    ai_img:[
      
    ],

    displayStatus:'none',
    isSend : true,//验证码是否正在发送中  倒计时还没结束
    currentTime: "获取验证码",
    isTakeIn: false//是不是已经参加过

  },
  showDialog:function(){
      this.setData({
        displayStatus:'block'
      })
  },
  hideDialog:function(){
      this.setData({
        displayStatus:'none'
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var aid = decodeURIComponent(options.id); //普通二维码链接
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    var data = {};
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          userPhone: res.data.data.phone
        })
        data = { token: res.data.data.token, aid:aid};
        wx.request({
          url: config.getActivityInfoUrl,
          data: data,
          method: 'GET',
          success: function (res) {
            console.log(res);
            if (res.data.data.attend){
              that.setData({
                isTakeIn: true
              })
            }
            that.setData({
              aid: aid,
              icon: util_js.getImgByThisSize(res.data.data.icon, that.data.winWidth, 136).url,
              style: util_js.getImgByThisSize(res.data.data.icon, that.data.winWidth, 136).style,
              title: res.data.data.title,
              info: res.data.data.info,
              num: res.data.data.num,
              areaName: res.data.data.areaName,
              addressInfo: res.data.data.addressInfo,
              endDate: util_js.formatTimeToDay(res.data.data.endDate),
              image: res.data.data.imageJson
            })
          }
        })
        if (!res.data.data.phone) {
          that.setData({
            displayStatus: "block"
          })
        }
      }
    });
  }, 
  bangPhone : function(){
    var that = this;
    if (that.data.phone.length != 11) {
      util_js.lessFive("手机号不正确！");
      return;
    }
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        var data = { token: res.data.data.token, phone: that.data.phone,code:that.data.code };
        wx.request({
          url: config.bangPhoneUrl,
          data: data,
          method: 'GET',
          success: function (res) {
            console.log(res);
            if(res.data.success){
              that.setData({
                displayStatus: "none",
                userPhone: that.data.phone
              })
              wx.showToast({
                title: '绑定成功！',
                icon: 'success',
                duration: 2000
              })
              util_js.setStrg("userInfo", res.data, function () {

              });
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    });
  },
  joinActivity: function () {
    var that = this;
    console.log(that.data.userPhone)
    if (!that.data.userPhone){
      that.setData({
        displayStatus: "block"
      })
      return;
    }
    if (that.data.isTakeIn){
      wx.showToast({
        title: "已经参加过了",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        var data = {token: res.data.data.token, aid: that.data.aid};
        wx.request({
          url: config.attendActivityUrl,
          data: data,
          method: 'GET',
          success: function (res) {
            // console.log(res.data.success)
            if (!res.data.success){
              wx.showToast({
                title: "参加失败！",
                icon: 'success',
                duration: 2000
              })
            }else{
              var this_num = that.data.num + 1;
              that.setData({
                isTakeIn : true,
                num: this_num
              })
              wx.showToast({
                title: "报名成功！",
                icon: 'success',
                duration: 2000
              })
            }
          }
        })
      }
    });
  },
  watchPassPhone:function (event) {
    const that = this;
    that.setData({
      phone : event.detail.value
    })
  },
  watchPassCode: function (event) {
    const that = this;
    that.setData({
      code: event.detail.value
    })
  },
  getCode: function (e) {
    const that = this;
    if (!that.data.isSend){
      return;
    }
    that.setData({
      isSend: false
    })
    var currentTime = 60;
    var interval = setInterval(function () {
      currentTime--;
      that.setData({
        currentTime: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          currentTime: "获取验证码",
          isSend: true
        })
      }
    }, 1000) 
    if (!that.data.phone){
      util_js.lessFive("请输入手机号");
      setTimeout(function(){
        wx.hideLoading();
      },500)
      return;
    }
    // console.log(that.data.isSend)
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        console.log({ token: res.data.data.token, phone: that.data.phone, code: that.data.code })
        var data = { token: res.data.data.token, phone: that.data.phone, code: that.data.code };
        wx.request({
          url: config.createRegisterAuthCodeUrl,
          data: data,
          method: 'GET',
          success: function (res) {
            console.log(res)
          },
          fail:function(){
            
          }
        })
      }
    });
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