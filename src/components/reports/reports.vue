<!--
 * @Description: 
 * @Author: liutq
 * @Date: 2021-07-26 09:14:05
 * @LastEditTime: 2021-07-26 21:20:18
 * @LastEditors: sueRimn
 * @Reference: 
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" class="main"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
    this.getReports()
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 指定图表的配置项和数据
    var options = {}
    this.$http.get('reports/type/1').then(e => {
      if (e.data.meta.status != 200) return this.$message.error(e.data.meta.msg)

      myChart.setOption(_.merge(e.data.data, this.options))
    })
    // 使用刚指定的配置项和数据显示图表。
  },
  methods: {
    getReports() {}
  }
}
</script>
<style>
.main {
  width: 850px;
  height: 500px;
}
</style>
