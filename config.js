/**
 * 小程序配置文件
 */
// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la
//var host = "https://nanjing-web.jiancaiyg.com";
//var host = "https://web-dev.texuan.wang"; 
var host = "https://web-online.texuan.wang";
//var host = "http://proxy-wx.texuan.wang:4901";
//var host = "http://192.168.3.2:8080" ;

var config = {
  // 下面的地址配合云端 Server 工作
  // 用code换取openId
  getAllCoponUrl: host + '/coupon/getAllCoupon',//获取优惠券列表
  receiveCouponUrl:host+'/coupon/receiveAllCoupon',//领取优惠卷
  getCouponUrl: host +'/coupon/getMyCouponPagerNew',//自己的优惠券
  getNumsUrl:host+'/statistics/staticsSpecfic',
  getsecondbannerUrl:host+'/bannerSub/getBannerSubList',//一级banner下的二级bannner列表
  updateUserInfourl: host + '/user/updateUserInfo',
  registerUserByWeixinUrl: host + '/user/registerUserByWeixin',
  getpackets:host+'/redPackage/getRedPackageByPager?token=',//获取红包队列
  selectpacket:host+'/redPackage/clickRedPackage?token=',//点击打开红包
  checkphoneUrl:host+'/redPackage/checkBandPhone?token=',//检查是否绑定手机
  bangPhoneUrl: host + '/user/bangPhone',//绑定电话
  bangPhoneWithVerify: host + '/user/bangPhoneWithVerify',//绑定电话
  createRegisterAuthCodeUrl: host + '/user/createRegisterAuthCode',//获取验证码
  signUserUrl: host + '/user/signUser',//- 用户签到
  getSignByMonthUrl: host + '/user/getSignByMonth',//- - 用户的一月签到记录
  shareUrl: host + '/user/share',//- -  分享成功之后调用

  getBannerListUrl: host + '/banner/getBannerList',//获取首页banner图
  getActivityPagerUrl: host + '/activity/getActivityPager',//获取预约活动列表
  getActivityInfoUrl: host + '/activity/getActivityInfo',//获取活动详情
  attendActivityUrl: host + '/activity/attendActivity',//报名活动
  getMyActivityPagerUrl: host + '/activity/getMyActivityPager',//-获取我的活动

  getForumPagerUrl: host + '/forum/getForumPager',//- 获取论坛数据
  getForumInfoUrl: host + '/forum/getForumInfo',//- 获取论坛详情
  getForumCommentPagerUrl: host + '/forum/getCommentPager',//- 获取论坛详情里面的评论列表
  uploadImgUrl: "https://web.jiancaiyg.com/storage/handle",//上传图片
  publishForumUrl: host + '/forum/publishForum',//- 论坛  发帖
  addForumCommentUrl: host + '/forum/addForumComment',//- 论坛 回复帖子


  addGroupEntryInfoUrl: host + '/entryInfo/addGroupEntryInfo',//-- 进群信息登记
  addSigningEntryInfoUrl: host + '/entryInfo/addSigningEntryInfo',//-- 签单信息登记
  addCardInfoUrl: host + '/entryInfo/addCardInfo',//- 售卡信息登记

  getCouponPagerUrl: host + '/coupon/getCouponPager',//- 获取我的优惠券--
  getCanUseCouponCountUrl: host + '/coupon/getCanUseCouponCount',//- 获取能使用的优惠券---
  getAllAddressUrl: host + '/address/getAllAddress',//- - 获取地址列表--
  addAddressUrl: host + '/address/addAddress',//- - - 添加地址--
  delAddressUrl: host + '/address/delAddress',//- - - - 删除地址--
  updateAddressUrl: host + '/address/updateAddress',//- - - 更新地址--


  getGroupByPagerUrl: host + '/groupBy/getGroupByPager',//- -获取团购列表-
  getGoodOrderInfoUrl: host + '/groupBy/getGoodOrderInfo',//- -获取商品订单详情--
  getGoodInfoUrl: host + '/groupBy/getGoodInfo',//- -获取商品详情---
  getMyGoodOrderPagerUrl: host + '/groupBy/getNewMyGoodOrderPager',//- -获取订单列表--
  buyGoodUrl: host + '/groupBy/buyNewGood',//- -购买商品---
  payGoodUrl: host + '/groupBy/payGood',//- -支付商品----
  orderPayParamUrl: host + '/pay/orderPayParam',//- -获取支付参数----
  channelOrderUrl: host + '/groupBy/channelOrder',//- -取消订单-----
  confirmOrderUrl: host + '/groupBy/confirmOrder',//- -确认收货------
  cashMoneyUrl: host + '/wallet/cashMoney',//- -用户钱包提现------
  loadUserInfoUrl: host + '/user/loadUserInfo',//- -更新用户信息------
  addCollectUrl: host + '/collect/addCollect',//- -添加收藏------
  getCollectPagerUrl: host + '/collect/getCollectPager',//- -获取收藏列表------
  delCollectUrl: host + '/collect/delCollect',//- -删除收藏------
  getSineRuleUrl: host + '/user/getSineRule',//- -获取签到规则------


  getSpikeListUrl: host + '/spike/getSpikeList',//- -获取当前秒杀---
  getNextSplikeListUrl: host + '/spike/getNextSplikeList',//- -获取下场秒杀----
  getMoreSplikeListUrl: host + '/spike/getMoreSplikeList',//- -获取更多秒杀-----
  getSplikeInfoUrl: host + '/spike/getSplikeInfo',//- -获取秒杀商品详情------
  buyGoodSpikeUrl: host + '/spike/buyGood',//- -购买秒杀------
  addSpikeCollectUrl: host + '/collect/addSpikeCollect',//- -- 添加秒杀收藏------
  delSpikeCollectUrl: host + '/collect/delSpikeCollect',//- -- - 删除秒杀收藏------


  getBargainPagerUrl: host + '/bargain/getBargainPager',//- -获取砍价列表----
  addBargainUrl: host + '/bargain/addBargain',//- -添加砍价-----
  friendBargainUrl: host + '/bargain/friendBargain',//- -砍价------
  getBargainInfoUrl: host + '/bargain/getBargainInfo',//- -砍价详情------
  buyBargainUrl: host + '/bargain/buyBargain',//- -购买砍价商品------
  getMyBargainPagerUrl: host + '/bargain/getMyBargainPager',//- -获取我的砍价-------

  getCommentPagerUrl: host + '/groupBy/getCommentPager',//- -- 评论列表-------
  commentOrderUrl: host + '/groupBy/commentOrder'//- -评论相关-------




};

module.exports = config 