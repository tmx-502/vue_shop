<!--
 * @Description: 
 * @Author: liutq
 * @Date: 2021-07-22 17:44:11
 * @LastEditTime: 2021-07-23 00:35:50
 * @LastEditors: sueRimn
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
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="addBtnIsDisabled" size="mini"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name" ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only"
          ><el-button type="primary" :disabled="addBtnIsDisabled" size="mini"
            >添加参数</el-button
          ></el-tab-pane
        >
      </el-tabs>
    </el-card>
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
        children: 'children',
      },
      selectedCateKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      this.$http.get('categories').then((e) => {
        if (e.data.meta.status != 200)
          return this.$message.error(e.data.meta.msg)
        this.cateList = e.data.data
      })
    },
    handleCateChange() {
      if (this.selectedCateKeys.length < 3) {
        this.selectedCateKeys = []
        return
      }
      this.getParamsData()
    },
    handleTabsClick() {
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
        .then((e) => {
          if (e.data.meta.status != 200)
            return this.$message.error(e.data.meta.msg)
          this[`${this.activeName}TableData`] = e.data.data
          console.log(this[`${this.activeName}TableData`])
        })
    },
  },
  computed: {
    addBtnIsDisabled() {
      return this.selectedCateKeys.length < 3
    },
  },
}
</script>
<style >
.el-row {
  display: flex;
  align-items: center;
}
.chooseGoods {
  font-size: 20px;
  text-align: center;
}
</style>
