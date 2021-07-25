<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-07-21 20:45:08
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-07-24 21:57:08
-->

<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      <el-button class="addClassBtn" type="primary" @click="getParentCateList"
        >添加分类</el-button
      >
    </el-breadcrumb>
    <el-card>
      <!-- <el-table :data="cateList" stripe border style="width: 100%">
        <el-table-column type="expand">
          
        </el-table-column>
        <el-table-column align="center" type="index" width="60"></el-table-column>
        <el-table-column align="center"  prop="cat_name" label="分类名称" width="180">
        </el-table-column>
          <el-table-column align="center"  label="启用" width="180">
            <template slot-scope="scope"
            >
             <i v-if="scope.row.cat_deleted"  class="el-icon-error"></i><i  v-else class="el-icon-success"></i>

            </template
          >
        </el-table-column>
        <el-table-column align="center"  label="层级" width="180">
          <template slot-scope="scope"
            ><el-tag v-if="scope.row.cat_level == '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level == '1'" type="success"
              >二级</el-tag
            >
            <el-tag v-else-if="scope.row.cat_level == '2'" type="info"
              >三级</el-tag
            ></template
          >
        </el-table-column>
        <el-table-column align="center" label="操作"> </el-table-column>
      </el-table>
-->

      <treeTable
        :data="cateList"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text=""
        border
        :columns="columns"
      >
        <template slot="cat_deleted" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted"
            style="color:red;font-size:20px"
            class="el-icon-error"
          ></i
          ><i
            v-else
            style="color:lightgreen;font-size:20px"
            class="el-icon-success"
          ></i>
        </template>
        <template slot="cat_level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == '0'">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == '1'" type="success"
            >二级</el-tag
          >
          <el-tag v-else-if="scope.row.cat_level == '2'" type="info"
            >三级</el-tag
          >
        </template>
        <template slot="operate" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showUpdateCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="showDeleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </treeTable>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="30%"
      :before-close="addCateDialogClose"
    >
      <el-form
        :model="addCateFrom"
        :rules="addCateFromRules"
        ref="addCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            style="width: 100%;"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑"
      :visible.sync="updateCateDialogVisible"
      width="30%"
      :before-close="updateCateDialogClose"
    >
      <el-form
        :model="updateCateFrom"
        :rules="addCateFromRules"
        ref="updateCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="updateCateFrom.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否启用',
          type: 'template',
          template: 'cat_deleted'
        },
        {
          label: '数据层级',
          type: 'template',
          template: 'cat_level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate',
          width: '220px'
        }
      ],
      addCateDialogVisible: false,
      updateCateDialogVisible: false,
      addCateFrom: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFromRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_pid',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      updateCateFrom: {
        cat_id: 0,
        cat_name: ''
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      this.$http.get('categories', { params: this.queryInfo }).then(e => {
        if (e.data.meta.status != 200)
          return this.$message.error(e.data.meta.msg)
        this.cateList = e.data.data.result
        this.total = e.data.data.total
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(nowCurrent) {
      this.queryInfo.pagenum = nowCurrent
      this.getCateList()
    },
    getParentCateList() {
      this.addCateDialogVisible = true
      this.$http.get('categories', { params: { type: 2 } }).then(e => {
        if (e.data.meta.status != 200)
          return this.$message.error(e.data.meta.msg)
        this.parentCateList = e.data.data
      })
    },
    parentCateChange() {
      let len = this.selectedKeys.length
      this.addCateFrom = {
        cat_pid: len > 0 ? this.selectedKeys[len-1] : 0,
        cat_level: len-1,
        cat_name: this.addCateFrom.cat_name
      }
    },
    addCate() {
      this.$refs.addCateRef.validate(valid => {
        if (!valid) return
        this.$http.post('categories', this.addCateFrom).then(e => {
          if (e.data.meta.status != 201)
            return this.$message.error(e.data.meta.msg)
            console.log(e);
            console.log(this.addCateFrom);
          this.$message.success(e.data.meta.msg)
          this.getCateList()
          this.addCateDialogVisible = false
        })
      })
    },
    addCateDialogClose() {
      this.$refs.addCateRef.resetFields()
      this.selectedKeys = []
      this.addCateFrom.cat_pid = 0
      this.addCateFrom.cat_level = 0
      this.addCateDialogVisible = false
    },
    updateCateDialogClose() {
      this.$refs.updateCateRef.resetFields()
      this.updateCateFrom = {
        cat_id: 0,
        cat_name: ''
      }
      this.updateCateDialogVisible = false
    },
    showUpdateCate(cat_id) {
      this.updateCateDialogVisible = true
      this.updateCateFrom.cat_id = cat_id
    },
    updateCate() {
      this.$refs.updateCateRef.validate(valid => {
        if (!valid) return
        this.$http
          .put(`categories/${this.updateCateFrom.cat_id}`, {
            cat_name: this.updateCateFrom.cat_name
          })
          .then(e => {
            if (e.data.meta.status != 200)
              return this.$message.error(e.data.meta.msg)
            this.$message.success(e.data.meta.msg)
            this.getCateList()
            this.updateCateDialogVisible = false
          })
      })
    },
    showDeleteCate(cat_id) {
      this.$confirm('此操作将永久删除该类项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${cat_id}`).then(e => {
          if (e.data.meta.status != 200)
            return this.$message.error(e.data.meta.msg)
          this.$message.success(e.data.meta.msg)
          this.getCateList()
        })
      })
    }
  }
}
</script>

<style>
.addClassBtn {
  position: absolute;
  right: 40px;
  transform: translateY(-35%);
}
</style>
