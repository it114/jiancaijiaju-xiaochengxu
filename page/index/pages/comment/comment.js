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
    results:"",
    isOk:false
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  onLoad: function (options) {
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
          url: config.getCommentPagerUrl,
          data: { token: res.data.data.token,gid: options.gid},
          method: 'GET',
          success: function (res) {
            console.log(res)
            if (res.data.data.length) {
              var imgArr = [];
              console.log(res.data.data);
              for (var i = 0; i < res.data.data.length; i++) {
                res.data.data[i].ctime = util_js.formatTimeToDay(res.data.data[i].ctime);
                // res.data.data[i].image = res.data.data[i].image.slice(0, res.data.data[i].image.length-1);
                res.data.data[i].image = res.data.data[i].image.split(",")
                for (var j = 0; j < res.data.data[i].image.length; j++) {
                
                  if (res.data.data[i].image[j]){
                    var obj = util_js.getImgByThisSize(res.data.data[i].image[j], that.data.winWidth * 0.40, that.data.winWidth * 0.40);
                    console.log(obj)
                    obj.width = that.data.winWidth * 0.40 + "px";
                    obj.height = that.data.winWidth * 0.40 + "px";
                    imgArr.push(obj)
                  }
                 
                }
                res.data.data[i].imgArr = imgArr;
              }
              console.log(res)
              that.setData({
                isOk:true,
                results: res.data.data
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