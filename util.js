//临时控制跳转

// var pagecon=0;
// function test(){
//   if(pagecon==0){
//     pagecon=pagecon+1;
//     return true


//   }
// }



var cfg_js = require('config.js');
//用户登录
function getNewSession(saveSesionOk) {
  // console.log(cfg_js.registerUserByWeixinUrl)
  wx.login({
    success: function (res) {
      // console.log(res)
      setTimeout(function(){
        wx.request({
          url: cfg_js.registerUserByWeixinUrl,
          data: { code: res.code },
          success: function (res) {
            setStrg("userInfo", res.data, function () {
              
            });
          },
          fail: function (res) {
            // console.log(res)
          }
        })
      },500)
    }
  });
}
function shareApp (){
  wx.getStorage({
    key: "userInfo",
    success: function (ret) {
      wx.request({
        url: cfg_js.shareUrl,
        data: { token: ret.data.data.token },
        success: function (res) {
          console.log(res)
        }
      })
      console.log('/page/main/index/index?uid=' + 56126251)
      var shareObj = {
        title: '家居mall',
        path: '/page/main/index/index?uid=' + 56126251
      }
      
      return shareObj;
    }
  })
  
}

//获取所有备忘列表
function memoList(session, success) {
  var url = cfg_js.memoListURI;
  post(url, {}, function (res) {
    success(res)
  })
}

function toFixed(num, s) {
  var times = Math.pow(10, s)
  var des = num * times + 0.5
  des = parseInt(des, 10) / times
  return des + ''
}

//压缩图片  并且做变形处理
function getImgByThisSize(url, showWidth, showHieght) {
  if (url) {
    if (url.indexOf("/storage/") != (-1)) {
      var s1 = url.split("/storage/");
    } else if (url.indexOf("/guagua/") != (-1)) {
      var s1 = url.split("/guagua/");
    }
    var group = s1[1].split("*");
    var orgWidth = parseFloat(group[0]);
    var orgHeight = parseFloat(group[1]);
    var width = Math.round(showWidth * 3);
    if (width < orgWidth) {
      var imgTypes = url.substring(url.lastIndexOf("."));
      var imgName = url.split(imgTypes)[0] + "_" + width + "_0";
      url = imgName + imgTypes;
    }
    return getImgSizeBySize(url, showWidth, showHieght);
  }
}


//压缩图片
function comperssImge(url, showWidth) {
  if (url) {
    if (url.indexOf("/storage/") != (-1)) {
      var s1 = url.split("/storage/");
    } else if (url.indexOf("/guagua/") != (-1)) {
      var s1 = url.split("/guagua/");
    }
    var group = s1[1].split("*");
    var orgWidth = parseFloat(group[0]);
    var orgHeight = parseFloat(group[1]);
    var width = Math.round(showWidth * 3);
    if (width < orgWidth) {
      var imgTypes = url.substring(url.lastIndexOf("."));
      var imgName = url.split(imgTypes)[0] + "_" + width + "_0";
      url = imgName + imgTypes;
    }
    return url;
  }
}

function getHeightFromWidth(realWidth, realHeight, thumWidth) {
  var thumHeight = Math.round((thumWidth / realWidth) * realHeight);//显示宽度除以图片真实宽度 乘以 图片真实高度
  return thumHeight;
}


//截取照片
function getImgSizeBySize(url, showWidth, showHieght) {
  var realSize = getImageRealSize(url);
  var thumSize = { w: showWidth, h: showHieght };
  var h = getHeightFromWidth(realSize.w, realSize.h, thumSize.w);

  //判断高度是否超出；大于，图片不够显示，截左右
  if (thumSize.h > h) {
    var w = getHeightFromWidth(realSize.h, realSize.w, thumSize.h);//肯定超出去
    var over = 0 - Math.round((w - thumSize.w) / 2);//左右截取
    //margin-left: 17px;margin-right: 17px
    var obj = { url: url, style: "margin-left:" + over + "px" + "; margin-right:" + over + "px;height:" + showHieght + "px;width:" + w+"px" };
    //var obj={over:over,type:1}
    return obj;
  } else {
    var over = 0 - Math.round((h - thumSize.h) / 2);
    var obj = { url: url, style: "margin-top:" + over + "px" + ";margin-bottom:" + over + "px;width:" + showWidth + "px;height:" + h+"px" };
    // var obj={over:over,type:2}
    return obj;
  }

}


//获取图片真实尺寸
function getImageRealSize(url) {
  //  if(url.startWith("http")){
  if (url.indexOf("/storage/") != (-1)) {
    var s1 = url.split("/storage/");
  } else if (url.indexOf("/guagua/") != (-1)) {
    var s1 = url.split("/guagua/");
  }
  var group = s1[1].split("*");
  var orgWidth = parseFloat(group[0]);
  var orgHeight = parseFloat(group[1]);
  var obj = { w: orgWidth, h: orgHeight };
  return obj;
  //  }
}

function getHeightFromWidth(realWidth, realHeight, thumWidth) {
  var thumHeight = Math.round((thumWidth / realWidth) * realHeight);//显示宽度除以图片真实宽度 乘以 图片真实高度
  return thumHeight;
}

//set本地存储
function setStrg(key, value, success) {
  wx.setStorage({
    key: key,
    data: value,
    success: function (res) {
      success(res)
    }
  })
}

