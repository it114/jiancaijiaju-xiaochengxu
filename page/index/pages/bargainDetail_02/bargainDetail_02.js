var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth : "",
    winHeight : "",
    isfriendBargain:false,
    isBargainPrice: 0,
    userId: "",
    rootUid:"",
    totalPrice:"",
    showModel: false,
    results: {},
    uid:"",
    icon :"",
    name:"",
    isNow:false,
    isNowPrice : "",
    isclick : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  agreeGetUser: function (e) {
    //设置用户信息本地存储
    var that = this
    that.setData({
      showModel: false
    })
    var userInfo = e.detail.userInfo;
    var data = {};
    data.name = userInfo.nickName;
    data.icon = userInfo.avatarUrl;

    wx.getUserInfo({
      success: function (res) {
        var userInfo = JSON.parse(res.rawData);
        data.name = userInfo.nickName;
        data.icon = userInfo.avatarUrl;
        data.token = that.data.token;
        wx.request({
          url: config.updateUserInfourl,
          data: data,
          method: 'GET',
          success: function (ret) {
            util_js.setStrg("userInfo", ret.data, function () {

            });
          }
        })
      }
    })
  },
  onLoad: function (options) {
    var friendUid;
    var that = this;
    if(options.uid){
     friendUid = options.uid;
      that.setData({
        uid: options.uid
      })
    }

    if (options.rootUid) {
      that.setData({
        rootUid: options.rootUid
      })
    }

    if (options.bid) {
      that.setData({
        bid: options.bid
      })
    }
    
    /** 
     * 获取系统信息 
     */
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
        console.log(res);
        that.setData({
          token: res.data.data.token,
          userId: res.data.data.id,
          rootUid: res.data.data.rootUid,
          icon:res.data.data.icon,
          name: res.data.data.name
        })
        // console.log({ token: res.data.data.token, bid: options.bid, friendUid: res.data.data.id })
        var data_ajax = { token: res.data.data.token, bid: options.bid, friendUid: res.data.data.id };
        if (friendUid){
          data_ajax.friendUid = friendUid;
        }
        console.log(data_ajax)
        wx.request({
          url: config.getBargainInfoUrl,
          data: data_ajax,
          method: 'GET',
          success: function (res) {
            res.data.data.image = res.data.data.image.split(",")[0];
            var imgArr = [];
            var obj = util_js.getImgByThisSize(res.data.data.image, that.data.winWidth, 200);
            res.data.data.style = obj.style;
            res.data.data.image = obj.url;
            var isfriendBargain = false;
            if (res.data.data.participate){
              isfriendBargain = true;
            }
            if (res.data.data.participate || (res.data.data.uid != that.data.userId)){
              that.setData({
                isfriendBargain: isfriendBargain,
                results: res.data.data,
                bid: options.bid,
                isBargainPrice: res.data.data.bargainPrice,
                totalPrice: res.data.data.price,
                bargainPrice_mine: that.toFixed(res.data.data.originalPrice - res.data.data.aimsPrice - res.data.data.price, 2)
              })
              
            }else{
              wx.request({
                url: config.friendBargainUrl,
                data: { token: that.data.token, bid: that.data.bid },
                method: 'GET',
                success: function (results) {
                  if (results.data.data && results.data.data.msg && !results.data.success) {
                    wx.showToast({
                      title: results.data.data.msg,
                      icon: 'fail',
                      duration: 2000
                    });
                    return;
                  }
                  
                  that.setData({
                    isfriendBargain: true,
                    bid: options.bid,
                    isNowPrice: that.toFixed(results.data.data.money, 2),
                    isNow: true,
                    results: res.data.data,
                    isBargainPrice: that.toFixed(results.data.data.money, 2),
                    // totalPrice: that.toFixed(that.data.totalPrice + res.data.data.money, 2),
                    totalPrice: res.data.data.price + results.data.data.money,//砍掉的钱
                    bargainPrice_mine: that.toFixed(res.data.data.originalPrice - res.data.data.aimsPrice - res.data.data.price - results.data.data.money, 2)
                    // bargainPrice_mine: that.toFixed(that.data.results.originalPrice - that.data.results.aimsPrice - that.data.results.price , 2)
                  })
                  wx.showToast({
                    title: '砍价成功！',
                    icon: 'success',
                    duration: 2000
                  })
                }
              })
            }
            var this_time = (res.data.data.ctime + 24 * 60 * 60 * 1000 - new Date().getTime()) / 1000;
            that.timeDown(this_time);
          }
        })
      },
      fail:function(){
        wx.login({
          success: function (res) {
            // console.log(res)
            var obj = { code: res.code };
            if (that.data.uid) {
              obj.uid = that.data.uid;
            }

            if (that.data.rootUid) {
              obj.rootUid = that.data.rootUid;
              console.log('first open login suc rootUid ' + that.data.rootUid);
            }
            
            // setTimeout(function () {
            wx.request({
              url: config.registerUserByWeixinUrl,
              data: obj,
              success: function (res) {
                that.setData({
                  token: res.data.data.token,
                  userId: res.data.data.id,
                })

                if (res.data.data.rootUid) {
                  that.setData({
                    rootUid: res.data.data.rootUid,
                  });
                }


                wx.getSetting({
                  success(res) {
                    console.log(res)
                    if (!res.authSetting['scope.userInfo']) {
                      wx.authorize({
                        scope: 'scope.userInfo',
                      })
                      that.setData({
                        showModel: true
                      })
                    } else {
                      wx.getUserInfo({
                        success: function (res) {
                          var userInfo = JSON.parse(res.rawData);
                          data.name = userInfo.nickName;
                          data.icon = userInfo.avatarUrl;
                          data.token = that.data.token;
                          fundebug.userInfo = userInfo;

                          wx.request({
                            url: config.updateUserInfourl,
                            data: data,
                            method: 'GET',
                            success: function (ret) {
                              console.log(ret);
                             
                              that.setData({
                                userId: ret.data.data.id
                              })
                              that.setData({
                                token: res.data.data.token,
                                userId: res.data.data.id,
                                rootUid: res.data.data.rootUid,
                              })
                              var data_ajax = { token: res.data.data.token, bid: options.bid, friendUid: res.data.data.id };
                              if (friendUid) {
                                data_ajax.friendUid = friendUid;
                              }
                              console.log(data_ajax)
                              wx.request({
                                url: config.getBargainInfoUrl,
                                data: data_ajax,
                                method: 'GET',
                                success: function (res) {
                                  console.log(res)
                                  res.data.data.image = res.data.data.image.split(",")[0];
                                  var imgArr = [];
                                  var obj = util_js.getImgByThisSize(res.data.data.image, that.data.winWidth, 200);
                                  res.data.data.style = obj.style;
                                  res.data.data.image = obj.url;
                                  // }
                                  var isfriendBargain = false;
                                  if (res.data.data.participate || (res.data.data.uid != that.data.userId)) {
                                    isfriendBargain = true;
                                    that.setData({
                                      isfriendBargain: isfriendBargain,
                                      results: res.data.data,
                                      bid: options.bid,
                                      totalPrice: res.data.data.price,
                                      isBargainPrice: res.data.data.res.data.data.bargainPrice,
                                      bargainPrice_mine: that.toFixed(res.data.data.originalPrice - res.data.data.aimsPrice - res.data.data.price, 2)
                                    })
                                  }else{
                                    console.log(res.data.data.uid)
                                    console.log(that.data.userId)
                                    if (res.data.data.uid != that.data.userId) {
                                      return;
                                    }
                                    wx.request({
                                      url: config.friendBargainUrl,
                                      data: { token: that.data.token, bid: that.data.bid },
                                      method: 'GET',
                                      success: function (results) {
                                        if (results.data.data && results.data.data.msg && !results.data.success) {
                                          wx.showToast({
                                            title: results.data.data.msg,
                                            icon: 'fail',
                                            duration: 2000
                                          });
                                          return;
                                        }

                                        that.setData({
                                          isfriendBargain: true,
                                          bid: options.bid,
                                          isNowPrice: that.toFixed(results.data.data.money, 2),
                                          isNow: true,
                                          results: res.data.data,
                                          isBargainPrice: that.toFixed(results.data.data.money, 2),
                                          // totalPrice: that.toFixed(that.data.totalPrice + res.data.data.money, 2),
                                          totalPrice: res.data.data.price + results.data.data.money,//砍掉的钱
                                          bargainPrice_mine: that.toFixed(res.data.data.originalPrice - res.data.data.aimsPrice - res.data.data.price - results.data.data.money, 2)
                                          // bargainPrice_mine: that.toFixed(that.data.results.originalPrice - that.data.results.aimsPrice - that.data.results.price , 2)
                                        })
                                        wx.showToast({
                                          title: '砍价成功！',
                                          icon: 'success',
                                          duration: 2000
                                        })
                                      }
                                    })
                                  }
                                  
                                  var this_time = (res.data.data.ctime + 24 * 60 * 60 * 1000 - new Date().getTime()) / 1000;
                                  that.timeDown(this_time);
                                  // }
                                }
                              })
                              util_js.setStrg("userInfo", ret.data, function () {

                              });
                            }
                          })
                        }
                      })
                    }
                  }
                })
                util_js.setStrg("userInfo", res.data, function () {

                });
              },
              fail: function (res) {
                // console.log(res)
              }
            })
            // }, 500)
          }
        });
      }
    })
  },
  friendBargain:function(){
    var that = this;
    if (that.data.isfriendBargain&&!that.data.uid){
      return;
    }
    if (that.data.isclick) {
      return;
    }
    that.setData({
      isclick:true
    })
    wx.request({
      url: config.friendBargainUrl,
      data: { token: that.data.token,bid:that.data.bid},
      method: 'GET',
      success: function (res) {
        if (res.data.data && res.data.data.msg && !res.data.success){
          wx.showToast({
            title: res.data.data.msg,
            icon: 'fail',
            duration: 2000
          });
          return;
        }
        that.setData({
          isfriendBargain: true,
          isNowPrice: that.toFixed(res.data.data.money, 2),
          isNow:true,
          isBargainPrice: that.toFixed(res.data.data.money,2),
          totalPrice: that.toFixed(that.data.totalPrice + res.data.data.money,2),
          bargainPrice_mine: that.toFixed(that.data.results.originalPrice - that.data.results.aimsPrice - that.data.results.price - res.data.data.money,2)
        })
        wx.showToast({
          title: '砍价成功！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  bugGood:function(){
    var that = this;
    var price = that.toFixed(that.data.results.originalPrice - that.data.totalPrice,2);
    wx.navigateTo({
      url: 'orderConfirm/orderConfirm?' + 'bid=' + that.data.bid + '&gid=' + that.data.token + '&image=' + that.data.results.image + '&style=' + that.data.results.style + '&price=' + price + '&goodName=' + that.data.results.goodName,
    })
  },
  toFixed:function(num, s) {
    var times = Math.pow(10, s)
    var des = num * times + 0.5
    des = parseInt(des, 10) / times
    return des + ''
  },
  timeDown: function (starttime, types) {
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
        oDay: oDay,
        oHour: oHour,
        oMinutes: oMinutes,
        oSecond: oSecond
      })
    }, 1000)
  },
  // buyBargain:function(){
  //   wx.request({
  //     url: config.buyBargainUrl,
  //     data: { token: that.data.token, friendUid: that.data.uid, bid: that.data.bid },
  //     method: 'GET',
  //     success: function (res) {
  //       console.log(res.data.money)
  //       that.setData({
  //         isfriendBargain: true,
  //         isBargainPrice: res.data.data.money,
  //         bargainPrice_mine: that.toFixed(that.data.results.originalPrice - that.data.results.aimsPrice - that.data.results.price - res.data.data.money, 2)
  //       })
  //       wx.showToast({
  //         title: '砍价成功！',
  //         icon: 'success',
  //         duration: 2000
  //       })
  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if(!that.data.token){
      return;
    }
    wx.request({
      url: config.getBargainInfoUrl,
      data: { bid: that.data.bid, token: that.data.token, friendUid: that.data.userId},
      method: 'GET',
      success: function (res) {
        console.log(res)
        res.data.data.image = res.data.data.image.split(",")[0];
        var imgArr = [];
        var obj = util_js.getImgByThisSize(res.data.data.image, that.data.winWidth, 200);
        res.data.data.style = obj.style;
        res.data.data.image = obj.url;
        var isfriendBargain = false;
        if (res.data.data.participate) {
          isfriendBargain = true;
        }
        that.setData({
          isfriendBargain: isfriendBargain,
          isNow: false,
          results: res.data.data,
          isBargainPrice: res.data.data.bargainPrice,
          totalPrice: res.data.data.price,
          bargainPrice_mine: that.toFixed(res.data.data.originalPrice - res.data.data.aimsPrice - res.data.data.price, 2)
        })
        var this_time = (res.data.data.ctime + 24 * 60 * 60 * 1000 - new Date().getTime()) / 1000;
        that.timeDown(this_time);
        // }
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
    // console.log('/pages/bargainDetail_02/bargainDetail_02?uid=' + that.data.userId)
    return {
      title: '家居mall,兄弟快来帮忙砍一刀！',
      path: '/page/main/index/index?uid=' + that.data.userId + "&bid=" + that.data.bid +"&pagerId=bargainDetail_02&rootUid="+that.data.rootUid,
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