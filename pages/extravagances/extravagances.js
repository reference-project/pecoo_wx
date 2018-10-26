const app = getApp()
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImageUrl,
    banners: [],
    luxuryStory: [],
    totalCount: 0,
    pageNum: 1,
    pageSize: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let luxuryBanner = api.luxuryBanner({
      userId: app.getUserId(),
      displayTerminal: 1
    }).then(data => {
      return data.bannerList
    });
    let luxuryGoodsNew = api.luxuryGoodsNew({
      userId: app.getUserId(),
      pageNum: 1,
      pageSize: 10
    }).then(data => {
      return data
    })
    let luxuryStory = api.luxuryStory({
      userId: app.getUserId(),
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(data => {
      return data
    });
    Promise.all([luxuryBanner, luxuryGoodsNew, luxuryStory]).then( data => {
      this.setData({
        luxuryBanner: data[0],
        luxuryGoodsNew: data[1].pageResult,
        luxuryStory: data[2].pageResult,
        totalCount: data[2].totalCount
      })
    })
  },
  searchProduct () {
    wx.navigateTo({
      url: '/pages/extravagancesSearch/extravagancesSearch',
    })
  },
  jump(e) {
    let obj = e.currentTarget.dataset;
    app.handleJump(obj.gotourl, obj.gotoid, obj.gototype, obj.gotokind)
  },
  // takePhoto() {
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1, // 默认9  
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
  //     success: function (res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
  //       that.setData({
  //         tempFilePaths: res.tempFilePaths
  //       })
  //     }
  //   })
  // },
  onShareAppMessage: function () {
    
  },
  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },
  onReachBottom: function () {
    if (this.data.luxuryStory.length >= this.data.totalCount) return
    this.setData({
      loading: true
    })
    api.luxuryStory({
      userId: app.getUserId(),
      pageNum: ++this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(data => {
      this.setData({
        loading: false,
        pageNum: data.pageNum,
        luxuryStory: this.data.luxuryStory.concat(data.pageResult)
      })
    });
  }
})