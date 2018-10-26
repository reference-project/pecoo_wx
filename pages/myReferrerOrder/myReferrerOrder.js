const app = getApp()
const api = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pageSize: 10,
    hidden: false,
    recommendOrder: [],
    totalCount: 0,
    hidden: false,
    baseImg: app.globalData.baseImageUrl
  },
  onShow: function () {
    
  },
 
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.recommendOrder({
      userId: app.getUserId(),
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(data => {
      this.setData({
        totalCount: data.totaoCount,
        recommendOrder: data.pageResult,
        hidden: true
      })
    })
  },
  onReachBottom: function () {
    api.recommendOrder({
      userId: app.getUserId(),
      pageNum: ++this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(data => {
      this.setData({
        pageNum: data.pageNum,
        recommendOrder: this.data.recommendOrder.concat(data.pageResult),
      })
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
  
})