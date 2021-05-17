import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { deleteUserInfo } from '../../../redux/actions/login'
import screen from 'screenfull'
import dayjs from 'dayjs'
import { Button, Modal } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import './css/header.less'
import menuList from '../../../config/menu_config'

const { confirm } = Modal;

@connect(
    state => ({ 
        userInfo: state.userInfo,
        title: state.title
     }),
    { deleteUserInfo }
)
//在非路由组件中，要使用路由组件的api，借助withRouter实现
@withRouter
class Header extends Component {

    state = {
        isFull: false,
        date: dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
        weatherInfo: {},
        title: ''
    }

    componentDidMount = () => {
        //给screenfull绑定监听
        screen.on('change', () => {
            let isFull = !this.state.isFull
            this.setState({ isFull })
        })
        //更新时间
        this.timeID = setInterval(() => {
            this.setState({ date: dayjs().format('YYYY年 MM月DD日 HH:mm:ss') })
        })
        //展示当前菜单名称
        this.getTitle()
    }

    componentWillUnmount() {
        //清除更新时间定时器
        clearInterval(this.timeID)
    }

    //切换全屏按钮的回调
    fullScreen = () => {
        screen.toggle()
    }

    //退出登录的回调
    logout = () => {
        const { deleteUserInfo } = this.props
        confirm({
            icon: <ExclamationCircleOutlined />,
            title: '确定退出？',
            content: '若退出需要重新登录',
            cancelText: '取消',
            okText: '确认',
            onOk() {
                //触发redux删除所保存的用户信息
                deleteUserInfo()
            }
        });
    }

    getTitle = () => {
        const {pathname} = this.props.location
        let pathKey
        //防止在跳转到添加、修改和查看商品详情页面后，因刷新页面而造成title丢失
        if (pathname.indexOf('product') !== -1) pathKey='product'
        else pathKey = pathname.split('/').reverse()[0]
        let title = ''
        menuList.forEach(item => {
            if (item.children && item.children instanceof Array) {
                let tmp = item.children.find(citem => {
                    return citem.key === pathKey
                })
                if (tmp) title = tmp.title
            } else {
                if(item.key === pathKey) title = item.title
            }
        });
        this.setState({title})
    }

    render() {
        const { isFull, date } = this.state
        const { user } = this.props.userInfo
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
                        {/* 此处直接调用方法匹配名称会有性能问题，每次render就会去匹配名称，由于有时间显示一直在调用render导致！ */}
                        {/* {this.state.title} */}

                        {/* 使用redux保存menu的title，解决性能问题 */}
                        {/* {this.props.title} */}

                        {/* 
                            最终版：
                            1.使用redux保存menu的title，解决性能问题
                            2.再结合state保存的title，解决刷新丢失问题 
                        */}
                        {this.props.title || this.state.title}
                    </div>
                    <div className="header-bottom-right">
                        {date}
                        <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="天气信息" />
                        晴 &nbsp;&nbsp;温度：2~5
                    </div>
                </div>
            </header>
        )
    }
}
export default Header