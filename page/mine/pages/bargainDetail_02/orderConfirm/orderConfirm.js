// page/index/pages/groupBuying/orderConfirm/orderConfirm.js
var config = require('../../../../../config.js');
var util_js = require('../../../../../util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token:"",
    isClickPay: false,
    num: 1,
    voucherName :"",
    valueName:'',
    totalPrice:0,
    voucherId: "0",
    attrName :"写死的",
    price: 0,
    addressId : "",
    addressInfo :{
      address : "",
      name : "",
      phone: "",
      areaName: "请选择收货地址"
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options)
    var id = decodeURIComponent(options.id);
    var bid = decodeURIComponent(options.bid);
    var title = decodeURIComponent(options.goodName);
    var price = decodeURIComponent(options.price);
    var style = decodeURIComponent(options.style);
    var image = decodeURIComponent(options.image);
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          id:id,
          bid:bid,
          title: title,
          price: util_js.toFixed(price,2),
          // num:num,
          totalPrice: util_js.toFixed(price, 2),
          token: res.data.data.token,
          // valueName: valueName,
          payFee: util_js.toFixed(price, 2),
          image: image,
          style:style
        })
      }
    })
    wx.getStorage({
      key: "chooseEdAddress",
      success: function (res) {
        console.log(res);
        if (res.data&&res.data.id){
          that.setData({
            addressInfo: res.data,
            addressId: res.data.id
          })
        }
      }
    }),
    
    wx.getStorage({
      key: "chooseVoucher",
      success: function (res) {
        console.log(res);
        if (res.data && res.data.couponRule&&res.data.couponRule.full) {
          var voucherName = "满" + res.data.couponRule.full + "减" + res.data.couponRule.offer;
          console.log(voucherName);
          that.setData({
            voucherName: voucherName,
            voucherId : res.data.id,
            payFee: util_js.toFixed(that.data.payFee - res.data.couponRule.offer,2)
          })
          util_js.setStrg("chooseVoucher", {}, function () { })
        }
      }
    }) 
  },
  // 加
  jia_fn: function (e) {
    var num = this.data.num+1;
    this.setData({
      num: num
    })
  },
  // 减
  jian_fn: function (e) {
    var num = this.data.num-1;
    if(num <=1){
      num = num;
    }
    this.setData({
      num: num
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  payMoney:function(){
    var that = this;
    if (that.data.isClickPay){
      return;
    }
    if (!that.data.addressId){
      util_js.lessFive("请添加地址信息！");
      return;
    }
    that.setData({
      isClickPay : true
    })
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          token: res.data.data.token
        })   
        wx.request({
          url: config.buyBargainUrl,
          data: { token: res.data.data.token, bid: that.data.bid, addressId: that.data.addressId},
          method: 'GET',
          success: function (res) {
            // console.log(res.data) 
            wx.request({
              url: config.orderPayParamUrl,
              data: {token: that.data.token,orderId: res.data.data.orderId,type: 1},
              method: 'GET',
              success: function (res) {
                that.setData({
                  isClickPay: false
                })
                wx.requestPayment({
                  'timeStamp': res.data.timeStamp,
                  'nonceStr': res.data.nonceStr,
                  'package': res.data.package,
                  'signType': res.data.signType,
                  'paySign': res.data.paySign,
                  'success': function (res) {
                    // console.log(res);
                    util_js.lessFive("购买成功！");
                    util_js.setStrg("chooseVoucher", {}, function () { 
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 1
                        })
                      }, 1000)
                    });
                  },
                  'fail': function (res) {
                    that.setData({
                      isClickPay: false
                    })
                    util_js.lessFive("购买失败！")
                    // console.log(res)
                  }
                })
              }
            })
          }
        })
      },
      fail:function(){
        that.setData({
          isClickPay: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: "chooseEdAddress",
      success: function (res) {
        // console.log(res);
        if (res.data && res.data.id) {
          that.setData({
            addressInfo: res.data,
            addressId: res.data.id
          })
        }
      }
    })
    wx.getStorage({
      key: "chooseVoucher",
      success: function (res) {
        // console.log(res);
        if (res.data && res.data.couponRule&& res.data.couponRule.full) {
          var voucherName = "满" + res.data.couponRule.full + "减" + res.data.couponRule.offer;
          // console.log(voucherName);
          that.setData({
            voucherName: voucherName,
            voucherId: res.data.id,
            payFee: util_js.toFixed(that.data.payFee - res.data.couponRule.offer,2)
          })
          util_js.setStrg("chooseVoucher", {}, function () { })
        }
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
    util_js.shareApp();
  }
})