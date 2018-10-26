const app = getApp();
const api = require('../../utils/api.js');
const acc = require('../../utils/calculate.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    payType: false, // 余额支付
    disable: false, // 余额足够
    orderId: '', // 订单id
    orderDetail: {},
    paybtn: true, // 防止多次点击支付
    realBalanceMoney: 0, // 实付余额金额
    baseImg: app.globalData.baseImageUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.luxuryOrderDetail({
      orderId: options.orderId,
      userId: app.getUserId(),
    }).then(data => {
      let addressInfo = {};
      this.setData({
        orderId: options.orderId,
        orderDetail: data,
        payMoney: data.priceTotal,
        hidden: true
      })
    })
  },

  changePay () {
    this.setData({
      payType: !this.data.payType
    })
    this.diffMoney()
  },

  diffMoney () {
    let payMoney = ''; // 应支付的金额
    let realMoney = this.data.orderDetail.priceTotal; // 支付合计
    let useMoney = this.data.orderDetail.usedMoney; // 可用余额
    let realBalanceMoney = this.data.realBalanceMoney; // 实扣余额金额
    if (this.data.payType) {
      if (realMoney > useMoney) {
        this.setData({
          disable: false
        })
        payMoney = acc.accSub(useMoney, realMoney); // 再次支付金额
        realBalanceMoney = useMoney; // 实扣余额金额
      } else {
        this.setData({
          disable: true
        })
        payMoney = '0.00';
        realBalanceMoney = realMoney;
      }
    } else {
      this.setData({
        disable: false
      })
      payMoney = realMoney;
      realBalanceMoney = 0;
    }
    this.setData({
      payMoney: payMoney,
      realBalanceMoney: realBalanceMoney
    })
  },

  pay () {
    let that = this;
    if (!this.data.paybtn) return
    this.setData({
      paybtn: false
    })
    api.luxuryOrderPay({
      orderId: this.data.orderId,
      userId: app.getUserId(),
      voucherCode: '',
      openId: wx.getStorageSync('wxInfo').openId,
      isBalance: this.data.payType ? 'Y' : 'N',
      transferStatus: 'N', // 购买保险
      updateAddressId: this.data.orderDetail.addressId, // 地址id
      actualMoney: this.data.payMoney, // 金额
      rechargeWay: this.data.payType ? (this.data.orderDetail.priceTotal > this.data.orderDetail.usedMoney ? '03' : '04') : '03', // 商品总价大于可用余额。使用余额和微信混合支付，传03  否04
    }).then(data => {
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
              that.setData({
                paybtn: true
              })
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
    }).catch(err => {
      this.setData({
        paybtn: true
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('ready')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('show')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('hide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('unload')
  },

})