<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-07-25 23:49:25
 * @LastEditors: liutq
 * @LastEditTime: 2021-07-26 15:51:06
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
        <el-table-column type="index" width="60" align="center"> </el-table-column>
        <el-table-column align="center" prop="order_number" label="订单编号" width="350"></el-table-column>
        <el-table-column align="center" prop="order_price" label="订单价格(元)"></el-table-column>
        <el-table-column align="center" prop="order_fapiao_title" label="订单类型"></el-table-column>
        <el-table-column align="center" label="是否付款">
          <template slot-scope="scope">
            <el-tag :type="scope.row.pay_status === '1' ? '' : 'danger'">{{ scope.row.pay_status === '1' ? '已付款' : '未付款' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发货状态"></el-table-column>
        <el-table-column align="center" prop="update_time" label="下单时间" :formatter="handleDate"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="changeAddress"></el-button>
            <el-button type="warning" size="small" icon="el-icon-location-information" @click="showLogisticsDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!--地址对话框-->
      <el-dialog title="修改地址" :visible.sync="AddressdialogVisible" width="35%" @close="addressDialogClose">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="cityData" v-model="addressForm.address1" :props="{ expandTrigger: 'hover' }" style="width: 100%;"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2"> <el-input v-model="addressForm.address2"></el-input></el-form-item
        ></el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="AddressdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddressdialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!--物流对话框-->
      <el-dialog title="修改地址" :visible.sync="logisticsDialogVisible" width="50%">
        <el-timeline>
          <el-timeline-item v-for="item in logisticsList" :timestamp="item.time" placement="top" ::key="item.time">
            <el-card>
              <h4>{{ item.context }}</h4>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata.js'

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
        consignee_addr: ''
      },
      orerdsData: [],
      total: 0,
      AddressdialogVisible: false,
      logisticsDialogVisible: false,
      cityData,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入省市区/县'
          }
        ],
        address2: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入详细地址'
          }
        ]
      },
      logisticsList: []
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    getOrders() {
      this.$http.get('orders', { params: this.queryInfo }).then(e => {
        if (e.data.meta.status != 200) {
          return this.$message.error(e.data.meta.msg)
        }
        console.log(e)
        this.total = e.data.data.total
        this.queryInfo.pagenum = parseInt(e.data.data.pagenum)
        this.orerdsData = e.data.data.goods
      })
    },
    handleDate(row) {
      return new Date(row.create_time).toLocaleDateString()
    },
    handleSizeChange(e) {
      this.queryInfo.pagesize = e
      this.getOrders()
    },
    handleCurrentChange(e) {
      this.queryInfo.pagenum = e
      this.getOrders()
    },
    changeAddress() {
      this.AddressdialogVisible = true
    },
    addressDialogClose() {
      this.$refs.addressFormRef.resetField()
    },
    showLogisticsDialog() {
      let id = 1106975712662
      return this.$message.error('暂无物流信息')
      this.$http.get(`kuaidi/${id}`).then(e => {
        console.log(e)
        if (e.data.meta.status != 200) return this.$message.error(e.data.meta.msg)
        this.logisticsList = e.data.data
        this.logisticsDialogVisible = true
      })
    }
  }
}
</script>

<style></style>
