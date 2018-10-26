Component({
  properties: {
    pic: String,
    goodsName: String,
    color: String,
    size: String,
    priceUnit: String,
    price: String,
    num: Number,
    orderId: String
  },
  methods: {
    jump () {
      wx.navigateTo({
        url: `/pages/extravagancesOrderDetail/extravagancesOrderDetail?orderId=${this.data.orderId}`
      })
    }
  }
})