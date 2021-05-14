import {SAVE_TITLE} from '../action_types'

//创建menu的title的action
export const saveTitle = value => {
    return {type:SAVE_TITLE, data: value}
}