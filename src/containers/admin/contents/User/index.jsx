import React, { Component } from 'react'
import dayjs from 'dayjs'
import { Card, Button, Table, Message, Modal, Form, Input, Select } from 'antd';
import { PlusCircleOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { reqUserList, reqAddUser } from '../../../../api'
import { PAGE_SIZE_USER } from '../../../../config'
const { Password } = Input
const { Item } = Form
const { Option } = Select

export default class User extends Component {

  formRef = React.createRef()

  state = {
    isShowAdd: false, //是否展示新增弹窗
    userList: [], //用户列表
    roleList: [] //角色列表
  }

  componentDidMount() {
    this.getUserList()
  }

  //获取用户信息
  getUserList = async () => {
    let result = await reqUserList()
    const { status, data, msg } = result
    if (status === 0) this.setState({
      userList: data.users.reverse(),
      roleList: data.roles
    })
    else Message.error(msg, 2)
  }

  //新增用户弹窗----确定按钮回调
  handleOk = () => {
    this.formRef.current.validateFields()
      .then(async (values) => {
        let result = await reqAddUser(values)
        const { status, data, msg } = result
        if (status === 0) {
          Message.success('添加用户成功！')
          let userList = this.state.userList
          this.setState({ userList: [data, ...userList], isShowAdd: false })
        }
        else Message.error(msg, 2)
      })
      .catch((errInfo) => {
        Message.warning('表单输入有误，请检查！', 2)
      });
  }

  //新增用户弹窗----取消按钮回调
  handleCancel = () => {
    this.setState({ isShowAdd: false })
  }

  //显示添加用户模态框
  showAddUser = () => {
    this.setState({ isShowAdd: true }, () => {
      this.formRef.current.resetFields()
    });
  }

  render() {
    const dataSource = this.state.userList
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: time => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        render: (id) => {
          let result = this.state.roleList.find((item) => {
            return item._id === id
          })
          if (result) return result.name
        }
      },
      {
        title: '操作',
        key: 'option',
        render: () => (
          <div>
            <Button type='link'>修改</Button>
            <Button type='link'>删除</Button>
          </div>
        )
      }
    ];

    return (
      <div>
        <Card
          extra={
            <Button
              type='primary'
              onClick={this.showAddUser}
            >
              <PlusCircleOutlined />添加用户
          </Button>
          }
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            pagination={{ defaultPageSize: PAGE_SIZE_USER }}
            rowKey="_id"
          />
        </Card>
        {/* 新增角色提示框 */}
        <Modal
          title="添加用户"
          visible={this.state.isShowAdd}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            ref={this.formRef}
          >
            <Item
              label="用户名"
              name="username"
              rules={[
                { required: true, message: '用户名必须输入！' }
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Item>
            <Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '密码必须输入！' },
                { max: 12, message: '密码必须小于等于12位！' },
                { min: 4, message: '密码必须大于等于4位！' }
              ]}
            >
              <Password
                placeholder="请输入密码"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Item>
            <Item
              label="手机号"
              name="phone"
              rules={[
                { required: true, message: '手机号必须输入！' }
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Item>
            <Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '邮箱必须输入！' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Item>
            <Item
              label="角色"
              name="role_id"
              rules={[
                { required: true, message: '必须选择一个角色！' }
              ]}
            >
              <Select>
                <Option value=''>请选择一个角色</Option>
                {
                  this.state.roleList.map((item) => {
                    return <Option key={item._id} value={item._id}>{item.name}</Option>
                  })
                }
              </Select>
            </Item>
          </Form>
        </Modal>
      </div>
    )
  }
}