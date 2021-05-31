const Raven = require('./raven.min.js')
const HOST =  'https://client.test.yzchn.com/'  //'http://119.119.1.176:8089/' 
const loading = {
  count: 0,
  isLoading: false,
  isManual: false,
  start () {
    this.count += 1
    if (this.isManual) return
    setTimeout(() => {
      if (this.count > 0) {
        wx.showLoading({ title: '加载中' })
      }
    }, 1000)
  },
  cancel () {
    this.count -= 1
    if (this.isManual) return
    if (this.count <= 0) {
      this.count = 0
      wx.hideLoading()
    }
  }
}
function createRequest (method, url, data, header) {
  return new Promise((resolve, reject) => {
    loading.start()
    const newMethod = method.toUpperCase()
      wx.request({
        url: url,
        data: data || {},
        header: header || {},
        method: newMethod,
        success: function (res) {
          loading.cancel()
          resolve(res)
        },
        fail: function (res) {
          Raven.captureBreadcrumb({
            category: 'ajax',
            data: {
              method: newMethod,
              url: url,
              status_code: -1
            }
          })
          Raven.captureMessage(JSON.stringify(res), {
            level: 'error'
          })
          loading.isManual = false
          wx.hideLoading()
          loading.cancel()
          wx.showToast({
            title: '网络异常，请稍后再试',
            icon: 'none'
          })
          reject(new Error(res.errMsg))
        }
      })
    })
}


function homRequest (method, url, opts) {
  opts = opts || {}
  const data = opts.data || {}
  const header = opts.header || {}
  if(url == 'common/imgUpload') {
    header['Content-Type'] = header['Content-Type'] || 'multipart/form-data'
   } else {
    header['Content-Type'] = header['Content-Type'] || 'application/x-www-form-urlencoded'
  }
  try {
    if(wx.getStorageSync('token')) {
      header['token'] = wx.getStorageSync('token')
    }
    if(wx.getStorageSync('customerId')) {
      header['customerId'] = wx.getStorageSync('customerId')
    }
    header['type'] = 'mall'
  } catch(e) {

  }
  return createRequest(method, HOST + url, data, header)
}
/**
 * 微信小程序登录验证
 */
function loginAndSign (opts) {
  return homRequest('GET', 'weChat/login', opts, HOST)
}

/**
 * 微信小程序手机号授权登陆
 */
function weChatloginByPhone (opts) {
  return homRequest('POST', 'weChat/loginByPhone', opts, HOST)
}

/**
 * 查看是否登录
 */
function isLoginApi (opts) {
  return homRequest('GET', 'customer/isLogin', opts, HOST)
}

/**
 * 登陆
 */
function Login (opts) {
  return homRequest('POST', 'customer/login', opts, HOST)
}

/**
 * 获取验证码
 */
function verificationCode (opts) {
  return homRequest('GET', 'sms/send', opts, HOST)
}

/**
 * 退出登陆
 */
function logout (opts) {
  return homRequest('POST', 'customer/logout', opts, HOST)
}

/**
 * 更换手机号
 */
function changePhone (opts) {
  return homRequest('POST', 'customer/changePhone', opts, HOST)
}

/**
 * 
 * 获取首页分类类别
 */
function homekindList(opts) {
  return homRequest('GET', 'home/kindList', opts, HOST)
}

/**
 * 首页Banner
 */
function homeBanner(opts) {
  return homRequest('GET', 'home/banner', opts, HOST)
}

/**
 * 获取首页广告
 */
function homeAdvert(opts) {
  return homRequest('GET', 'home/advert', opts, HOST)
}

/**
 * 获取首页分类对应的产品
 */
function productListList(opts) {
  return homRequest('GET', 'home/productList', opts, HOST)
}

/**
 * 获取首页分类对应的产品
 */
function productDetail(opts) {
  return homRequest('GET', 'product/detail', opts, HOST)
}

/**
 * 获取省份
 */
function commonProvince(opts) {
  return homRequest('GET', 'common/province', opts, HOST)
}

/**
 * 获取城市列表
 */
