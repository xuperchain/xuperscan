<template>
  <div class="wrapper">
    <a-input-search
      placeholder="请输入区块哈希/区块高度/交易哈希进行搜索"
      @search="onSearch"
    />
  </div>
</template>

<script>
import { getSearch } from "@/utils/api.js";

export default {
  components: {},
  props: {},
  data() {
    return {
      value: "",
    };
  },
  watch: {},
  computed: {},
  methods: {
    async onSearch(value) {
      if (value.length == 0) {
        this.$router.push({ path: "/" });
        return;
      }
      let res = await getSearch(value);
      if (res.code == 4) {
        this.$router.push({ path: "/null", query: { id: value } });
        this.$emit("SearchValue", value);
      } else if (res.msg == "txs") {
        this.$router.push({ path: "/transaction", query: { id: value } });
      } else if (res.msg == "block") {
        this.$emit("SearchValue", value);
        this.$router.push({ path: "/blockDetails", query: { id: value } });
      } else if (res.code == 1) {
        this.$message.error(res.msg);
        this.$message.destroy();
      }
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
/deep/ .ant-input-affix-wrapper .ant-input {
  width: 100%;
  height: 48px;
}
</style>