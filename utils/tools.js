// 防抖函数
export function debounce(fn,delay){
    let timer = null;
    return function(event){
        // console.log(timer+'111');
        if(timer){
            clearTimeout(timer);
            timer = null
        }
        // console.log(timer+'222');
        timer = setTimeout(() => {
            fn.call(this,event)
            console.log('ok');
        }, delay);
        // 写成了setInterval 会导致防抖后最后一次执行时进入无限循环 重复执行 失去防抖意义
        // console.log(timer+'333');
    }
}