function commonCity(opts) {
  return homRequest('GET', 'common/addressList', opts, HOST)
}

/**
 * 获取产品规格
 */
function productAttribute(opts) {
  return homRequest('GET', 'product/getSkuList', opts, HOST)
}

/**
 * 购物车列表
 */
function cartList(opts) {
  return homRequest('GET', 'cart/list', opts, HOST)
}

/**
 * 删除购物车商品
 */
function cartDelete(opts) {
  return homRequest('POST', 'cart/delete', opts, HOST)
}


/**
 * 清空失效商品
 */
function cartClear(opts) {
  return homRequest('POST', 'cart/clear', opts, HOST)
}

/**
 * 清空失效商品
 */
function cartUpdateQuantity(opts) {
  return homRequest('POST', 'cart/updateQuantity', opts, HOST)
}

/**
 * 新增收货地址
 */
function deliveryAddressInsert(opts) {
  return homRequest('POST', 'deliveryAddress/insert', opts, HOST)
}

/**
 * 获取产品SKU
 */
function productGetSku(opts) {
  return homRequest('GET', 'product/getSkuList', opts, HOST)
}

/**
 * 获取收货地址
 */
function deliveryAddress(opts) {
  return homRequest('GET', 'deliveryAddress/list', opts, HOST)
}

/**
 * 删除收货地址
 */
function deliveryAddressDel(opts) {
  return homRequest('POST', 'deliveryAddress/del', opts, HOST)
}

/**
 * 查询单个收货地详情
 */
function deliveryAddressInfo(opts) {
  return homRequest('GET', 'deliveryAddress/info', opts, HOST)
}

/**
 * 收货地址标签
 */
function deliveryAddressTags(opts) {
  return homRequest('GET', 'deliveryAddress/tags', opts, HOST)
}

/**
 * 收货地址--编辑
 */
function deliveryAddressUpdate(opts) {
  return homRequest('POST', 'deliveryAddress/update', opts, HOST)
}

/**
 * 获取版本号
 */
function versionGet(opts) {
  return homRequest('GET', 'version/get', opts, HOST)
}

/**
 * 优惠券
 */
function couponList(opts) {
  return homRequest('GET', 'coupon/list', opts, HOST)
}

/**
 * 优惠券未领取列表
 */
function couponListByProduct(opts) {
  return homRequest('GET', 'coupon/listByProduct', opts, HOST)
}

/**
 * 优惠券领取
 */
function couponGet(opts) {
  return homRequest('POST', 'coupon/get', opts, HOST)
}

/**
 * 加入购物车
 */
function cartInsert(opts) {
  return homRequest('POST', 'cart/insert', opts, HOST)
}

/**
 * 获取订单列表信息
 */
function mallOrderGetConfirmOrder(opts) {
  return homRequest('POST', 'mallOrder/getConfirmOrder', opts, HOST)
}

/**
 * 根据购物车选中项--计算价格
 */
function mallOrderCalcAmount(opts) {
  return homRequest('GET', 'mallOrder/calcAmount', opts, HOST)
}

/**
 * 获取快递方式
 */
function expressGetWay(opts) {
  return homRequest('GET', 'express/getWay', opts, HOST)
}

/**
 * 获取默认收货地址
 */
function deliveryAddressDefault(opts) {
  return homRequest('GET', 'deliveryAddress/getDefault', opts, HOST)
}

/**
 * 订单列表
 */
function mallOrderList(opts) {
  return homRequest('GET', 'mallOrder/list', opts, HOST)
}

/**
 * 确认完成
 */
function confirmReceiveOrder(opts) {
  return homRequest('POST', 'mallOrder/confirmReceiveOrder', opts, HOST)
}

/**
 * 取消订单
 */
function cancelUserOrder(opts) {
  return homRequest('POST', 'mallOrder/cancelUserOrder', opts, HOST)
}

/**
 * 浏览记录
 */
function readHistoryList(opts) {
  return homRequest('GET', 'readHistory/list', opts, HOST)
}

/**
 * 清空浏览记录
 */
