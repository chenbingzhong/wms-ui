import request from '@/utils/request'

// 查询仓库物料明细列表
export function listWarehouseMaterialDetail(query) {
  return request({
    url: '/material/warehouseMaterialDetail/list',
    method: 'get',
    params: query
  })
}

// 查询仓库物料明细详细
export function getWarehouseMaterialDetail(id) {
  return request({
    url: '/material/warehouseMaterialDetail/' + id,
    method: 'get'
  })
}

// 新增仓库物料明细
export function addWarehouseMaterialDetail(data) {
  return request({
    url: '/material/warehouseMaterialDetail',
    method: 'post',
    data: data
  })
}

// 修改仓库物料明细
export function updateWarehouseMaterialDetail(data) {
  return request({
    url: '/material/warehouseMaterialDetail',
    method: 'put',
    data: data
  })
}

// 删除仓库物料明细
export function delWarehouseMaterialDetail(id) {
  return request({
    url: '/material/warehouseMaterialDetail/' + id,
    method: 'delete'
  })
}
