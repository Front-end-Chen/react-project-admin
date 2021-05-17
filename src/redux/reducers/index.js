// 该文件用于汇总所有的reducer为一个总的reducer, 整合所有状态
import { combineReducers } from 'redux'
import loginReducer from './login'
import menuReducer from './menu'
import productReducer from './product'
import categoryReducer from './category'

//整合所有reducer汇总所有状态
//参数为一个对象，key为各组件状态的名称，value是各组件的reducer	
export default combineReducers({
    userInfo: loginReducer,
    title: menuReducer,
    productList: productReducer,
    categoryList: categoryReducer
})