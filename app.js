var fundebug = require('./libs/fundebug.0.9.0.min.js');
fundebug.init(
  {apikey: '0fbf2b84f05aefa6e9d24db0c080c2a18f2889788d12e78bb5bd06af4f77980d'
  });
fundebug.notify("Test", "Hello, Fundebug!")

var util_js = require('util.js');
App({
  onLaunch: function () {

    var that = this;

    // ---------------------------------验证登录开始------------------------------
          // util_js.getNewSession(function (res) {
  
          // })
    // ---------------------------------结束---------------------------


  }
})

