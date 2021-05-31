const api = require("../../utils/api");
const app = getApp()
// page/shoppingDetails/shoppingDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     // banner配置字段
     background: [],
     viewHeight: 'height: 0px',
     imageURL: '/assets/images/1.jpg',
     isNumDisabled: false,
     duration: 500,
     currentSwiper: 0,
     active: 0,
     isShow: false,
     openSthShow: false,
     openChooseShow: false,
     isDisabled: false,
     specificationId: '', // 规格id
     productDetailList: {},
     isListShow: '',
     shoppingNum: 1,
     specificationId: '',
     type: 1,
     listAttribute: [],
     isGroup: false,
     listAttributeList: [],
     list: [
     ],
     groupList: [],
     time: 25000*1000,
     discountShow: false,
     submitTile: '立即购买',
     openChooseNum: 0,
     bottomLift: 0,
     timeData: {},
     getSkuList: {},
     prcieImage: {},
     ShoppingType: {},
     iscarBtn: false,
     isLogin: '',
     isJoin: true,
     height: '390px',
     skuid: '',
     GroupId: '',
     getWay: '',
     address: '',
     groupId: '',
     pid: '',
     bg: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.getFileSystemManager().readFile({
      filePath: '/assets/images/bg.png', // 选择图片返回的相对路径
      encoding: 'base64', // 编码格式
      success: res => { // 成功的回调
        that.setData({
          bg: res.data
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {  // 获取手机信息
        if(res.safeArea.width < 400) {
          that.setData({
            height: '301px'
          })
        }
      }
    })

    // 开启分享功能
    wx.showShareMenu({
      withShareTicket: true
    })
  
    that.setData({
      pid: options.pid,
      openChooseShow: options.openChooseShow == 1 ? true : false,
      isLogin: wx.getStorageSync('isLoginApi'),
      openChooseNum: options.openChooseShow || 0,
      skuid: options.skuid ? options.skuid : '',
      specificationId: options.skuid ? options.skuid : ''
    })
    app.getDeviceSize().then(res => {
      const {bottomLift} = res
      this.setData({
        bottomLift: bottomLift
      })
    })
    that.shoppingList()
    that.apicouponListByProduct()
    that.groupListByProduct()
    that.expressGetWayList()
    that.deliveryAddressDefaultList()
    that.productAttribute()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    that.productPromotionInfo()
    that.apicouponListByProduct()
    that.setData({
      isListShow: '',
      shoppingNum: 1
    })

  },

  onUnload: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      mayData: { a: 1}
    })

  },

  onChange (e) {
    this.setData({
      timeData: e.detail,
    });
  },

  /**
   * banner图适配
   */
  imageLoad (e) {
    let winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    let imgwidth = e.detail.width
    let imgheight = e.detail.height
    let that = this
    let height = winWid*imgheight/imgwidth
    that.setData({
      viewHeight: `height:${height}px`,
    })
  },
  swiperChange(e){
    const that = this
    that.setData({
      currentSwiper: e.detail.current
    })
  },

  /**
   * banner 图预览
   */
  previewImage:function(e){   
    const current = e.target.dataset.src;
    const imgList = e.target.dataset.list
    //图片预览
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  /**
   * 商品类型
   */
  productPromotionInfo () {
    const that = this
    const data = {
      productId: that.data.pid
    }
    api.productPromotionInfo( { data } ).then( res => {
      if(res.data.code == 0) {
        const data = res.data.data
        data.remain = data.remain * 1000
        that.setData({
          ShoppingType: res.data.data
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
   * 未领取优惠券列表
   */
  couponBtn () {
    const that = this
    that.setData({
      discountShow: true,
      isShow: false
    })
    that.apicouponListByProduct()
  },

  /**
   * 未领取优惠券列表接口
   */
  apicouponListByProduct () {
    const that = this
    api.couponListByProduct( { } ).then( res => {
      if(res.data.code == 0) {
        that.setData({
          couponList: res.data.data,
          submitTile: res.data.data.length > 0 ? '领券购买' : '立即购买'
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
   * 获取购物车数量
   */
  cartCount () {
    api.cartCount({
    }).then(res=>{
      if(res.data.code == 0) {
        wx.setStorage({
        data: res.data.data,
        key:'carNum',
        success: function (res){
        }
      })
      }
    })
  },

  /**
   * 领取优惠券页面
   */
  couponGeBtn (e) {
    const that = this
    if(that.data.isLogin !== 1) {
      wx.redirectTo({
        url: `/pages/loginSelect/loginSelect?num=${4}&id=${that.data.pid}`
      })
      return
    }
    const data = {
      couponId: e.target.dataset.id
    }
    api.couponGet( { data } ).then( res => {
      if(res.data.code == 0) {
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(()=>{
          this.apicouponListByProduct()
        }, 2000)
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
   * 关闭优惠券弹框
   */
  onClose () {
    let that = this
    that.setData({
      discountShow: false,
      isShow: false
    })
  },

  /**
   * 发起拼团弹框
   */
  groupBookingBtn (e) {
    let that = this
    that.setData({
      isJoin: e.currentTarget.dataset.type == 3 ? false : true,
      openChooseShow: true,
      type: e.currentTarget.dataset.type,
      groupId: e.currentTarget.dataset.id,
      isGroup: true,
      isShow: false
    })
    that.productAttribute()
  },

  /**
   * 关闭开团
   */
  onopensthClose () {
    let that = this
    that.setData({
      openSthShow: false,
      isListShow: '',
      isShow: false
    })
  },

   /**
   * 选择规格--弹框
   */
  submitBtn (e) {
    let that = this
    that.setData({
      openChooseShow: true,
      type: e.currentTarget.dataset.type,
      isShow: false,
      isGroup: false,
    })
    that.productAttribute()
  },

  /**
   * 规格列表
   */
  productAttribute () {
    const that = this
    const data = {
      productId : that.data.pid,
      isGroup: that.data.isGroup
    }
    api.productAttribute( { data } ).then( res => {
      if(res.data.code == 0) {
        let arr = res.data.data
        let img = {pic: arr.pic, price: arr.price}
        let maximum = ''
        if(this.data.skuid) {
          let list = {}
          arr.list.map((val)=>{
            if(val.id == this.data.skuid) {
              img = {pic: val.pic, price: val.price}
              maximum = val.stock
              list = val
            }
          })
          arr.tree.map((val)=>{
            val.v.map((res)=>{
              if(list.stock < 1) {
                if(res.id == list[(val.k_s)]) {
                  res.isNum = true
                }
              } else {
                if(res.id == list[(val.k_s)]) {
                  res.isSelect = true
                }
              }

            })

          })
        }
        that.setData({
          listAttribute: arr.tree,
          listAttributeList: arr.list,
          maximum: maximum,
          prcieImage: img
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
   * 选择规格--获取对应的图片和价格
   */
  chooseSpecificationBtn (e) {
    const that = this
    let selectIndex = e.currentTarget.dataset.selectIndex; 
    let attrIndex = e.currentTarget.dataset.attrIndex;  
    let arr = that.data.listAttributeList
    let id = e.currentTarget.dataset.id
    let prcieImage = that.data.prcieImage
    let listAttribute = that.data.listAttribute
    let cont = listAttribute[selectIndex].v.length
    let ids = ''
    for( let i = 0; i < cont; i++) {
      listAttribute[selectIndex].v[i].isSelect = false
      listAttribute[selectIndex].v[i].isNum = false
    }
    listAttribute[selectIndex].v[attrIndex].isSelect = true
    for(let i = 0; i < arr.length; i++) {
      arr[i].conts = ''
      for(let j = 0; j < listAttribute.length; j++) {
        let s = `s${j+1}`
        arr[i].conts+=arr[i][s]
      }
    }
    listAttribute.map( res => {
      res.v.map(val => {
        if(val.isSelect) {
          ids += val.id
        }
      })
    })
    arr.map( (res, index) => {
      if(res.conts == ids) {
        that.setData({
          prcieImage: res
        })
      }
    })
    let isNumDisabled = false
    if(that.data.prcieImage.stock <= 0) {
      let s = `s${listAttribute.length}`
      listAttribute.map( res => {
        if(res.k_s === s) {
          res.v.map( val => {
            if(that.data.prcieImage[s] == val.id) {
              val.isNum = true
              isNumDisabled = true
            }
          })
        }
      })
    } else {
      listAttribute.map( res => {
        res.v.map( val => {
          val.isNum = false
          isNumDisabled = false
        })
      })
    }
    that.setData({
      listAttributeList: arr,
      isNumDisabled: isNumDisabled,
      shoppingNum: 1,
      listAttribute: listAttribute
    })
  },

  /**
   * 关闭选择规格--弹框
   */
  onChooseClose () {
    let that = this
    that.setData({
      openChooseShow: false,
      isShow: false,
      shoppingNum: 1,
      openChooseNum : ''
    })
  },

  /**
   * 发起拼团
   */
  groupBtn (id) {
    const that = this
    const data = {
      skuCode : id
    }
    api.groupGetBySku( { data } ).then( res => {
      if(res.data.code == 0) {
        let arr = res.data.data
        that.setData({
          list: arr
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
   * 拼团列表
   */
  groupListByProduct () {
    const that = this
    const data = {
      productId : that.data.pid,
      page: 1,
      pageSize: 5
    }
    api.groupListByProduct( { data } ).then( res => {
      if(res.data.code == 0) {
        let arr = res.data.data
        arr.map(res => {
          res.time = res.time * 1000
        })
        that.setData({
          groupList: arr
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
   * 选择开团table切换
   */
  popupListBtn (e) {
    const that = this
    that.setData({
      isListShow: e.currentTarget.dataset.index,
      groupId: e.currentTarget.dataset.id
    })

  },

  /**
   * 确认开团
   */
  popupBtn () {
    const that = this
    if(!that.data.groupId) {
      wx.showToast({
        title: '请选择开团项',
        duration: 2000,
        icon: 'none'
      })
      return
    }
    const data = {
      productId : that.data.pid,
      productSkuId: that.data.specificationId,
      quantity: that.data.shoppingNum,
      groupId: that.data.groupId,
      isJoin: that.data.isJoin
    }
    api.groupJion( { data } ).then( res => {
      if(res.data.code == 0) {
        let arr = JSON.stringify(res.data.data)
        that.setData({
          openSthShow: false,
          isShow: false,
          type: ''
        })
        wx.navigateTo({
          url: `/pages/submitOrder/submitOrder?arr=${arr}`
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
   * 联系客服
   */
  phoneCall () {
    api.afterGetPhone( {} ).then( res => {
      if(res.data.code == 0) {
        wx.makePhoneCall({
          phoneNumber: res.data.data
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
   * 查看全部拼团
   */
  allgroupBooking (e) {
    const that = this
    if(that.data.isLogin !== 1) {
      wx.redirectTo({
        url: `/pages/loginSelect/loginSelect?num=${4}&id=${that.data.pid}`
      })
      return
    }
    wx.navigateTo({
      url: `/pages/groupBookingDetails/groupBookingDetails?id=${that.data.pid}`
    })
  },

  /**
   * 商品详情--api
   */
  shoppingList () {
    const that = this
    const data = {
      id: that.data.pid
    }
    api.productDetail({ data }).then( res => {
      if(res.data.code == 0) {
        let albumPics = res.data.data.albumPics
        albumPics = albumPics.split(',')
        let data = res.data.data
        data.detail =   data.detail.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ') //正则替换
        data.serviceIds = data.serviceIds.split(',')
        that.setData({
          productDetailList: data,
          background: albumPics,
          isShow: false,
          isDisabled: res.data.data.publishStatus === 0 ? true : false,
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
  * 商品递减
  */
 minusBtn (e) {
    const that = this
    if(that.listAttributeList()) {
      return
    }
    let num = that.data.shoppingNum
    if(num > 1) {
      num--
    }
    that.setData({
      shoppingNum: num
    })
 },

  /**
  * 商品递增
  */
  addBtn (e) {
    const that = this
    if(that.listAttributeList()) {
      return
    }
    let num = that.data.shoppingNum
    let maximum = e.currentTarget.dataset.maximum
    if(num < maximum) {
      num++
    }
    that.setData({
      shoppingNum: num
    })
  },
  
  /**
  * 购物车列表
  */
  shoppingCart () {
    wx.navigateTo({
      url: '/pages/shoppingTrolleys/shoppingTrolleys'
    })
  },

  /**
   * 获取快递方式
   */
  expressGetWayList() {
    const that = this
    api.expressGetWay( {  } ).then( res => {
      if( res.data.code == 0) {
        that.setData({
          getWay: res.data.data
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
   * 获取默认收货地址
   */
  deliveryAddressDefaultList() {
    const that = this
    api.deliveryAddressDefault( {  } ).then( res => {
      if( res.data.code == 0) {
        that.setData({
          address: res.data.data
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
  * 判读是否选择规格
  */
  listAttributeList () {
    const that = this
    let arr = []
    let id = ''
    let listAttributeList = that.data.listAttributeList
    that.data.listAttribute.map( res => {
      res.v.map(val => {
        if(val.isSelect) {
          arr.push(val)
          id += val.id
        }
      })
    })
    if(arr.length !== that.data.listAttribute.length) {
      wx.showToast({
        title: '请选择规格',
        duration: 2000,
        icon: 'none'
      })
      return true
    }
    listAttributeList.map( (res, index) => {
      if(res.conts == id) {
        that.setData({
          maximum: res.stock
        })
      }
    })
  },

  /**
  * 选择规格--确定按钮
  */
  specificationBtn () {
    const that = this
    if(that.data.isLogin !== 1) {
      wx.redirectTo({
        url: `/pages/loginSelect/loginSelect?num=${4}&id=${that.data.pid}`
      })
      return
    }
    let specificationId = that.data.specificationId
    let arr = []
    let id = ''
    let listAttributeList = that.data.listAttributeList
    that.data.listAttribute.map( res => {
      res.v.map(val => {
        if(val.isSelect) {
          arr.push(val)
          id += val.id
        }
      })
    })
    if(arr.length !== that.data.listAttribute.length) {
      wx.showToast({
        title: '请选择规格',
        duration: 2000,
        icon: 'none'
      })
      return
    }
    
    listAttributeList.map( (res, index) => {
      if(res.conts == id) {
        specificationId = res.id
      }
    })
    that.setData({
      iscarBtn: true,
      specificationId: specificationId
    })
    if(that.data.type == 1 || that.data.openChooseNum == 1) { // 加入购物车
      const data = {
        productId: that.data.pid,
        productSkuId: specificationId,
        quantity: that.data.shoppingNum
      }
      api.cartInsert( { data } ).then( res => {
        that.setData({
          iscarBtn: false
        })
        if(res.data.code == 0) {
          that.setData({
            openChooseShow: false,
            type: '',
            openChooseNum: '',
            isShow: false
          })
          wx.showToast({
            title: '加入购物车成功',
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
    } else if (that.data.type == 3) { // 发起拼团
      that.setData ({
        openSthShow: true,
        openChooseShow: false,
        isShow: true
      })
      that.groupBtn(specificationId)
    } else if (that.data.type == 4) {
     that.popupBtn()
      that.setData ({
        openChooseShow: false,
        isShow: true
      })
    }
    else { // 立即购买
      const data = {
        productId: that.data.pid,
        productSkuId: specificationId,
        quantity: that.data.shoppingNum
      }
      api.productBuyNow( { data } ).then( res => {
        if(res.data.code == 0) {
          that.setData({
            openChooseShow: false,
            isShow: false
          })
          wx.navigateTo({
            url: `/pages/submitOrder/submitOrder?cartIds=${res.data.data}`
          })
        } else {
          wx.showToast({
            title: res.data.message,
            duration: 2000,
            icon: 'none'
          })
        }
      })

    }

  }
})