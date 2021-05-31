// page/specialOffer/specialOffer.js
const api = require("../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeProductListList: [],
    top: '10'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.specialOffer()

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
   * 今日特价
   */
  specialOffer () {
    const that = this
    const data = {
      page: 1,
      pageSize: 10
    }
    api.specialOffer({data}).then( res => {
      wx.stopPullDownRefresh();
      if(res.data.code == 0) {
        that.setData({
          homeProductListList: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.message,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
})