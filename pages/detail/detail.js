const app = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const bidRule = require('../../utils/bidRule.js');
var zhText;
const colleType = '02'; // 拍品的收藏
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '', // 商品id
    banner: [], // 轮播图
    priceUnit: '', // 金钱符号
    estimateMin: '', // 最小估计值
    startPrice: '', // 开始价格
    priceValue: '', // 出价价格
    estimateOffer: '', // 预估报价
    priceRate: '', // 汇率
    goodsName: '', // 英文商品名称
    goodsNameCh: '', // 中文商品名
    goodsDesc: '', // 英文拍品信息
    goodsDescCh: '', // 中文拍品详情信息
    isCollection: '', // 是否收藏
    lotNum: '', // 和商品名称做拼接  
    goodsDetailImages: [], // 商品详情图片
    address: '', // 竞拍地点
    auctionName: '', // 所属拍会名称
    auctionId: '', // 拍会Id
    nowStartPrice: '', // 当前价格
    bidNo: '', // 多少人参与竞拍
    firstPicUrl: '', // 第一张图片
    translate: false, // 不翻译，正常英文
    totalPrice: '', // 合计金额
    totalMoney: '', // 金额转换人民币
    voiceUrl: '', // 语音播报的url
    bidsBox: false, // 我要出价的的弹框
    sugBox: false, // 推荐出价的弹框
    voiceFlag: false, // 语音
    suggestPrice: [], // 建议报价
    animationData: {}, // 动画
    disable: false, // 防止二次下单
    orderType: '01', // 竞拍订单
    reduceColor: false,
    baseImg: app.globalData.baseImageUrl,
    likeList: [],
    shareCode: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    if (options.shareCode) {
      this.setData({
        shareCode: options.shareCode
      })
      wx.setStorageSync('shareCode', options.shareCode);
    }
    let that = this;
    let goodsDetailData = api.getGoodsDetailData({
      userId: app.getUserId(),
      goodsId: options.id
    }).then(data => {
      return data
    })
    let likeData = api.goodsLikeList({
      userId: app.getUserId(),
      goodsId: options.id
    }).then(data => {
      return data
    })
    Promise.all([goodsDetailData, likeData]).then(function (data) {
      let priceNumber = '' // 这里是我要出价以后的默认价格
      let val = '';
      if (data[0].nowStartPrice) {
        if (data[0].nowStartPrice > data[0].estimateMin) {
          val = data[0].nowStartPrice
          priceNumber = that.diffPrice(val)
        } else {
          priceNumber = data[0].estimateMin
        }
      } else {
        if (data[0].estimateMin && data[0].estimateMin > data[0].startPrice) {
          priceNumber = data[0].estimateMin;
        } else {
          val = data[0].startPrice;
          priceNumber = that.diffPrice(val);
        }
      }
      that.setData({
        id: data[0].id,
        banner: data[0].auctionGoodsPics,
        firstPicUrl: data[0].auctionGoodsPics[0] && data[0].auctionGoodsPics[0].bigPicUrl || '',
        priceUnit: data[0].priceUnit,
        startPrice: data[0].startPrice,
        nowStartPrice: data[0].nowStartPrice,
        estimateMin: data[0].estimateMin,
        estimateMax: data[0].estimateMax,
        priceValue: priceNumber,
        estimateOffer: data[0].estimateMin ? data[0].priceUnit + data[0].estimateMin + '-' + data[0].priceUnit + data[0].estimateMax : '暂无',
        bidNo: data[0].bidNo,
        priceRate: data[0].priceRate,
        goodsName: data[0].goodsName,
        goodsDesc: data[0].goodsDesc ? data[0].goodsDesc : '暂无详情信息',
        goodsNameCh: data[0].goodsNameCh,
        isCollection: data[0].isCollection,
        lotNum: data[0].lotNum,
        auctionId: data[0].auctionId,
        auctionName: data[0].auctionName,
        startTime: data[0].startTime,
        address: data[0].address,
        goodsDetailImages: data[0].auctionGoodsDetailImages,
        totalPrice: (priceNumber * 1.4).toFixed(2),
        totalMoney: (priceNumber * 1.4 * data[0].priceRate).toFixed(2),
        likeList: data[1],
        hidden: true
      })
    })
  },
  callMe(){
    wx.makePhoneCall({
      phoneNumber: '4001112016',
    })
  },
  // 计算价格
  diffPrice (val) {
    let priceNumber = ''
    if (val < 100) {
      priceNumber = val + 10
    } else if (val >= 100 && val < 500) {
      priceNumber = val + 50
    } else if (val >= 100 && val < 500) {
      priceNumber = val + 50
    } else if (val >= 500 && val < 1000) {
      priceNumber = val + 100
    } else if (val >= 1000 && val < 2000) {
      priceNumber = val + 200
    } else if (val >= 2000 && val < 5000) {
      priceNumber = val + 250
    } else if (val >= 5000 && val < 10000) {
      priceNumber = val + 500
    } else if (val >= 10000 && val < 20000) {
      priceNumber = val + 1000
    } else {
      priceNumber = val + 1500
    }
    return priceNumber
  },
  // 查看大图
  lookBig (e) {
    let index = e.currentTarget.dataset.index;
    let banner = [];
    this.data.banner.forEach(ele => {
      banner.push(ele.bigPicUrl)
    })
    wx.previewImage({
      current: banner[index],
      urls: banner,
    })
  },
  // 翻译
  translate () {
    if (this.data.goodsDescCh && this.data.goodsNameCh) {
      this.setData({
        translate: !this.data.translate
      })
    } else {
      api.goodsTranslate({
        userId: app.getUserId(),
        goodsId: this.data.id
      }).then(data => {
        this.setData({
          goodsNameCh: data.goodsNameCh,
          goodsDescCh: data.goodsDescCh,
          translate: !this.data.translate
        })
      })
    }
  },
  // 语音播报
  voicePlay() {
    this.setData({
      voiceFlag: !this.data.voiceFlag
    })
    let content = ''
    let voiceUrl = "http://fanyi.sogou.com/reventondc/microsoftGetSpeakFile?from=translateweb&amp;spokenDialect=zh-CHS&amp;text="
    if (this.data.goodsDescCh) {
      content = encodeURI(encodeURI(this.data.goodsDescCh));
      this.setData({
        voiceUrl: voiceUrl + content
      })
    } else {
      api.goodsTranslate({
        userId: app.getUserId(),
        goodsId: this.data.id
      }).then(data => {
        this.setData({
          goodsNameCh: data.goodsNameCh,
          goodsDescCh: data.goodsDescCh,
          translate: true
        })
        content = encodeURI(encodeURI(data.goodsDescCh));
        this.setData({
          voiceUrl: voiceUrl + content
        })
      })
    }
    if (this.data.voiceFlag) {
      this.audioCtx.play()
    } else {
      this.audioCtx.pause()
    }
  },
  audioEnd (e) {
    this.setData({
      voiceFlag: !this.data.voiceFlag
    })
  },
  // 出价的input框的值
  priceInput:function(e){
    this.setData({
      priceValue: e.detail.value,
      totalPrice: (e.detail.value * 1.4).toFixed(2),
      totalMoney: (e.detail.value * 1.4 * this.data.priceRate).toFixed(2),
    })
  },
  // 隐藏我要出价的弹框
  shadeHide(){
    let animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    })
    this.animation = animation
    this.animation.translateY(500).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
    setTimeout(function () {
      this.setData({
        bidsBox: false,
        sugBox: false
      })
    }.bind(this), 720)
  },
  // 设置收藏
  setCollection () {
    api.addUserCollection({
      'goodsId': this.data.id,
      'userId': app.getUserId(),
      'colleType': colleType
    }).then(data => {
      this.setData({
        isCollection: 'Y'
      })
      app.showToast('收藏成功');
    })
  },
  // 取消收藏
  cancelCollection () {
    api.delUserCollection({
      'goodsIds': this.data.id,
      'userId': app.getUserId(),
      'colleType': colleType
    }).then(data => {
      this.setData({
        isCollection: 'N'
      })
      app.showToast('已取消收藏');
    })
  },
  // 减价
  priceMin:function(){
    let curPrice = parseInt(this.data.priceValue);
    let proPrice = this.data.nowStartPrice ? parseInt(this.data.nowStartPrice) : parseInt(this.data.startPrice);
    let price_Value = bidRule.reduceMoney(curPrice, proPrice);
    if (price_Value == proPrice) {
      this.setData({
        reduceColor: false
      })
    }
    this.setData({
      priceValue: price_Value,
      totalPrice: (price_Value * 1.4).toFixed(2),      
      totalMoney: (price_Value * 1.4 * this.data.priceRate).toFixed(2)
    })
  },
  // 加价
  priceAdd:function(){
    let curPrice = parseInt(this.data.priceValue);
    if (!curPrice) {
      curPrice = 0;
    }
    let price_Value = bidRule.addMoney(curPrice);
    this.setData({
      reduceColor: true,
      priceValue: price_Value,
      totalPrice: (price_Value * 1.4).toFixed(2),      
      totalMoney: (price_Value * 1.4 * this.data.priceRate).toFixed(2)
    })
  },
  // 授权成功
  success (data) {
    let wxInfo = {}
    wxInfo.nickName = data.nickName
    wxInfo.picAddress = data.avatarUrl
    wxInfo.openId = data.openid
    wx.setStorageSync('wxInfo', wxInfo);
    if (res) {
      this.setData({
        bidsBox: true
      })
    }
  },
  // 授权失败
  failed (err) {
    return false
  },
  // 我要出价来判断是否授权
  goBids () {
    if (!app.getUserId()) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    let wxInfo = wx.getStorageSync('wxInfo');
    if (!wxInfo.openId) {
      app.getUserInfo(this.success.bind(this), this.failed.bind(this))
    } else {
      this.setData({
        bidsBox: true
      })
      let animation = wx.createAnimation({
        duration: 500,  // 动画时长
        timingFunction: "ease", // 线性
      });
      this.animation = animation
      setTimeout(function () {
        this.animation.translateY(0).step()
        this.setData({
          animationData: this.animation.export()
        })
      }.bind(this), 200)
    }
  },
  // 出价的弹出框隐藏
  detailBidNone: function () {
    this.setData({
      shadeBlack: false,
      bidDivHide: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('myAudio');
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  //我要出价
  isHaveMoney () {
    if (app.getUserId()) {
      console.log(app.getUserId())
    }
    let oldPrice = parseFloat(this.data.startPrice); // 目前最高价
    let money = this.data.priceValue;		//输入的价格
    if (!money) {
      return app.showToast('请输入价格！');
    }
    let reg = /^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
    if (!reg.test(money)) {
      return app.showToast('请输入正确的数字！');
    };
    money = parseFloat(money);
    if (oldPrice == "") {
      oldPrice = 0;
    }
    if (money <= oldPrice) {
      return app.showToast('出价金额不得小于起拍价');
    }
    //给出推荐价格数组
    if (money != 0) {
      let list = new Array();
      let maxlist = new Array();
      list = bidRule.recommendMoney(money);
      for (var i = 0; i < list.length; i++) {
        if (money == list[i]) {
          break;
        } else if (money < list[i]) {
          maxlist.push(list[i]);
        }
      }
      if (maxlist.length > 0) {
        if (maxlist.length > 3) {
          for (var i = 0; i < 3; i++) {
            maxlist = maxlist.slice(0, 3)
          }
        } else {
          for (var i = 0; i < maxlist.length; i++) {
            maxlist = maxlist.slice(0, maxlist.length+1)
          }
        }
        this.setData({
          suggestPrice: maxlist,
          bidsBox: false,
          sugBox: true
        })
        return false; 
      }
      //下单
      if (!this.data.disable){
        this.setData({ // 防止二次下单
          disable: true
        })
        this.createOrder('');
      }
    }
  },
  // 下单接口
  createOrder(ucontrol) {
    let that = this;
    api.createOrder({
      userId: app.getUserId(),
      orderType: this.data.orderType,
      goodId: this.data.id,
      ucontrol: ucontrol,
      clientPrice: this.data.priceValue
    }).then(data => {
      wx.navigateTo({
        url: '/pages/myOrder/myOrder'
      })
    }).catch(err => {
      if (err.data.scode == "600001") {
        wx.showModal({
          title: '提示',
          content: '当前您有一次试拍机会(下单成功20分钟未支付货款，订单将自动取消并失去试拍金额)，也可直接充值保证金进行竞拍',
          confirmColor: '#999999',
          cancelColor: '#999999',
          cancelText: '充保证金',
          confirmText: '我要试拍',
          success: function (res) {
            if (res.confirm) {
              that.setData({
                orderType: '03',
                disable: false
              })
              that.isHaveMoney()
            } else if (res.cancel) {
              wx.navigateTo({
                url: `/pages/recharge/recharge?rechargeType=02`
              });
            }
          }
        })
      } else if (err.data.scode == "600002") {
        wx.showModal({
          title: '提示',
          content: err.data.result.describe,
          confirmText: '去充值',
          confirmColor: '#333333',
          cancelColor: '#999999',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: `/pages/recharge/recharge`
              });
            } else if (res.cancel) {
              that.setData({
                disable: false
              })
            }
          }
        })
      } else if (err.data.scode == '600008') {
        wx.showModal({
          title: '您已经拍过这个商品',
          content: '您已经拍过这个商品，是否重新下单',
          confirmText: '重新下单',
          confirmColor: '#333333',
          cancelColor: '#999999',
          success: function (res) {
            if (res.confirm) {
              that.createOrder('01');
            } else if (res.cancel) {
              that.setData({
                disable: false
              })
            }
          }
        })
      } else if (err.data.code == '40003'){
        wx.redirectTo({
          url: '/pages/login/login',
        })
      } else {
        app.showToast(err.data.msg);
        that.setData({
          disable: false
        })
      }
    })
  },
  // 选择推荐报价
  setPrice(event){
    let suggestPrice = event.currentTarget.dataset.variable;
    this.setData({
      priceValue: suggestPrice,
      bidsBox: true,
      sugBox: false
    })
  },
  // 推荐价格取消
  setPriceNone(){
    this.setData({
      bidsBox: true,
      sugBox: false
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      bidsBox: false,
      sugBox: false,
      disable: false
    })
  },
  // 去猜你喜欢
  goLike (e) {
    let pages = getCurrentPages();
    if (pages.length >= 10) {
      wx.redirectTo({
        url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.goodsName,
      path: `/pages/detail/detail?id=${this.data.id}&shareCode=${app.getShareCode()}`
    }
  }
})