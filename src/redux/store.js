// 该文件专门用于暴露一个store对象，整个应用只有一个store对象

//从redux中引入createStore，用于创建最核心的store对象
import { applyMiddleware, createStore } from 'redux'
//引入redux-devtools-extension，用于支持redux开发者调试工具的运行
import { composeWithDevTools } from 'redux-devtools-extension'
//引入redux-thunk
import thunk from 'redux-thunk'
//引入汇总后的reducer
import allreducers from './reducers'

//创建store并暴露
export default createStore(allreducers, composeWithDevTools(applyMiddleware(thunk)))