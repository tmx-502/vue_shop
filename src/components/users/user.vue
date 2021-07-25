<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="15">
        <el-col :span="7"
          ><el-input
            placeholder="请输入内容"
            clearable
            class="input-with-select"
            v-model="queryInfo.query"
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4"
          ><el-button class="addY" @click="dialogVisible = true" type="primary"
            >添加用户</el-button
          ></el-col
        >
      </el-row>

      <!-- 表格 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" width="60" align="center">
        </el-table-column>
        <el-table-column
          align="center"
          prop="create_time"
          label="日期"
          width="180"
          :formatter="handleDate"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="账户"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="role_name"
          label="权限"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="mobile" label="手机">
        </el-table-column>
        <el-table-column align="center" prop="email" label="邮箱">
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope"
            ><el-switch @change="mg_stateChange(scope.row)" v-model="scope.row.mg_state"> </el-switch
          ></template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="showEdit(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              size="small"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="角色分配"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-star-off"
                size="small"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加用户对话框 -->
      <el-dialog
        @closed="dialogClosed('dialogFrom')"
        title="添加用户"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <!-- 对话框内容 -->
        <el-form
          ref="dialogFrom"
          status-icon
          :model="addUseForm"
          :rules="addUserRules"
          label-width="80px"
        >
          <el-form-item label="用户名称" required prop="username">
            <el-input v-model="addUseForm.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" required prop="password">
            <el-input type="password" v-model="addUseForm.password"></el-input>
          </el-form-item>
          <el-form-item label="密码确认" required prop="checkPwd2">
            <el-input type="password" v-model="addUseForm.checkPwd2"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUseForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUseForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户对话框 -->
      <el-dialog
        title="提示"
        @closed="dialogClosed('dialogEdit')"
        :visible.sync="editDialogVisible"
        width="30%"
      >
        <el-form
          ref="dialogEdit"
          status-icon
          :model="editInfo"
          :rules="addUserRules"
          label-width="80px"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input disabled v-model="editInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editInfo.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEdit">确 定</el-button>
        </span>
      </el-dialog>

<!-- 角色分配对话框 -->
<el-dialog
  title="角色分配"
  :visible.sync="setRolesdialogVisible"
  width="50%"
  >
  <div>
    <div>用户名：{{userInfo.username}}</div>
    <div>当前角色：{{userInfo.role_name}}</div>
    <div>更改角色：<el-select v-model="selectRoleID" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  </div>
  </div>

  <span slot="footer" class="dialog-footer">
    <el-button @click="setRolesdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10, 100]"
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
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[0-9A-z-_]+@[0-9A-z-_]+.[0-9A-z]+/

      return !value || regEmail.test(value)
        ? callback()
        : callback(new Error('邮箱格式不正确'))
    }
    var checkPwd = (rule, value, callback) => {
      const regPwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-z]+$/
      return regPwd.test(value)
        ? callback()
        : callback(new Error('密码中需要包含字符和数字'))
    }
    var checkPwd2 = (rule, value, callback) => {
      return this.addUseForm.checkPwd2 == this.addUseForm.password
        ? callback()
        : callback(new Error('两次密码不相同'))
    }
    var checkPhoto = (rule, value, callback) => {
      const regPhoto = /^1[0-9]{10}$/
      return !value || regPhoto.test(value)
        ? callback()
        : callback(new Error('请输入正确的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      userList: [],
      currentPage: 1,
      total: 0,
      dialogVisible: false,
      addUseForm: {
        username: '',
        password: '',
        checkPwd2: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入用户名称'
          },
          {
            min: 2,
            max: 10,
            message: '请输入2-10位字符的用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入密码'
          },
          {
            min: 4,
            message: '密码不能少于4位字符',
            trigger: 'blur'
          },
          { validator: checkPwd, trigger: 'blur' }
        ],
        checkPwd2: [
          {
            required: true,
            trigger: 'blur',
            message: '请确认密码'
          },
          { validator: checkPwd2, trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkPhoto, trigger: 'blur' }]
      },
      editInfo: {},
      editDialogVisible: false,
      setRolesdialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectRoleID: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      this.$http.get('users', { params: this.queryInfo }).then((e) => {
        e = e.data
        if (e.meta.status !== 200) { return this.$message.error('获取用户列表失败') }
        this.userList = e.data.users
        this.total = e.data.total
      })
    },
    handleSizeChange (e) {
      this.queryInfo.pagesize = e
       this.getUserList()
    },
    handleCurrentChange (e) {
      this.queryInfo.pagenum = e
      this.getUserList()
    },
    handleDate (row) {
      return new Date(row.create_time).toLocaleDateString()
    },
    dialogClosed (e) {
      // 对话框关闭时重置表单
      this.$refs[e].resetFields()
    },
    addUser () {
      // 添加用户
      this.$refs.dialogFrom.validate((e) => {
        if (e) {
          this.$http.post('users', this.addUseForm).then((result) => {
            if (result.data.meta.status == 201) {
              this.dialogVisible = false
              this.$Message.success(result.data.meta.msg)
              this.getUserList()
            } else this.$Message.error(result.data.meta.msg)
          })
        }
      })
    },
    showEdit (id) {
      this.$http.get('users/' + id).then((e) => {
        if (e.data.meta.status !== 200) {
          this.$message.error(e.data.meta.message)
        } else this.editInfo = e.data.data
      })
      this.editDialogVisible = true
    },
    handleEdit () {
      this.$refs.dialogEdit.validate((e) => {
        if (e) {
          this.$http
            .put('users/' + this.editInfo.id, this.editInfo)
            .then((result) => {
              console.log(result)
              if (result.data.meta.status == 200) {
                this.$message.success(result.data.meta.msg)
                this.editDialogVisible = false
                this.getUserList()
              } else this.$message.error(result.data.meta.msg)
            })
        }
      })
    },
    deleteUser (e) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('users/' + e).then((result) => {
          if (result.data.meta.status == 200) {
            this.$message.success(result.data.meta.msg)
            this.getUserList()
          } else this.$message.error(result.data.meta.msg)
        })
      })
    },
    setRole (userInfo) {
      this.selectRoleID = ''
      this.userInfo = userInfo
      this.$http.get('roles').then(e => {
        if (e.data.meta.status != 200) return this.$message.error(e.data.meta.msg)
        this.rolesList = e.data.data
      })
      this.setRolesdialogVisible = true
    },
    saveRoleInfo () {
      if (!this.selectRoleID) return this.$message.error('请选择要更改的角色')

      this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleID }).then(e => {
        if (e.data.meta.status != 200) return this.$message.error(e.data.meta.msg)
        this.setRolesdialogVisible = false
        this.userInfo = e.data.data
        this.getUserList()
      })
    },
    mg_stateChange (info) {
      this.$http.put(`users/${info.id}/state/${info.mg_state}`).then(e => {
        if (e.data.meta.status != 200) return this.$message.error(e.data.meta.msg)
      })
    }
  }
}
</script>

<style>
.el-card {
  margin-top: 20px;
  text-align: left !important;
}
.el-table {
  margin-top: 20px;
}
/* .el-input {
    width: 400px !important;

  } */
</style>
