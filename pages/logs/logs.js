// logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    date: '',
    minDate: new Date(2021, 4, 1).getTime(),
    maxDate: new Date(2021, 6, 31).getTime(),
    nowDate: new Date().getTime(),
    allEvent:[],
    dayEvent:[
      {
        title:'aaaaa',
        startTime:'10:30',
        endTime:'11:30'
      },
      {
        title:'vvvvv',
        startTime:'14:30',
        endTime:'15:30'
      }
    ],
    calendarConfig: {
      multi: true, // 是否开启多选,
      weekMode: true, // 周视图模式
      theme: 'elegant', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题色在参考 /theme 文件夹
      showLunar: true, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      inverse: true, // 单选模式下是否支持取消选中,
      markToday: '今', // 当天日期展示不使用默认数字，用特殊文字标记
      hideHeader: true, // 隐藏日历头部操作栏
      takeoverTap: true, // 是否完全接管日期点击事件（日期不会选中)
      emphasisWeek: true, // 是否高亮显示周末日期
      chooseAreaMode: true, // 开启日期范围选择模式，该模式下只可选择时间段
      showHolidays: true, // 显示法定节假日班/休情况，需引入holidays插件
      showFestival: true, // 显示节日信息（如教师节等），需引入holidays插件
      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      defaultDate: '2018-3-6', // 默认选中指定某天，如需选中需配置 autoChoosedWhenJump: true
      preventSwipe: true, // 是否禁用日历滑动切换月份
      firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
      autoChoosedWhenJump: true, // 设置默认日期及跳转到指定日期后是否需要自动选中
      disableMode: {
        // 禁用某一天之前/之后的所有日期
        type: 'after', // [‘before’, 'after']
        date: '2020-3-24' // 无该属性或该属性值为假，则默认为当天
      },
    },
    calendar:{}
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    const that = this
    wx.request({
      url: 'https://www.rhysdid.site:8082/doctor/login', //这里填写你的接口路径
      header: { 
          'Content-Type': 'application/json'
      },
      data: {
        id:"2020001",
        passwd1:123456
      },
      success: function(res) {
      //这里就是请求成功后，进行一些函数操作
        console.log(res.data)
      }
    })
    wx.request({
      url: 'https://www.rhysdid.site:8082/doctor/as', //这里填写你的接口路径
      header: { 
          'Content-Type': 'application/json'
      },
      data: {
      },
      success: function(res) {
      //这里就是请求成功后，进行一些函数操作
      that.allEvent = res.data
        console.log(that.allEvent)

      }
    })
    this.calendar = this.selectComponent('#calendar').calendar
    console.log(this.calendar)
    this.calendar.jump({year:2018, month:6, date:6 })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  initData() {
    console.log("aaaa")
    return 'aaaa'
  },
  formatter(day) {
    const month = day.date.getMonth() + 1;
    const date = day.date.getDate();
    if (month === 5) {
      if (date === 1) {
        day.bottomInfo = '劳动节';
      } else if (date === 4) {
        day.bottomInfo = '五四青年...';
      } else if (date === 11) {
        day.text = '今天';
      }
    }
    console.log(this.aaas)
    //this.initData();
    //console.log(this.allEvent)
    return day;
  },
})

