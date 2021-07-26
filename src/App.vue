<!--
 * @Description: 
 * @Author: liutq
 * @Date: 2021-07-22 09:10:57
 * @LastEditTime: 2021-07-26 11:56:15
 * @LastEditors: liutq
 * @Reference: 
-->
<template>
  <div id="app">
    <!--路由占位符-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
