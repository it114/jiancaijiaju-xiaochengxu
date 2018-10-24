var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({
  data: {
  
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    showLoading: false,
    token: "",
    allResults: "",
    address_list:[
     
    ],
    
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    })
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        console.log(res)
        that.setData({
          token: res.data.data.token
        })
        wx.request({
          url: config.getAllAddressUrl,
          data: { token: res.data.data.token },
          method: 'GET',
          success: function (res) {
            console.log(res)
            if (res.data.data.length){
              // console.log(res.data.data);
              var allResults = {};
              for (var i = 0; i < res.data.data.length;i++){
                allResults[res.data.data[i].id] = res.data.data[i]
              }
              that.setData({
                address_list: res.data.data,
                allResults: allResults
              })
            }
          }
        })
      }
    })
  },
  chooseAddress:function(e){
    var that = this;
    util_js.setStrg("chooseEdAddress", that.data.allResults[e.currentTarget.id],function(){
      
    });
    setTimeout(function () {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      })
    }, 500)
  },
  handleLoadMore: function () {
    var that = this;
    this.setData({
      showLoading: true
    })

    //模拟加载
    setTimeout(function () {
      that.setData({
        showLoading: false
      })
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      // wx.stopPullDownRefresh() //停止下拉刷新
    }, 3500);
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  editAddress:function(e){
    var data = this.data.address_list;
   
    for(var i = 0;i < data.length;i++){
      console.log(data[i])
      if (data[i].id == e.currentTarget.dataset.id){
        var text = "?";
        for (var key in data[i]) {
          text = text + key + "=" + data[i][key] + "&"
        }
        console.log('newAddress' + text)
        wx.navigateTo({
          url: 'newAddress/newAddress'+text
        })
      }
    }  
  },
  // 打开新增地址页面
  toNewAddressPage: function () {
    wx.navigateTo({
      url: 'newAddress/newAddress?id=0',
    })
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        // console.log(res)
        wx.request({
          url: config.getAllAddressUrl,
          data: { token: res.data.data.token },
          method: 'GET',
          success: function (res) {
            // console.log(res)
            if (res.data.data.length) {
              var allResults = {};
              // console.log(res.data.data);
              for (var i = 0; i < res.data.data.length; i++) {
                allResults[res.data.data[i].id] = res.data.data[i]
              }
              that.setData({
                address_list: res.data.data,
                allResults: allResults
              })
            }
          }
        })
      }
    })
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onShareAppMessage: function () {
    util_js.shareApp();
  }
})  