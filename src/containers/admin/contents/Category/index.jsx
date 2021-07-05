import React, { Component } from 'react'
import { connect } from 'react-redux';
import { saveCategoryList } from '../../../../redux/actions/category.js'
import { reqCategoryList, reqAddCategory, reqUpdateCategory } from '../../../../api'
import { Button, Card, Table, Message, Modal, Form, Input } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { PAGE_SIZE_CATEGORY } from '../../../../config';
const { Item } = Form

@connect(
    state => ({ categoryList: state.categoryList }),
    { saveCategoryList }
)
class Category extends Component {

    /*
        antd v4版本From表单使用resetFields重置表单数据
            1.给From表单一个ref属性标识
                <Form ref={this.formRef}></Form>
            2.创建form表单实例
                formRef = React.createRef()
            3.在需要重置表单数据的地方调用resetFields方法
                this.formRef.current.resetFields()
    */

    formRef = React.createRef();

    state = {
        categoryList: [], //商品分类列表
        visible: false, //控制弹窗的展示或隐藏
        operateType: '', //操作类型（新增？修改？）
        isLoading: true, //是否处于加载中
        modalCurrentId: '' //当前修改分类的id
    }

    //获取商品分类列表-假分页，数据全返回，前端自己分页！
    getCategoryList = async () => {
        const reduxCategoryList = this.props.categoryList
        if (reduxCategoryList.length) {
            this.setState({ isLoading: false }) //隐藏加载动画
            //展示最新数据在前面
            this.setState({ categoryList: reduxCategoryList.reverse() })
        } else {
            let result = await reqCategoryList()
            this.setState({ isLoading: false }) //隐藏加载动画
            const { status, data, msg } = result
            if (status === 0) {
                //展示最新数据在前面
                this.setState({ categoryList: data.reverse() })
                //保存categoryList到redux以便详情读取
                this.props.saveCategoryList(data)
            } else {
                Message.error(msg, 2);
            }
        }
    }

    componentDidMount() {
        //组件加载，请求商品分类列表
        this.getCategoryList()
    }

    //用于展示弹窗--作为新增
    showAdd = () => {
        this.setState({
            modalCurrentId: '', //当前操作的id
            operateType: 'add', //类型更改为添加
            visible: true //展示弹窗
        })
    };

    //用于展示弹窗--作为修改
    showUpdate = (item) => {
        const { _id, name } = item //获取当前要修改分类的id、name
        // console.log(item);
        this.setState({
            modalCurrentId: _id, //当前操作的id
            operateType: 'update', //操作方式变为更新
            visible: true //展示弹窗
        },
            //想在异步setState之后操作表单必须写在setState的第二个参数的回调函数里！
            //方法1
            () => {
                //antdv4使用formRef的setFieldsValue来设置表单value
                this.formRef.current.setFieldsValue({
                    categoryName: name
                })
            }
        )

        //想在异步setState之后操作表单
        //方法2
        // setTimeout(() => {
        //     this.formRef.current.setFieldsValue({
        //         categoryName: name
        //     })
        // }, 0)
    };

    //真正执行新增的操作
    toAdd = async (values) => {
        let result = await reqAddCategory(values)
        const { status, data, msg } = result
        if (status === 0) {
            Message.success('新增商品分类成功！')
            let categoryList = this.state.categoryList
            //保存新数据到state中，并隐藏弹窗
            this.setState({ categoryList: [data, ...categoryList], visible: false })
            this.formRef.current.resetFields() //重置表单
        } else {
            Message.error(msg, 2)
        }
    }

    //真正执行修改的操作
    toUpdate = async (categoryObj) => {
        let result = await reqUpdateCategory(categoryObj)
        const { status, msg } = result
        if (status === 0) {
            Message.success('更新分类名称成功！')
            this.getCategoryList() //重新请求商品列表
            this.setState({ visible: false }) //隐藏弹窗
            this.formRef.current.resetFields() //重置表单
        } else {
            Message.error(msg, 2)
        }
    }

