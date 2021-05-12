import React, { Component } from 'react'
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom'
import { deleteUserInfo } from '../../../redux/actions/login'
import screen from 'screenfull'
import dayjs from 'dayjs'
import { Button, Modal} from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import './css/header.less'
const { confirm } = Modal;

@connect(
    state => ({userInfo: state.userInfo}),
    {deleteUserInfo}
)
//在非路由组件中，要使用路由组件的api，借助withRouter实现
@withRouter
class Header extends Component {

    state = {
        isFull: false,
        date: dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
        weatherInfo: {}
    }

    componentDidMount = () => {
        //给screenfull绑定监听
        screen.on('change',() => {
            let isFull = !this.state.isFull
            this.setState({isFull})
        })
        //更新时间
        this.timeID = setInterval(() => {
            this.setState({date: dayjs().format('YYYY年 MM月DD日 HH:mm:ss')})
        })
    }

    componentWillUnmount(){
        //清除更新时间定时器
        clearInterval(this.timeID)
    }

    //切换全屏按钮的回调
    fullScreen = () => {
        screen.toggle()
    }

    //退出登录的回调
    logout = () => {
        const {deleteUserInfo} = this.props
        confirm({
            icon: <ExclamationCircleOutlined />,
            title: '确定退出？',
            content: '若退出需要重新登录',
            cancelText:'取消',
            okText:'确认',
            onOk() {
              //触发redux删除所保存的用户信息
              deleteUserInfo()
            }
          });
    }

    render() {
        const {isFull, date} = this.state
        const {user} = this.props.userInfo
        return (
            <header className="header">
                <div className="header-top">
                    <Button size='small' onClick={this.fullScreen}>
                        {isFull ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    </Button>
                    <span className="username">欢迎，{user.username}</span>
                    <Button type='link' onClick={this.logout}>退出登录</Button>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {this.props.location.pathname}
                    </div>
                    <div className="header-bottom-right">
                        {date}
                        <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="天气信息"/>
                        晴 &nbsp;&nbsp;温度：2~5
                    </div>
                </div>
            </header>
        )
    }
}
export default Header