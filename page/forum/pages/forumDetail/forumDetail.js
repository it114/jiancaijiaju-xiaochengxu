var app = getApp();
var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    id: 0,
    icon : "",
    title : "",
    info : "",
    tom : '',
    aid : "",
    fid : "",
    hiden_input:true,
    status:'none',
    focus:false,
    commentInfo_send: "",
    fromUid : "",
    userId : "",
    commentInfo_add: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var aid = decodeURIComponent(options.id); //普通二维码链接
    // console.log(aid)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          aid : aid
        });
      }
    });

    var data = {};
  
      wx.getStorage({
        key: "userInfo",
        success: function (res) {
          data = { token: res.data.data.token,fid:aid};
          that.setData({
            userId:res.data.data.id,
            userIcon: res.data.data.icon
          });
          wx.request({
            url: config.getForumInfoUrl,
            data: data,
            method: 'GET',
            success: function (res) {
  
              console.log(res);
              var imgArr = [];
              
              if (res.data.data.image) {
    
                res.data.data.image = res.data.data.image.split(",");
                for (var j = 0; j < res.data.data.image.length; j++) {
                  if (res.data.data.image[j]){
                
                    imgArr.push(res.data.data.image[j])
                  }
                  
                }

                
              }

              that.setData({
                info: res.data.data.info,
                title: res.data.data.title,
                ctime: util_js.formatTimeToDay(res.data.data.ctime),
                commentNum: res.data.data.commentNum, 
                width: that.data.winWidth * 0.80 + "px",
                height: that.data.winWidth * 0.40 + "px",
                icon: res.data.data.simpleUser.icon,
                name: res.data.data.simpleUser.name,
                uid: res.data.data.uid,
                imgArr: imgArr
              });
            
              wx.request({
                url: config.getForumCommentPagerUrl,
                data: data,
                method: 'GET',
                success: function (ret) {
                  // console.log(ret.data.data);
                  // console.log(ret.data.data[0].ctime)
                  for(var j = 0;j < ret.data.data.length;j++){
                    if (ret.data.data[j].ctime){
                      ret.data.data[j].ctime = util_js.formatTimeToDay(ret.data.data[j].ctime)
                    }else{
                      ret.data.data[j].ctime = 0;
                    }
                  }
                  console.log(ret.data.data)
                  console.log(ret.data.data)
                  
                  console.log(ret.data.data)
                  console.log(ret.data.data)
                  that.setData({
                    commentInfo: ret.data.data
                  }) 
                }
              })
            }
          })
        }
      });
 
  },

  clickMe: function (e) {
    // this.setData({
    //   hiden_input: !this.data.hiden_input
    // })
    var status = this.data.status;
    if(status=='none'){
      this.setData({
        status: 'block',
        focus:true
      })
    }else{
      this.setData({
        status: 'none',
        focus:false
      })
    }
    console.log(e)
    var newtom = e.currentTarget.dataset.name;
    this.setData({
      tom: newtom,
      fromUid: e.currentTarget.id
    })
  },
  closeReply:function(e){
    var status = this.data.status;
    if (status == 'block') {
      this.setData({
        status: 'none',
        focus: false
      })
    }
  },
  openBigImage: function (e) {
    var that = this;
    console.log(that.data.imgArr)
    wx.previewImage({
      urls: that.data.imgArr // 需要预览的图片http链接列表
    })
  },
  addForumComment:function(e) {
    var that = this;
    if (!that.data.commentInfo_send){
      util_js.lessFive("请输入评论！");
      return;
    }
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        var data = { token: res.data.data.token, fid: that.data.aid, fromUid: that.data.fromUid, info: that.data.commentInfo_send};
        console.log(data)
        wx.request({
          url: config.addForumCommentUrl,
          data: data,
          method: 'GET',
          success: function (res) {
            console.log(res);
            res.data.data.ctime = util_js.formatTimeToDay(res.data.data.ctime);
            that.setData({
              commentInfo_add: [res.data.data].concat(that.data.commentInfo_add),
              commentInfo_send: "",
              commentNum: that.data.commentNum + 1
            })
            // console.log(that.data.commentInfo_add);
          }
        })
      }
    });
  },
  watchInfo: function(event) {
    const that = this;
    that.setData({
      commentInfo_send: event.detail.value
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