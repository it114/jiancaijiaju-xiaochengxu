// pages/address/newAddress/newAddress.js
var config = require('../../../../../config.js');
var util_js = require('../../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */


  data: {
    isUpdate : false,
    region: ['省份、', '城市、', '区县'],
    customItem: '',
    name : "",
    phone : "",
    areaId : 0,
    info : "",
    address : "",
    areaName:"",
    id:"",
    token:"",
    isClick : false
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var areaName = "";
    for (var i = 0; i < e.detail.value.length;i++){
      areaName += e.detail.value[i]
    }
    this.setData({
      areaName: areaName,
      region: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = decodeURIComponent(options.id);
    if (id&&id!=0){
      console.log(444545455644)
      var region = decodeURIComponent(options.areaName);
      if (region.indexOf("省") != -1) {
        var region_01 = region.split("省");
        var region_02 = region_01[1].split("市");
        region = [];
        region.push(region_01[0] + "省");
        region.push(region_02[0]);
        region.push(region_02[1]);
      } else {
        var region = region.split("市");
      }
      this.setData({
        isUpdate: true,
        id: id,
        phone: decodeURIComponent(options.phone),
        name: decodeURIComponent(options.name),
        info: decodeURIComponent(options.info),
        areaName: decodeURIComponent(options.areaName),
        region: region
      })
    }
  },
  watchUserName: function (event) {
    const that = this;
    that.setData({
      name: event.detail.value
    })
  },
  watchUserPhone: function (event) {
    const that = this;
    that.setData({
      phone: event.detail.value
    })
  },
  watchUserDetailAddress: function (event) {
    const that = this;
    that.setData({
      info: event.detail.value
    })
  },
  addAddress:function(){
    var that = this;
    if (that.data.isClick){
      return;
    }
    that.setData({
      isClick:true
    })
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          token:res.data.data.token
        })
        if (that.data.phone.length != 11) {
          util_js.lessFive("手机号不正确");
          that.setData({
            isClick: false
          })
          return;
        }
        if (!that.data.phone || !that.data.name || !that.data.areaName || !that.data.info) {
          util_js.lessFive("请补全信息！");
          that.setData({
            isClick: false
          })
          return;
        }
        console.log(that.data);
        var urls = config.addAddressUrl; 
        if (that.data.isUpdate){
          urls = config.updateAddressUrl;
        }
        wx.request({
          url: urls,
          data: that.data,
          method: 'GET',
          success: function (res) {
            that.setData({
              isClick: false
            })
            console.log(res)
            wx.showToast({
              title: '添加成功！',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.hideLoading();
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
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