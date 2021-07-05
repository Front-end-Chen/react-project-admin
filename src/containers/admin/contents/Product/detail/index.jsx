import React, { Component } from 'react'
import { connect } from 'react-redux';
import { saveCategoryList } from '../../../../../redux/actions/category.js'
import { Card, Button, List, Message } from 'antd';
import { reqCategoryList, reqProdById } from '../../../../../api'
import { ArrowLeftOutlined } from '@ant-design/icons';
import './css/detail.less'
import { BASE_URL } from '../../../../../config'
const { Item } = List

@connect(
    state => ({ 
        productList: state.productList,
        categoryList: state.categoryList
    }),
    {saveCategoryList}
)

class Detail extends Component {
    //方法1：直接根据商品id发请求获取对应商品的数据（效率低）
    //方法2：从redux中获取之前在请求商品分页列表时保存到redux中的数据，再根据id查找（效率稍高）
    //方法3：点按钮跳转之前将当前商品的数据缓存到一个公共对象中，便于获取后再根据id查找（最简单）
    state = {
        _id: '',
        categoryId: '', //商品分类id
        categoryName: '', //商品分类名称，需要根据分类id获取
        desc: '', //商品描述
        detail: '', //商品详情
        imgs: [], //商品图片
        name: '', //商品名称
        price: '', //商品价格
        isLoading: true
    }

    //缓存categoryId，因为setState是异步的，在setState后新的categoryId从状态中读取不到
    categoryId = ''

    componentDidMount() {
        this.getProduct()
    }

    //获取商品信息
    getProduct = () => {
        const { id } = this.props.match.params
        const reduxProductList = this.props.productList
        const reduxCategoryList = this.props.categoryList
        //判断redux中是否有productList，有则使用，无则发请求
        if (reduxProductList.length) {
            //根据id从redux中查找匹配的数据
            let result = reduxProductList.find((prod) => {
                return prod._id === id
            })
            if (result) {
                // const { categoryId, desc, detail, imgs, name, price } = result
                // this.setState({ categoryId, desc, detail, imgs, name, price })
                //setState是异步的，保存categoryId到实例自身
                this.categoryId = result.categoryId
                this.setState({...result})
            }
        } else this.getProdById(id)
        //判断redux中是否有categoryList，有则使用，无则发请求
        if (reduxCategoryList.length) {
            let result = reduxCategoryList.find((item) => item._id === this.categoryId)
            this.setState({categoryName: result.name, isLoading: false})
        } else this.getCategorylist()
    }

    //根据商品id获取商品信息
    getProdById = async(id) => {
        let result = await reqProdById(id)
        const {status, data} = result
        if(status === 0) {
            // const { categoryId, desc, detail, imgs, name, price } = data
            // this.setState({ categoryId, desc, detail, imgs, name, price })
            this.categoryId = data.categoryId
            this.setState({ ...data })
        }
        else Message.error("获取商品信息失败！", 2)
    }

    //获取商品分类列表
    getCategorylist = async() => {
        let result = await reqCategoryList()
        const { status, data, msg } = result
        if (status === 0) {
            let result = data.find((item)=>{
                return item._id === this.categoryId
            })
            if(result) this.setState({categoryName: result.name, isLoading: false})
            //保存categoryList到redux中
            this.props.saveCategoryList(data)
        } else {
            Message.error(msg, 2);
        }
    }

    //根据分类id获取分类名称
    // getCategoryName = async (categoryId) => {
    //     let result = await reqCategoryName(categoryId)
    //     const { status, data } = result
    //     if (status === 0) {
    //         this.setState({ categoryName: data.name })
    //     } else {
    //         Message.error('获取分类名称失败！', 2)
    //     }
    // }

    render() {
        const { categoryName, desc, detail, imgs, name, price, isLoading } = this.state
        const title = (
            <>
                <Button
                    type='link'
                    size='large'
                    onClick={() => { this.props.history.goBack() }}
                >
                    <ArrowLeftOutlined style={{ fontSize: '20px' }} />
                </Button>
                <span style={{ fontSize: '21px' }}>商品详情</span>
            </>
        )
        
        return (
            <>
                <Card
                    loading={isLoading}
                    title={title}
                >
                    <List>
                        <Item className='prod-item'>
                            <span className='prod-item-name'>商品名称：</span>
                            <span className='prod-item-info'>{name}</span>
                        </Item>
                        <Item className='prod-item'>
                            <span className='prod-item-name'>商品描述：</span>
                            <span className='prod-item-info'>{desc}</span>
                        </Item>
                        <Item className='prod-item'>
                            <span className='prod-item-name'>商品价格：</span>
                            <span className='prod-item-info'>￥ {price}</span>
                        </Item>
                        <Item className='prod-item'>
                            <span className='prod-item-name'>所属分类：</span>
                            <span className='prod-item-info'>{categoryName}</span>
                        </Item>
                        <Item className='prod-item'>
                            <span className='prod-item-name'>商品图片：</span>
                            {
                                imgs.map((img, index) => {
                                    return <img key={index} src={BASE_URL + "/upload/" + img} alt="商品图片" />
                                })
                            }
                        </Item>
                        <Item className='prod-item'>
                            <span className='prod-item-name'>商品详情：</span>
                            <span className='prod-item-info' dangerouslySetInnerHTML={{ __html: detail }}></span>
                        </Item>
                    </List>
                </Card>
            </>
        )
    }
}

export default Detail