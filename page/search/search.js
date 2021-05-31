// page/search/search.js
const api = require("../../utils/api");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getStorageSync('statusBarHeight'),
    hotSearchData: [],
    homeProductListList: [],
    dataList:[
    ],
    page: 1,
    placeholder: '',
    id: '',
    stopApi: false,
    canRun: true,
    focus: '',
    timer: null,
    width: '210px',
    name: '',
    names: '',
    num: '',
    value: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    if(options.id ) {
      this.setData({
        id: options.id || '',
        value: options.name || 'search'
      })
      this.homeProductListList(options.name)
    } else {
      this.setData({
        focus: 'auto'
      })
    }
    this.setData({
      num: options.num || '',
      placeholder: options.names || 'search'
    })
    this.getHotSearch()
    wx.getSystemInfo({
      success: function (res) {  // 获取手机信息
        if(res.safeArea.width < 400) {
          that.setData({
            width:'190px'
          })
        }
      }
    })

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
   * 搜索功能
   */
  search(e) {
    if(e.detail.value.trim()) {
      this.debounce(this.getWords(e.detail.value))
      this.setData({
        name: '',
        names: '',
        homeProductListList: [],
        value: e.detail.value.trim()
      })
    } else {
      this.setData({
        dataList: [],
        homeProductListList: [],
        value: ''
      })
    }
  },

  /**
   * 手机键盘搜索功能
   */
  bindconfirm() {
    let placeholder = this.data.value ? this.data.value : this.data.placeholder
    this.debounce(this.homeProductListList(placeholder))
  },

  /**
   * 防抖
   */
  debounce(callback, wait = 800) {
    const that = this
    const { canRun, timer } = that.data;
    if (canRun) {
      callback;
      that.data.canRun = false;
    }
    timer && clearInterval(that.data.timer);
    that.data.timer = setInterval(() => {
      that.data.canRun = true;
    }, wait);
  },

  /**
   * 取消事件
   */
  returnBtn () {
    console.log(this.data.num)
    if(this.data.num) {
      wx.switchTab({
        url: `/pages/classify/classify`
      })
      app.globalData.returnVal = 1
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
    this.setData({
      value: '',
      dataList: []
    })
  },

  /**
   * 获取热搜数据
   */
  getHotSearch () {
    api.getHotSearch({
    }).then(res=>{
      if(res.data.code == 0) {
         this.setData({
          hotSearchData: res.data.data
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
   * 热搜点击事件
   */
  hotSearchBtn (e) {
    const name = e.currentTarget.dataset.name
    this.setData({
      value: name,
      names: ''
    })
    this.homeProductListList(name)
  },

  /**
   * 搜索功能
   */
  getWords (name) {
    const data = {
      name: name
    }
    api.getWords({
      data
    }).then(res=>{
      if(res.data.code == 0) {
        let arr = []
        let list = []
        console.log(res.data.data)
        if(res.data.data.length > 0) {
          let list = JSON.parse(res.data.data)
          arr = list.map((item)=>{
            if(item.name.indexOf(name) !== -1) {
              const reg = new RegExp(name,'g');
              let val = item.name
              val = val.replace(reg, `,%${name},%`)
              val = val.split(',%')
              item.arr = val
              return item
            }
          })

        } else {
          this.setData({
            names: 1
          })
          this.homeProductListList('')
        }
        this.setData({
          value: name,
          dataList: arr
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
   * 获取产品列表
   */
  homeProductListList (name) {
    const that = this
    let stopApi = false
    if(that.data.stopApi) {
      return
    }
    const data = {
      kind:  this.data.id || 0,
      name: name,
      page: that.data.page,
      pageSize: 20
    }
    api.productListList({data}).then( res => {
      if(res.data.code == 0) {
        if(res.data.data.length === 0) {
          stopApi = true
          this.setData({
            names: 1
          })
          this.homeProductListList('')
        }
        const homeProductListList = that.data.homeProductListList.concat(res.data.data)
        let temp = {}; 
        let result = []; //最后的新数组
        
        homeProductListList.map(function (item, index) {
          if(!temp[item.pId]){
            result.push(item);
            temp[item.pId] = true;
          }
        })
        that.setData({
          homeProductListList: result,
          stopApi: stopApi
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
   * 商品查询
   */
  productSearch (e) {
    this.setData({
      name: e.currentTarget.dataset.name,
      value: e.currentTarget.dataset.name
    })
    this.homeProductListList(e.currentTarget.dataset.name)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(e){
    let that = this
    that.setData({
      page: that.data.page + 1
    })
    that.homeProductListList(this.data.name)
  },
})