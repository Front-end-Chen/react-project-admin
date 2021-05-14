import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { saveUserInfo } from '../../redux/actions/login.js'
import { Form, Input, Button, Message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api';
import './css/login.less'
import logo from '../../static/imgs/logo.png'

//2.装饰器写法
@connect(
    state => ({isLogin: state.userInfo.isLogin}),
    {saveUserInfo}
)
//antdv4写法
class Login extends Component {

    //点击登录按钮的成功的回调
    //新版本自动触发表单验证validateFields
    onFinish = async(values) => {
        // console.log(values); {username:xxx,password:xxx}
        // alert('向服务器发送登录请求');
        // this.props.saveUserInfo('向服务器发送登录请求')

        //获取用户输入
        const { username, password } = values
        //不要将发ajax请求的代码写组件里，不便于维护！
        //使用async、await与拦截器简化处理请求成功失败的代码(代替手动.then和.catch)
        //若用户输入无错误，发送登录请求
        const result = await reqLogin(username, password)
        //从响应中获取：请求状态、错误信息、数据
        const { status, msg, data } = result
        if (status === 0) {
            //1.服务器返回的user信息，还有token交由redux管理
            this.props.saveUserInfo(data)
            //2.跳转admin页面
            this.props.history.replace('/admin/home')
            //注：此处必须先保存数据再跳转，不然admin页面获取不到数据
        } else {
            Message.warning(msg,2)
        }
    };

    //点击登录按钮的失败的回调
    onFinishFailed = ({ values, errorFields, outOfDate }) => {
        Message.error('表单输入有误，请检查！',2)
    };

    //自定义校验，即：自己写判断 -> 密码的验证器---每当在密码输入框输入东西后，都会调用此函数去验证输入是否合法。
    pwdValidator = (rule, value) => {
        if (!value) {
            return Promise.reject(new Error('密码必须输入'));
        } else if (value.length > 12) {
            return Promise.reject(new Error('密码必须小于等于12位'));
        } else if (value.length < 4) {
            return Promise.reject(new Error('密码必须大于等于4位'));
        } else if (!(/^\w+$/).test(value)) {
            return Promise.reject(new Error('密码必须是字母、数字、下划线组成'));
        }
        return Promise.resolve();
    }

    render() {
        //从redux中获取用户的登录状态
        const {isLogin} = this.props
        //如果已经登录了，重定向到admin页面
        if (isLogin) {
            return <Redirect to='/admin/home'/>
        }
        return (
            <div className='login'>
                <header>
                    <img src={logo} alt="logo" />
                    <h1>商品管理系统</h1>
                </header>
                <section>
                    <h1>用户登录</h1>
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Form.Item
                            name="username"
                            /*
                            定义用户名校验规则---“声明式验证”，即：自己不去做实际判断，只是声明
                               用户名/密码的的合法性要求:
                                   1). 必须输入
                                   2). 必须大于等于4位
                                   3). 必须小于等于12位
                                   4). 必须是字母、数字、下划线组成
                           */

                            rules={[
                                { required: true, message: '用户名必须输入！' },
                                { max: 12, message: '用户名必须小于等于12位！' },
                                { min: 4, message: '用户名必须大于等于4位！' },
                                { pattern: /^\w+$/, message: '用户名必须是字母、数字、下划线组成！' },
                            ]}
                        >
                            {/* UserOutlined为不同图标名 */}
                            {/* style={{ color: 'rgba(0,0,0,.25)'}}调整图标的颜色 */}
                            <Input
                                // prefix={<ZhihuOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)'}}/>}
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="用户名"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { validator: this.pwdValidator },
                            ]}>
                            <Input
                                // prefix={<AlipayOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button block type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default Login;

//1.常规写法
//从redux中获取状态和操作状态的方法
// export default connect(
//     state => ({isLogin: state.userInfo.isLogin}),
//     {saveUserInfo}
// )(Login)