//get本地存储
function getStrg(key, success) {
  wx.getStorage({
    key: key,
    success: function (res) {
      success(res)
    }
  })
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTimeToDay(numbers) {
    var format = 'Y-M-D';
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

  var date = new Date(numbers);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  }


//封装post请求
function post(url, data, success) {
  wx.request({
    url: url,
    data: data,
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      success(res)
    }
  })
}

//封装get请求
function got(url, data, success) {
  wx.request({
    url: url,
    data: data,
    header: { 'content-type': 'application/json' },
    success: function (res) {
      success(res)
    }
  })
}

//一些showToast
function lessFive(title,time) {
  wx.showToast({
    title: title,
    icon: 'loading',
    duration: time || 1000
  })
}
function errorModel(title,time) {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: time || 1000
  })
}




//获取所有日志列表
function scheduleList(session, date, success) {
  var url = cfg_js.scheduleListURI;
  var data = { remind_date: date }
  got(url, data, success)
}


//点击footer的添加操作
function footer() {
  wx.showActionSheet({
    itemList: ['新增日程', '新增备忘'],
    success: function (res) {
      if (!res.cancel) {
        if (res.tapIndex == 0) {
          wx.navigateTo({ url: '../startVoice/index?redirect=schedule' })
        } else {
          wx.navigateTo({ url: '../startVoice/index?redirect=memo' })
        }
      }
    }
  })
}

//点击备忘导航
function forBw() {
  wx.redirectTo({ url: '../listMemo/index' })
}

//点击备忘导航
function forRc() {
  wx.redirectTo({ url: '../listSchedule/index' })
}

//微信录音api
function startVoive(success) {
  wx.startRecord({
    success: function (res) {
      success(res)
    }
  })
}

//微信上传文件API(将语音识别成文字方法)
function upload(session, filePath, success, fail) {
  wx.uploadFile({

    url: cfg_js.speechRecURI,
    filePath: filePath,
    name: 'file',
    success: function (res) {
      success(res)
    },
    fail: function () {
      fail()
    }
  })
}

// //语音解析失败弹窗
// function unknowVoice() { } {
//   wx.showToast({
//     title: '解析失败',
//     icon: 'loading',
//     duration: 2000
//   })
// }

//将文字转义解析
function analysis(data, success) {
  var url = cfg_js.analysisURI;
  got(url, data, success)
}

//删除日志
function deleteSchedule(data, success) {
  var url = cfg_js.deleteScheduleURI;
  got(url, data, success)
}

//更新日志
function updateScheDule(session, data, success) {
  var url = cfg_js.updateScheDuleURI;
  post(url, data, success)
}


//定时推送消息至微信模板
function pushWx(session) {
  var now = new Date();
  var nowTime = dataformat(now, "yyyy-MM-dd hh:mm");

  var url = cfg_js.alarmURI;
  var data = {
    session: session
  };

  got(url, data, function (res) {
    for (var i = 0; i < res.data.length; i++) {
      var formId = res.data[i].form_id
      var date = res.data[i].remind_date
      var time = res.data[i].remind_time
      var befortime = res.data[i].advance_notice
      var content = res.data[i].remind_content

      if (befortime == undefined || befortime == "") {
        befortime = 0
      }
      var clockTimestamp = Date.parse(date.replace(/-/g, '/') + " " + time);//闹钟时间
      var beforTimestamp = Number(befortime) * 60000;//提前分钟
      var resulTime = dataformat(new Date(clockTimestamp - beforTimestamp), 'yyyy-MM-dd hh:mm');//最终闹钟

      // console.log("闹钟："+new Date(clockTimestamp),
      //"提前时间："+beforTimestamp,"最终时间："+new Date(resulTime))
      if (nowTime == resulTime) {
        console.log(resulTime + "的闹钟响啦！");
        muban(formId, date, time, content, session);
      } else { console.log("有闹钟，但还不到时候") }
    }
  })

}





//模板
function muban(formId, data, time, content, session) {
  // console.log("模板发送成功")
  // console.log("给模板信息：","formId:",formId,"日期：",data,"时间:",time,"内容:",content)

  var url = cfg_js.gets('sendMsg');
  var data = {
    "session": session,
    "touser": "",
    "template_id": "8p4RgJmZdYei7dkpAXmhEaWYZFbSd0C3CSklCdFGFiE",
    "page": "",
    "form_id": formId,
    "data": {
      "keyword1": { "value": time, "color": "#173177" },
      "keyword2": { "value": content, "color": "#173177" }
    }
  }
  got(url, data, function (res) {
    console.log("模板发送成功" + res)
  })
}

function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  url = decodeURIComponent(url)
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

function tryDecodeURIComponent(value) {
  if (value) {
    try {
      return decodeURIComponent(value);
    } catch (err) {
      return value;
    }
  }
  return "";
}

module.exports = {
  // test:test,
  getNewSession: getNewSession,
  tryDecodeURIComponent: tryDecodeURIComponent,
  setStrg: setStrg,
  getStrg: getStrg,
  post: post,
  got: got,
  errorModel:errorModel,
  lessFive: lessFive,
  formatTimeToDay: formatTimeToDay,
  scheduleList: scheduleList,
  footer: footer,
  forBw: forBw,
  forRc: forRc,
  startVoive: startVoive,
  upload: upload,
  toFixed: toFixed,
  analysis: analysis,
  deleteSchedule: deleteSchedule,
  updateScheDule: updateScheDule,
  pushWx: pushWx,
  muban: muban,
  GetRequest: GetRequest,
  getImgByThisSize: getImgByThisSize,
  getImgSizeBySize: getImgSizeBySize,
  formatTimeToDate: formatTimeToDay,
  shareApp: shareApp

}
