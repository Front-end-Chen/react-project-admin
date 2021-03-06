import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import {saveTitle} from '../../../redux/actions/menu'
import { Menu } from 'antd';
import './css/left_nav.less'
import logo from '../../../assets/imgs/logo.png'
import menuList from '../../../config/menu_config'
const { SubMenu, Item } = Menu;

@connect(
    state => ({
        menus: state.userInfo.user.role.menus,
        username: state.userInfo.user.username
    }), //当前用户的权限
    {saveTitle}
)
@withRouter
class LeftNav extends Component {

    /* 注意:
        1.Link放在Item里面，不然css样式失效
        2.菜单得动态生成，不能写死，便于权限管理
    */
    //用于创建菜单的函数
    createMenu = (target) => {
        return target.map((item) => {
            //判断用户是否有权限查看菜单
            if (this.hasAuth(item.key)) {
                if(!item.children){
                    return (
                        <Item key={item.key} icon={item.icon} onClick={() => {this.props.saveTitle(item.title)}}>
                            <Link to={item.path}>
                                <span>{item.title}</span>
                            </Link>
                        </Item>
                    )
                }else{
                    return (
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.createMenu(item.children)}
                        </SubMenu>
                    )
                }
            } else {
                return "" //去除警告，map回调函数里必须返回一个值
            }
        })
    }

    //权限校验
    hasAuth = (key) => {
        const { menus, username } = this.props
        if(username === "admin") return true
        //some查找数组中是否有满足条件的元素，返回布尔值，查找到第一个满足条件的元素就终止循环
        let isHasKey = menus.some((menu) => {
            return menu === key
        })
        if(isHasKey) return true
        else return false
    }

    render() {
        let {pathname} = this.props.location
        return (
            <div>
                <header className="nav-header">
                    <img src={logo} alt="logo" />
                    <h1>商品管理系统</h1>
                </header>
                <Menu
                    //1.按路由动态默认选中
                    //2.第一次登录需跳转/admin/home
                    //3.此处有小坑：不跳转/admin/home，也可设置selectedKeys解决
                    //4.防止在跳转到添加、修改和查看商品详情页面后，因刷新页面而造成默认选中的菜单项丢失
                    defaultSelectedKeys={pathname.indexOf('product') !== -1 ? 'product' : pathname.split('/').reverse()[0]}
                    defaultOpenKeys={pathname.split('/').splice(2)}
                    mode="inline"
                    theme="dark"
                >
                    {this.createMenu(menuList)}
                </Menu>
            </div>
        )
    }
}
export default LeftNav