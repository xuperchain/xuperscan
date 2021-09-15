<template>
  <div class="home">
    <div class="bottom">
      <div class="inpu">
        <InputSearch @SearchValue="SearchValue" ></InputSearch>
         <div class="img-center">
      <img src="../assets/image/none.png" alt="" />
      <p>未找到{{ inputValue }}相关结果</p>
    </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from "../components/inputSearch.vue";
export default {
  components: {
    InputSearch,
  },
  data() {
    return {
        inputValue:""
    };
  },
  methods: {
      SearchValue(data){
        this.inputValue=data
      }
  },
  mounted() {
      this.inputValue=this.$route.query.id
  },
};
</script>

<style lang="less" scoped>
.bottom {
  padding: 30px 50px 50px 50px;
  margin: 10px 90px;
  // height: 1228px;
  background: #ffffff;
  border: 1px solid #eeeeee;

  .inpu {
    margin-bottom: 30px;
  }
}
.img-center {
  margin: 120px auto;
  text-align: center;
  img {
    width: 74px;
    height: 74px;
  }
  p {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 30px;
  }
}
</style>