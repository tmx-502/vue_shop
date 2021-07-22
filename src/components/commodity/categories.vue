<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-07-21 20:45:08
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-07-22 08:41:02
-->

<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      <el-button class="addClassBtn" type="primary">添加分类</el-button>
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




      <treeTable :data="cateList" :selection-type='false' :expand-type='false' show-index index-text='' border :columns='columns'>
        <template slot="cat_deleted" slot-scope="scope">
             <i v-if="scope.row.cat_deleted" style="color:red;font-size:20px"  class="el-icon-error"></i><i  v-else style="color:lightgreen;font-size:20px" class="el-icon-success"></i>
        </template>
        <template  slot="cat_level" slot-scope="scope">
<el-tag v-if="scope.row.cat_level == '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level == '1'" type="success"
              >二级</el-tag
            >
            <el-tag v-else-if="scope.row.cat_level == '2'" type="info"
              >三级</el-tag
            >
        </template>
        <template slot="operate" slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
            >删除d</el-button>
         
          </template>
      </treeTable>
       <el-pagination
             @size-change="getCateList"
        @current-change="getCateList"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10,20,50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination> 
    </el-card>
  </div>
</template>

<script>

export default {
  data () {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,columns:[{
        lable:"分类名称",
        prop:'cat_name'
      },{
        lable:'是否启用',
        type:'template',
         template:'cat_deleted'
      },{
        lable:'数据层级',type:'template',
        template:'cat_level'
      },{
        lable:'操作',type:'template',
        template:'operate'
      }]
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    getCateList () {
      this.$http.get('categories', { params: this.queryInfo }).then((e) => {
        if (e.data.meta.status != 200) return this.$message.error(e.data.meta.msg)
        this.cateList = e.data.data.result
        this.total = e.data.data.total
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
