//项目的菜单配置
//注意: 
// antdv4开始图标是另外的组件，所以配置文件里必须写组件,
// 不然无法动态生成图标
import {
  AppstoreOutlined,
  ToolOutlined,
  UnorderedListOutlined,
  HomeOutlined,
  UserOutlined,
  SafetyOutlined,
  AreaChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  BarChartOutlined
} from '@ant-design/icons';

let menu_config = [
  {
    title: '首页', // 菜单标题名称
    key: 'home', // 对应的key
    icon: <HomeOutlined />, // 图标名称
    path: '/admin/home' //对应路由
  },
  {
    title: '商品',
    key: 'prod_about',
    icon: <AppstoreOutlined />,
    children: [ // 子菜单列表
      {
        title: '分类管理',
        key: 'category',
        icon: <UnorderedListOutlined />,
        path: '/admin/prod_about/category'
      },
      {
        title: '商品管理',
        key: 'product',
        icon: <ToolOutlined />,
        path: '/admin/prod_about/product'
      },
    ]
  },

  {
    title: '用户管理',
    key: 'user',
    icon: <UserOutlined />,
    path: '/admin/user'
  },
  {
    title: '角色管理',
    key: 'role',
    icon: <SafetyOutlined />,
    path: '/admin/role'
  },

  {
    title: '图形图表',
    key: 'charts',
    icon: <AreaChartOutlined />,
    children: [
      {
        title: '柱形图',
        key: 'bar',
        icon: <BarChartOutlined />,
        path: '/admin/charts/bar'
      },
      {
        title: '折线图',
        key: 'line',
        icon: <LineChartOutlined />,
        path: '/admin/charts/line'
      },
      {
        title: '饼图',
        key:  'pie',
        icon: <PieChartOutlined />,
        path: '/admin/charts/pie'
      },
    ]
  },
]

export default menu_config