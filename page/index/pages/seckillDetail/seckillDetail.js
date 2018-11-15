var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  results:"",
 num:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var gid = decodeURIComponent(options.gid);
    var time = decodeURIComponent(options.time);
    var dayTime = decodeURIComponent(options.dayTime); 
    var isNotBegin = decodeURIComponent(options.isNotBegin); 
    console.log(isNotBegin)
    console.log(isNotBegin)
    console.log(isNotBegin)
    console.log(isNotBegin)
    that.setData({
      dayTime: dayTime,
      time:time,
      isNotBegin: isNotBegin||false
    })
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        // console.log(res)
        that.setData({
          token: res.data.data.token,
        })
        wx.request({
          url: config.getSplikeInfoUrl,
          data: { token: res.data.data.token, dayTime: dayTime,time:time,gid:gid},
          method: 'GET',
          success: function (res) {
            if (res.data.data.data.clientCommentList.length){
              for (var i = 0; i < res.data.data.data.clientCommentList.length; i++) {
                res.data.data.data.clientCommentList[i].ctime = util_js.formatTimeToDay(res.data.data.data.clientCommentList[i].ctime)
              }
            }
            
            res.data.data.data.icon = res.data.data.data.icon.split(",");
            res.data.data.data.image = res.data.data.data.image.split(",")[0]
                var imgArr = [];
            var obj = util_js.getImgByThisSize(res.data.data.data.image, 100, 100);
                res.data.data.data.style = obj.style;
                res.data.data.data.image = obj.url;
                res.data.data.data.info = util_js.tryDecodeURIComponent(res.data.data.data.info);
                res.data.data.data.info = res.data.data.data.info.replace(/p>/g, '');
                res.data.data.data.info = res.data.data.data.info.replace(/\//g, '');
                res.data.data.data.info = res.data.data.data.info.replace(/</g, '');
                res.data.data.data.clientAttrList[0].active = "active";
              // }
            console.log(res.data.data.data.id)


            imgArr = [];
            if (res.data.data.data.infoImage) {
              res.data.data.data.infoImage = res.data.data.data.infoImage.split(",");
              for (var i = 0; i < res.data.data.data.infoImage.length; i++) {
                if (res.data.data.data.infoImage[i]) {
                  var obj = util_js.getImgByThisSize(res.data.data.data.infoImage[i], that.data.winWidth, 0)
                  imgArr.push(obj)
                }
              }
            }

            res.data.data.data.infoImage = imgArr;
            // if (res.data.data.data.clientAttrList){
              that.setData({
                aid: res.data.data.data.clientAttrList[0].aid,
                vid: res.data.data.data.clientAttrList[0].vid,
                gid: res.data.data.data.clientAttrList[0].gid,
                results: res.data.data.data,
        
              })
            // }
              
              
            // }
          }
        })
      }
    })
  },
  // 加
  jia_fn: function (e) {
    return

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
    return
    var num = this.data.num - 1;
    if (num <= 1) {
      num = 1;
    }
    this.setData({
      num: num,
      totalPrice: this.data.results.price * num
    })
  },
  chooseThis:function(e){
    var that = this;
    
    var ret = that.data.results;
    for (var i = 0; i < ret.clientAttrList.length;i++){
      if (e.target.dataset.vid == ret.clientAttrList[i].vid){
        ret.clientAttrList[i].active = "active";
      }else{
        ret.clientAttrList[i].active = "";
      }
    }
    that.setData({
      aid: e.target.dataset.aid,
      gid: e.target.dataset.gid,
      vid: e.target.dataset.vid,
      results:ret
    })
    console.log(e)
  },
  bugGood: function () {
    var that = this;
    console.log(that.data)
    if(!that.data.vid||!that.data.aid||!that.data.gid){
      return;
    }
    console.log(that.data.results);
    console.log(that.data.num)
    var totalPrice = that.data.results.realPrice*that.data.num;
    var valueName;
    var ret = that.data.results;
    for (var i = 0; i < ret.clientAttrList.length; i++) {
      if (that.data.vid == ret.clientAttrList[i].vid) {
        valueName = ret.clientAttrList[i].valueName
      }
    }
    wx.navigateTo({
      url: 'orderConfirm/orderConfirm?' + 'vid=' + that.data.vid + '&gid=' + that.data.gid + '&image=' + that.data.results.image + '&style=' + that.data.results.style + '&price=' + that.data.results.realPrice + '&goodName=' + that.data.results.title + '&aid=' + that.data.aid + '&num=' + that.data.num + '&valueName=' + valueName + '&dayTime=' + that.data.dayTime + '&time=' + that.data.time + '&totalPrice=' + totalPrice,
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
  addCollect: function () {
    var that = this;
    var urls = config.delSpikeCollectUrl;
    if (that.data.results.collect == false) {
      urls = config.addSpikeCollectUrl;
    }
    console.log({ token: that.data.token, gid: that.data.results.id, day: that.data.dayTime, time: that.data.time})
    wx.request({
      url: urls,
      data: { token: that.data.token, gid: that.data.results.id, day: that.data.dayTime, time: that.data.time },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (that.data.results.collect == true) {
          util_js.lessFive("已取消");
          that.data.results.collect = false;
        } else {
          util_js.lessFive("收藏成功");
          that.data.results.collect = true;
        }
        that.setData({
          results: that.data.results
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
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
    console.log('/page/main/index/index?uid=' + that.data.userId)
    return {
      title: '点我得红包，最高100元',
      path: '/page/main/index/index?uid=' + that.data.userId,
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