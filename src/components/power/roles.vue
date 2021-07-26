<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="rowBorder" v-for="item in scope.row.children" :key="item.id">
              <el-col :span="5"
                ><el-tag @close="deleteRights(scope.row, item.id)" closable>{{ item.authName }}</el-tag
                ><i class="el-icon-caret-right"></i
              ></el-col>
              <el-col :span="19">
                <el-row class="rowBorder rowBorderNone" v-for="subItem in item.children" :key="subItem.id">
                  <el-col :span="5"
                    ><el-tag @close="deleteRights(scope.row, subItem.id)" closable type="success">{{ subItem.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="19"
                    ><el-tag @close="deleteRights(scope.row, it.id)" closable v-for="it in subItem.children" :key="it.id" type="info">{{ it.authName }}</el-tag></el-col
                  >
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px"
          ><template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRolesDialog(scope.row)">分配权限</el-button>
          </template></el-table-column
        >
      </el-table>
    </el-card>

    <!-- 权限对话框 -->
    <el-dialog title="权限分配" :visible.sync="setDialogRolesVisible" width="30%" @close="setRightsDialogClose">
      <el-tree ref="rightsTreeRef" show-checkbox :default-checked-keys="defKeys" node-key="id" :data="rightsList" :props="rightsListProps" check-on-click-node getCurrentKey></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      setDialogRolesVisible: false,
      rightsListProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      rightsList: {},
      // 当前分配权限ID
      rolesID: ''
    }
  },
  methods: {
    getRolesList() {
      this.$http.get('roles').then(e => {
        if (e.data.meta.status != 200) {
          this.$message.error(e.data.meta.msg)
          return
        }
        this.rolesList = e.data.data
      })
    },
    deleteRights(role, rightId) {
      this.$confirm('此操作删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('roles/' + role.id + '/rights/' + rightId).then(e => {
          if (e.data.meta.status != 200) {
            this.$message.error(e.data.meta, msg)
          } else role.children = e.data.data
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    showSetRolesDialog(role) {
      this.rolesID = role.id
      const getDefKeys = node => {
        if (!node.children) {
          this.defKeys.push(node.id)
          return
        }
        node.children.forEach(item => {
          getDefKeys(item)
        })
      }
      getDefKeys(role)

      this.$http.get('rights/tree').then(e => {
        if (e.data.meta.status != 200) {
          this.$message.error(e.data.meta.msg)
          return
        }
        this.rightsList = e.data.data
      })
      this.setDialogRolesVisible = true
    },
    setRightsDialogClose() {
      this.defKeys = []
    },
    setRoles() {
      const rids = [...this.$refs.rightsTreeRef.getCheckedKeys(), ...this.$refs.rightsTreeRef.getHalfCheckedKeys()].join(',')
      this.$http.post(`roles/${this.rolesID}/rights`, { rids }).then(e => {
        if (e.data.meta.status != 200) {
          this.$message.error(e.data.meta.msg)
          return
        }
        this.getRolesList()
        this.setDialogRolesVisible = false
      })
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style>
.el-tag {
  margin: 8px;
}
.rowBorder {
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}
.rowBorder:first-child {
  border-top: 1px solid #eee;
}
.rowBorderNone:last-child {
  border-bottom: none;
}
.rowBorderNone:first-child {
  border-top: none;
}
</style>
