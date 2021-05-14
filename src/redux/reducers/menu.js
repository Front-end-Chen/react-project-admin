import {SAVE_TITLE} from '../action_types'

//初始化menu的title数据
let initState = ''

export default function menuReducer (preState=initState, action) {
    const {type, data} = action
    let newState
    switch (type) {
        case SAVE_TITLE: 
            newState = data
            return newState

        default:
            return preState
    }
}