<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-07-24 16:56:15
 * @LastEditors: liutq
 * @LastEditTime: 2021-07-26 08:58:06
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        :closable="false"
        title="添加商品信息"
        type="info"
        center
        show-icon
      >
      </el-alert>
      <el-steps align-center :active="active - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-position="top"
        ref="addRuleFormRef"
        label-width="100px"
      >
        <el-tabs
          :before-leave="tabsChange"
          v-model="active"
          tab-position="left"
        >
          <el-tab-pane label="基本信息" name="0"
            ><el-form-item label="商品名称" prop="goods_name"
              ><el-input v-model="addForm.goods_name"></el-input></el-form-item
            ><el-form-item label="价格" prop="goods_price"
              ><el-input
                v-model="addForm.goods_price"
                type="number"
              ></el-input></el-form-item
            ><el-form-item label="数量" prop="goods_number"
              ><el-input
                v-model="addForm.goods_number"
                type="number"
              ></el-input></el-form-item
            ><el-form-item label="重量" prop="goods_weight"
              ><el-input v-model="addForm.goods_weight"></el-input
            ></el-form-item>
            <el-form-item label="商品分类：" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="parentCateList"
                style="width: 100%"
                :props="addProps"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(it, index) in item.attr_vals"
                  :label="it"
                  :key="index"
                ></el-checkbox> </el-checkbox-group
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2"
            ><el-form-item
              label=""
              v-for="item in onlyTableData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input> </el-form-item
          ></el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :headers="uploadHeaders"
              list-type="picture-card"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="uploadResult"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button class="addbtn" type="success" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图对话 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewdialogVisible"
      width="50%"
    >
      <img class="previewClass" :src="previewPicUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import _ from 'lodash'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      active: '0',
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入商品名称'
          }
        ],
        goods_price: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入价格'
          }
        ],
        goods_number: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入数量'
          }
        ],
        goods_weight: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入重量'
          }
        ],
        goods_introduce: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入介绍'
          }
        ],
        goods_cat: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入商品类'
          }
        ]
      },
      parentCateList: [],
      addProps: {
        expandTrigger: 'hover',
        value: 'cat_pid',
        label: 'cat_name',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPicUrl: '',
      previewdialogVisible: false
    }
  },

  methods: {
    next () {
      if (this.active++ > 2) this.active = 0
    },
    getParentCateList () {
      this.addCateDialogVisible = true
      this.$http.get('categories').then(e => {
        if (e.data.meta.status !== 200) {
          return this.$message.error(e.data.meta.msg)
        }
        this.parentCateList = e.data.data
      })
    },
    tabsChange (activeName, oldActiveName) {
      if (activeName !== '0' && this.addForm.goods_cat.length < 3) {
        this.$message.error('请先选择商品')
        return false
      }
      if (activeName === '1' || activeName === '2') {
        const sel = activeName === '1' ? 'many' : 'only'
        this.$http
          .get(
            `categories/${
              this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
            }/attributes`,
            { params: { sel } }
          )
          .then(e => {
            if (e.data.meta.status !== 200) {
              return this.$message.error(e.data.meta.msg)
            }
            e.data.data.forEach(
              e =>
                (e.attr_vals =
                  e.attr_vals.length == 0
                    ? sel == 'many'
                      ? []
                      : ''
                    : sel == 'many'
                      ? e.attr_vals.split(',')
                      : e.attr_vals)
            )
            this[sel + 'TableData'] = e.data.data
            console.log(sel, this[sel + 'TableData'])
          })
      }
    },
    handlePreview (file) {
      this.previewPicUrl = file.response.data.url
      this.previewdialogVisible = true
    },
    handleRemove (file) {
      this.addForm.pics.splice(
        this.addForm.pics.findIndex(e => e.pic == file.response.data.tmp_path),
        1
      )
    },
    uploadResult (result, file, fileList) {
      const picInfo = { pic: result.data.tmp_path }
      this.addForm.pics.push(picInfo)
      const urlList = []
      // fileList.forEach(e=>urlList.push( e.response.data.url))
      // this.previewPicUrlList=urlList
      //         console.log(fileList);
    },
    addGoods () {
      this.$refs.addRuleFormRef.validate(valid => {
        if (!valid) return this.$message.error('请填写必要信息')

        const tableData = [...this.manyTableData, ...this.onlyTableData]
        tableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value:
              typeof item.attr_vals === 'object'
                ? item.attr_vals.join(',')
                : item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        const from = _.cloneDeep(this.addForm)
        from.goods_cat = from.goods_cat.join(',')
        this.$http.post('goods', from).then(e => {
          console.log(e)
          if (e.data.meta.status !== 201) {
            return this.$message.error(e.data.meta.msg)
          }
          this.$message.success(e.data.meta.msg)
          this.$router.push('/goods')
        })
      })
    }
  },
  created () {
    this.getParentCateList()
  }
}
</script>

<style>
.el-steps {
  transform: scale(85%);
  margin: 10px;
}
.el-checkbox {
  margin: 0 10px 0 !important;
}
.previewClass {
  width: 100%;
  height: 60vh;
}
.ql-editor {
  min-height: 300px;
}
.addbtn {
  margin-top: 20px !important;
}
</style>
