import todo from '../../component/v2/plugins/todo'
import selectable from '../../component/v2/plugins/selectable'
import solarLunar from '../../component/v2/plugins/solarLunar/index'
import timeRange from '../../component/v2/plugins/time-range'
import week from '../../component/v2/plugins/week'
import holidays from '../../component/v2/plugins/holidays/index'
import plugin from '../../component/v2/plugins/index'
plugin
  .use(todo)
  .use(solarLunar)
  .use(selectable)
  .use(week)
  .use(timeRange)
  .use(holidays)

const conf = {
  data: {
    calendarConfig: {
      weekMode: false, // 周视图模式
      theme: 'default', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题色在参考 /theme 文件夹
      //showLunar: true, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      //inverse: true, // 单选模式下是否支持取消选中,
      markToday: '今', // 当天日期展示不使用默认数字，用特殊文字标记
      hideHeader: false, // 隐藏日历头部操作栏
      takeoverTap: true, // 是否完全接管日期点击事件（日期不会选中)
      emphasisWeek: true, // 是否高亮显示周末日期
      showHolidays: true, // 显示法定节假日班/休情况，需引入holidays插件
      showFestival: true, // 显示节日信息（如教师节等），需引入holidays插件
      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      preventSwipe: false, // 是否禁用日历滑动切换月份
      firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: false, // 日历面板是否只显示本月日期
      autoChoosedWhenJump: true, // 设置默认日期及跳转到指定日期后是否需要自动选中
    },
    dayEvent: [],
    allEvent: [],
    calendarEvent: [],
    lastSelect: [],
    nowSelect: {},
    show: false,
    showpop: false,
    nowTimeType: '',
    currentDate: '',
    currentDate_cha: '',
    time_start: '',
    time_end: '',
    newTitle: '',
    showChangepop: false,
    showChange: false,
    newTitle_cha: '',
    time_start_cha: '',
    time_end_cha: '',
    nowTimeType_cha: '',
    changeIndex:0,
  },
  onLoad() {
    console.log('onload')
    const that = this
    wx.request({
      url: 'https://www.rhysdid.site:8082/doctor/login', //这里填写你的接口路径
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        id: "2020001",
        passwd1: 123456
      },
      success: function (res) {
        //这里就是请求成功后，进行一些函数操作
        console.log(res.data)
      }
    })
    that.con()
    console.log(that.data.allEvent)
  },
  con() {
    var that = this
    console.log(that)
    that.data.allEvent = []
    that.data.calendarEvent = []
    wx.request({
      url: 'https://www.rhysdid.site:8082/doctor/as', //这里填写你的接口路径
      header: {
        'Content-Type': 'application/json'
      },
      data: {},
      success: function (res) {
        //这里就是请求成功后，进行一些函数操作
        that.setData({
          allEvent: res.data.activities
        })
        //that.data.allEvent = res.data.activities
        console.log(that.data.allEvent)
        that.data.allEvent.forEach(x => {
          console.log(x)
          if (x.date.slice(5, 6) == '0') {
            that.data.calendarEvent.push({
              year: x.date.slice(0, 4),
              month: x.date.slice(6, 7),
              date: x.date.slice(8, 10),
            })
          } else {
            that.data.calendarEvent.push({
              year: x.date.slice(0, 4),
              month: x.date.slice(5, 7),
              date: x.date.slice(8, 10),
            })
          }
        })
        console.log(that.data.calendarEvent)
        const calendar = that.selectComponent('#calendar').calendar
        calendar.setTodos({
          // 待办点标记设置
          pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
          dotColor: '#7fccde', // 待办点标记颜色
          //circle: true, // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
          showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
          dates: that.data.calendarEvent
        })
      }
    })
  },
  afterTapDate(e) {

  },
  whenChangeMonth(e) {

  },
  whenChangeWeek(e) {

  },
  takeoverTap(e) {
    // console.log('takeoverTap', e.detail)
    // console.log(this.data.allEvent)
    const calendar = this.selectComponent('#calendar').calendar
    calendar.setDateStyle([{
      year: e.detail.year,
      month: e.detail.month,
      date: e.detail.date,
      class: 'select'
    }])
    calendar.setDateStyle(this.data.lastSelect)
    this.setData({
      lastSelect: [{
        year: e.detail.year,
        month: e.detail.month,
        date: e.detail.date,
        class: 'unselect'
      }],
      nowSelect: {
        year: e.detail.year,
        month: e.detail.month,
        date: e.detail.date
      }
    })
    var thisDayEvent = []
    this.data.allEvent.forEach(x => {
      if (x.date.slice(0, 4) == e.detail.year && x.date.slice(6, 7) == e.detail.month && x.date.slice(8, 10) == e.detail.date) {
        if (x.time_start == null) {
          x.time_start = '00:00:00'
          x.time_end = '24:00:00'
        }
        thisDayEvent.push({
          title: x.detail,
          startTime: x.time_start,
          endTime: x.time_end,
          id: x.activity_id
        })
      }
    })
    this.setData({
      dayEvent: thisDayEvent
    })
  },
  afterCalendarRender(e) {
    //console.log('afterCalendarRender', e)
    console.log(this.data.calendarEvent)
    // 获取日历组件上的 calendar 对象

  },
  onSwipe(e) {
    console.log('onSwipe', e)
  },
  newEvent() {
    console.log(this.data.nowSelect)
    this.setData({
      show: true
    })
  },
  // 新建事件dialog关闭
  onClose() {
    this.setData({
      show: false
    });
  },
  // 修改事件dialog关闭
  onClose_cha() {
    this.setData({
      showChange: false
    });
  },
  // 新建事件点击时间输入框唤醒时间选择器
  clickStart() {
    this.setData({
      showpop: true,
      nowTimeType: 'start'
    })
  },
  // 修改事件点击时间输入框唤醒时间选择器
  clickStart_cha() {
    this.setData({
      showChangepop: true,
      nowTimeType_cha: 'start'
    })
  },
  // 新建事件点击时间输入框唤醒时间选择器
  clickEnd() {
    this.setData({
      showpop: true,
      nowTimeType: 'end'
    })
  },
  // 修改事件点击时间输入框唤醒时间选择器
  clickEnd_cha() {
    this.setData({
      showChangepop: true,
      nowTimeType_cha: 'end'
    })
  },
  // 新建事件时间选择器确认
  setTime(value) {
    var time = value.detail
    console.log(time)
    if (this.data.nowTimeType == 'start') {
      this.setData({
        time_start: time
      })
    } else if (this.data.nowTimeType == 'end') {
      this.setData({
        time_end: time
      })
    }
    this.onpopClose()
  },
  // 修改事件时间选择器确认
  ChangeTime(value) {
    var time = value.detail
    console.log(time)
    if (this.data.nowTimeType_cha == 'start') {
      this.setData({
        time_start_cha: time
      })
    } else if (this.data.nowTimeType_cha == 'end') {
      this.setData({
        time_end_cha: time
      })
    }
    this.onChangepopClose()
  },
  // 新建事件时间选择器关闭
  onpopClose() {
    this.setData({
      showpop: false
    });
  },
  // 修改事件时间选择器关闭
  onChangepopClose() {
    this.setData({
      showChangepop: false
    });
  },
  //dialog确认，向后端发送新建事件
  sendNewEvent() {
    const that = this
    console.log(this.data.newTitle)
    console.log(this.data.nowSelect)
    if (this.data.nowSelect.year == null) {
      //console.log('aaa')
      wx.showToast({
        title: '请选择日期！',
        icon: 'none',
        duration: 1500
      })
    } else {
      if (this.data.nowSelect.month < 10) {
        var date = this.data.nowSelect.year + '-' + '0' + this.data.nowSelect.month + '-' + this.data.nowSelect.date
      } else if (this.data.nowSelect.month >= 10) {
        var date = this.data.nowSelect.year + '-' + this.data.nowSelect.month + '-' + this.data.nowSelect.date
      }
      wx.request({
        url: 'https://www.rhysdid.site:8082/doctor/new', //这里填写你的接口路径
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          date1: date,
          time_start1: that.data.time_start + ':00',
          time_end1: that.data.time_end + ':00',
          detail: that.data.newTitle,
          type: "0",
        },
        success: function (res) {
          //这里就是请求成功后，进行一些函数操作
          console.log(res.data)
          that.con()
          var newAr = that.data.dayEvent
          newAr.push({
            title: that.data.newTitle,
            startTime: that.data.time_start + ':00',
            endTime: that.data.time_end + ':00'
          })
          that.setData({
            dayEvent: newAr
          })
          
          wx.showToast({
            title: '操作成功！',
            icon: 'success',
            duration: 1500
          })
        }
      })
    }
  },
  //dialog确认，向后端发送修改事件
  sendChangeEvent(res) {
    const that = this
    console.log(this.data.newTitle_cha)
    console.log(this.data.nowSelect)
    var ind = this.data.changeIndex
    console.log(this.data.dayEvent)
    console.log(this.data.dayEvent[ind])
    if (this.data.newTitle_cha == '' || this.data.time_start_cha == '' || this.data.time_end_cha == '') {
      //console.log('aaa')
      wx.showToast({
        title: '请填写完整！',
        icon: 'none',
        duration: 1500
      })
    } else {
      if (this.data.nowSelect.month < 10) {
        var date = this.data.nowSelect.year + '-' + '0' + this.data.nowSelect.month + '-' + this.data.nowSelect.date
      } else if (this.data.nowSelect.month >= 10) {
        var date = this.data.nowSelect.year + '-' + this.data.nowSelect.month + '-' + this.data.nowSelect.date
      }
      wx.request({
        url: 'https://www.rhysdid.site:8082/doctor/correct', //这里填写你的接口路径
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          activity_id: this.data.dayEvent[ind].id,
          date1: date,
          time_start1: this.data.time_start_cha + ':00',
          time_end1: this.data.time_end_cha + ':00',
          detail: this.data.newTitle_cha,
          type: '0',
          sta: 1,
        },
        success: function (res) {
          //这里就是请求成功后，进行一些函数操作
          console.log(res.data)
          that.con()
          var newAr = that.data.dayEvent
          newAr[ind].title = that.data.newTitle_cha
          newAr[ind].startTime = that.data.time_start_cha + ':00'
          newAr[ind].endTime = that.data.time_end_cha + ':00'
          that.setData({
            dayEvent: newAr
          })
          
          wx.showToast({
            title: '操作成功！',
            icon: 'success',
            duration: 1500
          })
        }
      })
    }
  },
  // 新建事件标题输入框输入
  onNewChange(event) {
    this.setData({
      newTitle: event.detail
    })
  },
  // 修改事件标题输入框输入
  onNewChange_cha(event) {
    this.setData({
      newTitle_cha: event.detail
    })
  },
  //删除按钮点击事件
  deleteEvent(res) {
    var ind = res.currentTarget.dataset.index
    var that = this
    console.log(this.data.dayEvent[ind])
    wx.request({
      url: 'https://www.rhysdid.site:8082/doctor/delete', //这里填写你的接口路径
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        id: '2020001',
        activity_id: this.data.dayEvent[ind].id,
      },
      success: function (res) {
        //这里就是请求成功后，进行一些函数操作
        console.log(res.data)
        that.con()
        var newAr = that.data.dayEvent
        newAr.splice(ind,1)
        that.setData({
          dayEvent: newAr
        })
        wx.showToast({
          title: '操作成功！',
          icon: 'success',
          duration: 1500
        })
      }
    })
  },
  // 修改按钮唤起dialog
  OpenChange(res) {
    var ind = res.currentTarget.dataset.index
    this.setData({
      showChange: true,
      changeIndex: ind
    })
  },
}

Page(conf)