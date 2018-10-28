//index.js
//获取应用实例
var config = require('../../../config.js');
var util_js = require('../../../util.js');
const app = getApp()
var data = {};
Page({
  data: {
      swiper:[],
      winHeight:0,
      showModel : false,
      token : "",
      activityList:"",
      uid : "",
      userId: "",
      rootUid:"",
      showMask:false,
      showCoupon:false,
      coupons:[]
  },
  
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
      url: config.getNumsUrl + '?token=' + encodeURIComponent(that.data.token)+'&eventType='+typeid,
      // data:{
      //   username:username
      // },
      method: 'post',
      success: function (res) {
   
      }

    })

  },
  //关闭分享引导
  closeMask(){
    this.setData({
       showMask:false
    });
     //存储分享引导 下次不显示
     wx.setStorage({
      key: "should_show_share_app_mask",
      data: true
   });

  },
  //一键领取
  receiveCoupon(){
    let that=this;
    wx.request({
      url: config.receiveCouponUrl+'?token='+encodeURIComponent(that.data.token),
      data: data,
      method: 'POST',
      success: function (res) {

        if(res.data){
          that.setData({
            showCoupon:false
          })
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 2000
          });
        }
        
      }
    })
  },


  //获取用户信息
  getUserInfo: function (e) {
     var that = this;
    //如果用户点击同意授权
    if(e.detail.userInfo){

          that.setData({
            showModel: false
          })
          var userInfo = e.detail.userInfo;
          var data = {};
          data.name = userInfo.nickName;
          data.icon = userInfo.avatarUrl;
          data.token = that.data.token;

          //上传用户信息
          wx.request({
            url: config.updateUserInfourl,
            data: data,
            method: 'GET',
            success: function (ret) {
              util_js.setStrg("userInfo", ret.data, function () {

              });
            }
          });
          //检测是否绑定手机
          wx.request({
            url: config.checkphoneUrl + encodeURIComponent(that.data.token),
            data:{
              username:data.name
            },
            method: 'post',
            success: function (res) {
              if(res.data.data.isBandPhone=='0'){
                let start_time=res.data.data.redPackageSet.starttime;
              let end_time=res.data.data.redPackageSet.endtime;
                //跳转到红包雨界面
                    wx.redirectTo({
                      url: '/page/main/activity/index?start_time='+start_time+'&end_time='+end_time
                })

              }
            }
        });
  }else{
    //用户拒绝授权
    wx.showModal({
      title: '用户未授权',
      content: '拒绝授权,小程序将无法正常显示个人信息,点击确定重新获取授权。',
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting["scope.userInfo"]) {
                  //如果用户重新同意了授权登录
                  that.setData({
                    showModel: false
                  })

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
                          that.setData({
                            userId: ret.data.id,
                            rootUid: ret.data.rootUid,
                          })

                          if (ret.data.rootUid) {
                            that.setData({
                              rootUid: ret.data.rootUid,
                            });
                          }

                          if (!ret.data.phone) {
                            wx.redirectTo({
                              url: '/page/main/activity/index?start_time=1&end_time=1'
                            })
                          }

                          util_js.setStrg("userInfo", ret.data, function () {

                          });
                        }
                      })
                    }
                  })
              }
            }, 
            fail: function (res) {

            }
          })

        }
      }
    })

  }
  },

  
  onLoad: function (opt) {

    var that = this;
    //显示分享按钮
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
      },
      fail: function (res) {
         
      }
    });
    //是否显示分享引导
    wx.getStorage({
      key: 'should_show_share_app_mask',
      success: function(res) {
        that.setData({
          showMask: res.data
        });
      },
    });

    if (opt.pagerId && opt.pagerId == "bargainDetail_02") {
      //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      wx.navigateTo({
        url: '/page/index/pages/bargainDetail_02/bargainDetail_02?uid=' + opt.uid + "&bid=" +opt.bid,
      })
    }
    if (opt.uid) {
      that.setData({
        uid: opt.uid
      })
    }

     if (opt.rootUid) {
      that.setData({
        rootUid: opt.rootUid
      })
    }



    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          uid: res.data.data.id,
          userId: res.data.data.id,
          token:res.data.data.token
        });

        if (res.data.data.rootUid) {
          that.setData({
            rootUid: res.data.data.rootUid,
          });
        }

        if (!res.data.data.phone) {
          wx.redirectTo({
            url: '/page/main/activity/index?start_time=1&end_time=1'
          })
        }

     //已经授权检测是否绑定手机
     let username=res.data.data.name;
     wx.request({
       url: config.checkphoneUrl + encodeURIComponent(res.data.data.token),
      data:{
        username:username,
      },
      method: 'post',
      success: function (res) {       
        if(res.data.data.isBandPhone=='0'){
        let start_time=res.data.data.redPackageSet.starttime;
        let end_time=res.data.data.redPackageSet.endtime;
          //跳转到红包雨界面
              wx.redirectTo({
                url: '/page/main/activity/index?start_time='+start_time+'&end_time='+end_time
          })

        console.log('first open suc to jump red package ');
        }else{

          //获取优惠卷
        wx.request({
          url: config.getAllCoponUrl + '?token=' + encodeURIComponent(that.data.token),
          method: 'POST',
          success: function (res) {
            if (res.data.length > 2) {
              that.setData({
               coupons: (res.data).slice(0, 3),
                showCoupon: true,
                showMask: false

              })
            }
          }
        })

        }
      } 
    })

    },
      fail:function(){
        console.log('first open failed to get user info ')
        wx.login({
          success: function (res) {
            console.log('first open login suc ')

            var obj = {code:res.code};
            if(that.data.uid){
              obj.uid = that.data.uid;
              console.log('first open login suc uid ' + that.data.uid);
            }

            if (that.data.rootUid) {
              obj.rootUid = that.data.rootUid;
              console.log('first open login suc rootUid '+that.data.rootUid);
            } else {
              obj.rootUid = that.data.uid;
              console.log('first open login suc rootUid ' + that.data.uid);
            }
            
            // setTimeout(function () {
              wx.request({
                url: config.registerUserByWeixinUrl,
                data:obj,
                success: function (res) {
                  console.log('first open failed to get user info '+res);

                  that.setData({
                    token : res.data.data.token,
                    userId: res.data.data.id
                  })

                  if (res.data.data.rootUid) {
                    that.setData({
                      rootUid: res.data.data.rootUid,
                    });
                  }



                  wx.getSetting({
                    success(res) {
                      if (!res.authSetting['scope.userInfo']) {
                          that.setData({
                            showModel: true
                          })
                      } else {
                        console.log('first open failed cant showModel ');
                       
                        wx.getUserInfo({
                          success: function (res) {
                            var userInfo = JSON.parse(res.rawData);                           fundebug.userInfo = userInfo;

                            data.name = userInfo.nickName;
                            data.icon = userInfo.avatarUrl;
                            data.token = that.data.token;
                            wx.request({
                              url: config.updateUserInfourl,
                              data: data,
                              method: 'GET',
                              success: function (ret) {
                                that.setData({
                                  userId: ret.data.id,
                                  rootUid: ret.data.rootUid,
                                })

                                if (ret.data.rootUid) {
                                  that.setData({
                                    rootUid: ret.data.rootUid,
                                  });
                                }

                                if (!ret.data.phone) {
                                  wx.redirectTo({
                                    url: '/page/main/activity/index?start_time=1&end_time=1'
                                  })
                                }

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
      
    

    wx.request({
      url: config.getBannerListUrl,
      data: data,
      method: 'GET',
      success: function (res) {
        that.setData({
          swiper: res.data
        })
      }
    })
    wx.request({
      url: config.getActivityPagerUrl11,
      data: {},
      method: 'GET',
      success: function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].startDate = util_js.formatTimeToDay(res.data.data[i].startDate)
          res.data.data[i].endDate = util_js.formatTimeToDay(res.data.data[i].endDate)
          res.data.data[i].icon = res.data.data[i].icon.split(",")[0]
          var imgArr = [];
          var obj = util_js.getImgByThisSize(res.data.data[i].icon, 73, 73);
          console.log(obj)
          res.data.data[i].width = 73 + "px";
          res.data.data[i].height = 73 + "px";
          res.data.data[i].icon = obj.url;
        }
        that.setData({
          activityList: res.data.data
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    console.log('/page/main/index/index?uid=' + that.data.userId +" rootUid: ret.data.rootUid,"+that.data.rootUid)
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
