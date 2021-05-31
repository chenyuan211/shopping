// pages/productList/productList.js
Component({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getStorageSync('statusBarHeight'),
    top: ''

  },
   /**
   * 获取父组件的值
   */
  properties: {
    homeProductListList: {
      type: [],
      value: ''
    },
    top: {
      type: '',
      value: ''
    }
  },
  methods: {
      /**
     * 查看商品详情
     */
    shoppimgDetail (e) {
      let id = e.currentTarget.dataset.pid
      let openChooseShows = e.currentTarget.dataset.openchooseshow == undefined ? 0 : 1
      wx.navigateTo({
        url: `/page/shoppingDetails/shoppingDetails?pid=${id}&openChooseShow=${openChooseShows}`
      })
    },
  }
})