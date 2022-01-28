import request from "@/utils/request";

/** 
* 获取交易列表
*
* @param {String} data 交易ID (可选)
* @return {Object} 返回的交易列表
*/

export function getTransActions(data) {
  return request({
    url: `/v1/transactions${data ? '/' + data : ''}`,
    method: 'get'
  })
}

/** 
* 获取区块列表列表
*
* @param {String} data 区块ID (可选)
* @return {Object} 返回的区块列表
*/

export function getBlocks(data) {
  return request({
    url: `/v1/blocks${data ? '/' + data : ''}`,
    method: 'get',
  })
}

/** 
* 搜索
*
* @param {String} data 区块高度或者区块ID或者交易ID
* @return {Object} 返回交易详情或者区块详情
*/
export function getSearch(data) {
  return request({
    url: `/v1/search/${data}`,
    method: 'get',
  })
}

/** 
* 获取首页信息
*
* @return {Object} 返回的首页信息
*/
export function getStatus(host = '') {
  return request({
    url: `${host}/v1/status`,
    method: 'get',
  })
}

/** 
* 历史交易数 面积图 
*
* @return {Object} 返回面积图
*/
export function getTransaction_stats() {
  return request({
    url: `/v1/transaction_stats`,
    method: 'get',
  })
}