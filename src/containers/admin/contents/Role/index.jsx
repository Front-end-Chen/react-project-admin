import React, { Component } from 'react'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import { Card, Button, Table, Message, Modal, Form, Input, Tree } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { reqRoleList, reqAddRole, reqAuthRole } from '../../../../api'
import menuList from '../../../../config/menu_config'
const { Item } = Form

@connect(
  state => ({ username: state.userInfo.user.username }),
  {}
)
class Role extends Component {

  formRef = React.createRef()

  state = {
    roleList: [], //保存角色的数组
    menuList, //菜单列表的数组
    isShowAdd: false,
    isShowAuth: false,
    checkedKeys: [], //选中的菜单
    _id: '' //当前操作的角色id
  }

  getRoleList = async () => {
    let result = await reqRoleList()
    const { status, data } = result
    if (status === 0) this.setState({ roleList: data })
    else Message.error("获取角色列表失败！", 2)
  }

  componentDidMount() {
    this.getRoleList()
  }

  //新增角色--确认按钮
  handleOk = () => {
    this.formRef.current.validateFields()
      .then(async (values) => {
        let result = await reqAddRole(values)
        const { status, msg } = result
        if (status === 0) {
          Message.success('新增角色成功')
          this.getRoleList()
          this.setState({ isShowAdd: false })
        }
        else Message.error(msg)
      })
      .catch((errorInfo) => {
        Message.warning('表单输入有误，请检查！', 2)
      })
  }

  //新增角色--取消按钮
  handleCancel = () => {
    this.setState({ isShowAdd: false })
  }

  //授权弹窗--确认按钮
  handleAuthOk = async () => {
    const { _id, checkedKeys } = this.state
    const { username } = this.props
    let result = await reqAuthRole({ _id, menus: checkedKeys, auth_name: username })
    const { status, msg } = result
    if (status === 0) {
      Message.success('授权成功！')
      this.setState({ isShowAuth: false })
      //获取最新数据展示
      this.getRoleList()
    }
    else Message.error(msg, 2)
  }

  //授权弹窗--取消按钮
  handleAuthCancel = () => {
    this.setState({ isShowAuth: false })
  }

  //勾选触发
  onCheck = checkedKeys => this.setState({ checkedKeys });

  //用于展示授权弹窗
  //状态回显
  showAuth = (id) => {
    //再次点击从数据中找出选中的权限
    const { roleList } = this.state
    let result = roleList.find((item) => {
      return item._id === id
    })
    //设置默认选中的菜单
    if (result) this.setState({ checkedKeys: result.menus })
    //保存_id以便设置（更新）权限
    this.setState({ isShowAuth: true, _id: id })
  }

  //用于展示新增弹窗
  showAdd = () => {
    this.setState({ isShowAdd: true }, () => {
      this.formRef.current.resetFields()
    });
  }

  render() {
    const dataSource = this.state.roleList
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (time) => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        key: 'auth_time',
        //注意没有时间就不展示
        render: (time) => time ? dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss') : ''
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        key: 'auth_name',
      },
      {
        title: '操作',
        key: 'option',
        render: (item) => <Button type='link' onClick={() => { this.showAuth(item._id) }}>设置权限</Button>
      }
    ];
    //treeData是属性菜单的源数据
    //自己外面在加一个总的菜单
    const treeData = [
      {
        title: "平台功能",
        key: "top",
        children: this.state.menuList
      }
    ]

    return (
      <>
        <Card
          extra={
            <Button type='primary' onClick={this.showAdd}>
              <PlusCircleOutlined />新增角色
            </Button>
          }
          style={{ width: '100% ' }}
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            pagination={{ defaultPageSize: 5 }}
            rowKey="_id"
          />
        </Card>
        {/* 新增角色提示框 */}
        <Modal
          title="新增角色"
          visible={this.state.isShowAdd}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form
            name="normal_login"
            className="login-form"
            ref={this.formRef}
          >
            <Item
              name="roleName"
              rules={[
                { required: true, message: '角色名必须输入！' }
              ]}
            >
              <Input placeholder="请输入角色名" />
            </Item>
          </Form>
        </Modal>
        {/* 设置权限提示框 */}
        <Modal
          title="设置权限"
          visible={this.state.isShowAuth}
          onOk={this.handleAuthOk}
          onCancel={this.handleAuthCancel}
          okText="确认"
          cancelText="取消"
        >
          <Tree
            checkable //允许选中
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            defaultExpandAll={true}
            treeData={treeData}
          >
          </Tree>
        </Modal>
      </>
    )
  }
}

export default Role