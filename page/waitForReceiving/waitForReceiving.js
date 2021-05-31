// pages/payment/payment.js
const api = require('../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mallOrderListDate: [],
    status: {
      0: '等待支付',
      1: '待发货',
      2: '已发货',
      3: '已完成',
      4: '已关闭',
      5: '取消',
      6: '待分享',
      7: '已完成'
    },
    page: 1,
    pageSize: 10,
    isLoading: false,
    isInvoice: false,
    isinvoiceArrow: false,
    isDisabled: false,
    billId: '',
    flag: false,
    billInfoeList: {
      type: 0,
      headerType: 0
    },
    statuss: {
      0: '待付款',
      1: '待收货',
      6: '待成团',
    },
    mallOrderType: '',
    index: '',
    mayData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.statuss[options.status]
    })
    this.mallOrderListQuery(options.status)
    this.setData({
      mallOrderType: Number(options.status)
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
    const that = this
    let pages = getCurrentPages();//当前页面栈
    let prevPage = pages[pages.length - 1];//上一页面
    console.log(prevPage.data.mayData)
    if(prevPage.data.mayData.a == 1) {
      that.setData({
        mallOrderListDate: [],
        page: 1,
      })
      that.mallOrderListQuery(1, Number(that.data.mallOrderType))
    } else if (prevPage.data.mayData.mallOrderDetailData) {
      let mallOrderDetailData = prevPage.data.mayData.mallOrderDetailData
      that.data.mallOrderListDate[that.data.index] = mallOrderDetailData
      that.setData({
        mallOrderListDate: that.data.mallOrderListDate
      })
      
    }

  },

 /**
   * 订单列表查询
   */
  mallOrderListQuery(status){
    let isLoading = true
    const that = this
    if(that.data.flag) {
      that.setData({
        isLoading: false
      })
      return
    }
    let flag = false
    const data = {
      status: Number(status),
      page: that.data.page,
      pageSize: that.data.pageSize
    }
    api.mallOrderList( { data } ).then( res => {
      isLoading = false
      if(res.data.code == 0) {
        if (res.data.data.length === 0) {
          flag = true
        }
        that.setData({
          mallOrderListDate: that.data.mallOrderListDate.concat(res.data.data),
          flag: flag,
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
   * 邀请好友参团
   */
  onShareAppMessage (e) {
    console.log(e)
    const id = e.target.dataset.id
    return {
      title: '分享',
      path: '/page/groupDetails/groupDetails?id=' + id,
      success: function (res) {
      // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
        wx.showToast({
          title: "分享失败",
          icon: 'success',
          duration: 2000
        })
      },
    }

  },

  /**
   * 订单详情
   */
  orderDetails (e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    this.setData({
      index: index
    })
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${id}`
    })
  },

  
  /**
   * 确认收货
   */
  sureConsignee (e) {
    const that = this
     const data = {
       orderId: e.currentTarget.dataset.id
     }
     api.confirmReceiveOrder( { data } ).then( res => {
       if(res.data.code == 0) {
         that.setData({
           page: 1,
           mallOrderListDate: []
         })
         wx.pageScrollTo({
           scrollTop: 0,
         })
         that.mallOrderListQuery(that.data.mallOrderType)
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
    * 取消订单
    */
   cancelUserOrderBtn (e) {
     const that = this
     const data = {
       orderId: e.currentTarget.dataset.id
     }
     api.cancelUserOrder( { data } ).then( res => {
       if(res.data.code == 0) {
         that.setData({
           page: 1,
           mallOrderListDate: []
         })
         wx.pageScrollTo({
           scrollTop: 0,
         })
         that.mallOrderListQuery(that.data.mallOrderType)
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
    * 立即支付
    */
   paymentBtn (e) {
     const that = this
     const data = {
       orderId: e.currentTarget.dataset.id,
       openId: wx.getStorageSync('openid'),
       payType: 2,
       billId: '',
     }
     api.mallOrderPayNow( { data } ).then( res => {
       if(res.data.code == 0) {
         wx.requestPayment({
           timeStamp:res.data.data.timeStamp,
           nonceStr:res.data.data.nonceStr,
           package:res.data.data.package,
           paySign:res.data.data.paySign,
           signType:res.data.data.signType,
           success(res) {
             const id = e.currentTarget.dataset.id
             wx.navigateTo({
               url: `/pages/orderDetail/orderDetail?id=${id}`
             })
             that.setData({
              page: 1,
              mallOrderListDate: [],
            })
            wx.pageScrollTo({
              scrollTop: 0,
            })
            that.mallOrderListQuery(that.data.mallOrderType)
 
           },
           fail(error) {
             wx.showToast({
               title: '支付失败',
               duration: 2000,
               icon: 'none'
             })
 
           }
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
    * 加入购物车
    */
   carBtn (e) {
     const data = {
       orderId: e.currentTarget.dataset.id
     }
     api.cartInsertByOrder( { data } ).then( res => {
       if(res.data.code == 0) {
         wx.showToast({
           title: '已加入购物车',
           duration: 2000,
           icon: 'none'
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
    * 查看物流
    */
   logisticsBtn (e) {
     const that = this
     const id = e.currentTarget.dataset.id
     wx.navigateTo({
       url: `/pages/logisticsDetails/logisticsDetails?id=${id}`
     })
 
   },
 
   /**
    * 更多事件
    */
   moreBtn (e) {
     const that = this
     that.setData({
       moreShow: that.data.moreShow === e.currentTarget.dataset.id ? '' : e.currentTarget.dataset.id
     })
   },
 
   /**
    * 获取发票信息
    */
   billInfoe () {
     const that = this
     api.billInfoe( {  } ).then( res => {
       if( res.data.code == 0) {
         let arry = res.data.data
         arry.headerType = arry.headerType || 0
         arry.type = arry.type || 0
         that.setData({
           billInfoeList: arry,
           isinvoiceArrow: arry.type === 1 ? true : false
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
    * 发票确定事件
    */
   invoiceBtn (e) {
     const that = this
     that.billInfoe()
     that.setData({
       isInvoice: true,
       orderId: e.currentTarget.dataset.id,
       mallOrderType: that.data.mallOrderType
     })
   },
 
    /**
    * 发票确定事件
    */
   myEventListener (e) {
     const that = this
     let isNum = e.detail.invoiceShow != undefined ? 0 : 1
     that.setData({
       isInvoice: e.detail.invoiceShow != undefined ? e.detail.invoiceShow : true,
     })
     if(isNum === 0) {
       return
     }
     const data = {
       billReceiverEmail: e.detail.billReceiverEmail || '',
       billReceiverPhone: e.detail.billReceiverPhone || '',
       dutyParagraph: e.detail.dutyParagraph || '',
       header: e.detail.header || '',
       headerType: e.detail.headerType || '',
       registAddress: e.detail.registAddress || '',
       registBank: e.detail.registBank || '',
       registBankCard: e.detail.registBankCard || '',
       registPhone: e.detail.registPhone || '',
       type: e.detail.type || '',
       orderId: that.data.orderId
     }
     that.setData({
       isDisabled: true
     })
     api.billApply( { data } ).then( res => {
       that.setData({
         isDisabled: false
       })
       if( res.data.code == 0) {
        that.setData({
          page: 1,
          mallOrderListDate: []
        })
        wx.pageScrollTo({
          scrollTop: 0,
        })
         that.setData({
           billId: res.data.dataset,
           isInvoice: false
         })
         that.mallOrderListQuery(that.data.mallOrderType)
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
    * 页面上拉触底事件的处理函数
    */
   onReachBottom(e){
     let that = this
     that.setData({
       page: that.data.page + 1
     })
     that.mallOrderListQuery(that.data.mallOrderType)
   },
})