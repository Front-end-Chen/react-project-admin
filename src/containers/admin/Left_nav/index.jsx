import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import {saveTitle} from '../../../redux/actions/menu'
import { Menu } from 'antd';
import './css/left_nav.less'
import logo from '../../../static/imgs/logo.png'
import menuList from '../../../config/menu_config'
const { SubMenu, Item } = Menu;

@connect(
    state => ({}),
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
        })
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
                    // 按路由动态默认选中
                    // 第一登录需跳转/admin/home
                    defaultSelectedKeys={pathname.split('/').reverse()[0]}
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