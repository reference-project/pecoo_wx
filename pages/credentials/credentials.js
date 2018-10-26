const app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    certificatesList: [],
    pageNum: 1,
    back: '',
    pageSize: 10,
    orderId: '', // 当前订单
    receiveName: '' // 收货地址的姓名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      back: options.back || 0,
      orderId: options.orderId || '',
      receiveName: options.receiveName || ''
    })
  },

  del (e) {
    let that = this;
    app.showModal('您确定删除吗？', function () {
      let obj = e.currentTarget.dataset
      api.delUserCard({
        userId: app.getUserId(),
        id: obj.id
      }).then(result => {
        that.data.certificatesList.splice(obj.index, 1);
        that.setData({
          certificatesList: that.data.certificatesList
        })
        if (that.data.back) {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.reviceCredentials(that.data.certificatesList)
        }
      }) 
    }, function () {
      console.log('用户点击取消')
    })
  },
  edit (e) {
    wx.navigateTo({
      url: `/pages/uploadCard/uploadCard?id=${e.currentTarget.dataset.id}`,
    })
  },
  clickEvent (e) {
    let curCredential = this.data.certificatesList[e.currentTarget.dataset.index];
    if (this.data.receiveName) {
      if (curCredential.realName == this.data.receiveName) {
        api.luxuryBindCard({
          orderId: this.data.orderId,
          cardId: curCredential.id,
          userId: app.getUserId()
        }).then(data => {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.bindIdCard(curCredential)
        })
      } else {
        app.showToast('收货人姓名必须与清关证件姓名一致');
      }
    } else if (this.data.back) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.changeIdCard(curCredential)
    }
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
    api.userIdCardList({
      userId: app.getUserId(),
      pageNum: this.data.pageNum,
      pageSize: 10
    }).then(data => {
      this.setData({
        certificatesList: data.pageResult
      })
    })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})