<template>
  <!-- <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <img class="layout-logo" src="../assets/电商.png" />
          <span class="title">电商管理系统</span>
          <div class="layout-nav">
            <MenuItem name="1">
              <Button @click="exit">
                <i class="iconfont icon-tuichu"> </i>退出</Button
              >
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout :style="{ padding: '0 50px', height: '80vh' }">
        <Breadcrumb :style="{ margin: '16px 0' }">
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Components</BreadcrumbItem>
          <BreadcrumbItem>Layout</BreadcrumbItem>
        </Breadcrumb>

        <Content
          :style="{ padding: '24px 0', height: '100%', background: '#fff' }"
        >
          <Layout>
            <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon>
            <Sider
              hide-trigger
              :style="{ background: '#fff' }"
              collapsible
              collapsed-width="64"
              value
              default-collapsed
              breakpoint="md"
            >
              <Menu
                active-name="1-2"
                theme="light"
                width="auto"
                :open-names="['1']"
              >
                <Submenu
                  :name="item.id"
                  v-for="item in menulist"
                  :key="item.id"
                >
                  <template slot="title">
                    <Icon :type="menuIconList[item.id]" />
                  </template>
                </Submenu>
              </Menu> </Sider
            >.

            <Content
              :style="{
                padding: '24px',
                minHeight: '100%',
                background: '#fff',
              }"
            >
            </Content>
          </Layout>
        </Content>
      </Layout>
      <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
    </Layout>
  -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img class="layout-logo" src="../assets/电商.png" />
        <span class="title">电商管理系统</span>
      </div>
      <el-button @click="exit" type="info" icon="el-icon-switch-button">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse ? '64px' : '170px'">
        <el-menu
          router
          unique-opened
          :collapse="iscollapse"
          :collapse-transition="false"
          class="el-menu-vertical-demo "
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
          :default-active="activePath"
        >
          <div class="btn-toggle" @click="toggleCollapse">|||</div>
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="menuIconList[item.id]" />
              <span class="authName">{{ item.authName }}</span>
            </template>
            <el-menu-item class="it_authName" :index="it.path" v-for="it in item.children" :key="it.id" @click="saveNavState(it.path)"
              ><i class="el-icon-menu"></i>
              {{ it.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu></el-aside
      >
      <!-- 右侧主体 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      menuIconList: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-operation',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      iscollapse: false
    }
  },
  created() {
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    exit() {
      this.$confirm('退出系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      })
    },
    // 获取菜单
    getMenuList() {
      this.$http.get('menus').then(res => {
        if (res.data.meta.status != 200) {
          return this.$Message.warning(res.data.meta.msg)
        }
        this.menulist = res.data.data
      })
    },
    toggleCollapse() {
      // 切换菜单
      this.iscollapse = !this.iscollapse
    },
    saveNavState(e) {
      // 缓存打开的菜单
      sessionStorage.setItem('activePath', e)
      this.activePath = e
    }
  }
}
</script>

<style>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 25px;
}
.el-header div {
  display: flex;
  align-content: center;
}
.el-header div span {
  margin: auto 15px;
}
.el-header img {
  width: 70px;
  height: 55px;
}
.el-aslide {
  background-color: #333744;
}
.el-menu {
  border-right: none !important;
  height: 100%;
}
.el-main {
  background-color: #d2d2d2;
}
.authName {
  margin-left: 10px;
}
.it_authName {
  padding-left: 55px !important;
}
.btn-toggle {
  background-color: #545c64;
  color: #fff;
  line-height: 30px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-submenu .el-menu-item {
  min-width: 170px !important;
}
</style>
