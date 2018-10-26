var app = getApp();
const api = require('../../utils/api.js')
const acc = require('../../utils/calculate.js')
var detailB = true;
var orderId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    hidden: false,
    disable: false,
    curOrderDetail: {}, // 当前支付信息
    fareMoney: '0.00', // 抵付
    payMoney: 0, // 待支付
    wxPay: true, // 微信支付
    balancePay: false, // 余额支付
    paybtn: true, // 防止多次支付
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.payAuctionInfo({
      orderId: options.orderId,
      userId: app.getUserId()
    }).then(data => {
      this.setData({
        curOrderDetail: data,
        payMoney: data.realMoney,
        hidden: true
      })
    })
  },
  // 微信支付
  changeWxPay () {
    if (this.data.disable) return
    this.setData({
      wxPay: !this.data.wxPay
    })
  },
  // 余额
  changeBalancePay () {
    this.setData({
      balancePay: !this.data.balancePay
    })
    let userMoney = this.data.curOrderDetail.usedMoney; // 可用余额
    if (this.data.balancePay) {
      if (userMoney >= this.data.curOrderDetail.realMoney) {
        this.setData({
          payMoney: '0.00',
          fareMoney: this.data.curOrderDetail.realMoney,
          disable: true
        })
      } else { // 余额和微信一起支付
        let fareMoney = userMoney; // 抵付金额
        let payMoney = acc.accSub(fareMoney, this.data.curOrderDetail.realMoney); // 再需支付金额
        this.setData({
          payMoney: payMoney,
          fareMoney: fareMoney ? fareMoney : '0.00',
          disable: false
        })
      }
    } else {
      this.setData({
        disable: false,
        fareMoney: '0.00',
        payMoney: this.data.curOrderDetail.realMoney
      })
    }
  },
  // 支付
  pay () {
    let that = this;
    if (!this.data.paybtn) return
    this.setData({
      paybtn: false
    })
    api.auctionOrderPay({
      sourceMode: 'MINI',
      tokenId: wx.getStorageSync('userInfo').tokenId,
      openId: wx.getStorageSync('wxInfo').openId,
      orderId: this.data.curOrderDetail.id,
      userId: app.getUserId(),
      rechargeWay: this.data.balancePay ? (this.data.curOrderDetail.realMoney > this.data.curOrderDetail.usedMoney ? '03' : '04') : '03',
      isBalance: this.data.balancePay ? 'Y' : 'N',
      transferStatus: 'N',
      payType: '02',
      productQuantity: 1,
      updateAddressId: this.data.curOrderDetail.addressId,
      productName: this.data.curOrderDetail.goodsName, // 商品名称
      productAmount: this.data.curOrderDetail.goodsAmountRmb, // 商品金额
      actualMoney: this.data.payMoney
    }).then(data => {
      that.setData({
        paybtn: true
      })
      if (data.wxpayinfo) {
        let wxPayInfo = JSON.parse(data.wxpayinfo);
        wx.requestPayment({
          'timeStamp': wxPayInfo.timestamp,
          'nonceStr': wxPayInfo.noncestr,
          'package': wxPayInfo.package,
          'signType': wxPayInfo.signType,
          'paySign': wxPayInfo.finalsign,
          'success': function (res) {
            app.showToast("支付成功", 'success', function () {
              wx.navigateBack({
                delta: 1,
              })
            })
          },
          'fail': function () {
            that.setData({
              paybtn: true
            })
          }
        })
      } else {
        app.showToast("支付成功", 'success', function () {
          that.setData({
            paybtn: true
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        })
      }
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

})