import {SAVE_USER_INFO, DELETE_USER_INFO} from '../action_types'

//创建保存用户信息的action
export const saveUserInfo = value => ({type:SAVE_USER_INFO, data: value})
//创建删除用户信息的action
export const deleteUserInfo = () => ({type:DELETE_USER_INFO})