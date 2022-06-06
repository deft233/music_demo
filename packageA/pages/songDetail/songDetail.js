import request from '../../../utils/Api/request'
import PubSub from 'pubsub-js'
// pages/songDetail/songDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, //歌曲是否正在播放
        songDetailList: [], //歌曲详情列表
        musicUrl:'', //歌曲的地址
        stime:'0:00',//歌曲开始时长
        dtime:'',//歌曲总时长
        currentLength:0, //进度条实时长度
    },
    // 控制歌曲是否播放
    handleMusicPlay() {
        let isPlay = !this.data.isPlay
        // this.setData({
        //     isPlay
        // })
        this.songPlayControll(isPlay, this.data.songDetailList[0].id,this.data.musicUrl)
    },
    // 控制歌曲是否播放功能
    async songPlayControll(isPlay, id,musicUrl) {
        // console.log(isPlay);   
        if (isPlay) {
            // 播放歌曲
            if(!musicUrl){
                let resSongData = await request('/song/url', {
                    id: id
                })
                let resSongUrl = resSongData.data[0].url;
                this.setData({
                    musicUrl:resSongUrl
                })
            }  
            //   console.log(resSongUrl,this.data.songDetailList[0].name);
            this.BackgroundAudioManager.src = this.data.musicUrl;
            this.BackgroundAudioManager.title = this.data.songDetailList[0].name
        } else {
            this.BackgroundAudioManager.pause()
        }
    },
    // 通过id发送请求获取歌曲信息
    async getSongDetailById(id) {
        let songDetailRes = await request('/song/detail', {
            ids: id
        })
           console.log(songDetailRes);
           let dtime = songDetailRes.songs[0].dt/1000
           dtime = Math.floor(dtime/60)+':'+Math.floor(dtime%60)
        this.setData({
            songDetailList: songDetailRes.songs,
            dtime
        })
        // 动态设置 导航栏的标题
        wx.setNavigationBarTitle({
            title: this.data.songDetailList[0].name
        })
    },
    changePlayStatus(isPlay){
        this.setData({
            isPlay
        })
        this.appInstance.globalData.isMusicPlay = isPlay;
    },
    // 处理切歌的函数
    handleSwitch(event){
        let type = event.currentTarget.id
        // console.log(type);
        // 发布切歌的事件
        PubSub.publish('switchMusic',type)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    // 
    onLoad: function (options) {
        // console.log(JSON.parse(options.song));
        // 判断是否有播放记录 如有则同步播放   
        this.appInstance = getApp();
        if(this.appInstance.globalData.isMusicPlay && this.appInstance.globalData.musicId == options.song){
            this.setData({
                isPlay:true
            })
        }
        // console.log(this.appInstance.globalData);
        // console.log(options);
        this.getSongDetailById(options.song);
        this.BackgroundAudioManager = wx.getBackgroundAudioManager() //let 作用于块级作用域 在if里定义的变量在else不生效 
        this.BackgroundAudioManager.onPlay(()=>{
            // console.log('onPlay');
            // 缓存正在播放歌曲的状态和id
            this.appInstance.globalData.musicId = options.song;
            this.changePlayStatus(true)
        })
        this.BackgroundAudioManager.onPause(()=>{
            // console.log('onPause');
            this.changePlayStatus(false)
        })
        this.BackgroundAudioManager.onStop(()=>{
            this.changePlayStatus(false)
        })
        // 监听音频正在播放事件
        this.BackgroundAudioManager.onTimeUpdate(()=>{
            // console.log(this.BackgroundAudioManager.currentTime);
            // 实时长度
            let currentLength = this.BackgroundAudioManager.currentTime/this.BackgroundAudioManager.duration *420
            let stime = this.BackgroundAudioManager.currentTime
            stime = Math.floor(stime/60)+':'+Math.floor(stime%60)
            this.setData({
                stime,
                currentLength
            })
        })
        // 自动播放结束 到下一首
        this.BackgroundAudioManager.onEnded(()=>{
            PubSub.publish('switchMusic','next');
        })
        // 订阅事件 推荐页面传递id
        PubSub.subscribe('sendIdToSongDetail',(msg,id)=>{
            // console.log(id);
            // 重新获取切换到的歌曲信息
            this.getSongDetailById(id);
            // 先暂停上一首歌曲
            this.BackgroundAudioManager.pause();
            // 自动播放切换到的歌曲
            this.songPlayControll(true,id)
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
        PubSub.unsubscribe('sendIdToSongDetail')
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