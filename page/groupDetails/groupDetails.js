// pages/groupDetails/groupDetails.js
const api = require('../../utils/api')
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisabled: false,
    isLogin: '',
    openChooseShow: false,
    isNumDisabled: false,
    prcieImage: {},
    list: {},
    id: '',
    listAttribute: [],
    listAttributeList: [],
    shoppingNum: 1,
    maximum: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    that.groupInfo(options.id)
    that.setData({
      id: options.id
    })
    that.setData({
      isLogin: wx.getStorageSync('isLoginApi')
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    that.setData({
      iscarBtn: false
    })

  },

  /**
   * 选择规格--弹框
   */
  submitBtn (e) {
    let that = this
    if(that.data.isLogin !== 1) {
      wx.redirectTo({
        url: `/pages/loginSelect/loginSelect?num=${3}&id=${that.data.id}`
      })
      return
    }
    that.productAttribute()
    that.setData({
      openChooseShow: true,
      type: e.currentTarget.dataset.type,
    })
  },

  /**
   * 规格列表
   */
  productAttribute () {
    const that = this
    const data = {
      productId : that.data.list.productInfo.productId,
      isGroup: true
    }
    api.productAttribute( { data } ).then( res => {
      if(res.data.code == 0) {
        let arr = res.data.data
        that.setData({
          listAttribute: arr.tree,
          listAttributeList: arr.list,
          prcieImage: {pic: arr.pic, price: arr.price}
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
  for(let i = 0; i < listAttributeList.length; i++) {
    listAttributeList[i].conts = ''
    for(let j = 0; j < arr.length; j++) {
      let s = `s${j+1}`
      listAttributeList[i].conts+=listAttributeList[i][s]
    }
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
      listAttribute: listAttribute
    })
  },

  /**
  * 选择规格--确定按钮
  */
  specificationBtn () {
    const that = this
    let specificationId = ''
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
    
    for(let i = 0; i < listAttributeList.length; i++) {
      listAttributeList[i].conts = ''
      for(let j = 0; j < arr.length; j++) {
        let s = `s${j+1}`
        listAttributeList[i].conts+=listAttributeList[i][s]
      }
    }
    listAttributeList.map( (res, index) => {
      if(res.conts == id) {
        specificationId = res.id
      }
    })
    that.setData({
      iscarBtn: true
    })
    const data = {
      productId : that.data.list.productInfo.productId,
      productSkuId: specificationId,
      quantity: that.data.shoppingNum,
      groupId: that.data.list.productInfo.groupId,
      isJoin: true
    }
    api.groupJion( { data } ).then( res => {
      if(res.data.code == 0) {
        let arr = JSON.stringify(res.data.data)
        that.setData({
          openSthShow: false,
          isShow: false
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
   * 关闭选择规格--弹框
   */
  onChooseClose () {
    let that = this
    that.setData({
      openChooseShow: false
    })
  },




  /**
   * 拼团详情
   */
  groupInfo (id) {
    const that = this
    const data = {
      orderId: id
    }
    api.groupInfo( { data } ).then( res => {
      if(res.data.code == 0) {
        that.setData({
          list: res.data.data
        })
      } else if(res.data.code == 10045) {
        Dialog.alert({
          title: '提示',
          message: '活动已结束',
          confirmButtonText: '我知道了',
        }).then(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        });
      } else {
        wx.showToast({
          title: res.data.message,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  }
})