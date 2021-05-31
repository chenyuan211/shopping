// components/invoice/invoice.js
const validate = require('../../utils/validate')
Component({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceType: ['普通发票'],
    invoiceRise: ['个人', '公司'],
    isinvoiceArrow: false,
    invoiceName: '',
    bankAccount: '',
    userPhone: '',
    address: '',
    dutyNum: '',
    bankNum: '',
    phone: '',
    email: '',
    isDisabled: false,
    billInfoeList: {
      type: 0,
      headerType: 0,
     header: ''
    }
  },

  /**
   * 获取父组件的值
   */
  properties: {
    invoiceShow: {
      type: Boolean,
      value: ''
    },
    billInfoeList: {
      type: {},
      value: ''
    },
    isDisabled: {
      type: Boolean,
      value: ''
    },
    isinvoiceArrow: {
      type: Boolean,
      value: ''
    }
  },
  
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
    hide: function () { },
  },
  methods: {
    /**
     * 发票抬头切换
     */
    isinvoiceRiseBtn (e) {
      const that = this
      const index = e.currentTarget.dataset.index
      let billInfoeList = that.data.billInfoeList
      billInfoeList.headerType = index
      that.setData({
        billInfoeList: billInfoeList,
        isinvoiceArrow: false
      })
    },

    /**
     * 发票类型
     */
    invoiceTypeBtn (e) {
      console.log(e)
      const that = this
      const index = e.currentTarget.dataset.index
      let billInfoeList = that.data.billInfoeList
      billInfoeList.type = index
      that.setData({
        billInfoeList: billInfoeList,
        isinvoiceArrow: index === 1 ? true : false
      })
    },

    /**
     * 展开收起更多选填项
     */
    invoiceArrow () {
      const that = this
      that.setData({
        isinvoiceArrow: !that.data.isinvoiceArrow
      })
    },

    /**
     * 抬头名称--赋值
     */
    invoiceNameChange (e) {
      const that = this
      let billInfoeList = that.data.billInfoeList
      billInfoeList.header = e.detail.trim()
      that.setData({
        billInfoeList: billInfoeList
      })
    },

    /**
     * 单位税号--赋值
     */
    ondutyChange (e) {
      const that = this
      let billInfoeList = that.data.billInfoeList
      billInfoeList.dutyParagraph = e.detail.trim()
      that.setData({
        billInfoeList: billInfoeList
      })
    },

    /**
     * 注册地址--赋值
     */
    addressChange (e) {
      const that = this
      let billInfoeList = that.data.billInfoeList
      billInfoeList.registAddress = e.detail.trim()
      that.setData({
        billInfoeList: billInfoeList
      })
    },

    /**
     * 注册电话--赋值
     */
    onPhoneChange (e) {
      const that = this
      let billInfoeList = that.data.billInfoeList
      billInfoeList.registPhone = e.detail.trim()
      that.setData({
        billInfoeList: billInfoeList
      })
    },

    /**
     * 开户银行--赋值
     */
    onBankChange (e) {
      const that = this
      let billInfoeList = that.data.billInfoeList
      billInfoeList.registBank = e.detail.trim()
      that.setData({
        billInfoeList: billInfoeList
      })
    },

    /**
     * 银行账户--赋值
     */
    onAccountChange (e) {
      const that = this
      let billInfoeList = that.data.billInfoeList
      billInfoeList.registBankCard = e.detail.trim()
      that.setData({
        billInfoeList: billInfoeList
      })
    },

    /**
     * 邮箱地址--赋值
     */
    onEmailChange (e) {
      const that = this
      let billInfoeList = that.data.billInfoeList
      billInfoeList.billReceiverEmail = e.detail.trim()
      that.setData({
        billInfoeList: billInfoeList
      })
    },

    /**
     * 手机号--赋值
     */
    userPhoneChange (e) {
      const that = this
      let billInfoeList = that.data.billInfoeList
      billInfoeList.billReceiverPhone = e.detail.trim()
      that.setData({
        billInfoeList: billInfoeList
      })
    },

    /**
     * 关闭弹框
     */
    onClose () {
      const that = this
      that.triggerEvent('myevent', {invoiceShow: false})
    },

    /**
     * 提交
     */
    submitBtn() {
      const that = this
      if(!that.data.billInfoeList.header) {
        wx.showToast({
          title: '抬头名称不能为空',
          duration: 2000,
          icon: 'none'
        })
        return
      }
      if((that.data.billInfoeList.headerType === 1 && that.data.billInfoeList.type === 0) || that.data.billInfoeList.type === 1) {
        if(!that.data.billInfoeList.dutyParagraph) {
          wx.showToast({
            title: '单位税号不能为空',
            duration: 2000,
            icon: 'none'
          })
          return
        }
      }
      if(that.data.billInfoeList.type === 1) {
        if(!that.data.billInfoeList.registAddress) {
          wx.showToast({
            title: '注册地址不能为空',
            duration: 2000,
            icon: 'none'
          })
          return
        }
        if(!validate.phoneEncrypt(that.data.billInfoeList.registPhone)) {
          wx.showToast({
            title: '手机号输入有误',
            duration: 2000,
            icon: 'none'
          })
          return
        }
        if(!that.data.billInfoeList.registBank) {
          wx.showToast({
            title: '开户银行不能为空',
            duration: 2000,
            icon: 'none'
          })
          return
        }
        if(!that.data.billInfoeList.registBankCard) {
          wx.showToast({
            title: '银行账户不能为空',
            duration: 2000,
            icon: 'none'
          })
          return
        }
      }

      if(!validate.emailEncrypt(that.data.billInfoeList.billReceiverEmail)) {
        wx.showToast({
          title: '邮箱地址输入有误',
          duration: 2000,
          icon: 'none'
        })
        return
      }

      if(!validate.phoneEncrypt(that.data.billInfoeList.billReceiverPhone)) {
        wx.showToast({
          title: '手机号输入有误',
          duration: 2000,
          icon: 'none'
        })
        return
      }
      that.data.billInfoeList.headerType = that.data.billInfoeList.type == 1 ? 1 : 0
      if(that.data.billInfoeList.headerType == 0) {
        that.data.billInfoeList.registBankCard = ''
        that.data.billInfoeList.registBank = ''
        that.data.billInfoeList.registBankCard = ''
        that.data.billInfoeList.registAddress = ''
        that.data.billInfoeList.dutyParagraph = ''
        that.data.billInfoeList.registPhone = ''
      }
      let myEventOption = {}
      that.triggerEvent('myevent', that.data.billInfoeList, myEventOption)
    }
  }
})