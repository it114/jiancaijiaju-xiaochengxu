var app = getApp();
var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    status: false,
    files: [],
    file: "",
    info: "",
    maxNum: 0
  },

  chooseImage: function (e) {
    var that = this;
    console.log(that.data.maxNum);
    if (that.data.maxNum == 6) {
      util_js.lessFive("已经6张啦");
      setTimeout(function () {
        wx.hideLoading();
      }, 1000)
      return;
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        util_js.lessFive("上传中");
        var tempFilePaths = res.tempFilePaths[0];
        wx.uploadFile({
          url: config.uploadImgUrl, //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'file',
          success: function (ret) {
            console.log(ret)
            var data = JSON.parse(ret.data).ok;
            // that.data.files.push(data.ok);
            var maxNum = 1 + that.data.maxNum;
            that.setData({
              files: that.data.files.concat(data),
              maxNum: maxNum
            });
            wx.hideLoading();
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    })
  },
  watchInfo: function (event) {
    const that = this;
    that.setData({
      info: event.detail.value
    })
  },

  watchTitle: function (event) {
    const that = this;
    that.setData({
      title: event.detail.value
    })
  },


  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  delthis: function (e) {
    var cdk = e.target.id;
    console.log(cdk)
    var newfiles = [];
    var files = this.data.files;
    for (var i = 0; i < files.length; i++) {
      if (files[i] != cdk) {
        newfiles.push(files[i]);
      }
    }
    this.setData({
      files: newfiles
    })
  },
  send: function (e) {
    var that = this;
    console.log(this.data.files);
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        if (!that.data.info) {
          util_js.lessFive("请输入内容");
          return;
        }
        var files = that.data.files;
        var imageList = "";
        for (var i = 0; i < files.length; i++) {
          if (files[i]) {
            imageList += files[i] + ","
          }
        }
        console.log(imageList)
        var data = { token: res.data.data.token,info: that.data.info, image: imageList,oid:that.data.id,gid:that.data.gid};
        wx.request({
          url: config.commentOrderUrl,
          data: data,
          method: 'GET',
          success: function (res) {
            console.log(res);
            if(res.data.success){
              wx.showToast({
                title: '评论成功！',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                wx.hideLoading();
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }else{
              wx.showToast({
                title: '评论失败！',
                icon: 'none',
                duration: 2000
              })
            } 
          }
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      gid: options.gid
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