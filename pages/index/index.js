// pages/index/index.js
import requests from '../../utils/Api/request'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerList:[],
        recommendList:[],
        topList:[]
    },
    // 跳转至推荐歌曲页面
    toRecommendSong(){
        wx.navigateTo({
          url: '/packageA/pages/recommendSong/recommendSong',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:async function (options) {
       let res =await requests('/banner',{type:0})
        // wx.request({
        //     url:'http://localhost:3000/banner',
        //     data:{
        //         type:2
        //     },
        //     success:(res)=>{
        //         console.log(res.data);
        //     },
        //     fail:(res)=>{
        //         console.log(res.data);
        //     }

        // })
        // console.log(res.banners);
        this.setData({
            bannerList:res.banners
        })
        let resRecomend = await requests('/personalized')
        console.log(resRecomend);
        this.setData({
            recommendList:resRecomend.result
        })
        // 请求热歌排行榜数据 swiperitem需要5个 发5次请求 在每个请求中拿3条歌曲数据
        let topListArr = [];//用于接收多次请求后整理的数据数组 需要名字和list
        for (let index = 0; index < 5; index++) {
            let resTopList = await requests('/top/list',{idx:index})
            
            topListArr.push({name:resTopList.playlist.name,list:resTopList.playlist.tracks.slice(0,3)})
            // console.log(topListArr);  
            // 每次请求都更新数据 渲染页面 这样页面不会长时间白屏 但渲染多次性能会差一些
            this.setData({
                topList:topListArr
            })
        }
        // this.setData({
        //     topList:topListArr
        // }) 这样等获取完数据在一次性渲染 减少了渲染次数 但在网络不好的情况下会长时间白屏
        // 结束
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