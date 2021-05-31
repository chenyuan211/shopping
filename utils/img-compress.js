function ImageCompression (img, tempFilesSize,getImgsuccess) {
  wx.getFileSystemManager().readFile({
    filePath: img, // 选择图片返回的相对路径
    encoding: 'base64', // 编码格式
    success: res => { // 成功的回调
      getImgsuccess(res)
    }
  })
}


module.exports = {
  ImageCompression
}