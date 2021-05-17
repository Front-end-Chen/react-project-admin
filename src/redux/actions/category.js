import {SAVE_CATEGORY_LIST} from '../action_types'

//保存categoryList的action
export const saveCategoryList = value => {
    return {type: SAVE_CATEGORY_LIST, data: value}
}