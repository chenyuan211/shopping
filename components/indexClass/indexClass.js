// components/indexClass/indexClass.js
const app = getApp()
Component({
 /**
   * 获取父组件的值
   */
  properties: {
    titleData: {
      type: [],
      value: ''
    },
    isShow: {
      type: Boolean,
      value: ''
    }


  },

  /**
   * 组件的初始数据
   */
  data: {
    progressLeft: 0,
    marginRight: '21px',
    safeArea: 0,
    falg: false,
    screenWidth: 0,
    left: 0,
    marginTop: 15,
    compWidth: 0,
    width: '60px',
    widths: '18px',
    height: '60px'

  },

  lifetimes:{
    attached() {
      const that = this
      wx.getSystemInfo({
        success: function (res) {  // 获取手机信息
          that.setData({
            screenWidth: res.screenWidth,
          })
          if(res.safeArea.width <= 360) {
            that.setData({
              width: '52px',
              safeArea: res.safeArea.width,
              marginTop: 7,
              marginRight: '17px',
              height: '52px'
            })
          } else  if(res.safeArea.width < 400) {
            that.setData({
              width: '52px',
              safeArea: res.safeArea.width,
              marginTop: 7,
              height: '52px'
            })
          }
        }
      })
    },
    ready() {
      const that = this
      let rectWidth = 0
      wx.createSelectorQuery().in(that)
      .selectAll('.the-id')
      .boundingClientRect((rect) =>{
        
        rectWidth = rect[rect.length - 1].right
        let screenWidth = that.data.screenWidth - 20
        that.setData({ compWidth: (that.data.screenWidth - 20) / rectWidth * 44 });
      })
    .exec()

    }

  },

  /**
   * 组件的方法列表
   */
  methods: {
    scroll(e) {
      const that = this
      let scrollWidth = e.detail.scrollWidth
      let scrollLeft = e.detail.scrollLeft
      let left = 44 / scrollWidth * scrollLeft
      if(left < 0) {
        left = 0
      } else if (left > (44 - that.data.compWidth)) {
        left = 44 - that.data.compWidth
      }
      this.setData({
        progressLeft: `${left}px`,
       })

    },
    /**
   * 跳转二级分类
   */
  classBtn (e) {
    const url = e.currentTarget.dataset.url
    this.triggerEvent('myevent',url)
  },

  }
})
