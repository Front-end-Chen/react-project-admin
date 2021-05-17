import {SAVE_PRODUCT_LIST} from '../action_types'

//初始化商品分页列表
let initProductList = []

export default function productReducer (preState=initProductList, action) {
    const {type, data} = action
    let newState
    switch (type) {
        case SAVE_PRODUCT_LIST:
            newState = [...data]
            return newState

        default:
            return preState
    }
}