//app.js
const api = require('./utils/api')
const mta = require('./utils/mta_analysis')
var QQMapWX = require('/utils/qqmap-wx-jssdk.min.js');
App({
  qqmapsdk: new QQMapWX({ key: 'HC6BZ-XF6K3-YPZ3B-3XTZC-N475F-ZOBH6'}),
  setGlobalData: function (data) {
    data = data || {}
    this.globalData.openid = data.openid
    this.globalData.token = data.token
    this.globalData.customerId = data.customerId
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.autoUpdate()

     /**
     * 登录
     */
    const _this = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let data = {
          code: res.code
        }
        api.loginAndSign({
          data
        }).then(res=>{
          if (this.openidCallback) {
            this.openidCallback(res)
          }
          const data = res.data.data
          if (!data) return
          // 用户画像分析
          // _this.globalData.customerId = res.data.data.customerId
          mta.Data.userInfo = {
            openid: data.openid,
            customerId: data.customerId
          }
          this.setGlobalData(data)
          wx.setStorageSync('globalData', this.globalData)
          wx.setStorage({
            data: data.customerId,
            key:'customerId',
            success: function (res){
            }
          })
          wx.setStorage({
            data: data.openid,
            key:'openid',
            success: function (res){
            }
          })
          _this.isLoginBtn(data.customerId, data.openid)
          _this.cartCount()
        })
      }
    })

     /**
     * 网络判断
     */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        wx.showToast({
          title: '没有网了哦',
          duration: 2000,
        })
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        wx.setStorage({
          data: res.statusBarHeight,
          key:'statusBarHeight',
          success: function (res){
          }
        })
      }
  })


    /**
     * 校验当前用户的session_key是否有效
     */
    wx.checkSession({
      success: res => {
        wx.getSetting({
          success (res){
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function(res) {
                  let data = res
                  wx.getStorage({
                    key: 'openid',
                    success (res) {
                      data.openId = res.data
                      api.weChatGetUserInfo({
                        data
                      }).then(res=>{
                        if(res.data.code == 0) {
                          wx.setStorage({
                            data: true,
                            key:'userInfor',
                            success: function (res){
                            }
                          })
                        } else {
                          wx.showToast({
                            title: res.data.message,
                            icon: 'none'
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          }
        })
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        wx.login() //重新登录
      }
    })
  },

  /**
   * 查看是否登录
   */
  isLoginBtn(customerId, openid){
    let that = this
    const data = {
      authCode: openid,
      authType: 'mall',
      cutomerId: customerId
    }
    api.isLoginApi({
      data
    }).then(res=>{
      let isLoginApi = 0
      if(res.data.code == 0) {
        isLoginApi = 1
        wx.setStorage({
          data: isLoginApi,
          key:'isLoginApi',
          success: function (res){
          }
        })
        wx.setStorage({
                data: res.data.data.token || '',
                key:'token',
                success: function (res){
                }
            })
            wx.setStorage({
              data: res.data.data.phone || '',
              key:'phone',
              success: function (res){
              }
            })
      } else {
        wx.setStorage({
          data: isLoginApi,
          key:'isLoginApi',
          success: function (res){
          }
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
   * 获取设备信息
   */
  getDeviceSize: function() {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success: function(res) {
          const {screenHeight, safeArea} = res
          const {bottom} = safeArea
          const bottomLift = screenHeight - bottom
          resolve({bottomLift})
        }
      })
    })
  },

  /**
   * 获取小程序更新机制
   */
  autoUpdate () {
    const self = this
    if(wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        if (res.hasUpdate) { // 检测到有新版本
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序？',
            success: function(res) {
              if (res.confirm) {
                self.downLoadAndUpdate(updateManager)
              } else {
                wx.showModal({
                  title: '温馨提示~',
                  content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                  showCancel:false,//隐藏取消按钮
                  confirmText:"确定更新",//只保留确定更新按钮
                  success: function(res) {
                    if (res.confirm) {
                      //下载新版本，并重新应用
                      self.downLoadAndUpdate(updateManager)
                    }
                  }
                })

              }
            }
          })

        }
      })
    }
    

  },

  /**
   * 下载小程序新版本并重启应用
   */
  downLoadAndUpdate (updateManager){
    var self=this
    wx.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function () {
      wx.hideLoading()
      //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '已经有新版本了哟~',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      })
    })
  },

  globalData: {
    userInfo: '',
    returnVal: 0,
    openid: '',
    token: '',
    customerId: '',
    classId: '',
    returnId: '',
    shoppingTrolleyNum: 1
  }
})