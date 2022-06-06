// pages/recommendSong/recommendSong.js

import request from '../../../utils/Api/request'
import PubSub from 'pubsub-js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        day:'',//日
        month:'',//月
        recommendSongList:[],//推荐歌曲列表
        index:0 //当前点击的歌曲index
    },
    // 获取每日推荐列表数据
   async getRecommendList(){
      let songList = await request('/recommend/songs')
    //   console.log(songList);
      this.setData({
        recommendSongList:songList.recommend
      })
    },
    // 处理点击歌曲跳转至播放页面
    // 原本是打算把歌曲信息通过query参数传递到另外一个页面 但小程序传递参数会将参数截取一部分 限制大小 因此无法正常传递整个对象 所以考虑使用传递歌曲id 在另外一个页面发送请求获取歌曲详情
    handleRoutePlay(event){
      let songDetailId = event.currentTarget.dataset.song.id;
      let index = event.currentTarget.dataset.index;
      console.log(index);
      this.setData({
        index
      })
      // console.log(event);
      wx.navigateTo({
        url: `/packageA/pages/songDetail/songDetail?song=${songDetailId}`,
      })
      // console.log(songDetailId);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取每日推荐歌曲前先判断有没有登录
        let loginStatus = wx.getStorageSync('cookies')
        if(!loginStatus) {
            wx.showToast({
              title: '请先登录',
              success:()=>{
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
              }
            })
        }
        this.setData({
            day:new Date().getDate(),
            month:new Date().getMonth()+1
        })
        // 已登录 获取每日推荐列表数据
        this.getRecommendList();
        // 订阅切歌事件
        PubSub.subscribe('switchMusic',(msg,type)=>{
          // console.log(msg,type);
          let {index} = this.data
          // 判断切歌类型 定位歌曲
          if(type=='next'){
            (index === this.data.recommendSongList.length -1) && (index = -1)
            index+=1;
          }else{
            (index === 0) && (index =this.data.recommendSongList.length)
            index-=1;
          }
          this.setData({
            index
          })
          // console.log(index);
          // 回传歌曲id到播放页面
          let id = this.data.recommendSongList[index].id
          PubSub.publish('sendIdToSongDetail',id)
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
      PubSub.unsubscribe('switchMusic')
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})