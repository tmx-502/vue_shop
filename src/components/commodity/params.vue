<!--
 * @Description: 
 * @Author: liutq
 * @Date: 2021-07-22 17:44:11
 * @LastEditTime: 2021-07-23 18:34:08
 * @LastEditors: liutq
 * @Reference: 
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="3" class="chooseGoods">选择商品： </el-col>
        <el-col :span="9"
          ><el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            style="width: 100%"
            :props="cascaderProps"
            @change="handleCateChange"
            clearable
          ></el-cascader
        ></el-col>
        <el-col :span="12">
          <el-alert
            title="注意：只允许为三级分类设置相关参数！"
            type="info"
            show-icon
          ></el-alert
        ></el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane
          v-for="item in activeNames"
          :label="item == 'many' ? '动态属性' : '静态属性'"
          :name="item"
        >
          <el-button
            type="primary"
            :disabled="addBtnIsDisabled"
            size="mini"
            @click="addParamDialogVisible = true"
            >添加参数</el-button
          >
          <el-table
            :data="item == 'many' ? manyTableData : onlyTableData"
            border
            stripe
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deleteTag(index, scope.row)"
                  >{{ item }}</el-tag
                ><el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="scope.row.inputVisible = true"
                  >+ 添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showUpdateDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="showDeleteParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数 -->
    <el-dialog
      title="添加参数"
      :visible.sync="addParamDialogVisible"
      width="30%"
      :before-close="addParamDialogClose"
    >
      <el-form
        :model="addParamFrom"
        :rules="addParamRules"
        ref="addParamRef"
        label-width="120px"
      >
        <el-form-item
          :label="(activeName === 'many' ? '动态' : '静态') + '参数名称：'"
          prop="attr_name"
        >
          <el-input v-model="addParamFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数 -->
    <el-dialog
      title="修改参数"
      :visible.sync="updateParamDialogVisible"
      width="30%"
      :before-close="updateParamDialogClose"
    >
      <el-form
        :model="updateParamFrom"
        :rules="addParamRules"
        ref="updateParamRef"
        label-width="120px"
      >
        <el-form-item
          :label="(activeName === 'many' ? '动态' : '静态') + '参数名称：'"
          prop="attr_name"
        >
          <el-input v-model="updateParamFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_pid',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      activeName: 'many',
      activeNames: ['many', 'only'],
      manyTableData: [],
      onlyTableData: [],
      addParamDialogVisible: false,
      updateParamDialogVisible: false,
      addParamRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      addParamFrom: {
        attr_name: ''
      },
      updateParamFrom: {},
      inputVisible: false,
      newinputValue: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      this.$http.get('categories').then(e => {
        if (e.data.meta.status != 200)
          return this.$message.error(e.data.meta.msg)
        this.cateList = e.data.data
      })
    },
    handleCateChange() {
      if (this.selectedCateKeys.length < 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      this.getParamsData()
    },
    handleTabsClick() {
      if (this.selectedCateKeys.length < 3) return
      this.getParamsData()
    },
    getParamsData() {
      this.$http
        .get(
          `categories/${
            this.selectedCateKeys[this.selectedCateKeys.length - 1]
          }/attributes`,
          { params: { sel: this.activeName } }
        )
        .then(e => {
          if (e.data.meta.status != 200)
            return this.$message.error(e.data.meta.msg)
          e.data.data.forEach(item => {
            item.attr_vals =
              item.attr_vals != '' ? item.attr_vals.split(',') : []
            item.inputVisible = false
            item.inputValue = ''
          })
          this[`${this.activeName}TableData`] = e.data.data
        })
    },
    addParam() {
      this.$refs.addParamRef.validate(valid => {
        if (!valid) return
        this.$http
          .post(
            `categories/${
              this.selectedCateKeys[this.selectedCateKeys.length - 1]
            }/attributes`,
            {
              attr_name: this.addParamFrom.attr_name,
              attr_sel: this.activeName
            }
          )
          .then(e => {
            if (e.data.meta.status != 201)
              return this.$message.error(e.data.meta.msg)
            console.log(e)
          })
      })
    },
    addParamDialogClose() {
      this.$refs.addParamRef.resetFields()
      this.addParamDialogVisible = false
    },
    showUpdateDialog(attr_id) {
      this.$http
        .get(
          `categories/${
            this.selectedCateKeys[this.selectedCateKeys.length - 1]
          }/attributes/${attr_id}`,
          {
            params: { attr_sel: this.activeName }
          }
        )
        .then(e => {
          if (e.data.meta.status != 200)
            return this.$message.error(e.data.meta.msg)
          this.updateParamFrom = e.data.data
          this.updateParamDialogVisible = true
        })
    },
    updateParamDialogClose() {
      this.$refs.updateParamRef.resetFields()
      this.updateParamDialogVisible = false
    },
    updateParam() {
      this.$refs.updateParamRef.validate(valid => {
        if (!valid) return
        this.$http
          .put(
            `categories/${
              this.selectedCateKeys[this.selectedCateKeys.length - 1]
            }/attributes/${this.updateParamFrom.attr_id}`,
            {
              attr_name: this.updateParamFrom.attr_name,
              attr_sel: this.activeName
            }
          )
          .then(e => {
            if (e.data.meta.status != 200)
              return this.$message.error(e.data.meta.msg)
            this.getParamsData()
            this.updateParamDialogVisible = false
          })
      })
    },
    showDeleteParam(attr_id) {
      this.$confirm('此操作将永久删除该类项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .delete(
            `categories/${
              this.selectedCateKeys[this.selectedCateKeys.length - 1]
            }/attributes/${attr_id}`
          )
          .then(e => {
            if (e.data.meta.status != 200)
              return this.$message.error(e.data.meta.msg)
            this.$message.success(e.data.meta.msg)
            this.getParamsData()
          })
      })
    },
    handleInputConfirm(row) {
      row.inputVisible = false

      if (row.inputValue === '') return
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      this.updateAttrVals(row)
    },
    updateAttrVals(row) {
      this.$http
        .put(
          `categories/${
            this.selectedCateKeys[this.selectedCateKeys.length - 1]
          }/attributes/${row.attr_id}`,
          {
            attr_name: row.attr_name,
            attr_sel: this.activeName,
            attr_vals: row.attr_vals.join(',')
          }
        )
        .then(e => {
          if (e.data.meta.status != 200)
            return this.$message.error(e.data.meta.msg)
        })
    },
    deleteTag(index, row) {
      row.attr_vals.splice(index, 1)
      this.updateAttrVals(row)
    }
  },
  computed: {
    addBtnIsDisabled() {
      return this.selectedCateKeys.length < 3
    }
  }
}
</script>
<style>
.el-row {
  display: flex;
  align-items: center;
}
.chooseGoods {
  font-size: 20px;
  text-align: center;
}
.input-new-tag {
  width: 100px !important;
}
</style>
