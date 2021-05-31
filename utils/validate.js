
// 姓名验证
function nameEncrypt(name) {
  const myregs =/^(?![-.''])(?!.*?[-.'']$)[\u4E00-\u9FA5][A-Za-z]+$/
  let flag = false
  if(!myregs.test(name)) {
    if(name.length < 2 || name.length > 15) {
      flag = false
    } else {
      flag = true
    }
    return flag
  }
}

// 手机号验证
function phoneEncrypt (phone) {
  const myreg = /^[1][3,4,5,7,8,6,2,9][0-9]{9}$/;
  const tel = /^0\d{2,3}-?\d{7,8}$/;
  let flag = false
  phone = phone || ''
  if(phone.length === 11) {
    if(!myreg.test(phone)) {
      flag = false
    } else {
      flag = true
    }
  } else {
    if(!tel.test(phone)) {
      flag = false
    } else {
      flag = true
    }
  }
  return flag
}

// 邮箱验证
function emailEncrypt (email) {
  const myreg = /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
  let flag = false
  email = email || ''
  if(!myreg.test(email)) {
    flag = false
  } else {
    flag = true
  }
  return flag
}


module.exports = {
  phoneEncrypt: phoneEncrypt,
  nameEncrypt: nameEncrypt,
  emailEncrypt: emailEncrypt
}