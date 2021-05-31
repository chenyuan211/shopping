Component({
  properties: {
    countNum: {
      type: Number,
      value: ''
    }
  },
  data: {
    selected: 0,
    countNum: '',
    selectedColor: '#02AAB0',
    list: [
      {
        "pagePath": "/pages/index/index",
        "text": "首页",
        "iconPath": "/assets/images/tab_icon_home_selected.png",
        "selectedIconPath": "/assets/images/tab_icon_home_selected1.png"
      },
      {
        "pagePath": "/pages/classify/classify",
        "text": "分类",
        "iconPath": "/assets/images/tab_icon_home_classification.png",
        "selectedIconPath": "/assets/images/tab_icon_home_classification_h.png"
      },
      {
        "pagePath": "/pages/shoppingTrolley/shoppingTrolley",
        "text": "购物车",
        "iconPath": "/assets/images/cart.png",
        "selectedIconPath": "/assets/images/cart1.png"
      },
      {
        "pagePath": "/pages/personalCenter/personalCenter",
        "text": "我的",
        "iconPath": "/assets/images/tab_icon_me_normal.png",
        "selectedIconPath": "/assets/images/tab_icon_me_normal1.png"
      }
  ]
  },
  attached() {
    const that = this
    that.setData({
      countNum: wx.getStorageSync('carNum') || ''
    })
  },
  methods: {
    // switchTab(e) {
    //   const data = e.currentTarget.dataset
    //   const url = data.path
    //   wx.switchTab({url})
    //   this.setData({
    //     selected: data.index,
    //     countNum: wx.getStorageSync('carNum') || ''
    //   })
    // }
  }
})