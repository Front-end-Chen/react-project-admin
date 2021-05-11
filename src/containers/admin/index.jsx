import React, { Component } from 'react'
import { connect } from 'react-redux'


class Admin extends Component {
    render() {
        return (
            <div>
                Admin
            </div>
        )
    }
}

//从redux中获取状态和操作状态的方法
export default connect(
    state => ({ userInfo: state.userInfo }),
    {}
)(Admin)