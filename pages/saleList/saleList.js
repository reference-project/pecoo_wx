const app = getApp();
const api = require('../../utils/api.js');
const colleType = '01';
let leftH = 0, rightH = 0;
let leftList = [];
let rightList = [];
let _boxWidth = 0; // 瀑布流的图片盒子宽度
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,     
    auctionId: '', // 当前拍卖会的id
    auctionHouse: {}, // 拍卖会的数据
    loading: false,
    goodsList:[], // 会场列表数据
    _leftList: [],
    _rightList: [],
    shareCode: '', // 推荐码
    _boxWidth: '', // 盒子宽度
    pageNum: 1,
    totalCount: 0,
    baseImg: app.globalData.baseImageUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.shareCode) {
      this.setData({
        shareCode: options.shareCode
      })
      wx.setStorageSync('shareCode', options.shareCode);
    }
    wx.getSystemInfo({
      success: function (res) {
        _boxWidth = res.windowWidth / 2 - 20 - 20; // 盒子宽度
      }
    })
    api.auctionListGoods({
      userId: app.getUserId(),
      auctionId: options.id,
      pageNum: 1,
      pageSize: 10
    }).then(data => {
      this.setData({
        auctionHouse: data,
        goodsList: data.goodsList,
        auctionId: options.id,
        totalCount: data.totalCount,
        hidden: !data.totalCount ? true : false
      })
    })
  },
  loadImage (e) {
    let that = this;
    let h = e.detail.height * 1;
    let w = e.detail.width * 1;
    let scaleVal = _boxWidth * h / w // 比例值
    if (leftH <= rightH) {
      leftH = leftH + scaleVal;
      leftList.push(that.data.goodsList[e.currentTarget.dataset.index]);
    } else {
      rightH = rightH + scaleVal;
      rightList.push(that.data.goodsList[e.currentTarget.dataset.index]);
    };
    if (this.data.totalCount < 10 && leftList.length + rightList.length == this.data.totalCount) {
      this.setData({ // 这里表示后端总过数据只有不到10条
        _leftList: leftList,
        _rightList:rightList,
        hidden: true
      })
    } else if (leftList.length + rightList.length == 10 || (this.data.pageNum >= 2 && this.data.totalCount % 10 == leftList.length + rightList.length)) {
      this.setData({
        _leftList: this.data._leftList.concat(leftList),
        _rightList: this.data._rightList.concat(rightList),
        hidden: true,
        loading: false
      })
    }
  },
  onReachBottom: function () {
    if (this.data._leftList.length + this.data._rightList.length >= this.data.totalCount) return;
    let pageNum = ++this.data.pageNum;
    leftList = [];
    rightList = [];
    this.setData({
      goodsList: [], // 清空重新渲染image拿取高度
      loading: true
    })
    api.auctionListGoods({
      userId: app.getUserId(),
      auctionId: this.data.auctionId,
      pageNum: pageNum,
      pageSize: 10
    }).then(data => {
      this.setData({
        pageNum: pageNum,
        goodsList: data.goodsList
      })
    })
  },
  setCollection() {
    api.addUserCollection({
      'goodsId': this.data.auctionId,
      'userId': app.getUserId(),
      'colleType': colleType
    }).then(data => {
      let auctionHouse = this.data.auctionHouse
      auctionHouse.isCol = 'Y'
      this.setData({
        auctionHouse: auctionHouse
      })
      app.showToast('收藏成功');
    })
  },
  cancelCollection () {
    api.delUserCollection({
      goodsIds: this.data.auctionId,
      userId: app.getUserId(),
      colleType: colleType
    }).then(data => {
      let auctionHouse = this.data.auctionHouse
      auctionHouse.isCol = 'N'
      this.setData({
        auctionHouse: auctionHouse
      })
      app.showToast('已取消收藏');
    })
  },
  
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    leftList = [];
    rightList = [];
    leftH = 0;
    rightH = 0;
  },

  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    leftList = [];
    rightList = [];
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    return{
      title: this.data.startName,
      path: `/pages/saleList/saleList?id=${that.data.auctionId}&shareCode=${app.getShareCode()}`
    }
  }
})