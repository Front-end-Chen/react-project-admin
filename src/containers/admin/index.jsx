import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {deleteUserInfo} from '../../redux/actions/login'

class Admin extends Component {

    //退出登录的回调
    logout = () => {
        //触发redux删除所保存的用户信息
        this.props.deleteUserInfo()
    }

    //在render里，若想实现跳转，最好用<Redirect>！
    render() {
        const { user, isLogin } = this.props.userInfo
        //判断是否登录了
        if (!isLogin) {
            return <Redirect to='/login'/>
        } else {
            return (
                <div>
                    我是Admin组件，你登录了，你的名字是：{user.username}
                    <button onClick={this.logout}>退出登录</button>
                </div>
            )
        }
    }
}

//从redux中获取状态和操作状态的方法
export default connect(
    state => ({ userInfo: state.userInfo }),
    { deleteUserInfo }
)(Admin)