var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    token: "",
    // tab切换  
    currentTab: 0,
    showLoading: false,

    //正在疯抢商品数据
    crazyNowList:[],
  
  //即将开抢商品数据
    willCrazyList: [],


  //更多预告数据
    moreList:[]
  },
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
    var that = this;
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        // console.log(res)
        that.setData({
          token: res.data.data.token
        })


        //统计次数
        wx.request({
          url: config.getNumsUrl + '?token=' + encodeURIComponent(that.data.token) + '&eventType=1',
          method: 'post',
          success: function (res) {
            console.log(res);
          }
        })
        
        wx.request({
          url: config.getSpikeListUrl,
          data: { token: res.data.data.token },
          method: 'GET',
          success: function (res) {
            if (res.data && res.data.data&&res.data.data.clientGoodList) {
              for (var i = 0; i < res.data.data.clientGoodList.length; i++) {
                res.data.data.clientGoodList[i].image = res.data.data.clientGoodList[i].image.split(",")[0]
                var imgArr = [];
                var obj = util_js.getImgByThisSize(res.data.data.clientGoodList[i].image, 100, 100);
                res.data.data.clientGoodList[i].style = obj.style;
                res.data.data.clientGoodList[i].image = obj.url;
                res.data.data.clientGoodList[i].info = util_js.tryDecodeURIComponent(res.data.data.clientGoodList[i].info);
                res.data.data.clientGoodList[i].info = res.data.data.clientGoodList[i].info.replace(/p>/g, '');
                res.data.data.clientGoodList[i].info = res.data.data.clientGoodList[i].info.replace(/\//g, '');
                res.data.data.clientGoodList[i].info = res.data.data.clientGoodList[i].info.replace(/</g, ''); 
                
                var percentage = (Number.parseInt(res.data.data.clientGoodList[i].buyNum) / Number.parseInt(res.data.data.clientGoodList[i].totalNum) * 100).toFixed(1);
                console.log(percentage);
                res.data.data.clientGoodList[i].percentage = percentage; 

              }
              if (res.data && res.data.data.day){
                var day = res.data.data.day.toString().slice(6, 8);
               
                that.setData({
                  day_crazyNowList: res.data.data.day,
                  time_crazyNowList: res.data.data.time,
                  endTime_crazyNowList: res.data.data.endTime,
                  crazyNowList: res.data.data.clientGoodList,
            
                })
                var now = new Date();
                now.setHours(res.data.data.endTime);
                now.setMinutes(0);
                now.setSeconds(0);
                console.log(now)
                var this_time = (now.getTime() - new Date().getTime()) / 1000;
                that.timeDown(this_time);
              }
            }
          }
        })
      },fail:function(){
         //用户信息丢失，重新登录获取token存入本地缓存
         that.toLogin();
      }
    })
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
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == 1){
        // console.log(that.data.willCrazyList)
        if (!that.data.willCrazyList.length) {
          wx.request({
            url: config.getNextSplikeListUrl,
            data: { token: that.data.token},
            method: 'GET',
            success: function (res) {
              // console.log(res)
              if (res.data && res.data.data && res.data.data.clientGoodList) {
                for (var i = 0; i < res.data.data.clientGoodList.length; i++) {
                  res.data.data.clientGoodList[i].image = res.data.data.clientGoodList[i].image.split(",")[0]
                  var imgArr = [];
                  var obj = util_js.getImgByThisSize(res.data.data.clientGoodList[i].image, 100, 100);
                  res.data.data.clientGoodList[i].style = obj.style;
                  res.data.data.clientGoodList[i].image = obj.url;
                  res.data.data.clientGoodList[i].info = util_js.tryDecodeURIComponent(res.data.data.clientGoodList[i].info);
                  res.data.data.clientGoodList[i].info = res.data.data.clientGoodList[i].info.replace(/p>/g, '');
                  res.data.data.clientGoodList[i].info = res.data.data.clientGoodList[i].info.replace(/\//g, '');
                  res.data.data.clientGoodList[i].info = res.data.data.clientGoodList[i].info.replace(/</g, '');
                }
                var day = res.data.data.day.toString().slice(6, 8);
                console.log(day)
                var thisDay = new Date().getDate();
                console.log(thisDay)
                if (day == thisDay){
                  thisDay = "今天"
                }else{
                  thisDay = "明天"
                }
                that.setData({
                  day_willCrazyList: res.data.data.day,
                  thisDay:thisDay,
                  time_willCrazyList: res.data.data.time,
                  endTime_willCrazyList: res.data.data.endTime,
                  willCrazyList: res.data.data.clientGoodList
                })
                var now = new Date();
                now.setDate(day);
                now.setHours(res.data.data.time);
                now.setMinutes(0);
                now.setSeconds(0);
                // console.log(now)
                var this_time = (now.getTime() - new Date().getTime()) / 1000;
                that.timeDown_second(this_time);
              }
            }
          })
        }
      } else if (e.target.dataset.current == 2){
        if (!that.data.moreList.length){  
          wx.request({
            url: config.getMoreSplikeListUrl,
            data: { token: that.data.token },
            method: 'GET',
            success: function (res) {
              if (res.data && res.data.data && res.data.data.clientGoodList) {
                for (var i = 0; i < res.data.data.clientGoodList.length; i++) {
                  res.data.data.clientGoodList[i].image = res.data.data.clientGoodList[i].image.split(",")[0]
                  var imgArr = [];
                  var obj = util_js.getImgByThisSize(res.data.data.clientGoodList[i].image, 100, 100);
                  res.data.data.clientGoodList[i].style = obj.style;
                  res.data.data.clientGoodList[i].image = obj.url;
                  res.data.data.clientGoodList[i].info = util_js.tryDecodeURIComponent(res.data.data.clientGoodList[i].info);
                  res.data.data.clientGoodList[i].info = res.data.data.clientGoodList[i].info.replace(/p>/g, '');
                  res.data.data.clientGoodList[i].info = res.data.data.clientGoodList[i].info.replace(/\//g, '');
                  res.data.data.clientGoodList[i].info = res.data.data.clientGoodList[i].info.replace(/</g, '');
                }
                var day = res.data.data.day.toString().slice(6, 8);
                console.log(day)
                var thisDay_last = new Date().getDate();
                console.log(res.data.data.clientGoodList)
                console.log(res.data.data.clientGoodList)
                console.log(res.data.data.clientGoodList)
                if (day == thisDay_last) {
                  thisDay_last = "今天"
                } else {
                  thisDay_last = "明天"
                } 
                that.setData({
                  day_moreList: res.data.data.day,
                  thisDay_last: thisDay_last,
                  time_moreList: res.data.data.time,
                  endTime_moreList: res.data.data.endTime,
                  moreList: res.data.data.clientGoodList
                })
                var now = new Date();
                now.setDate(day);
                now.setHours(res.data.data.time);
                now.setMinutes(0);
                now.setSeconds(0);
                // console.log(now)
                var this_time = (now.getTime() - new Date().getTime()) / 1000;
                that.timeDown_third(this_time);
              }
            }
          })
        }
      }
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  timeDown: function (starttime,types) {
    var that = this;
    if (starttime < 1) {
      starttime = 0
    }
    var tim = setInterval(function () {
      var oDay = Math.floor(starttime / (60 * 60 * 24));
      var _oDay = starttime % (60 * 60 * 24);
      var oHour = Math.floor(_oDay / (60 * 60));
      var _oHour = _oDay % (60 * 60);
      var oMinutes = Math.floor(_oHour / (60));
      var _oMinutes = _oHour % (60);
      var oSecond = Math.floor(_oMinutes);
      starttime--;
      if (starttime > 0) {
        if (oHour <= 0) {
          oHour = "00"
        } else if (oHour < 10) {
          oHour = "0" + oHour.toString();
        }
        if (oMinutes <= 0) {
          oMinutes = "00"
        } else if (oMinutes < 10) {
          oMinutes = "0" + oMinutes.toString();
        }
        if (oSecond <= 0) {
          oSecond = "00"
        } else if (oSecond < 10) {
          oSecond = "0" + oSecond;
        }
      } else {
        clearInterval(tim);
        that.setData({
          oDay_crazyNowList: "00",
          oHour_crazyNowList: "00",
          oMinutes_crazyNowList: "00",
          oSecond_crazyNowList: "00"
        })
      }
      that.setData({
        oDay_crazyNowList: oDay,
        oHour_crazyNowList: oHour,
        oMinutes_crazyNowList: oMinutes,
        oSecond_crazyNowList: oSecond
      })
    }, 1000)
  },
  timeDown_second: function (starttime) {
    var that = this;
    if (starttime < 1) {
      starttime = 0
    }
    var tim_socond = setInterval(function () {
      var oDay = Math.floor(starttime / (60 * 60 * 24));
      var _oDay = starttime % (60 * 60 * 24);
      var oHour = Math.floor(_oDay / (60 * 60));
      var _oHour = _oDay % (60 * 60);
      var oMinutes = Math.floor(_oHour / (60));
      var _oMinutes = _oHour % (60);
      var oSecond = Math.floor(_oMinutes);
      starttime--;
      if (starttime > 0) {
        if (oHour <= 0) {
          oHour = "00"
        } else if (oHour < 10) {
          oHour = "0" + oHour.toString();
        }
        if (oMinutes <= 0) {
          oMinutes = "00"
        } else if (oMinutes < 10) {
          oMinutes = "0" + oMinutes.toString();
        }
        if (oSecond <= 0) {
          oSecond = "00"
        } else if (oSecond < 10) {
          oSecond = "0" + oSecond;
        }
      } else {
        clearInterval(tim_socond);
        that.setData({
          oDay_willCrazyList: "00",
          oHour_willCrazyList: "00",
          oMinutes_willCrazyList: "00",
          oSecond_willCrazyList: "00"
        })
      }
      that.setData({
        oDay_willCrazyList: oDay,
        oHour_willCrazyList: oHour,
        oMinutes_willCrazyList: oMinutes,
        oSecond_willCrazyList: oSecond
      })
    }, 1000)
  },
  timeDown_third: function (starttime) {
    var that = this;
    if (starttime < 1) {
      starttime = 0
    }
    var tim_third = setInterval(function () {
      var oDay = Math.floor(starttime / (60 * 60 * 24));
      var _oDay = starttime % (60 * 60 * 24);
      var oHour = Math.floor(_oDay / (60 * 60));
      var _oHour = _oDay % (60 * 60);
      var oMinutes = Math.floor(_oHour / (60));
      var _oMinutes = _oHour % (60);
      var oSecond = Math.floor(_oMinutes);
      starttime--;
      if (starttime > 0) {
        if (oHour <= 0) {
          oHour = "00"
        } else if (oHour < 10) {
          oHour = "0" + oHour.toString();
        }
        if (oMinutes <= 0) {
          oMinutes = "00"
        } else if (oMinutes < 10) {
          oMinutes = "0" + oMinutes.toString();
        }
        if (oSecond <= 0) {
          oSecond = "00"
        } else if (oSecond < 10) {
          oSecond = "0" + oSecond;
        }
      } else {
        clearInterval(tim_third);
        that.setData({
          oDay_moreList: "00",
          oHour: "00",
          oMinutes_moreList: "00",
          oSecond_moreList: "00"
        })
      }
      that.setData({
        oDay_moreList: oDay,
        oHour_moreList: oHour,
        oMinutes_moreList: oMinutes,
        oSecond_moreList: oSecond
      })
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady : function () {
  
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