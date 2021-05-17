import {SAVE_CATEGORY_LIST} from '../action_types'

//初始化商品分页列表
let initCategoryList = []

export default function categoryReducer (preState=initCategoryList, action) {
    const {type, data} = action
    let newState
    switch (type) {
        case SAVE_CATEGORY_LIST:
            newState = [...data]
            return newState

        default:
            return preState
    }
}