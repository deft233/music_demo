// pages/personal/personal.js
let startY = 0;
let moveY = 0;
let endY = 0;

import request from '../../utils/Api/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        translateY: "translateY(0)",
        transition: "0",
        // 用户信息
        userInfo: {},
        // 最近播放列表
        recentPlayList:[]
    },
    toLogin() {
        wx.reLaunch({
            url: "/pages/login/login",
        })
    },
    handleTouchStart(event) {
        // console.log(event.touches[0].pageY);
        startY = event.touches[0].pageY;
        this.setData({

            transition: '0'
        })
    },
    handleTouchMove(event) {
        moveY = event.touches[0].pageY - startY;
        // console.log(moveY);
        if (moveY < 0) {
            return
        }
        if (moveY > 80) {
            moveY = 80;
        }
        this.setData({
            translateY: `translateY(${moveY}rpx)`
        })
    },
    handleTouchEnd(event) {
        // console.log(4321);
        this.setData({
            translateY: `translateY(0)`,
            transition: '.8s'
        })

    },
    async handleRecentPlay(uid){
        let index = 0;
        let recentPlayListRes = await request('/user/record',{uid:uid,type:0})
        let recentPlayList = recentPlayListRes.allData.slice(0,10).map(item=>{
            item.id = index++;
            return item;
        })
        // console.log(recentPlayList);
        this.setData({
            recentPlayList
        })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 页面加载时获取本地存储的userInfo数据 有就拿
        wx.getStorageSync('userInfo') && this.setData({
            userInfo: JSON.parse(wx.getStorageSync('userInfo'))
        });

        // 最近播放界面
        this.data.userInfo.userId && this.handleRecentPlay(this.data.userInfo.userId)

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