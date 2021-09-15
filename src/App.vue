<template>
  <div id="app">
    <div id="nav">
      <Top></Top>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import "ant-design-vue/dist/antd.css";
import Top from "@/components/top.vue";
export default {
  components: {
    Top,
  },
};
</script>
<style lang="less">
#app{
  padding-bottom: 45px;
}
</style>
