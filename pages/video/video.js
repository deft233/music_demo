// pages/video/video.js
import request from '../../utils/Api/request'
import {
  debounce
} from '../../utils/tools'
Page({

      /**
       * 页面的初始数据
       */
      data: {
        videoGroupList: [],
        navId: '',
        videoList: [],
        videoId: '',
        historyVideo: [], //历史播放视频
        isTrigger: false
      },
      // 跳转至搜索界面
      searchMusic(){
        wx.navigateTo({
          url: '/pages/search/search',
        })
      },
      // 获取视频标签列表
      async getVideoGroupList() {
        let resVideoList = await request('/video/group/list')
        this.setData({
          videoGroupList: resVideoList.data.slice(0, 14),
          navId: resVideoList.data[0].id
        })
        // console.log(resVideoList);
      },
      async getVideoList(navId) {
        let resVideo = await request('/video/group', {
          id: navId
        })
        let index = 0;
        wx.hideLoading()
        let videoList = resVideo.datas.map(item => {
          item.id = index++;
          return item
        })
        this.setData({
          videoList
        })
      },
      // 处理点击选中
      handleChecked(event) {
        // console.log(event);
        this.setData({
          navId: event.target.dataset.id,
          curVideoList: []
        })
        wx.showLoading({
          title: '正在加载'
        })
        this.getVideoList(event.target.dataset.id);
      },
      // 处理播放和暂停事件
      /**
       * 在播放下一个视频的时候暂停上一个在播放的视频
       * 1.如何找到上一个播放的视频
       * 2.如何确定点击播放的视频和正在播放的视频不是同一个
       * 使用videocontext记录当前播放的video
       * 单例设计模式
       * 始终只用一个变量接收实例 后边创建的实例覆盖前边的实例 节省内存空间
       */
      handlePlay(event) {
        this.vid && this.vid != event.target.id && this.videoContext && this.videoContext.stop();
        this.videoContext = wx.createVideoContext(event.target.id);
        this.vid = event.target.id;
        // console.log('play'+videoContext);
        this.setData({
          curVideoId: event.target.id
        })
        // 先判断历史播放数组有无当前要播放的video组件 有则seek
        let historyVideoItem = this.data.historyVideo.find(item => item.id == event.target.id)
        if (historyVideoItem) {
          this.videoContext.seek(historyVideoItem.curTime)
        } else
          this.videoContext.play()
        // console.log('?');
      },
      // 将播放的视频保存到记录中 此处不应该用防抖 因为播放视频都共同执行这个函数 快速的连续播放多个视频不能将不同视频加入到历史记录中
      handleHistoryVideo: function handleHistoryVideo(event) {
        let {
          historyVideo
        } = this.data;
        let historyVideoItem = {
          id: event.target.id,
          curTime: event.detail.currentTime
        }
        // 如果原数组没有该视频push 有则更新时间
        if (!historyVideo.find(item => {
            if (item.id == historyVideoItem.id) {
              item.curTime = historyVideoItem.curTime
              return true
            }
          }))
          historyVideo.push(historyVideoItem)
        // console.log(event);
      },
      // 播放结束的处理 从历史播放数组中删除该video
      handlePlayEnding: function (event) {
        let curItemId = event.target.id
        let {
          historyVideo
        } = this.data
        historyVideo = historyVideo.filter(item => item.id != curItemId)
        this.setData({
          historyVideo
        })
      },
      // 自定义下拉刷新重新加载数据 false 表示下拉刷新未被触发 触发后需要手动关闭下拉刷新
      async handleRefresh() {
        console.log('重新加载数据');
        await this.getVideoList(this.data.navId)
        this.setData({
          isTrigger: false
        })
      },
      // 下拉触底刷新 
      async handleRefreshBottom() {
        console.log('下拉触底刷新');
        // 此处应该实现分页功能 前端分页和后端分页 一般为后端分页
        // 但没有相应的api 我们这样处理 将请求数据再次接上模拟分页效果
        let resVideo = await request('/video/group', {
          id: this.data.navId
        })
        let index = 0;
        // wx.hideLoading()
        let videoList = resVideo.datas.map(item => {
          item.id = index++;
          return item
        })
        this.data.videoList.push(...videoList)
        this.setData({
          videoList: this.data.videoList
        })
      },
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
        this.getVideoGroupList().then(reason => {
          // 确保执行时机
          this.getVideoList(this.data.navId)
        })
      },

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: function () {

      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function () {

      },

      /**
       * 生命周期函数--监听页面隐藏
       */
      onHide: function () {

      },

      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: function () {

      },

      /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
      onPullDownRefresh: function () {
        console.log('页面下拉');
      },

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function () {
        console.log('页面上拉');
      },

      /**
       * 用户点击右上角分享 或者点击了open-type为share的button
       */
      onShareAppMessage: function ({
        from
      }) {
        console.log(from);
        if (from == 'button')
          return {
            title: '来自button的转发',
            path: '/pages/login/login',
            imageUrl: '/static/images/shanniruo.jpg'
          }
        else 
          return {
            title: '来自menu的转发',
            path: '/pages/login/login',
            imageUrl: '/static/images/shanniruo.jpg'
          }
      }
      })