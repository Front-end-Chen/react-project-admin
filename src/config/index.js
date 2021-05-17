/* 该文件为项目的配置文件，保存着通用性的配置，以及变量。 */

/* 
    发送请求基本路径，当前在开发环境，给自己的代理服务器发请求，
    若项目上线，配置成真正服务器的地址。 
*/

// export const BASE_URL = "http://localhost:3000";
export const BASE_URL = ""; //等于上面的写法
//商品分类列表每页展示的条数
export const PAGE_SIZE_CATEGORY = 6
//商品分类列表每页展示的条数
export const PAGE_SIZE_USER = 6
//商品管理每页展示的条数
export const PAGE_SIZE_PRODUCT = 5