var config = require('../../../config.js');
var util_js = require('../../../util.js');

Page({
  data:{
    paused:false,
    envelopesshow:false,
    windowWidth:"",//窗口宽度
    windowHeigh:"",//窗口高度
    packetList:[{}],//红包队列
    packetNum:30,//总共红包的数量
    showInter:'',//  循环动画定时器
    isSelect:-1,//点击红包序号
    selectview:false,
    shareview:false,
    prizeMoney:0,
    isShare:false,
    displayStatus:'none',
    isSend : true,//验证码是否正在发送中  倒计时还没结束
    currentTime: "获取验证码",
    token:'',
    phone:'',
    userId: "",
    rootUid:"",
  },
  closepacket(){
    wx.switchTab({
      url: '/page/main/index/index',
      success:function(e) {
        wx.setStorage({//存储已经领过红包雨了！！！
          key: "should_show_share_app_mask",
          data: true
        });

        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    });

    

  },
  //打开红包
showDialog:function(){
  let that=this;

   //已经绑定手机通过分享再次点击
    if(this.data.userPhone){
      wx.request({
        url: config.selectpacket + encodeURIComponent(that.data.token),
        data:{
          // token: that.data.token,
          // username:username
        },
        method: 'post',
        success: function (res) {
          //{"success":true,"data":0.66,"code":0}
          if (res.data.data == 0) {
            wx.showModal({
              title: '获取红包失败！',
              content: '可能已经被抢光拉！点击确认之后，重试领取红包。',
              success: function (res) { }
            })
          } else {
            that.setData({
              prizeMoney: res.data.data,
              shareview: true,
              selectview: false,

            })
          }

        }

      }) 

        
    }else{
      //显示绑定界面
      this.setData({
        displayStatus:'block'
      })

    }
    
},
hideDialog:function(){
    this.setData({
      displayStatus:'none'
    })
},
watchPassPhone:function (event) {
  const that = this;
  that.setData({
    phone : event.detail.value
  })
},
watchPassCode: function (event) {
  const that = this;
  that.setData({
    code: event.detail.value
  })
},
getCode: function (e) {
  const that = this;
  if (!that.data.isSend){
    return;
  }
  if (!that.data.phone){
    util_js.errorModel("请输入手机号");
    setTimeout(function(){
      wx.hideLoading();
    },500)
    return;
  }
  that.setData({
    isSend: false
  })
  var currentTime = 60;
  var interval = setInterval(function () {
    currentTime--;
    that.setData({
      currentTime: currentTime + '秒'
    })
    if (currentTime <= 0) {
      clearInterval(interval)
      that.setData({
        currentTime: "获取验证码",
        isSend: true
      })
    }
  }, 1000) 
  // console.log(that.data.isSend)
  wx.getStorage({
    key: "userInfo",
    success: function (res) {

      console.log({ token: res.data.data.token, phone: that.data.phone, code: that.data.code })
      var data = { token: res.data.data.token, phone: that.data.phone, code: that.data.code };
      wx.request({
        url: config.createRegisterAuthCodeUrl,
        data: data,
        method: 'GET',
        success: function (res) {
          util_js.errorModel(res.data.msg);

          console.log(res)
        },
        fail:function(){
          
        }
      })
    },
    fail:function(res){
      console.log(res);
    },
    
  });
},
bangPhone : function(){
  var that = this;
  if (that.data.phone.length != 11) {
    util_js.errorModel("手机号不正确！");
    return;
  }
  wx.showLoading();
  wx.getStorage({
    key: "userInfo",
    success: function (res) {
      var data = { token: res.data.data.token, phone: that.data.phone,code:'1234' };
      //      var data = { token: res.data.data.token, phone: that.data.phone,code:that.data.code };
      wx.request({
        url: config.bangPhoneWithVerify,
        data: data,
        method: 'GET',
        success: function (res) {
          wx.hideLoading();
          if(res.data.success){
            that.setData({
              displayStatus: "none",
              userPhone: that.data.phone
            })
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
              duration: 2000
            });
            wx.showLoading();
            //打开红包
            wx.request({
              url: config.selectpacket + encodeURIComponent(that.data.token),
              data:{
                // token: that.data.token,
                // username:username
              },
              method: 'post',
              success: function (res) {
                wx.hideLoading();
                if (res.data.data == 0) {
                  wx.showModal({
                    title: '获取红包失败！',
                    content: '可能已经被抢光拉！点击确认之后，重试领取红包。',
                    success: function (res) {}
                  })
                } else {
                  that.setData({
                    prizeMoney: res.data.data,
                    shareview: true,
                    selectview: false,

                  })
                }  
              }
            }) 
            util_js.setStrg("userInfo", res.data, function () {

            });
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  });
},
  start_rain(){
    let that=this;
    that.setData({
      envelopesshow: true
    })
    that.startactivity();
  },
  clickpacket(e){
    let that=this;
    that.setData({
      isSelect: e.currentTarget.dataset.index,
    });

    setTimeout(function(){
      clearInterval(that.data.showInter);
      that.setData({
        packetList: '',
        selectview:true
      })
    },500)

  },
  startactivity(){
    let that=this;
     //建立临时红包列表
     var packetList=[];
     //建立临时红包图片数组
     var srcList = ["../../../images/red-envelopes.png","../../../images/prize.png"];
     //生成初始化红包
     for(var i=0;i<that.data.packetNum;i++){
     // 生成随机位置（水平位置）
     var left = Math.random() * that.data.windowWidth-40;
     // 优化位置，防止红包越界现象，保证每个红包都在屏幕之内
     if(left<0){
       left+=100;
     } else if (left > that.data.windowWidth){
       left-=200;
     }
     // 建立临时单个红包
     var packet = {
       src: srcList[0],
       clicksrc:srcList[1],
       angle:Math.random()*(90+1)-45,
       top: -100,
       left:left,
       speed:Math.random() * 4500+5000     //生成随机掉落时间，保证每个掉落时间保持在3秒到5.5秒之间
     }
     // 将单个红包装入临时红包列表
     packetList.push(packet);
     // 将生成的临时红包列表更新至页面数据，页面内进行渲染
     that.setData({
       packetList: packetList
     })
     }

     // 初始化动画执行当前索引
     var tempIndex=0;
     // 开始定时器，每隔1秒掉落一次红包
     that.data.showInter=setInterval(function(){
     // 生成当前掉落红包的个数，1-3个
     var showNum = Math.ceil(Math.random() * 2);
    //  console.log(tempIndex)
     // 防止数组越界
     if (tempIndex>=that.data.packetNum){
       
       // 如果所有预生成的红包已经掉落完，清除定时器
       clearInterval(that.data.showInter);
         if(!that.data.selectview){
              setTimeout(function(){
            that.setData({
              envelopesshow: false,

            });

       },4000)
         }



     }else{
       switch (showNum){

         case 1:
           //设置临时红包列表当前索引下的top值，此处top值为动画运动的最终top值 
           packetList[tempIndex].top = that.data.windowHeigh+100;
           // 当前次掉落几个红包，索引值就加几
           tempIndex+=1;
           // console.log(showNum);

           break;
         case 2:
           packetList[tempIndex].top = that.data.windowHeigh+100;
           packetList[tempIndex + 1].top = that.data.windowHeigh+100;
           tempIndex+=2;
           // console.log(showNum);

           break;
         case 3:
           packetList[tempIndex].top = that.data.windowHeigh+100;
           packetList[tempIndex + 1].top = that.data.windowHeigh+100;
           packetList[tempIndex + 2].top = that.data.windowHeigh+100;
           tempIndex += 3;
           // console.log(showNum);

           break;
           default:
           // console.log(showNum);
       }
       // 更新红包列表数据
       that.setData({
         packetList: packetList
       })
     }
     },800); 
  },

formatDateTime(inputTime) {  
  var date = new Date(inputTime);
  var y = date.getFullYear();  
  var m = date.getMonth() + 1;  
  m = m < 10 ? ('0' + m) : m;  
  var d = date.getDate();  
  d = d < 10 ? ('0' + d) : d;  
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;  
  second = second < 10 ? ('0' + second) : second; 
  return m + '.' + d 
},
  onLoad:function(options){
    let that=this;

     // 获取手机屏幕宽高
      wx.getSystemInfo({
        success: function (res) {
          console.log(res);
          that.setData({
            windowWidth: res.windowWidth,
            windowHeigh: res.windowHeight,
            top: res.windowHeight-100   //设置红包初始位置
          })
        }
      });

      //获取token
      wx.getStorage({
        key: "userInfo",
        success: function (res) {
          that.setData({
            // uid: res.data.data.id,
            userId: res.data.data.id,
            // phone: res.data.data.phone,
            token:res.data.data.token
          });
        
          if (res.data.data.rootUid) {
            that.setData({
              rootUid: res.data.data.rootUid,
            });
          }


      }
    })
  },
  onShareAppMessage: function () {
    var that = this;
    console.log('/page/main/index/index?uid=' + that.data.userId+"&rootUid="+that.data.rootUid)
    return {
      title: '点我得红包，最高100元',
      path: '/page/main/index/index?uid=' + that.data.userId + "&rootUid=" + that.data.rootUid,
      imageUrl:'../../commonResource/images/000.png',
      success: function (res) {
        wx.request({
          url: config.shareUrl,
          data: { token: that.data.token },
          success: function (res) {
            //如果没有分享过
            // if(!that.data.isShare){

              wx.showToast({
                title: '分享成功!~',
                icon: 'none',
                duration: 2000
              });

              wx.switchTab({
                url: '/page/main/index/index',
                success: function (e) {
                  wx.setStorage({//存储已经领过红包雨了！！！
                    key: "should_show_share_app_mask",
                    data: true
                  });

                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                }
              })
            // that.setData({
            //   envelopesshow:false,
            //   selectview:false,
            //   shareview:false,
            //   isShare:true

            // })
            // // }else{
            //   wx.showToast({
            //     title: '你已经分享过啦！～',
            //     icon: 'none',
            //     duration: 2000
            //   })

            // }



          }
        })
      }
    }
  }
})