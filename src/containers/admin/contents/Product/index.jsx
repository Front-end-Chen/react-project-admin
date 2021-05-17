import React, { Component } from 'react'
import { Card, Button, Select, Input, Table, Message } from 'antd';
import { connect } from 'react-redux';
import { saveProductList } from '../../../../redux/actions/product.js'
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { reqProductList, reqSearchProduct, reqUpdateProdStatus } from '../../../../api/index.js'
import { PAGE_SIZE_PRODUCT } from '../../../../config';
const { Option } = Select;

@connect(
  state => ({}),
  { saveProductList }
)
class Product extends Component {

  state = {
    productList: [], //商品列表数据(分页)
    current: 1, //当前在哪一页
    total: '', //一共有几页
    keyWord: '', //搜索关键词
    searchType: 'productName',
    isLoading: true
  }

  columns = [
    {
      title: '商品名称', //列头名
      dataIndex: 'name',
      key: 'name',
      width: '19%'
    },
    {
      title: '商品描述', //列头名
      dataIndex: 'desc',
      key: 'desc'
    },
    {
      title: '价格', //列头名
      dataIndex: 'price',
      key: 'price',
      width: '9%',
      align: 'center',
      render: price => '￥' + price
    },
    {
      title: '状态',
      // dataIndex: 'status',
      key: 'status',
      width: '11%',
      align: 'center',
      render: (item) => {
        return (
          <>
            <Button
              type={item.status === 1 ? 'danger' : 'primary'}
              onClick={() => { this.updateProdStatus(item) }}
              style={{ marginRight: '18px' }}
            >
              {item.status === 1 ? '下架' : '上架'}
            </Button>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {item.status === 1 ? '在售' : '停售'}
            </span>
          </>
        )
      }
    },
    {
      title: '操作',
      //dataIndex: 'opera',
      key: 'opera',
      width: '8%',
      align: 'center',
      render: (item) => {
        return (
          <>
            <Button
              type='link'
              onClick={() => { this.props.history.push(`/admin/prod_about/product/detail/${item._id}`) }}
            >
              详情
            </Button>
            <br />
            <Button
              type='link'
              onClick={() => { this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`) }}
            >
              修改
            </Button>
          </>
        )
      }
    }
  ];

  isSearch = '' //isSearch标记是否是搜索商品

  componentDidMount() {
    this.getProductList()
  }

  //1.发请求获取商品列表数据(真分页-后端分页)
  //2.点击页码按钮的回调->获取对应页的数据
  //3.搜索与商品分页列表共用方法，需要根据isSearch标记判断
  getProductList = async (number = 1) => {
    let result
    const { searchType, keyWord } = this.state
    //1.isSearch标记是搜索商品
    //2.如果keyWord为空，则默认展示全部商品信息
    this.isSearch = keyWord ? true : false
    if (this.isSearch) {
      result = await reqSearchProduct(number, PAGE_SIZE_PRODUCT, searchType, keyWord)
    } else {
      result = await reqProductList(number, PAGE_SIZE_PRODUCT)
    }
    const { status, data } = result
    if (status === 0) {
      this.setState({
        productList: data.list,
        total: data.total,
        current: number,
        isLoading: false
      })
      //把获取的商品分页列表存入到redux中，便于详情页展示
      this.props.saveProductList(data.list)
    }
    else Message.error('获取商品列表失败！', 2)
  }

  //更新商品的状态（上架/下架）
  updateProdStatus = async ({ _id, status }) => {
    if (status === 1) status = 2
    else status = 1
    let result = await reqUpdateProdStatus(_id, status)
    if (result.status === 0) {
      Message.success('更新商品状态成功！')
      //更新商品前端显示
      let newProductList = this.state.productList.map((prod) => {
        if (prod._id === _id) prod.status = status
        return prod
      })
      this.setState({ productList: newProductList })
    }
    else Message.error('更新商品状态失败！', 2)
  }

  search = () => {
    this.getProductList()
  }

  render() {
    const dataSource = this.state.productList

    //模拟数据->测试用
    // const dataSource = [
    //   {
    //     key: '1',
    //     name: '华为 HUAWEI Mate 30',
    //     desc: '麒麟990旗舰芯片4000万超感光徕卡影像双超级快充屏内指纹8G+128GB亮黑色4G全网通版',
    //     price: '2999',
    //     status: 1
    //   },
    //   {
    //     key: '2',
    //     name: '华为 HUAWEI Mate 30',
    //     desc: '麒麟990旗舰芯片4000万超感光徕卡影像双超级快充屏内指纹8G+128GB亮黑色4G全网通版',
    //     price: '4999',
    //     status: 2
    //   },
    //   {
    //     key: '3',
    //     name: '华为 HUAWEI Mate 30',
    //     desc: '麒麟990旗舰芯片4000万超感光徕卡影像双超级快充屏内指纹8G+128GB亮黑色4G全网通版',
    //     price: '5999',
    //     status: 2
    //   },
    //   {
    //     key: '4',
    //     name: '华为 HUAWEI Mate 30',
    //     desc: ' 麒麟990旗舰芯片4000万超感光徕卡影像双超级快充屏内指纹8G+128GB亮黑色4G全网通版',
    //     price: '6999',
    //     status: 1
    //   }
    // ]

    return (
      <Card
        title={
          <>
            {/* 表单设成受控组件 */}
            <Select defaultValue="productName" onChange={(value) => { this.setState({ searchType: value }) }}>
              <Option value="productName">按名称搜索</Option>
              <Option value="productDesc">按描述搜索</Option>
            </Select>
            <Input
              style={{ margin: '0 10px', width: '20%' }}
              placeholder="请输入搜索关键字"
              allowClear
              onChange={(e) => { this.setState({ keyWord: e.target.value }) }}
            />
            <Button type='primary' onClick={this.search}><SearchOutlined />搜索</Button>
          </>
        }
        extra={
          <Button
            type='primary'
            onClick={() => { this.props.history.push('/admin/prod_about/product/add_update') }}
          >
            <PlusCircleOutlined />添加
          </Button>
        }
      >
        <Table
          bordered={true}
          dataSource={dataSource}
          columns={this.columns}
          rowKey='_id'
          loading={this.state.isLoading}
          locale={{emptyText: "暂无数据"}}
          //分液器默认每页10条数据
          pagination={{
            pageSize: PAGE_SIZE_PRODUCT,
            total: this.state.total,
            current: this.state.current,
            onChange: this.getProductList
          }}
        />
      </Card>
    )
  }
}

export default Product