<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" stripe style="width: 100%">
        <el-table-column type="index" width="60" align="center">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope"
            ><el-tag v-if="scope.row.level=='0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level=='1'" type="success">二级</el-tag>
            <el-tag v-else-if="scope.row.level=='2'" type="info">三级</el-tag></template
          >
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    getRightsList (type = 'list') {
      this.$http.get(`rights/${type}`).then((e) => {
        if (e.data.meta.status != 200) {
          this.$message.error(e.data.meta.msg)
          return
        }
        this.rightsList = e.data.data
      })
    }
  }
}
</script>

<style>
</style>
