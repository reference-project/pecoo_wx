const app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    hidden: false,
    curOrderDetail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.getAuctionOrderDetail({
      orderId: options.orderId,
      userId: app.getUserId()
    }).then(data => {
      data.totalNopremiumRmb = app.toDecimal2(data.totalNopremiumRmb);
      data.goodsAmount = app.toDecimal2(data.goodsAmount);
      data.goodsAmountRmb = app.toDecimal2(data.goodsAmountRmb);
      data.commission = app.toDecimal2(data.commission);
      data.serviceFee = app.toDecimal2(data.serviceFee);
      data.totalFreight = app.toDecimal2(data.totalFreight);
      data.totalFreightRmb = app.toDecimal2(data.totalFreightRmb);
      data.freight = app.toDecimal2(data.freight);
      this.setData({
        curOrderDetail: data,
        hidden: true
      })
    })
  },
  // 联系客服
  callMe () {
    wx.makePhoneCall({
      phoneNumber: '400-1112-016'
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
  
  }
  
})