function readHistoryClear(opts) {
  return homRequest('POST', 'readHistory/clear', opts, HOST)
}

/**
 * 退款理由
 */
function afterSaleReasonList(opts) {
  return homRequest('GET', 'afterSale/reasonList', opts, HOST)
}

/**
 * 获取客服电话
 */
function afterGetPhone(opts) {
  return homRequest('GET', 'afterSale/getPhone', opts, HOST)
}

/**
 * 订单详情
 */
function mallOrderDetail(opts) {
  return homRequest('GET', 'mallOrder/detail', opts, HOST)
}

/**
 * 拼团
 */
function groupGetBySku(opts) {
  return homRequest('GET', 'group/getBySku', opts, HOST)
}

/**
 * 拼团列表
 */
function groupListByProduct(opts) {
  return homRequest('GET', 'group/listByProduct', opts, HOST)
}

/**
 * 商品类型
 */
function productPromotionInfo(opts) {
  return homRequest('GET', 'product/promotionInfo', opts, HOST)
}

/**
 * 直购的立即购买
 */
function productBuyNow(opts) {
  return homRequest('POST', 'product/buyNow', opts, HOST)
}


/**
 * 最近一次开发票
 */
function billInfoe(opts) {
  return homRequest('POST', 'bill/info', opts, HOST)
}


/**
 * 添加发票
 */
function billInsert(opts) {
  return homRequest('POST', 'bill/insert', opts, HOST)
}


/**
 * 个人中心
 */
function customerMallInfo(opts) {
  return homRequest('GET', 'customer/mallInfo', opts, HOST)
}

/**
 * 意见反馈
 */
function feedbackTypeList(opts) {
  return homRequest('GET', 'feedback/typeList', opts, HOST)
}

/**
 * 意见提交
 */
function feedbackInsert(opts) {
  return homRequest('POST', 'feedback/insert', opts, HOST)
}

/**
 * 购物车数量
 */
function cartCount(opts) {
  return homRequest('GET', 'cart/count', opts, HOST)
}

/**
 * 微信绑定获取用户信息
 */
function weChatGetUserInfo (opts) {
  return homRequest('GET', 'weChat/getUserInfo', opts, HOST)
}

/**
 * 订单列表加购物车
 */
function cartInsertByOrder (opts) {
  return homRequest('POST', 'cart/insertByOrder', opts, HOST)
}

/**
 * 订单列表申请发票
 */
function billApply (opts) {
  return homRequest('POST', 'bill/apply', opts, HOST)
}

/**
 * 拼团详情
 */
function groupInfo (opts) {
  return homRequest('GET', 'group/info', opts, HOST)
}

/**
 * 查看物流
 */
function expressInfo (opts) {
  return homRequest('GET', 'express/info', opts, HOST)
}

/**
 * 参与拼团
 */
function groupJion (opts) {
  return homRequest('POST', 'group/join', opts, HOST)
}

/**
 * 提交订单
 */
function mallOrderGenerateOrder (opts) {
  return homRequest('POST', 'mallOrder/generateOrder', opts, HOST)
}

/**
 * 立即支付
 */
function mallOrderPayNow (opts) {
  return homRequest('POST', 'mallOrder/payNow', opts, HOST)
}

/**
 * 退款
 */
function afterSaleReturnApply (opts) {
  return homRequest('POST', 'afterSale/returnApply', opts, HOST)
}

/**
 * 优惠券数量
 */
function couponCount (opts) {
  return homRequest('GET', 'coupon/count', opts, HOST)
}

/**
 * 取消退款
 */
function afterSaleChanelReturn (opts) {
  return homRequest('POST', 'afterSale/chanelReturn', opts, HOST)
}

/**
 * 获取优惠券数量
 */
function countByCustomer (opts) {
  return homRequest('GET', 'coupon/countByCustomer', opts, HOST)
}

/**
 * 查询是否存在关联订单
 */
function mallOrderAllOrder (opts) {
  return homRequest('GET', 'mallOrder/allOrder', opts, HOST)
}

