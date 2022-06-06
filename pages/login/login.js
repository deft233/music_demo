// pages/login/login.js

import requests from '../../utils/Api/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        password: ''
    },
    async handleLogin() {
        //表单验证 1.收集表单数据 2.进行规则验证
        let { phone, password } = this.data
        // console.log(phone,password);
        // phone的验证 phone的正则
        let phoneReg = /^1[3-9][0-9]{9}$/
        if (!phone) {
            wx.showToast({ title: "手机号为空", icon: 'error' })

        } else if (!phoneReg.test(phone)) {
            wx.showToast({ title: "手机号格式不对", icon: 'error' })

        } else if (!password) {
            wx.showToast({ title: "密码不能为空", icon: 'error' })

        } else {
            wx.showToast({ title: "正在登陆" })
            //发送请求 后端验证是否通过
            let res = await requests('/login/cellphone', { phone, password, isLogin:true });
            if (res.code == 200) {
                // console.log('登录成功',res);
                //本地存储用户数据
                wx.setStorageSync('userInfo',JSON.stringify(res.profile))
                wx.switchTab({
                  url: '/pages/personal/personal',
                })
            } else {
                wx.showToast({
                    title: res['message'],
                    icon: 'error'
                })
            }
        }
    },
    // 处理输入框数据 收集数据 数据单项绑定 从视图层到数据层
    handInput(event) {
        // event.detail.value为具体的值
        // console.log(event.detail.value);
        // 将这个值赋值给phone或者password 如何判断type？使用data-set或者id标识出
        // console.log(event.target.dataset.type);
        // 给数据层赋值
        this.setData({
            [event.target.dataset.type]: event.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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