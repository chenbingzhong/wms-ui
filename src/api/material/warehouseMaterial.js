import request from '@/utils/request'

// 查询仓库物料信息列表
export function listWarehouseMaterial(query) {
  return request({
    url: '/material/warehouseMaterial/list',
    method: 'get',
    params: query
  })
}

// 查询仓库物料信息详细
export function getWarehouseMaterial(id) {
  return request({
    url: '/material/warehouseMaterial/' + id,
    method: 'get'
  })
}

// 新增仓库物料信息
export function addWarehouseMaterial(data) {
  return request({
    url: '/material/warehouseMaterial',
    method: 'post',
    data: data
  })
}

// 修改仓库物料信息
export function updateWarehouseMaterial(data) {
  return request({
    url: '/material/warehouseMaterial',
    method: 'put',
    data: data
  })
}

// 删除仓库物料信息
export function delWarehouseMaterial(id) {
  return request({
    url: '/material/warehouseMaterial/' + id,
    method: 'delete'
  })
}