    //点击弹窗确定按钮的回调
    handleOk = () => {
        const { operateType } = this.state
        this.formRef.current.validateFields()
            .then((values) => {
                // console.log(values);
                if (operateType === 'add') this.toAdd(values)
                if (operateType === 'update') {
                    const categoryName = values.categoryName
                    const categoryId = this.state.modalCurrentId
                    const categoryObj = { categoryId, categoryName }
                    this.toUpdate(categoryObj)
                }
            })
            .catch((errorInfo) => {
                // console.log(errorInfo);
                Message.warning('表单输入有误，请检查！', 2)
            })
    };

    //点击弹窗取消按钮的回调
    handleCancel = () => {
        this.setState({ visible: false })
        this.formRef.current.resetFields()
    };

    //测试columns中的dataIndex对render传参的影响
    // demo = (data) => {
    //     console.log('点了', data)
    // }

    render() {
        const dataSource = this.state.categoryList
        let { operateType, visible, isLoading } = this.state
        const columns = [
            //1.dataIndex对应展示dataSource中每条数据对应的key的value值
            //2.dataIndex与render同时出现时，优先展示render函数的内容
            //3.render接收一个参数，值为dataSource中每条数据的dataIndex为key的数据值。
            //  如果没写dataIndex，则将dataSource中每条数据的整个对象传入
            {
                title: '分类名', //列头名
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                // dataIndex: 'categoryName',
                key: 'operate',
                render: (item) => {
                    return <Button type='link' onClick={() => { this.showUpdate(item) }}>修改分类</Button>
                },
                width: '25%',
                align: 'center'
            }
        ];

        //以下为测试代码：
        // const dataSource = [
        //     //1.key对应columns的dataIndex展示
        //     //2.key必写，不然无法diff比较
        //     {
        //         key: '1',
        //         categoryName: '女生护肤1'
        //     },
        //     {
        //         key: '2',
        //         categoryName: '女生护肤2'
        //     },
        //     {
        //         key: '3',
        //         categoryName: '女生护肤3'
        //     },
        //     {
        //         key: '4',
        //         categoryName: '女生护肤4'
        //     },
        // ];

        // const columns = [
        //     //1.dataIndex对应展示dataSource中每条数据对应的key的value值
        //     //2.dataIndex与render同时出现时，优先展示render函数的内容
        //     //3.render接收一个参数，值为dataSource中每条数据的dataIndex为key的数据值。
        //     //  如果没写dataIndex，则将dataSource中每条数据的整个对象传入
        //     {
        //         title: '分类名', //列头名
        //         dataIndex: 'categoryName',
        //         key: 'categoryName',
        //     },
        //     {
        //         title: '操作',
        //         dataIndex: 'categoryName',
        //         // dataIndex: 'key',
        //         key: 'categoryName',
        //         // key: 'key',
        //         render: (data) => {
        //             return <Button type='link' onClick={() => { this.demo(data) }}>修改分类</Button>
        //         },
        //         width: '25%',
        //         align: 'center'
        //     }
        // ];

        return (
            <div>
                <Card extra={<Button type='primary' onClick={this.showAdd}><PlusCircleOutlined />添加</Button>}>
                    <Table
                        bordered={true}
                        dataSource={dataSource}
                        columns={columns}
                        rowKey='_id'
                        pagination={{ pageSize: PAGE_SIZE_CATEGORY, showQuickJumper: true }}
                        loading={isLoading}
                    />
                </Card>

                {/* 新增和修改分类共用组件 */}
                <Modal
                    title={operateType === 'add' ? '新增分类' : '修改分类'}
                    visible={visible}
                    okText='确定'
                    cancelText='取消'
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form
                        name="normal_login"
                        className="login-form"
                        ref={this.formRef}
                    >
                        <Item
                            name="categoryName"
                            rules={[
                                { required: true, message: '分类名必须输入！' }
                            ]}
                        >
                            <Input
                                placeholder="请输入分类名"
                            />
                        </Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Category