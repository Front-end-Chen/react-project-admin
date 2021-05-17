import {SAVE_USER_INFO, DELETE_USER_INFO} from '../action_types'

//创建保存用户信息的action
export const saveUserInfo = value => {
    //向localStorage中保存用户信息
    //注：user是对象，需要手动调用JSON.stringify()转成字符串保存，
    //否则默认调用Object.toString保存的是[object object]
    localStorage.setItem('user', JSON.stringify(value.user))
    //向localStorage中保存token
    localStorage.setItem('token', value.token)
    return {type:SAVE_USER_INFO, data: value}
}

//创建删除用户信息的action
export const deleteUserInfo = () => {
    //从localStorage中删除用户信息
    localStorage.removeItem('user')
    //从localStorage中删除token
    localStorage.removeItem('token')
    return {type: DELETE_USER_INFO}
}