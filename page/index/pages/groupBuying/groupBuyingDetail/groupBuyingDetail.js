// page/index/pages/groupBuying/groupBuyingDetail/groupBuyingDetail.js
var config = require('../../../../../config.js');
var util_js = require('../../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    valueName:"",
    userId:"",
    rootUid:"",
    vid : "",
    aid: "",
    num : 1,
    oDay:0,
    oHour:0,
    oMinutes:0,
    oSecond:0,
    totalPrice:0,
    results : {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
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
    var id = decodeURIComponent(options.id);
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          gid: id,
          userId : res.data.data.id,
          token: res.data.data.token
        })

        if (res.data.data.rootUid) {
          that.setData({
            rootUid: res.data.data.rootUid,
          });
        }

        wx.request({
          url: config.getGoodInfoUrl,
          data: { token: res.data.data.token,gid:id},
          method: 'GET',
          success: function (res) {
            for (var i = 0; i < res.data.data.clientAttrList.length; i++) {
              res.data.data.clientAttrList[i].active = "";
            }
            for (var i = 0; i < res.data.data.clientCommentList.length; i++) {
              res.data.data.clientCommentList[i].ctime = util_js.formatTimeToDay(res.data.data.clientCommentList[i].ctime)
            }
            
              res.data.data.icon = res.data.data.icon.split(",");
              console.log(res.data.data.icon)
              var imgArr = [];
              for (var i = 0; i < res.data.data.icon.length;i++){
                if (res.data.data.icon[i]){
                  var obj = util_js.getImgByThisSize(res.data.data.icon[i], that.data.winWidth * 0.390, that.data.winWidth * 0.390)
                  obj.width = that.data.winWidth+ "px";
                  obj.height = that.data.winWidth * 0.50 + "px";
                  imgArr.push(obj)
                }
              }
            res.data.data.iconArr = imgArr;

            imgArr = [];
            if (res.data.data.infoImage) {
              res.data.data.infoImage = res.data.data.infoImage.split(",");
              for (var i = 0; i < res.data.data.infoImage.length; i++) {
                if (res.data.data.infoImage[i]) {
                  var obj = util_js.getImgByThisSize(res.data.data.infoImage[i], that.data.winWidth,0)
                  imgArr.push(obj)
                }
              }
            }

            res.data.data.infoImage = imgArr;
            res.data.data.info = util_js.tryDecodeURIComponent(res.data.data.info);
            res.data.data.info = res.data.data.info.replace(/p>/g, '');
            res.data.data.info = res.data.data.info.replace(/\//g, '');
            res.data.data.info = res.data.data.info.replace(/</g, '');
            console.log(res.data.data)
              // res.data.data.icon = imgArr;
            if (res.data.data.clientAttrList[0].vid){
              res.data.data.clientAttrList[0].active = "active";
              that.setData({
                vid: res.data.data.clientAttrList[0].vid,
                valueName: res.data.data.clientAttrList[0].valueName,
                results: res.data.data,
                totalPrice : res.data.data.price
              })
            }else{
              that.setData({
                results: res.data.data,
                totalPrice: res.data.data.price
              })
            }
            that.timeDown(res.data.data.time - new Date().getTime());
              
            // }
          }
        })
      }
    })
  },
  // 加
  jia_fn: function (e) {
    var num = this.data.num + 1;
    // if(num > this.data.results.num){
    //   util_js.lessFive("库存不足");
    //   return;
    // }
    this.setData({
      num: num,
      totalPrice: this.data.results.price * num
    })
  },
  // 减
  jian_fn: function (e) {
    var num = this.data.num - 1;
    if (num <= 1) {
      num = 1;
    }
    this.setData({
      num: num,
      totalPrice: this.data.results.price*num
    })
  },
  timeDown:function(starttime){
    var that = this;
      starttime = starttime/1000;
      if (starttime < 1) {
        starttime = 0
      }
      var tim = setInterval(function () {
        var oDay = Math.floor(starttime / (60 * 60*24));
        var _oDay = starttime % (60 * 60*24);

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
        }else{
          clearInterval(tim);
          that.setData({
            oDay: "00",
            oHour: "00",
            oMinutes: "00",
            oSecond: "00"
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
  goToBuy:function(){
    var that = this;
    console.log(that.data.results)
    if (that.data.results.num >= that.data.results.buyNum){
       wx.showToast({
        title: '参团人数已满',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // orderConfirm / orderConfirm
    wx.request({
      url: config.bugGoodUrl,
      data: { token: res.data.data.token, gid: that.data.gid },
      method: 'GET',
      success: function (res) {
        console.log(res);

      }
    })
  },
  selectThisValue:function(e){
    var that = this;
    for (var i = 0; i < that.data.results.clientAttrList.length;i++){
      that.data.results.clientAttrList[i].active = '';
      if (that.data.results.clientAttrList[i].vid == e.target.dataset.vid){
        console.log(e.target.dataset.vid);
        that.data.results.clientAttrList[i].active = "active";
        that.setData({
          vid: e.target.dataset.vid,
          valueName: that.data.results.clientAttrList[i].valueName
        })
        }
    }
    that.setData({
      results: that.data.results
    })
  },
  goToNext: function () {
    var that = this;
    console.log(that.data.results)
    if (that.data.results.num <= that.data.results.buyNum) {
      wx.showToast({
        title: '参团人数已满',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.navigateTo({
      url: '../orderConfirm/orderConfirm?' + 'id=' + that.data.results.id + '&gid=' + that.data.results.gid + '&price=' + util_js.toFixed(that.data.results.price,2) + '&title=' + that.data.results.title + '&vid=' + that.data.vid + '&valueName=' + that.data.valueName + '&num=' + that.data.num,
    })
  },
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
    if (!that.data.gid){
      return;
    }
    wx.request({
      url: config.getGoodInfoUrl,
      data: { token: that.data.token, gid: that.data.gid },
      method: 'GET',
      success: function (res) {
        for (var i = 0; i < res.data.data.clientAttrList.length; i++) {
          res.data.data.clientAttrList[i].active = "";
        }
        for (var i = 0; i < res.data.data.clientCommentList.length; i++) {
          res.data.data.clientCommentList[i].ctime = util_js.formatTimeToDay(res.data.data.clientCommentList[i].ctime)
        }
        res.data.data.icon = res.data.data.icon.split(",");
        console.log(res.data.data.icon)
        var imgArr = [];
        for (var i = 0; i < res.data.data.icon.length; i++) {
          if (res.data.data.icon[i]) {
            var obj = util_js.getImgByThisSize(res.data.data.icon[i], that.data.winWidth * 0.390, that.data.winWidth * 0.390)
            obj.width = that.data.winWidth + "px";
            obj.height = that.data.winWidth * 0.50 + "px";
            imgArr.push(obj)
          }
        }
        res.data.data.iconArr = imgArr;
        imgArr = [];
       
        if (res.data.data.infoImage){
          res.data.data.infoImage = res.data.data.infoImage.split(",");
          for (var i = 0; i < res.data.data.infoImage.length; i++) {
            if (res.data.data.infoImage[i]) {
              var obj = util_js.getImgByThisSize(res.data.data.infoImage[i], that.data.winWidth,0)
              imgArr.push(obj)
            }
          }
        }
      
        res.data.data.infoImage = imgArr;
        res.data.data.info = util_js.tryDecodeURIComponent(res.data.data.info);
        // res.data.data.info = res.data.data.info.replace("/p/g","view");
        res.data.data.info = res.data.data.info.replace(/p>/g, '');
        res.data.data.info = res.data.data.info.replace(/\//g, '');
        res.data.data.info = res.data.data.info.replace(/</g, '');
        console.log(res.data.data)
        if (res.data.data.clientAttrList[0].vid) {
          if (that.data.vid){
            for (var i = 0; i < res.data.data.clientAttrList.length; i++) {
              if (that.data.vid == res.data.data.clientAttrList[i].vid) {
                res.data.data.clientAttrList[i].active = "active";
                that.setData({
                  vid: res.data.data.clientAttrList[i].vid,
                  valueName: res.data.data.clientAttrList[i].valueName,
                  results: res.data.data,
                  totalPrice: res.data.data.price
                })
              }
            }
          }else{
            that.setData({
              vid: res.data.data.clientAttrList[0].vid,
              valueName: res.data.data.clientAttrList[0].valueName,
              results: res.data.data,
              totalPrice: res.data.data.price              
            })
          }
          
        } else {
          that.setData({
            results: res.data.data,
            totalPrice: res.data.data.price  
          })
        }
      }
    })
  },
  addCollect:function(){
    var that = this;
    var urls = config.delCollectUrl;
    if(that.data.results.collect == false){
      urls = config.addCollectUrl;
    }
    console.log({ token: that.data.token, id: that.data.results.id })
    wx.request({
      url: urls,
      data: { token: that.data.token, id: that.data.results.id },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (that.data.results.collect == true) {
          util_js.lessFive("已取消");
          that.data.results.collect = false;
        }else{
          util_js.lessFive("收藏成功");
          that.data.results.collect = true;
        }        
        that.setData({
          results: that.data.results
        })
      },
      fail:function(res){
        console.log(res);
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
    console.log('/page/main/index/index?uid=' + that.data.userId+",rootUid="+that.data.rootUid)
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