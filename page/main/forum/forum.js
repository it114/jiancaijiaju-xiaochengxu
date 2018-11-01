// pages/forum/forum.js
var config = require('../../../config.js');
var util_js = require('../../../util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    results:[
      {

      }
    ],
    winWidth: 0,
    winHeight: 0,
    showLoading: false,
    cursor: "",
    uid:"",
    hasNext : false,
    userId:"",
    rootUid:"",
    showAll:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  handleLoadMore: function () {
    console.log(this.data.hasNext)
    if (!this.data.hasNext){
      return;
    }
    var that = this;
    var data = {};
    that.setData({
      showLoading: true
    })
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        data = { token: res.data.data.token, cursor: that.data.cursor};
        wx.request({
          url: config.getForumPagerUrl,
          data: data,
          method: 'GET',
          success: function (res) {
            // console.log(res);
            
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            for (var i = 0; i < res.data.data.length; i++) {
              var imgArr = [];
              res.data.data[i].image = res.data.data[i].image.split(",");
              if (res.data.data[i].image.length > 2) {
                for (var j = 0; j < res.data.data[i].image.length - 1; j++) {
                  var obj = util_js.getImgByThisSize(res.data.data[i].image[j], that.data.winWidth * 0.390, that.data.winWidth * 0.390)
                  obj.width = that.data.winWidth * 0.390 + "px";
                  obj.height = that.data.winWidth * 0.390 + "px";
                  imgArr.push(obj)
                  res.data.data[i].imgArr = imgArr;
                }
              } else {
                if (res.data.data[i].image[0]) {
                  var obj = util_js.getImgByThisSize(res.data.data[i].image[0], that.data.winWidth * 0.80, that.data.winWidth * 0.4)
                  obj.width = that.data.winWidth * 0.80 + "px";
                  obj.height = that.data.winWidth * 0.40 + "px";
                  imgArr.push(obj);
                  res.data.data[i].imgArr = imgArr;
                }
              }
              res.data.data[i].ctime = util_js.formatTimeToDay(res.data.data[i].ctime)
            }
            console.log(res.data.nextCursor)
            that.setData({
              results: that.data.results.concat(res.data.data),
              cursor: res.data.nextCursor,
              hasNext: res.data.hasnext
            })
            if (res.data.hasnext){
              setTimeout(function () {
                that.setData({
                  showLoading: false
                })
              }, 2000)
            }else{
              setTimeout(function () {
                that.setData({
                  showLoading: false,
                  showAll: true
                })
              }, 2000)
            }
          }
        })
      },fail:function(){
        wx.showToast({
          title: '缺少用户信息，请在首页授权后再试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var data = {};
    var that = this;
    if(!that.data.uid){
      wx.getStorage({
        key: "userInfo",
        success: function (res) {
        data = { token: res.data.data.token };

        if (res.data.data.rootUid) {
          that.setData({
            rootUid: res.data.data.rootUid,
          });
        };
        that.setData({
            uid: res.data.data.id,
            userId: res.data.data.id,
            token: res.data.data.token,
            icon: res.data.data.icon,
            name: res.data.data.name,
            phone: res.data.data.phone
        });
        
        wx.request({
          url: config.getForumPagerUrl,
          data: data,
          method: 'GET',
          success: function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              var imgArr = [];
              res.data.data[i].image = res.data.data[i].image.split(",");
              if (res.data.data[i].image.length > 2){
                for (var j = 0; j < res.data.data[i].image.length-1; j++) {
                  var obj = util_js.getImgByThisSize(res.data.data[i].image[j], that.data.winWidth * 0.390, that.data.winWidth * 0.390)
                  obj.width = that.data.winWidth * 0.390 + "px";
                  obj.height = that.data.winWidth * 0.390 + "px";
                  imgArr.push(obj)
                  res.data.data[i].imgArr = imgArr;
                }
              }else{
                if (res.data.data[i].image[0]) {
                  var obj = util_js.getImgByThisSize(res.data.data[i].image[0], that.data.winWidth * 0.80, that.data.winWidth * 0.4)
                  obj.width = that.data.winWidth * 0.80 + "px";
                  obj.height = that.data.winWidth * 0.40 + "px";
                  imgArr.push(obj)
                  res.data.data[i].imgArr = imgArr;
                }
              }
              res.data.data[i].ctime = util_js.formatTimeToDay(res.data.data[i].ctime)
            }
            console.log(res.data.nextCursor)
            if (res.data.data.length){
              that.setData({
                results: res.data.data,
                cursor: res.data.nextCursor,
                hasNext: res.data.hasnext
              })
            } 
          }
        })
          

        },fail:function(){
          wx.showToast({
            title: '缺少用户信息，请在首页授权后再试',
            icon: 'none',
            duration: 2000
          });
        }
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    console.log('/page/main/index/index?uid=' + that.data.userId)
    return {
      title: '家居mall',
      path: '/page/main/index/index?uid=' + that.data.userId+"&rootUid="+that.data.rootUid,
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