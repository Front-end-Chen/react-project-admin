import React, { Component } from 'react'
import { Card, Button, Form, Input, Select, Message } from 'antd'
import { connect } from 'react-redux'
import PicturesWall from './picture_wall'
import RichTextEditor from './rich_text_editor'
import { reqCategoryList, reqAddProduct, reqProdById, reqUpdateProduct } from '../../../../../api'
import { ArrowLeftOutlined } from '@ant-design/icons';
const { Item } = Form
const { Option } = Select

@connect(
    state => ({
        categoryList: state.categoryList,
        productList: state.productList
    }),
    {}
)
class AddUpdate extends Component {

    formRef = React.createRef();
    pictureWallRef = React.createRef()
    richTextEditor = React.createRef()

    state = {
        categoryList: [], //商品分类列表
        operaType: 'add', //操作类型add或update
        categoryId: '',
        name: '',
        desc: '',
        price: '',
        detail: '',
        imgs: [],
        _id: ''
    }

    componentDidMount() {
        this.addOrUpdate()
    }

    //处理添加或修改的公共方法
    addOrUpdate = () => {
        const { categoryList, productList } = this.props
        const { id } = this.props.match.params
        if (categoryList.length) this.setState({ categoryList })
        else this.getCategoryList()
        if (id) {
            this.setState({ operaType: 'update' })
            if (productList.length) {
                let result = productList.find((item) => {
                    return item._id === id
                })
                if (result) {
                    this.setState({ ...result }, () => {
                        //antdv4使用formRef的setFieldsValue来设置表单value
                        this.formRef.current.setFieldsValue({
                            categoryId: this.state.categoryId,
                            name: this.state.name,
                            desc: this.state.desc,
                            price: this.state.price
                        })
                    })
                    this.pictureWallRef.current.setFileList(result.imgs)
                    this.richTextEditor.current.setRichText(result.detail)
                }
            } else {
                this.getProductById(id)
            }
        }
    }

    getProductById = async (id) => {
        let result = await reqProdById(id)
        const { status, data } = result
        if (status === 0) {
            this.setState({ ...data }, () => {
                this.formRef.current.setFieldsValue({
                    categoryId: this.state.categoryId,
                    name: this.state.name,
                    desc: this.state.desc,
                    price: this.state.price
                })
            })
            this.pictureWallRef.current.setFileList(data.imgs)
            this.richTextEditor.current.setRichText(data.detail)
        } else {
            Message.error("获取商品信息失败！")
        }
    }

    //获取商品分类列表
    getCategoryList = async () => {
        let result = await reqCategoryList()
        const { status, data, msg } = result
        if (status === 0) this.setState({ categoryList: data })
        else Message.error(msg, 2);
    }

    //点击登录按钮的成功的回调
    //新版本自动触发表单验证validateFields
    onFinish = async (values) => {
        const { operaType, _id } = this.state
        //从上传组件中获取已经上传的图片数组
        let imgs = this.pictureWallRef.current.getImgArr()
        //从富文本组件中获取用户输入的文字转换为富文本的字符串
        let detail = this.richTextEditor.current.getRichText()
        let result
        //根据操作类型发请求
        if (operaType === 'add') result = await reqAddProduct({ ...values, imgs, detail })
        else result = await reqUpdateProduct({ ...values, imgs, detail, _id })
        const { status, msg } = result
        if (status === 0) {
            Message.success(operaType === 'add' ? '商品添加成功！' : '商品修改成功！')
            this.props.history.replace('/admin/prod_about/product')
        }
        else Message.error(msg, 2)
    };

    //点击登录按钮的失败的回调
    onFinishFailed = ({ values, errorFields, outOfDate }) => {
        Message.error('表单输入有误，请检查！', 2)
    };

    render() {
        const { operaType } = this.state
        const title = (
            <>
                <Button size='large' type="link" onClick={this.props.history.goBack}>
                    <ArrowLeftOutlined style={{ fontSize: '20px' }} />
                </Button>
                <span style={{ fontSize: '21px' }}>{operaType === 'add' ? "商品添加" : "商品修改"}</span>
            </>
        )

        return (
            <>
                <Card
                    title={title}
                >
                    <Form
                        name="normal_login"
                        className="login-form"
                        ref={this.formRef}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        style={{ margin: '18px 60px 0px' }}
                        labelCol={{ lg: 2 }}
                    >
                        <Item
                            label="商品名称" //input前面的label
                            name="name"
                            wrapperCol={{ offset: 1, lg: 8 }}
                            rules={[{ required: true, message: '请输入商品名称！' }]}
                        >
                            <Input
                                placeholder="商品名称"
                            />
                        </Item>
                        <Item
                            label="商品描述"
                            name="desc"
                            wrapperCol={{ offset: 1, lg: 10 }}
                            rules={[{ required: true, message: '请输入商品描述！' }]}
                        >
                            <Input
                                placeholder="商品描述"
                            />
                        </Item>
                        <Item
                            label="商品价格"
                            name="price"
                            wrapperCol={{ offset: 1, lg: 3 }}
                            rules={[{ required: true, message: '请请输入商品价格！' }]}
                        >
                            <Input
                                placeholder="商品价格"
                                addonAfter="元"
                                addonBefore="￥"
                                // prefix="￥"
                                type="number"
                            />
                        </Item>
                        <Item
                            label="商品分类"
                            name="categoryId"
                            wrapperCol={{ offset: 1, lg: 3 }}
                            rules={[{ required: true, message: '请选择一个分类！' }]}
                        >
                            <Select>
                                <Option value="">请选择分类</Option>
                                {
                                    this.state.categoryList.map((item) => {
                                        return <Option key={item._id} value={item._id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </Item>
                        <Item label="商品图片" wrapperCol={{ offset: 1, lg: 12 }}>
                            {/* 父调子的方法用ref */}
                            <PicturesWall ref={this.pictureWallRef} />
                        </Item>
                        <Item label="商品详情" wrapperCol={{ offset: 1, lg: 16 }}>
                            <RichTextEditor ref={this.richTextEditor} />
                        </Item>
                        <Button block type="primary" htmlType="submit">提交</Button>
                    </Form>
                </Card>
            </>
        )
    }
}

export default AddUpdate