 var app = getApp();
const api = require('../../utils/api.js');
Component({
  properties: {
    extravagancesOrderList: Array
  },
  methods: {
    // 提醒发货
    remind () {
      setTimeout(() => {
        app.showToast('提醒发货成功', 'success')
      }, 200)
    },
    // 申请售后
    callMe () {
      wx.makePhoneCall({
        phoneNumber: '400-1112-016'
      })
    },
    // 去支付页面
    pay (e) {
      console.log(e);
      wx.navigateTo({
        url: `/pages/orderPay/orderPay?orderId=${e.currentTarget.dataset.id}`,
      })
    },
    // 取消订单
    cancelOrder (e) {
      let that = this;
      app.showModal('您确定要取消订单吗？', function () {
        api.luxuryOrderCancel({
          orderId: e.currentTarget.dataset.id ,
          userId: app.getUserId()
        }).then(data => {
          app.showToast('取消订单成功', 'success', function () {
            that.triggerEvent('changeOrderStatus');
          })
        })
      }.bind(this), function () {
        console.log('取消取消订单')
      }.bind(this))
    },
    // 确认收货
    confirmGoods (e) {
      let that = this;
      api.luxuryConfirmGoods({
        orderId: e.currentTarget.dataset.id,
        userId: app.getUserId()
      }).then(data => {
        app.showToast('确认收货成功', 'success', function () {
          that.triggerEvent('changeOrderStatus');
        })
      })
    },
    // 上传身份证
    uploadCard (e) {
      let curOrder = this.data.extravagancesOrderList[e.currentTarget.dataset.index];
      wx.navigateTo({
        url: `/pages/credentials/credentials?receiveName=${curOrder.receiveName}&orderId=${curOrder.orderId}`,
      })
    },
    // 查看物流
    look (e) {
      let obj = e.currentTarget.dataset;
      console.log(obj)
      let content = '运单号：' + obj.expressno + '\r\n物流公司：' + obj.expresscompany;
      app.showErrorModal(content , '物流信息')
    }
  }
})