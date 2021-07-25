<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-07-25 23:49:25
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-07-26 00:46:42
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="orerdsData" style="width: 100%" border stripe>
        <el-table-column type="index" width="60" align="center">
        </el-table-column>
        <el-table-column
          align="center"
          prop="order_number"
          label="订单编号"
          width="350"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="order_price"
          label="订单价格(元)"
        ></el-table-column>
          <el-table-column
          align="center"
          prop="order_fapiao_title"
          label="订单类型"
        ></el-table-column>
        <el-table-column
          align="center"
          label="是否付款"
        ></el-table-column>
        <el-table-column
          align="center"
          label="发货状态"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="update_time"
          label="下单时间"
            :formatter="handleDate"
        ></el-table-column>
        <el-table-column
          align="center"
          label="操作"
        ></el-table-column>
      ></el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: '',
      },
      orerdsData: [],
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    getOrders() {
      this.$http.get('orders',{params:this.queryInfo}).then((e) => {
        if (e.data.meta.status != 200)
          return this.$message.error(e.data.meta.msg)
          console.log(e);
        this.orerdsData = e.data.data.goods
      })
    },  handleDate (row) {
      return new Date(row.create_time).toLocaleDateString()
    },
  },
}
</script>

<style>
</style>