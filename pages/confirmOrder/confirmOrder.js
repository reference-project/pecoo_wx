var app = getApp();
const api = require('../../utils/api.js');
const acc = require('../../utils/calculate.js')
// rechargeWay   03 微信  04 余额
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    hidden: false,
    curOrderDetail: {}, // 当前订单信息
    userAddress: {}, // 用户地址
    voucherList: [], // 可使用的优惠券
    voucherId: '', // 优惠券id
    voucherMoney: 0, // 优惠券金额  
    voucherCode: '', // 代金券券码  
    fareMoney: '0.00', // 抵付
    realBalanceMoney: 0, // 实付余额金额
    payMoney: 0, // 待支付
    balancePay: false, // 余额支付
    disable: false, // 余额足够 微信禁用
    paybtn: true, // 防止多次支付
    voucherHtml: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.payAuctionInfo({
      orderId: options.orderId,
      userId: app.getUserId(),
    }).then(data => {
      let voucherHtml = ''
      if (data.provideEntityList.length) {
        voucherHtml = '使用代金券'
      } else {
        voucherHtml = '无可用'
      }
      this.setData({
        curOrderDetail: data,
        userAddress: data.userAddressEntity,
        voucherList: data.provideEntityList,
        payMoney: data.realMoney,
        voucherHtml: voucherHtml,
        hidden: true
      })
    })
  },
  /**
   * 地址
   */
  changeAddressAndIdCard (obj) {
    this.setData({
      userAddress: obj
    })
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 地址选择
   */
  clickAddress () {
    wx.navigateTo({
      url: '/pages/address/address?back=1',
    })
  },
  /**
   * 选择代金券
   */
  selectedVoucher () {
    if (this.data.voucherList.length) {
      wx.navigateTo({
        url: `/pages/useVoucher/useVoucher?voucherId=${this.data.voucherId}&voucherList=${JSON.stringify(this.data.voucherList)}`,
      })
    }
  },
  /**
   * 改变优惠券
   */
  changeVoucher (obj) {
    if (obj) {
      let curVoucher = this.data.voucherList[obj.index];
      console.log(curVoucher)
      this.setData({
        voucherId: curVoucher.id,
        voucherMoney: curVoucher.actualMoney,
        voucherCode: curVoucher.voucherCode,
        voucherHtml: '-¥' + curVoucher.actualMoney
      });
    } else {
      this.setData({
        voucherId: '',
        voucherMoney: '',
        voucherCode: '',
        voucherHtml: '使用代金券'
      })
    }
    this.diffMoney();
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 计算金额
   */
  diffMoney () {
    let payMoney = 0; // 待支付的金额
    let fareMoney = this.data.fareMoney; // 抵付金额
    let useMoney = this.data.curOrderDetail.usedMoney; // 可用余额
    let realMoney = this.data.curOrderDetail.realMoney; // 商品金额
    let voucherMoney = this.data.voucherMoney; // 优惠券金额
    let realBalanceMoney = this.data.realBalanceMoney; // 实扣余额金额
    if (this.data.balancePay) { // 余额支付
      if (voucherMoney) {
        realBalanceMoney = acc.accSub(voucherMoney, realMoney); // 实扣余额金额
        if (useMoney >= realBalanceMoney) {
          this.setData({ // 禁用微信
            disable: true
          })
          fareMoney = realMoney; // 抵付金额
          payMoney = '0.00'; // 待支付
        } else {
          console.log('开启微信余额支付')
          this.setData({ // 开启微信
            disable: false
          })
          realBalanceMoney = useMoney;
          fareMoney = acc.accAdd(realBalanceMoney, voucherMoney);
          payMoney = acc.accSub(fareMoney, realMoney)
        }
      } else {
        if (useMoney >= realMoney) {
          this.setData({ // 禁用微信
            disable: true
          })
          fareMoney = realMoney;
          payMoney = '0.00'; // 待支付
        } else {
          this.setData({ // 打开微信
            disable: false
          })
          realBalanceMoney = useMoney;
          fareMoney = useMoney;
          payMoney = acc.accSub(useMoney, realMoney); // 待支付
        }
      }
    } else {
      this.setData({
        balancePay: false, // 不使用余额
        disable: false
      })
      if (voucherMoney) {
        payMoney = acc.accSub(voucherMoney, realMoney); // 商品金额-优惠卷金额
        realBalanceMoney = 0;
        fareMoney = voucherMoney;
      } else {
        payMoney = realMoney;
        fareMoney = '0.00';
        realBalanceMoney = '0.00';
      }
    }
    this.setData({
      payMoney: payMoney,
      fareMoney: fareMoney,
      realBalanceMoney: realBalanceMoney
    })
  },
  /**
   * 余额支付
   */
  balancePay () {
    this.setData({
      balancePay: !this.data.balancePay
    })
    this.diffMoney();
  },
  // 支付
  pay () {
    let that = this;
    if (!this.data.userAddress.id) {
      return app.showToast('请填写您的收货地址');
    }
    if (!this.data.paybtn) return
    this.setData({
      paybtn: false
    })
    api.auctionOrderPay({
      orderId: this.data.curOrderDetail.id,
      openId: wx.getStorageSync('wxInfo').openId,
      userId: app.getUserId(),
      voucherCode: this.data.voucherCode,
      isBalance: this.data.balancePay ? 'Y' : 'N',
      transferStatus: 'N', // 购买保险
      updateAddressId: this.data.userAddress.id, // 地址id
      actualMoney: this.data.payMoney, // 金额
      productName: this.data.curOrderDetail.goodsName, // 商品名称
      productAmount: this.data.curOrderDetail.goodsAmountRmb, // 商品金额
      rechargeWay: this.data.balancePay ? (this.data.curOrderDetail.realMoney > this.data.curOrderDetail.usedMoney ?'03' : '04') : '03', // 支付方式
    }).then(data => {
      this.setData({
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