// request封装功能函数
/*
功能函数封装的操作
1.确认功能点
2.部分静态代码
3.动态参数部分传入 注意传默认参数
*/
import config from './config'
export default (url,data={},methods='GET')=>{
  return new Promise((resolve,reject)=>{
    
    wx.request({
        url:config.host+url,//这样写可以在发请求的地方只写接口地址 但这样写还是有一定的耦合 与服务器
        data,
        header:{
          cookie:wx.getStorageSync('cookies')&&wx.getStorageSync('cookies').find(item=>{
            return item.indexOf('MUSIC_U')!=-1
          })
        },
        success:(res)=>{
          if(data.isLogin){
              // console.log('111');
              wx.setStorage({
                key:'cookies',
                data:res.cookies
              })
          }
           
            resolve(res.data);
            // console.log(res);
            
        },
        fail:(res)=>{
            reject(res);
            // console.log(res.data);
        }

    })
  })
}