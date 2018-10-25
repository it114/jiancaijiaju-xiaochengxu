//index.js
var config = require('../../../../config.js');
var util_js = require('../../../../util.js');
//获取应用实例
var app = getApp();
var calendarSignData = {};
var date;
var calendarSignDay;
Page({
  data:{
    singerRule:""
  },
  //事件处理函数
  calendarSign: function () {
    var that= this; 
    calendarSignData[date] = date;
    that.setData({
      calendarSignData: calendarSignData,
      calendarSignDay: calendarSignDay
    })
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        wx.request({
          url: config.signUserUrl,
          data: { token: res.data.data.token},
          method: 'GET',
          success: function (res) {
            wx.showToast({
              title: '签到成功',
              icon: 'success',
              duration: 2000
            })
            calendarSignData[date] = date;
            calendarSignDay = calendarSignDay + 1;
            that.setData({
              calendarSignData: calendarSignData,
              calendarSignDay: calendarSignDay
            })
          }
        })      
      }
    })
  },
  onLoad: function () {
    var that = this;
    var mydate = new Date();
    var year = mydate.getFullYear();
    var month = mydate.getMonth()+1;
    date = mydate.getDate();
    var day = mydate.getDay();

    var nbsp = 8 - ((date - day) % 7);
    var monthDaySize;
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30;
    } else if (month == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    };
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        var ajax_month = year + "" + month;
        if(month < 10){
          ajax_month = year + "0" + month;
        }

        wx.request({
          url: config.getSignByMonthUrl,
          data: { token: res.data.data.token, month: ajax_month},
          method: 'GET',
          success: function (res) {
            for(var i = 0;i < res.data.data.length;i++){
              var this_date = res.data.data[i].day.toString().slice(6,8);
              calendarSignData[this_date] = this_date;
            }
            that.setData({
              year: year,
              month: month,
              nbsp: nbsp,
              monthDaySize: monthDaySize,
              date: date,
              calendarSignData: calendarSignData
            })
          }
        })
        wx.request({
          url: config.getSineRuleUrl,
          data: { token: res.data.data.token },
          method: 'GET',
          success: function (res) {
            that.setData({
              singeRule : res.data.data
            })
          }
        })
      }
    })
  },
  onShareAppMessage: function () {
    util_js.shareApp();
  }
})
