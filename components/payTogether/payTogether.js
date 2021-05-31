// components/payTogether/payTogether.js
Component({

    /**
   * 获取父组件的值
   */
  properties: {
    payShow: {
      type: Boolean,
      value: ''
    },
    result: {
      type: [],
      value: ''
    },
    mallOrderAllOrder: {
      type: {},
      value: ''
    },
    etTotalCount: {
      type: {},
      value: ''
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    height: '360px',
  },
  
  /**
   * 在组件实例进入页面节点树时执行
   */
  attached: function() {
    const that = this
    wx.getSystemInfo({
      success: function (res) {  // 获取手机信息
        console.log(res.safeArea.width)
        if(res.safeArea.width < 400) {
          that.setData({
            height: '301px'
          })
        }
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 关闭弹框
     */
    onClose () {
      const that = this
      that.triggerEvent('myevent', {payShow: false})
    },

    /**
     * 复选框事件
     */
    checkboxChange (e) {
      this.setData({
        result: e.detail
      })
      this.triggerEvent('myevent', {payShow: true, result: e.detail})
    },

    /**
     * 提交
     */
    submitBtn() {
      const that = this
      let result = that.data.result
      that.triggerEvent('myevent', {payShow: false, data: result})
    }

  }
})
