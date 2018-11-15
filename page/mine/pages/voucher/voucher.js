var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    showLoading: false,
    token:"",
    coverindex:-1,
    list:[],
    list_used:[],
    list_timed : []
  },
  showtip(e){
    let id=e.currentTarget.dataset.id;
    let that=this;
    // util_js.errorModel("下单时使用");
    wx.showModal({
      title: '使用优惠券',
      content: '此优惠券仅限线下店内交款使用,您现在是否确认使用？',
      success: function (res) {
        if (res.confirm) {

          wx.request({

            url: config.useCoupon+'?token=' + encodeURIComponent(that.data.token)+'&id='+id,
            data: {'id': id},
            method: 'post',
            success: function (res) {
              if(res.data.success){
                util_js.errorModel("使用成功");
                that.onLoad();
              }else{
                  util_js.errorModel('使用失败，请稍后再试～');
              }
                  // if

            }
          })

        }
      }
    })
  },
  onLoad: function () {
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
        });
        //获取优惠卷列表
        var nowTime = new Date();
        var timestamp=nowTime.getTime();
        wx.request({
          url: config.getCouponUrl+'?token=' + encodeURIComponent(that.data.token),
          data: {status: 0},
          method: 'post',

          success: function (res) {
            if(res.data.data){
              
              let notUsed=[];
              let used=[];
              let overdue=[];
              for (var i = 0; i < res.data.data.length; i++) {
                if(res.data.data[i].status==1){
                  //已使用
                  used.push(res.data.data[i]);
                  

                }else{
                  //未过期
                  if(res.data.data[i].endTime-timestamp>0){
                    notUsed.push(res.data.data[i]);
                     //已过期   
                  }else{
                    overdue.push(res.data.data[i]);
                  }
                }
                that.setData({
                  list:notUsed,
                  list_used:used,
                  list_timed : overdue
                })
              // res.data.data[i].startTime = util_js.formatTimeToDay(res.data.data[i].startTime)
              // res.data.data[i].endTime = util_js.formatTimeToDay(res.data.data[i].endTime)

            }
            }
            
          }
        })
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
    //   if (e.target.dataset.current == 1) {
    //     wx.request({
    //       url: config.getCouponUrl+'?token=' + encodeURIComponent(that.data.token),
    //       data: {status: 1},
    //       method: 'post',
    //       success: function (res) {
    //         // for (var i = 0; i < res.data.data.length; i++) {
    //         //   res.data.data[i].startTime = util_js.formatTimeToDay(res.data.data[i].startTime)
    //         //   res.data.data[i].endTime = util_js.formatTimeToDay(res.data.data[i].endTime)
    //         // }
    //         that.setData({
    //           list_used: res.data.data
    //         })
    //       }
    //     })
    //   } else if (e.target.dataset.current == 2) {
    //     wx.request({
    //       url: config.getCouponUrl+'?token=' + encodeURIComponent(that.data.token),
    //       data: { status: 2 },
    //       method: 'post',
    //       success: function (res) {
    //         // for (var i = 0; i < res.data.data.length; i++) {
    //         //   res.data.data[i].startTime = util_js.formatTimeToDay(res.data.data[i].startTime)
    //         //   res.data.data[i].endTime = util_js.formatTimeToDay(res.data.data[i].endTime)
    //         // }
    //         that.setData({
    //           list_timed: res.data.data
    //         })
    //       }
    //     })
    //  }
      that.setData({
        currentTab: e.target.dataset.current
      })
  }
},
  onShareAppMessage: function () {
    util_js.shareApp();
  }
})