/**
 * 热搜
 */
function getHotSearch (opts) {
  return homRequest('GET', 'home/getHotSearch', opts, HOST)
}

/**
 * 搜索商品
 */
function getWords (opts) {
  return homRequest('GET', 'home/getWords', opts, HOST)
}

/**
 * 一级分类
 */
function getFirstCategory (opts) {
  return homRequest('GET', 'home/getFirstCategory', opts, HOST)
}

/**
 * 二级分类
 */
function getSecondCategory (opts) {
  return homRequest('GET', 'home/getSecondCategory', opts, HOST)
}

/**
 * 合并支付勾选
 */
function getTotalCount (opts) {
  return homRequest('GET', 'mallOrder/getTotalCount', opts, HOST)
}


/**
 * 今日特价
 */
function specialOffer (opts) {
  return homRequest('GET', 'home/specialOffer', opts, HOST)
}





const api = {
  Login: Login,
  logout: logout,
  cartList: cartList,
  getWords: getWords,
  getHotSearch: getHotSearch,
  specialOffer: specialOffer,
  cartClear: cartClear,
  couponGet: couponGet,
  cartInsert: cartInsert,
  isLoginApi: isLoginApi,
  homeBanner: homeBanner,
  homeAdvert: homeAdvert,
  versionGet: versionGet,
  couponList: couponList,
  cartDelete: cartDelete,
  commonCity: commonCity,
  changePhone: changePhone,
  homekindList: homekindList,
  loginAndSign: loginAndSign,
  productDetail: productDetail,
  productGetSku: productGetSku,
  afterGetPhone: afterGetPhone,
  getTotalCount: getTotalCount,
  mallOrderAllOrder: mallOrderAllOrder,
  getSecondCategory: getSecondCategory,
  mallOrderDetail: mallOrderDetail,
  weChatloginByPhone: weChatloginByPhone,
  getFirstCategory: getFirstCategory,
  verificationCode: verificationCode,
  productListList: productListList,
  commonProvince: commonProvince,
  productAttribute: productAttribute,
  cartUpdateQuantity: cartUpdateQuantity,
  deliveryAddressInsert: deliveryAddressInsert,
  deliveryAddress: deliveryAddress,
  deliveryAddressDel: deliveryAddressDel,
  deliveryAddressInfo: deliveryAddressInfo,
  deliveryAddressTags: deliveryAddressTags,
  deliveryAddressUpdate: deliveryAddressUpdate,
  couponListByProduct: couponListByProduct,
  mallOrderGetConfirmOrder: mallOrderGetConfirmOrder,
  mallOrderCalcAmount: mallOrderCalcAmount,
  expressGetWay: expressGetWay,
  deliveryAddressDefault: deliveryAddressDefault,
  mallOrderList: mallOrderList,
  confirmReceiveOrder: confirmReceiveOrder,
  cancelUserOrder: cancelUserOrder,
  readHistoryList: readHistoryList,
  readHistoryClear: readHistoryClear,
  afterSaleReasonList: afterSaleReasonList,
  groupGetBySku: groupGetBySku,
  groupListByProduct: groupListByProduct,
  productPromotionInfo: productPromotionInfo,
  productBuyNow: productBuyNow,
  billInfoe: billInfoe,
  billInsert: billInsert,
  customerMallInfo: customerMallInfo,
  feedbackTypeList: feedbackTypeList,
  feedbackInsert: feedbackInsert,
  cartCount: cartCount,
  weChatGetUserInfo: weChatGetUserInfo,
  cartInsertByOrder: cartInsertByOrder,
  billApply: billApply,
  groupInfo: groupInfo,
  expressInfo: expressInfo,
  groupJion: groupJion,
  mallOrderPayNow: mallOrderPayNow,
  mallOrderGenerateOrder: mallOrderGenerateOrder,
  afterSaleReturnApply: afterSaleReturnApply,
  afterSaleChanelReturn: afterSaleChanelReturn,
  couponCount: couponCount,
  countByCustomer: countByCustomer
}
module.exports = {
  ...api
}