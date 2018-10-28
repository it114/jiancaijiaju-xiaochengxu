var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;
var  tid = '';
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    showLoading_01: false,
    showLoading_02: true,
    showLoading_03: true,
    showLoading_04: false,
    nopay_list:[],
    noGet_list : [],
    noComment_list: [],
    noFa_list: [],
    list:[]
  }, 
  onLoad: function (options) {

		//订单类型跳转
		this.setData({
				currentTab:options.tid
		});

    var that = this;
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
        that.setData({
          token: res.data.data.token
        })
        if (options.tid-1 != -1) {
          return;
        }
        wx.request({
          url: config.getMyGoodOrderPagerUrl,
          data: { token: res.data.data.token, status: options.tid - 1},
          method: 'GET',
          success: function (res) {

            if (res.data.data.length) {

              for (var i = 0; i < res.data.data.length;i++){
                res.data.data[i].image = res.data.data[i].image.split(",")[0];
                var obj = util_js.getImgByThisSize(res.data.data[i].image ,110, 90)
                res.data.data[i].image = obj.url;
                res.data.data[i].style = obj.style;
                res.data.data[i].ctime = util_js.formatTimeToDay(res.data.data[i].ctime)
              }
              that.setData({
                list: res.data.data
              })
            }
          }
        })
      }
    })
  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageY; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {

    var touchMove = e.changedTouches[0].pageY;
    if (touchMove - touchDot <= -40 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法

      var that = this;
      that.setData({
        showLoading: true
      })
      //模拟加载
      setTimeout(function () {
        // that.setData({
        //   showLoading: false
        // })
      }, 3500);
    }
    clearInterval(interval); // 清除setInterval
    time = 0;//初始化相关变量
    touchDot = 0;//初始化相关变量
    flag_hd = true;//请求结束之后  暂时放在这里
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    if (e.detail.current == 2) {
      wx.request({
        url: config.getMyGoodOrderPagerUrl,
        data: { token: that.data.token, status: 1 },
        method: 'GET',
        success: function (res) {
         
          if (res.data.data.length) {
           
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].image = res.data.data[i].image.split(",")[0];
              var obj = util_js.getImgByThisSize(res.data.data[i].image, 110, 90)
              res.data.data[i].image = obj.url;
              res.data.data[i].style = obj.style;
              res.data.data[i].ctime = util_js.formatTimeToDay(res.data.data[i].ctime)
            }
            that.setData({
              noFa_list: res.data.data
            })
          }
        }
      })
    } else if (e.detail.current == 1){
      if (that.data.nopay_list.length > 0) {
        return;
      }
      wx.request({
        url: config.getMyGoodOrderPagerUrl,
        data: { token: that.data.token, status: 0 },
        method: 'GET',
        success: function (res) {

          if (res.data.data.length) {

            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].image = res.data.data[i].image.split(",")[0];
              var obj = util_js.getImgByThisSize(res.data.data[i].image, 110, 90)
              res.data.data[i].image = obj.url;
              res.data.data[i].style = obj.style;
              res.data.data[i].ctime = util_js.formatTimeToDay(res.data.data[i].ctime)
            }
            that.setData({
              nopay_list: res.data.data
            })
          }
        }
      })
    }else if(e.detail.current == 3){
      if (that.data.noGet_list.length > 0) {
        return;
      }
      wx.request({
        url: config.getMyGoodOrderPagerUrl,
        data: { token: that.data.token, status: 2 },
        method: 'GET',
        success: function (res) {

          if (res.data.data.length) {

            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].image = res.data.data[i].image.split(",")[0];
              var obj = util_js.getImgByThisSize(res.data.data[i].image, 110, 90)
              res.data.data[i].image = obj.url;
              res.data.data[i].style = obj.style;
              res.data.data[i].ctime = util_js.formatTimeToDay(res.data.data[i].ctime)
            }
            that.setData({
              noGet_list: res.data.data
            })
          }
        }
      })
    }else if(e.detail.current == 4){
      if (that.data.noComment_list.length > 0) {
        return;
      }
      wx.request({
        url: config.getMyGoodOrderPagerUrl,
        data: { token: that.data.token, status: 3 },
        method: 'GET',
        success: function (res) {
     
          if (res.data.data.length) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].image = res.data.data[i].image.split(",")[0];
              var obj = util_js.getImgByThisSize(res.data.data[i].image, 110, 90)
              res.data.data[i].image = obj.url;
              res.data.data[i].style = obj.style;
              res.data.data[i].ctime = util_js.formatTimeToDay(res.data.data[i].ctime)
            }

            that.setData({
              noComment_list: res.data.data
            })
          }
        }
      })
    } else if (e.detail.current == 0) {
      if (that.data.list.length > 0) {
        return;
      }
      wx.request({
        url: config.getMyGoodOrderPagerUrl,
        data: { token: that.data.token, status: -1 },
        method: 'GET',
        success: function (res) {

          if (res.data.data.length) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].image = res.data.data[i].image.split(",")[0];
              var obj = util_js.getImgByThisSize(res.data.data[i].image, 110, 90)
              res.data.data[i].image = obj.url;
              res.data.data[i].style = obj.style;
              res.data.data[i].ctime = util_js.formatTimeToDay(res.data.data[i].ctime)
            }

            that.setData({
               list: res.data.data
            })
          }
        }
      })
    }
    
    that.setData({
      showLoading: false
    })
  },
  /** 
   * 点击tab切换 
   */
  payGood: function (e) {
  
    var that = this;
    wx.request({
      url: config.payGoodUrl,
      data: { token: that.data.token, oid: e.currentTarget.id },
      method: 'GET',
      success: function (res) {

        wx.request({
          url: config.orderPayParamUrl,
          data: { token: that.data.token, orderId: res.data.data.orderId, type: 1 },
          method: 'GET',
          success: function (res) {
            wx.requestPayment({
              'timeStamp': res.data.timeStamp,
              'nonceStr': res.data.nonceStr,
              'package': res.data.package,
              'signType': res.data.signType,
              'paySign': res.data.paySign,
              'success': function (res) {

                util_js.lessFive("购买成功！");
                for(var i = 0; i < that.data.list.length;i++){
                  if (that.data.list[i].id == e.currentTarget.id){
                    that.data.list[i].status = 1;
                    that.setData({
                      list:that.data.list
                    })
                  }
                }
              },
              'fail': function (res) {

              }
            })
          }
        })
      }
    })
   
  },
  channelOrder:function(e){
    var that = this;
    wx.request({
      url: config.channelOrderUrl,
      data: { token: that.data.token, oid: e.currentTarget.id},
      method: 'GET',
      success: function (res) {

        util_js.lessFive("购买成功！");
        for (var i = 0; i < that.data.list.length; i++) {
          if (that.data.list[i].id == e.currentTarget.id) {
            that.data.list[i].status = 5;
            that.setData({
              list: that.data.list
            })
          }
        }
      }
    })
  },
  goComment: function (e) {
    var that = this;

    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "../comment/comment?id=" + e.currentTarget.id + "&gid=" + e.currentTarget.dataset.gid
    })
  },
  confirmOrder: function (e) {
    var that = this;
    wx.request({
      url: config.confirmOrderUrl,
      data: { token: that.data.token, oid: e.currentTarget.id},
      method: 'GET',
      success: function (res) {

        util_js.lessFive("确认成功！");
        for (var i = 0; i < that.data.noGet_list.length; i++) {
          if (that.data.noGet_list[i].id == e.currentTarget.id) {
            that.data.noGet_list[i].status = 3;
            that.setData({
              noGet_list: that.data.noGet_list 
            })
          }
        }
        for (var i = 0; i < that.data.list.length; i++) {
          if (that.data.list[i].id == e.currentTarget.id) {
            that.data.list[i].status = 3;
            that.setData({
              list: that.data.list
            })
          }
        }
      }
    })



    wx.request({
      url: config.getMyGoodOrderPagerUrl,
      data: { token: that.data.token, status: 2 },
      method: 'GET',
      success: function (res) {
        if (res.data.data.length) {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].image = res.data.data[i].image.split(",")[0];
            var obj = util_js.getImgByThisSize(res.data.data[i].image, 110, 90)
            res.data.data[i].image = obj.url;
            res.data.data[i].style = obj.style;
            res.data.data[i].ctime = util_js.formatTimeToDay(res.data.data[i].ctime)
          }
          that.setData({
            noGet_list: res.data.data
          })
        }
      }
    })

  },
  swichNav: function (e) {
    var that = this;
    that.setData({
      showLoading: false//关闭上拉状态
    })
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