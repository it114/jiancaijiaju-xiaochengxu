// pages/index/activityDetail/activityDetail.js
var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth:"",
    winHeight:"",
    phone : "",
    code : "",
    top_bg:'../../images/detail_bg.png',
    p_name:'现代简约风格三居室客厅墙面装饰复古现代简约风格三居室客厅墙面装饰复古现代简约风格三居室客厅墙面装饰复古现代简约风格三居室客厅墙面装饰复古现代简约风格三居室客厅墙面装饰复古现代简约风格三居室客厅墙面装饰复古',
    a_count:'200',
    a_time:'2018.05.19',
    a_place:'北京',
    ai_text:'居然之家是以家居为主业，以家庭大消费为平台，业务范围涵盖室内设计和装修、家具建材销售、商业会展、跨境电商、儿童娱乐、体育健身、数码智能、居家养老、城市综合体开发等领域的大型商业连锁集团公司，截至2017年底，已在全国开设223家门店，市场销售额将超608亿元。',
    ai_img:[
      
    ]

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
        data = { token: res.data.data.token, aid:aid};
        wx.request({
          url: config.getActivityInfoUrl,
          data: data,
          method: 'GET',
          success: function (res) {
            console.log(res);
            var obj = util_js.getImgByThisSize(res.data.data.icon, that.data.winWidth, that.data.winWidth * 0.5);
            var imgs = res.data.data.image.split(",");
            var imgArr = [];
            if (res.data.data.imageJson) {

              for (var i = 0; i < res.data.data.imageJson.length; i++) {
                if (res.data.data.imageJson[i]) {
                  var obj = util_js.getImgByThisSize(res.data.data.imageJson[i], that.data.winWidth, 0)
                  imgArr.push(obj)
                }
              }
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
              images: imgArr
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