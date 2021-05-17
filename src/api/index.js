/* 
  1.项目中所有请求由该文件发出
  2.以后每当发请求之前，都要在该文件里添加一个方法
*/
//引入我们自定义的ajax
import ajax from './ajax'
//引入请求的基本路径
import {BASE_URL} from '../config'

//登录请求
export const reqLogin = (username,password) => {
  return ajax.post(`${BASE_URL}/login`, {username, password})
}

//获取商品分类列表请求
export const reqCategoryList = () => {
  return ajax.get(`${BASE_URL}/manage/category/list`)
}

//新增商品分类
export const reqAddCategory = ({categoryName}) => {
  return ajax.post(`${BASE_URL}/manage/category/add`, {categoryName})
}

//更新商品分类名称
export const reqUpdateCategory = ({categoryId, categoryName}) => {
  return ajax.post(`${BASE_URL}/manage/category/update`, {categoryId, categoryName})
}

//获取商品分页列表
export const reqProductList = (pageNum, pageSize) => {
  return ajax.get(`${BASE_URL}/manage/product/list`, {params: {pageNum, pageSize}})
}

//更新商品的状态（上架/下架）
export const reqUpdateProdStatus = (productId, status) => {
  return ajax.post(`${BASE_URL}/manage/product/updateStatus`, {productId, status})
}

//搜索商品
export const reqSearchProduct = (pageNum, pageSize, searchType, keyWord) => {
  return ajax.get(`${BASE_URL}/manage/product/search`, {params: {pageNum, pageSize, [searchType]: keyWord}})
}

//根据分类id获取分类名称
// export const reqCategoryName = (categoryId) => {
//   return ajax.get(`${BASE_URL}/manage/category/info`, {params: {categoryId}})
// }

//根据商品id获取商品信息
export const reqProdById = (productId) => {
  return ajax.get(`${BASE_URL}/manage/product/info`,{params:{productId}})
}

//添加商品
export const reqAddProduct = (productObj) => {
  return ajax.post(`${BASE_URL}/manage/product/add`, {...productObj})
}

//请求删除图片（根据图片唯一名删除）
export const reqDeletePicture = (name) => {
  return ajax.post(`${BASE_URL}/manage/img/delete`,{name})
}

//请求更新商品
export const reqUpdateProduct = (productObj) => {
  return ajax.post(`${BASE_URL}/manage/product/update`,{...productObj})
}

//请求所有角色列表
export const reqRoleList = () => {
  return ajax.get(`${BASE_URL}/manage/role/list`)
}

//请求添加角色
export const reqAddRole = ({roleName}) => {
  return ajax.post(`${BASE_URL}/manage/role/add`,{roleName})
}

//请求给角色授权
export const reqAuthRole = (roleObj) => {
  return ajax.post(`${BASE_URL}/manage/role/update`, {...roleObj, auth_time: Date.now()})
}

//请求获取所有用户列表（同时携带着角色列表）
export const reqUserList = () => {
  return ajax.get(`${BASE_URL}/manage/user/list`)
}

//请求添加用户
export const reqAddUser = (userObj) => {
  return ajax.post(`${BASE_URL}/manage/user/add`, {...userObj})
}