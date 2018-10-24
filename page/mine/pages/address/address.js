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
    address_list: [

    ],

  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  chooseAddress: function (e) {
    var that = this;
    if(that.data.mine == "mine"){
      return;
    }
    util_js.setStrg("chooseEdAddress", that.data.allResults[e.currentTarget.id], function () {

    });
    setTimeout(function () {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      })
    }, 500)
  },
  // 打开新增地址页面
  toNewAddressPage: function () {
    wx.navigateTo({
      url: 'newAddress/newAddress?id=0',
    })
  },


  // 打开 删除当前收货地址弹窗
  openDeleteToast: function (e) {
    var that = this;
    wx.showModal({
      title: '确定要删除吗？',
      content: '',
      confirmColor: '#C4161E',
      cancelColor: '#333333',
      success: function (res) {
        if (res.confirm) {
          console.log('确定删除');
          wx.getStorage({
            key: "userInfo",
            success: function (res) {
              // console.log({ token: that.data.token, id: e.currentTarget.id })
              // console.log(that.data.address_list)
              wx.request({
                url: config.delAddressUrl,
                data: { token: that.data.token, id: e.currentTarget.id },
                method: 'GET',
                success: function (res) {
                  console.log(res)
                  for (var i = 0; i < that.data.address_list.length; i++) {
                    if (e.currentTarget.id == that.data.address_list[i].id) {
                      that.data.address_list[i].show = "";
                      that.setData({
                        address_list: that.data.address_list
                      });
                      util_js.lessFive("删除成功！");
                    }
                  }
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('取消删除');
        }
      }
    })
  },
  onLoad: function (opt) {
    var mine = decodeURIComponent(opt.mine);
    var that = this;

    /** 
     * 获取系统信息 
     */

    wx.getSystemInfo({

      success: function (res) {
        if (mine == "mine") {
          that.setData({
            mine: "mine",
            winWidth: res.windowWidth,
            winHeight: res.windowHeight
          });
        } else {
          that.setData({
            mine: "",
            winWidth: res.windowWidth,
            winHeight: res.windowHeight
          });
        }
      }
    })
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        // console.log(res)
        that.setData({
          token: res.data.data.token
        })
        wx.request({
          url: config.getAllAddressUrl,
          data: { token: res.data.data.token },
          method: 'GET',
          success: function (res) {
            // console.log(res)
            if (res.data.data.length) {
              // console.log(res.data.data);
              var allResults = {};
              for (var i = 0; i < res.data.data.length; i++) {
                res.data.data[i].show = true;
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
              // console.log(res.data.data);
              for (var i = 0; i < res.data.data.length; i++) {
                res.data.data[i].show = true;
              }
              that.setData({
                address_list: res.data.data
              })
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
  editAddress: function (e) {
    var data = this.data.address_list;

    for (var i = 0; i < data.length; i++) {
      console.log(data[i])
      if (data[i].id == e.currentTarget.dataset.id) {
        var text = "?";
        for (var key in data[i]) {
          text = text + key + "=" + data[i][key] + "&"
        }
        console.log('newAddress' + text)
        wx.navigateTo({
          url: 'newAddress/newAddress' + text
        })
      }
    }
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