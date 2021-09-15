<template>
  <div class="home">
    <div class="bottom">
      <div class="inpu">
        <InputSearch ></InputSearch>
        <Page ></Page>
      </div>
    </div>
  </div>
</template>

<script>
import Page from "../components/page.vue";
import InputSearch from "../components/inputSearch.vue";
export default {
  components: {
    Page,
    InputSearch,
  },
  data() {
    return {
    };
  },
  methods: {

  },
  mounted() {
  },
};
</script>

<style lang="less" scoped>
.bottom {
  padding: 30px 50px 50px 50px;
  margin: 10px 90px;
  background: #ffffff;
  border: 1px solid #eeeeee;

  .inpu {
    margin-bottom: 30px;
  }
}
</style>