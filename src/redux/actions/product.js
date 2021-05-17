import {SAVE_PRODUCT_LIST} from '../action_types'

//保存productList的action
export const saveProductList = value => {
    return {type: SAVE_PRODUCT_LIST, data: value}
}