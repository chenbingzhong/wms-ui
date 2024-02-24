<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="仓库" prop="warehouseId">

        <el-select v-model="queryParams.warehouseId" placeholder="请选择仓库" clearable filterable size="small">
          <el-option v-for="dict in warehouseIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>

        <!-- <el-input v-model="queryParams.warehouseId" placeholder="请输入仓库" clearable size="small"
          @keyup.enter.native="handleQuery" /> -->
      </el-form-item>

      <el-form-item label="物料名称" prop="materialId">

        <el-input v-model="queryParams.materialName" placeholder="物料名称"></el-input>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['material:warehouseMaterial:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['material:warehouseMaterial:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['material:warehouseMaterial:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['material:warehouseMaterial:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehouseMaterialList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="仓库" align="center" prop="warehouseId" :formatter="warehouseIdFormat" />
      <el-table-column label="物料名称" align="center" prop="materialId" :formatter="materialIdFormat" />

      <el-table-column label="总库存" align="center" prop="totalInventory" />
      <el-table-column label="锁定库存" align="center" prop="freezeInventory" />
      <el-table-column label="库存上限" align="center" prop="maxInventory" />
      <el-table-column label="库存下限" align="center" prop="minInventory" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['material:warehouseMaterial:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['material:warehouseMaterial:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改仓库物料信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-form-item label="仓库" prop="warehouseId">
          <el-select v-model="form.warehouseId" placeholder="请选择物料名称" clearable filterable>
            <el-option v-for="dict in warehouseIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"></el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="物料名称" prop="materialId">
          <el-select v-model="form.materialId" placeholder="请选择物料名称" clearable filterable>
            <el-option v-for="dict in materialIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"></el-option>
          </el-select>
        </el-form-item>



        <el-form-item label="总库存" prop="totalInventory">
          <el-input v-model="form.totalInventory" placeholder="请输入总库存" />
        </el-form-item>
        <el-form-item label="锁定库存" prop="freezeInventory">
          <el-input v-model="form.freezeInventory" placeholder="请输入锁定库存" />
        </el-form-item>
        <el-form-item label="库存上限" prop="maxInventory">
          <el-input v-model="form.maxInventory" placeholder="请输入库存上限" />
        </el-form-item>
        <el-form-item label="库存下限" prop="minInventory">
          <el-input v-model="form.minInventory" placeholder="请输入库存下限" />
        </el-form-item>
        <el-divider content-position="center">仓库物料明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini"
              @click="handleAddWmsWarehouseMaterialDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini"
              @click="handleDeleteWmsWarehouseMaterialDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="wmsWarehouseMaterialDetailList" :row-class-name="rowWmsWarehouseMaterialDetailIndex"
          @selection-change="handleWmsWarehouseMaterialDetailSelectionChange" ref="wmsWarehouseMaterialDetail">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50" />

          <el-table-column label="仓库" prop="whId" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.whId'" :rules="rules.whId">


                <el-select @change="getRegionOptions(scope.row)" v-model="scope.row.whId" placeholder="请选择仓库" clearable filterable>
                  <el-option v-for="dict in warehouseIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
                    :value="parseInt(dict.dictValue)"></el-option>
                </el-select>

              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="库区" prop="whRegionId" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.whRegionId'"
                :rules="rules.whRegionId">

  
                 <el-select @change="getLocationOptions(scope.row)" v-model="scope.row.whRegionId" placeholder="请选择仓库" clearable filterable>
                    <el-option v-for="dict in scope.row.whRegionOptions" :key="dict.id" :label="dict.name"
                      :value="parseInt(dict.id)"></el-option>
                  </el-select>

              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="whLocationId" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.whLocationId'"
                :rules="rules.whLocationId">

                 <el-select  v-model="scope.row.whLocationId" placeholder="请选择仓库" clearable filterable>
                      <el-option v-for="dict in scope.row.whLocationOptions" :key="dict.id" :label="dict.name"
                        :value="parseInt(dict.id)"></el-option>
                    </el-select>

              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="序列号" prop="serialNo" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.serialNo'"
                :rules="rules.serialNo">
                <el-input v-model="scope.row.serialNo" placeholder="请输入序列号" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="生产日期" prop="productDate" width="240">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.productDate'"
                :rules="rules.productDate">
                <el-date-picker clearable v-model="scope.row.productDate" type="date" value-format="yyyy-MM-dd"
                  placeholder="请选择生产日期" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="生产厂家" prop="manufacturer" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.manufacturer'"
                :rules="rules.manufacturer">
                <el-input v-model="scope.row.manufacturer" placeholder="请输入生产厂家" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="生产批号" prop="batchNo" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.batchNo'" :rules="rules.batchNo">
                <el-input v-model="scope.row.batchNo" placeholder="请输入生产批号" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库存量" prop="inventory" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.inventory'"
                :rules="rules.inventory">
                <el-input v-model="scope.row.inventory" placeholder="请输入库存量" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="锁定库存" prop="lockInventory" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.lockInventory'"
                :rules="rules.lockInventory">
                <el-input v-model="scope.row.lockInventory" placeholder="请输入锁定库存" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.remark'" :rules="rules.remark">
                <el-input v-model="scope.row.remark" placeholder="请输入备注" />
              </el-form-item>
            </template>
          </el-table-column>


        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWarehouseMaterial, getWarehouseMaterial, delWarehouseMaterial, addWarehouseMaterial, updateWarehouseMaterial, exportWarehouseMaterial } from "@/api/material/warehouseMaterial";

import { listWarehouseRegion } from "@/api/warehouse/warehouseRegion";
import { listWarehouseLocation } from "@/api/warehouse/warehouseLocation";

export default {
  name: "WarehouseMaterial",
  components: {
  },
  data() {
    return {

      // 物料名称字典
      materialIdOptions: [],
      warehouseIdOptions: [],



      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsWarehouseMaterialDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 仓库物料信息表格数据
      warehouseMaterialList: [],
      // 仓库物料明细表格数据
      wmsWarehouseMaterialDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseId: null,
        materialName: null,

        materialId: null,

        totalInventory: null,

        freezeInventory: null,

        maxInventory: null,

        minInventory: null,

      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        totalInventory: [
          { required: true, message: "总库存不能为空", trigger: "blur" }
        ],

      }
    };
  },
  created() {
    this.getQueryData("query_material_name").then(res => {
      this.materialIdOptions = res.data;
    });
    this.getQueryData("query_wh_name").then(res => {
      this.warehouseIdOptions = res.data;
    });
    this.getList();
  },
  watch: {
    'wmsWarehouseMaterialDetailList': {
      handler(newVal, oldVal) {
        this.form.wmsWarehouseMaterialDetailList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {

    getLocationOptions(row){

      let data = {
        regionId: row.whRegionId,
        pageSize: 999,
        pageNum: 1
      }

      listWarehouseLocation(data).then(res => {
        console.log(res.rows);

        row.whLocationOptions = res.rows;
      })

    },


    getRegionOptions(row) {
      let data = {
        warehouseId: row.whId,
        pageSize: 999,
        pageNum:1
      }
     
      listWarehouseRegion(data).then(res => {
        row.whRegionOptions = res.rows;
      })

    },


    // 物料名称字典翻译
    materialIdFormat(row, column) {
      return this.selectDictLabel(this.materialIdOptions, row.materialId);
    },

    //仓库名称字典翻译
    warehouseIdFormat(row, column) {
      return this.selectDictLabel(this.warehouseIdOptions, row.warehouseId);
    },


    /** 查询仓库物料信息列表 */
    getList() {
      this.loading = true;
      listWarehouseMaterial(this.queryParams).then(response => {
        this.warehouseMaterialList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        warehouseId: null,
        materialId: null,
        totalInventory: null,
        freezeInventory: null,
        maxInventory: null,
        minInventory: null,
        wmsWarehouseMaterialDetailList: [],
      };
      this.wmsWarehouseMaterialDetailList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加仓库物料信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWarehouseMaterial(id).then(response => {
        this.form = response.data;
        let detailList = response.data.wmsWarehouseMaterialDetailList;

        detailList.forEach(item => {
          this.getRegionOptions(item);
          this.getLocationOptions(item);
        })


        this.wmsWarehouseMaterialDetailList = detailList;
        this.open = true;
        this.title = "修改仓库物料信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if (this.form.id != null) {
            updateWarehouseMaterial(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWarehouseMaterial(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除仓库物料信息编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delWarehouseMaterial(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 仓库物料明细序号 */
    rowWmsWarehouseMaterialDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 仓库物料明细添加按钮操作 */
    handleAddWmsWarehouseMaterialDetail() {
      let obj = {};
      obj.whId = "";
      obj.whRegionId = "";
      obj.whLocationId = "";
      obj.serialNo = "";
      obj.productDate = "";
      obj.manufacturer = "";
      obj.batchNo = "";
      obj.inventory = "";
      obj.lockInventory = "";
      obj.remark = "";

      obj.whLocationOptions = [];
      obj.whRegionOptions = [];

      this.wmsWarehouseMaterialDetailList.push(obj);
    },
    /** 仓库物料明细删除按钮操作 */
    handleDeleteWmsWarehouseMaterialDetail() {
      if (this.checkedWmsWarehouseMaterialDetail.length == 0) {
        this.$alert("请先选择要删除的仓库物料明细数据", "提示", { confirmButtonText: "确定", });
      } else {
        this.wmsWarehouseMaterialDetailList.splice(this.checkedWmsWarehouseMaterialDetail[0].index - 1, 1);
      }
    },
    /** 单选框选中数据 */
    handleWmsWarehouseMaterialDetailSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.wmsWarehouseMaterialDetail.clearSelection();
        this.$refs.wmsWarehouseMaterialDetail.toggleRowSelection(selection.pop());
      } else {
        this.checkedWmsWarehouseMaterialDetail = selection;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有仓库物料信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportWarehouseMaterial(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
