/* 
  1.项目中所有请求由该文件发出
  2.以后每当发请求之前，都要在该文件里添加一个方法
*/
//引入我们自定义的ajax
import ajax from './ajax'
//引入请求的基本路径
import {BASE_URL} from '../config'

//登录请求
export const reqLogin = (username,password) => ajax.post(`${BASE_URL}/login`, {username, password})
//获取商品列表请求
export const reqCategoryList = () => ajax.get(`${BASE_URL}/manage/category/list`)
//新增商品分类
export const reqAddCategory = ({categoryName}) => ajax.post(`${BASE_URL}/manage/category/add`, {categoryName})
//更新商品分类名称
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax.post(`${BASE_URL}/manage/category/update`, {categoryId, categoryName})