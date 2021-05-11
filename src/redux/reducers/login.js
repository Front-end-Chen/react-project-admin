import {SAVE_USER_INFO, DELETE_USER_INFO} from '../action_types'

//初始化状态
let initState = 'ddd'

export default function loginReducer (preState=initState, action) {
    let {type, data} = action
    let newState
    switch (type) {
        case SAVE_USER_INFO:
            newState = preState + data
            return newState

        case DELETE_USER_INFO:
            newState = preState + data + '!!'
            return newState

        default:
            return preState
    }
}