<!--
 * @Description: 
 * @Author: liutq
 * @Date: 2021-07-22 17:44:32
 * @LastEditTime: 2021-07-25 23:56:46
 * @LastEditors: sueRimn
 * @Reference: 
-->
<template>
  <div>
  

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
 　　　　<el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getGoods"
            v-model="goodsListParams.query"
          >
            <el-button
              slot="append"
              @click="getGoods"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="3"
          ><el-button type="primary" @click="goAddPage"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" align="center"> </el-table-column>
        <el-table-column label="商品名称" width="600" prop="goods_name">
        </el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="add_time"
          align="center"
          width="120"
          :formatter="handleDate"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="showEdit(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="warning"
              size="small"
              icon="el-icon-delete"
              @click="deleteGood(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsListParams.pagenum"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="goodsListParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsList: [],
      goodsListParams: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
    }
  },
  methods: {
    getGoods() {
      this.$http.get('goods', { params: this.goodsListParams }).then((e) => {
        if (e.data.meta.status != 200)
          return this.$message.error(e.data.meta.msg)
        this.goodsList = e.data.data.goods
        this.total = e.data.data.total
      })
    },
    handleDate(row) {
      return new Date(row.add_time).toLocaleDateString()
    },
    handleSizeChange(e) {
      this.goodsListParams.pagesize = e
      this.getGoods()
    },
    handleCurrentChange(e) {
      this.goodsListParams.pagenum = e
      this.getGoods()
    },
    deleteGood(goods_id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http.delete('goods/' + goods_id).then((result) => {
          if (result.data.meta.status == 200) {
            this.$message.success(result.data.meta.msg)
            this.getGoods()
          } else this.$message.error(result.data.meta.msg)
        })
      })
    },
    showEdit(goods_id) {},
    goAddPage() {
      this.$router.push('/add')
    },
  },
  created() {
    this.getGoods()
  },
}
</script>
<style >
</style>
