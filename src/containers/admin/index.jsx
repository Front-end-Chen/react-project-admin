import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { deleteUserInfo } from '../../redux/actions/login'
import Header from './Header'
import LeftNav from './Left_nav'
import Home from '../../components/Home'
import Category from './contents/Category'
import Product from './contents/Product'
import User from './contents/User'
import Role from './contents/Role'
import Bar from './contents/Bar'
import Line from './contents/Line'
import Pie from './contents/Pie'
import { Layout } from 'antd'
import './css/admin.less'
const { Footer, Sider, Content } = Layout;

//2.装饰器写法
@connect(
    state => ({ userInfo: state.userInfo }),
    { deleteUserInfo }
)
class Admin extends Component {

    //在render里，若想实现跳转，最好用<Redirect>！
    render() {
        const { isLogin } = this.props.userInfo
        //判断是否登录了
        if (!isLogin) {
            return <Redirect to='/login' />
        } else {
            return (
                <Layout className="admin">
                    <Sider className="sider">
                        <LeftNav />
                    </Sider>
                    <Layout>
                        <Header className="header">Header</Header>
                        <Content className="content">
                            <Switch>
                                <Route path='/admin/home' component={Home} />
                                <Route path="/admin/prod_about/category" component={Category} />
                                <Route path="/admin/prod_about/product" component={Product} />
                                <Route path="/admin/user" component={User} />
                                <Route path="/admin/role" component={Role} />
                                <Route path="/admin/charts/bar" component={Bar} />
                                <Route path="/admin/charts/line" component={Line} />
                                <Route path="/admin/charts/pie" component={Pie} />
                                <Redirect to='/admin/home' />
                            </Switch>
                        </Content>
                        <Footer className="footer">
                            推荐使用谷歌浏览器，获取最佳用户体验
                        </Footer>
                    </Layout>
                </Layout>
            )
        }
    }
}

export default Admin

//1.常规写法
//从redux中获取状态和操作状态的方法
// export default connect(
//     state => ({ userInfo: state.userInfo }),
//     { deleteUserInfo }
// )(Admin)
