// pages/search/search.js
import request from '../../utils/Api/request'
import {
    debounce
} from '../../utils/tools'
// let timer = false
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeHolder: '', //搜索关键字占位
        hotSearch: [], //热搜
        searchKeyword: '', //搜索框关键字
        searchDataList: [], //搜索后的数据列表
        historyList: [], //历史数据列表
    },
    // 获取placeholder关键字
    async getPlaceHolder() {
        let placeHolder = await request('/search/default')
        // console.log(placeHolder);
        placeHolder = placeHolder.data.showKeyword

        this.setData({
            placeHolder
        })
    },
    async gethotSearchData() {
        let reshotSearch = await request('/search/hot/detail')
        // console.log(reshotSearch);
        this.setData({
            hotSearch: reshotSearch.data
        })
    },
    // 处理搜索框输入
    handleInputSearch(event) {
        let searchKeyword = event.detail.value
        this.setData({
            searchKeyword
        })
        // if(timer){
        //     return
        // }
        // timer = true
        this.getSearchData();
        // setTimeout(() => {
        //     timer = false
        // }, 1000);
        // 发送请求获取搜索数据

    },
    // 
    getSearchData: debounce(async function getSearchData() {
        if (!this.data.searchKeyword) {
            this.setData({
                searchDataList: []
            })
            return
        }
        let {
            historyList,
            searchKeyword
        } = this.data
        let searchDataRes = await request('/search', {
            keywords: searchKeyword,
            limit: 10
        })
        // 发送请求后 将关键字加入到历史记录数组中 再放入本地存储 刷新后还有 //数组去重
        if (historyList.indexOf(searchKeyword) !== -1) {
            historyList.splice(historyList.indexOf(searchKeyword), 1)
        }
        historyList.unshift(searchKeyword)
        wx.setStorageSync('historyList', historyList)
        // console.log(searchDataRes);
        this.setData({
            searchDataList: searchDataRes.result.songs,
            historyList
        })
    }, 500),
    // 点击x 清除输入框内容
    deleteInputValue() {
        this.setData({
            searchKeyword: '',
            searchDataList: []
        })
    },
    // 点击图标删除所有记录
    deleteHistory() {
        wx.showModal({
            title: "确认删除？",
            success: (res) => {
                if (res.confirm) {
                    wx.removeStorageSync('historyList');
                    this.setData({
                        historyList: []
                    })
                }
            }
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPlaceHolder();
        this.gethotSearchData()
        // 从本地存储中搜索是否有历史记录
        let historyList = wx.getStorageSync('historyList');
        historyList && this.setData({
            historyList
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