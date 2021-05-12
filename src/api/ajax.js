import axios from "axios";
import qs from 'querystring'
import store from '../redux/store'
import {deleteUserInfo} from '../redux/actions/login'
import {Message} from 'antd'
import NProgress from 'nprogress' //引入显示进度条的库
import 'nprogress/nprogress.css'

const instance = axios.create({
    timeout: 4000, //配置请求超时时间
});

// axios默认发送post请求时是以json格式，此处处理转换成urlencoded形式
//请求拦截器
instance.interceptors.request.use((config) => {
    // console.log(config);
    //进度条开始
    NProgress.start()
    //从redux中获取之前所保存的token
    const {token} = store.getState().userInfo
    //向请求头中添加token，用于校验身份
    if(token) config.headers.Authorization = 'atguigu_' + token
    //从配置对象中获取method和data
    const {method,data} = config
    if (method.toLowerCase() === 'post') {
        //若传递过来的参数是对象，转换成urlencoded形式
        if (data instanceof Object) {
            config.data = qs.stringify(data)
        }
    }
    return config;
});

//响应拦截器
instance.interceptors.response.use(
    (response)=>{
        //进度条结束
        NProgress.done()
        //请求若成功，返回真正的数据
        return response.data;
    }, 
    (error) => {
        //进度条结束
        NProgress.done()
        // debugger;
        if (error.response.status === 401) {
            Message.error('身份校验失败，请重新登录！',2)
            //分发一个删除用户信息的action
            store.dispatch(deleteUserInfo())
        } else {
            //请求若失败，提示错误（这里可以处理所有请求的异常）
            Message.error(error.message,2)
        }
        //中断Promise链
        return new Promise(()=>{})
    }
);

export default instance;