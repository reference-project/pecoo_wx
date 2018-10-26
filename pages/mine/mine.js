var app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    isCertificated: null, // 是否实名认证
    buyStatus: '', // 是否首单购买
    realName: '', // 真实姓名
    userName: '', // 用户名
    isChannel:'', // 渠道
    taskCertificated: '', //是否实名认证任务
    wxNickName:'拍库',
    msgCount: 0,
    wxHeadImage: '', // 头像
    process: [ // 流程 eg:待发货
      {
        url: '/pages/myOrder/myOrder?status=3',
        image: 'mine/pedding_payment.png',
        name: '待付款',
        width: '45rpx',
        height: '38rpx',
        isLogin: true
      },
      {
        url: '/pages/myOrder/myOrder?status=4',
        image: 'mine/pedding_delivery.png',
        name: '待发货',
        width: '44rpx',
        height: '42rpx',
        isLogin: true
      },
      {
        url: '/pages/myOrder/myOrder?status=5',
        image: 'mine/pedding_goods.png',
        name: '待收货',
        width: '43rpx',
        height: '42rpx',
        isLogin: true
      },
      {
        url: '/pages/myOrder/myOrder?status=6',
        image: 'mine/complete.png',
        name: '已完成',
        width: '44rpx',
        height: '42rpx',
        isLogin: true
      }
    ],
    myFn: [
      {
        url: '/pages/myCollect/myCollect',
        image: 'mine/my_collection.png',
        name: '我的收藏',
        isLogin: true
      },
      {
        url: '/pages/voucher/voucher',
        image: 'mine/coupon.png',
        name: '优惠券',
        isLogin: true
      },
      {
        url: '/pages/myWallet/myWallet',
        image: 'mine/wallet.png',
        name: '我的钱包',
        isLogin: true
      },
      {
        url: '/pages/goldShop/goldShop',
        image: 'mine/gold.png',
        name: '金币商城',
        isLogin: false
      },
      {
        url: '/pages/myReferrer/myReferrer',
        image: 'mine/qr_code.png',
        name: '我的推荐',
        isLogin: true
      },
      {
        url: '/pages/set/set',
        image: 'mine/set.png',
        name: '设置',
        isLogin: false
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let userId = app.getUserId();
    console.log(userId)
    let that = this;
    if (userId) {
      let myUserInfo = api.myUsreInfo({
        id: userId
      }).then(data => {
        return data
      })
      let messageCount = api.queryMessageListCount({
        userId: userId
      }).then(data => {
        return data
      })
      Promise.all([myUserInfo, messageCount]).then(function (data) {
        let userInfo = wx.getStorageSync('userInfo');
        userInfo.userName = data[0].userName;
        userInfo.realName = data[0].realName;
        userInfo.userImage = data[0].headImage;
        userInfo.isCertificated = data[0].isCertificated;
        userInfo.buyStatus = data[0].taskBuy;
        wx.setStorageSync('userInfo', userInfo);
        that.setData({
          userName: userInfo.userName,
          realName: userInfo.realName,
          userImage: userInfo.userImage || that.data.baseImg+'common/logo.png',
          isCertificated: userInfo.isCertificated,
          buyStatus: userInfo.buyStatus,
          msgCount: data[1],
          taskCertificated: data[0].taskCertificated
        })
      })
    } else {
      this.setData({
        userName: '',
        realName: '',
        userImage: this.data.baseImg + 'common/logo.png',
        isCertificated: '',
        taskCertificated: '',
        buyStatus: '',
        msgCount: 0
      })
    }
  },
  callme () {
    wx.makePhoneCall({
      phoneNumber: '4001112016',
    })
  },
  goMyLetters (e) {
    app.isLoginGo().then(data => {
      if (data) {
        wx.navigateTo({
          url: '/pages/myLetter/myLetter',
        })
      } else {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    })
  },
  goOrder () {
    api.isLogin({}).then(data => {
      if (data == 'Y') {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      } else {
        wx.navigateTo({
          url: '/pages/myOrder/myOrder',
        })
      }
    })
  },
  goPages (e) {
    let obj = e.currentTarget.dataset;
    if (obj.islogin) {
      api.isLogin({}).then(data => {
        if (data == 'Y') {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          wx.navigateTo({
            url: obj.url,
          })
        }
      })
    } else {
      wx.navigateTo({
        url: obj.url,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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


})