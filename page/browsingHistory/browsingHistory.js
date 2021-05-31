// page/browsingHistory/browsingHistory.js
const api = require("../../utils/api")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    readHistoryList: [],
    nowDate: '',
    stopApi: false,
    num: '',
    isLoading: true,
    afterData: [],
    pageSize: 10,
    page: 1

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      num : options.id
    })
    this.readHistoryListDate()

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
   * 浏览记录
   */
  readHistoryListDate () {
    let isLoading = true
    const that = this
    if(that.data.stopApi) {
      that.setData({
        isLoading: false
      })
      return
    }
    let stopApi = false
    const data = {
      page: that.data.page,
      pageSize: 10
    }
    api.readHistoryList( { data } ).then( res => {
      isLoading = false
      if(res.data.code == 0) {
        let data = []
        data = res.data.data
        if(res.data.data.length === 0) {
          stopApi = true
        }
        if(that.data.readHistoryList.length === 0) {
          that.setData({
            readHistoryList: res.data.data
          })
        } else {
          let readHistoryList = that.data.readHistoryList
          data.map((val, index) => {
            if( val.date === readHistoryList[readHistoryList.length-1].date) {
              readHistoryList[readHistoryList.length-1].list = readHistoryList[readHistoryList.length-1].list.concat(val.list)
              data.splice(index, 1)
            }
          })
          readHistoryList = readHistoryList.concat(data)
          that.setData({
            readHistoryList: readHistoryList
          })
        }
        that.setData({
          stopApi: stopApi,
          isLoading: isLoading
        })
      } else {
        wx.showToast({
          title: res.data.message,
          duration: 2000,
          icon: 'none'
        })
      }
    })
    that.setData({
      isLoading: isLoading
    })
  },

  /**
   * 清空浏览记录
   */
  emptyBtn () {
    const that = this
    api.readHistoryClear( { } ).then( res => {
      if(res.data.code == 0) {
        that.readHistoryListDate()
        that.setData({
          readHistoryList: [],
          stopApi: false,
          isLoading: true,
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

  /**
   * 进入商品详情页
   */
  shoppingBtn (e) {
    let id = e.currentTarget.dataset.id
    let openChooseShows = e.currentTarget.dataset.openchooseshow == undefined ? 0 : 1
    wx.navigateTo({
      url: `/page/shoppingDetails/shoppingDetails?pid=${id}&openChooseShow=${openChooseShows}`
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(e){
    let that = this
    that.setData({
      page: that.data.page + 1
    })
    that.readHistoryListDate()
  },
})