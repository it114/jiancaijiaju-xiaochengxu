//index.js
//获取应用实例
var config = require('../../../config.js');
var util_js = require('../../../util.js');

Page({
  data: {
      swiper:[{'image':'../../../images/no_image.png'}],
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
  //统计次数
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
    wx.request({
      url: config.getNumsUrl + '?token=' + encodeURIComponent(that.data.token)+'&eventType='+typeid,

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
      data: false
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
    //用户登录
    toLogin(){
      let that=this;
      wx.login({
        success: function (res) {
          var obj = {code:res.code};
          if(that.data.uid){
            obj.uid = that.data.uid;
          }
          if (that.data.rootUid) {
            obj.rootUid = that.data.rootUid;
          } else {
            obj.rootUid = that.data.uid;
          }

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
    //检查是否绑定手机
    checkphone(){
          let that=this;
          wx.request({
            url: config.checkphoneUrl +encodeURIComponent(that.data.token),
            data:{
              username:that.data.name
            },
            method: 'post',
            success: function (res) {

             if(res.data.success){
                if(res.data.data.isBandPhone=='0'){
                  let start_time=res.data.data.redPackageSet.starttime;
                  let end_time=res.data.data.redPackageSet.endtime;
                  //跳转到红包雨界面
                      wx.redirectTo({
                        url: '/page/main/activity/index?start_time='+start_time+'&end_time='+end_time
                  });

                }else{
                      //获取优惠卷
                      wx.request({
                        url: config.getAllCoponUrl + '?token=' + encodeURIComponent(that.data.token),
                        method: 'POST',
                        success: function (res) {
                             if(res.data.success){
                                if (res.data.length > 2) {
                                  that.setData({
                                    coupons: (res.data).slice(0, 3),
                                    showCoupon: true,
                                    showMask: false

                                  })
                                }
                              }else{
                                //如果token过期或不存在，重新登录
                                that.toLogin();
                              }     
                        }
                      })


                }
              }else{
                //如果token过期或不存在，重新登录
                that.toLogin();
              }
              
            }
        });
},
//更新用户信息
updateUserInfo(){
  let that=this;
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
            name:    ret.data.name
          })

          if (ret.data.rootUid) {
            that.setData({
              rootUid: ret.data.rootUid,
            });
          }
          that.checkphone();
          util_js.setStrg("userInfo", ret.data, function () {

          });
        }
      })
    }
  })
},
  //点击获取用户信息
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
          that.checkphone();
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
                  });
                  that.updateUserInfo();

              }
            }, 
            fail: function (res) {
                console.log('用户未同意授权')

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
      fail:function(){
        that.setData({
          showMask: true
        });

      }
    });
  
    if(opt){
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

    if ( opt.pagerId == "bargainDetail_02") {
      //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      wx.navigateTo({
        url: '/page/index/pages/bargainDetail_02/bargainDetail_02?uid=' + opt.uid + "&bid=" +opt.bid,
      })
    }
  }

//获取本地缓存用户信息
  wx.getStorage({
      key: "userInfo",
      complete:function(res){
        //  console.log(res);
      },
      success: function (res) {
        if(!res.data.data.id||!res.data.data.token){
          that.toLogin();
        }else{
           that.setData({
          name:res.data.data.name,
          uid: res.data.data.id,
          userId: res.data.data.id,
          token:res.data.data.token
        });

        if (res.data.data.rootUid) {
          that.setData({
            rootUid: res.data.data.rootUid,
          });
        }
        that.checkphone();
        }
       
      },
      fail:function(){
        
          //检查授权
          wx.getSetting({
              success(res) {
                console.log('未授权');
                //没有授权,弹出授权框
                if (!res.authSetting['scope.userInfo']) {
                    that.setData({
                      showModel: true
                    });
                    // that.toLogin();
                } else {
                //已经授权,重新登录
                that.toLogin();

                }
              }
        })
      }
    })
      
    

    wx.request({
      url: config.getBannerListUrl,
      data: {},
      method: 'GET',
      success: function (res) {
        if(res.statusCode==200){
          that.setData({
            swiper: res.data
        })
        }
        
      }
    })
    wx.request({
      url: config.getActivityPagerUrl,
      data: {},
      method: 'GET',
      success: function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].startDate = util_js.formatTimeToDay(res.data.data[i].startDate)
          res.data.data[i].endDate = util_js.formatTimeToDay(res.data.data[i].endDate)
          res.data.data[i].icon = res.data.data[i].icon.split(",")[0]
          var imgArr = [];
          var obj = util_js.getImgByThisSize(res.data.data[i].icon, 73, 73);
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
