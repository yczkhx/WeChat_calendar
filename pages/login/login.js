//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    username: '',
    password: ''
  },
  onLoad: function () {

  },


  // 获取输入账号 
  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },


  // 登录处理
  login: function () {
    var that = this;
    console.log(this.data.username)
    console.log(this.data.password)
    if (this.data.username.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '账号或密码不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: 'https://www.rhysdid.site:8082/doctor/login', //这里填写你的接口路径
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          id: that.data.username,
          passwd1: that.data.password
        },
        success(res) {
          console.log(that.data.username)
          console.log(res)
          if (res.data.state == "success") {
            var unitId = that.data.username;
            wx.setStorageSync('unitId', unitId);
            wx.navigateTo({
              url: '../calendarV2/index?id=' + that.data.username,
            })
          } else {
            var title=""
            if(res.data.state=="idwrong")
            {
              title="账号错误，请重新登录"
            }
            if(res.data.state=="passwrong")
            {
              title="密码错误，请重新登录"
            }
            wx.showToast({
              title: title,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  }
})
