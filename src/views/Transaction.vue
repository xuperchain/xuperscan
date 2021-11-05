<template>
  <div class="home">
    <div class="bottom">
      <div class="inpu">
        <InputSearch></InputSearch>
        <div class="solid"></div>
        <h1>交易详情</h1>
        <a-card class="card">
          <a-card-grid :hoverable="false" class="cards">
            <span class="tit1">{{ Headline.tit }}</span
            ><span
              >{{ ResultsOf.tx_id }}
              <a-icon
                class="copy"
                id="copy_text"
                :data-clipboard-text="ResultsOf.tx_id"
                @click="handleCopyFun"
                type="copy"
            /></span>
          </a-card-grid>

          <a-card-grid :hoverable="false" class="cards">
            <span class="tit1">{{ Headline.tit1 }}</span
            ><span>{{ ResultsOf.block_height }}</span>
          </a-card-grid>

           <a-card-grid :hoverable="false" class="cards">
            <span class="tit1">{{ Headline.tit10 }}</span
            ><span
              >{{ ResultsOf.block_id }}
              <a-icon
                class="copy"
                id="copy_text"
                :data-clipboard-text="ResultsOf.block_id"
                @click="handleCopyFun"
                type="copy"
            /></span>
          </a-card-grid>
          <a-card-grid :hoverable="false" class="cards">
            <span class="tit1">{{ Headline.tit2 }}</span
            ><span>{{ ResultsOf.timestamp | formatDate }}</span>
          </a-card-grid>
          <a-card-grid :hoverable="false" class="cards">
            <span class="tit1">{{ Headline.tit3 }}</span
            ><span>{{ ResultsOf.from_address }}</span>
          </a-card-grid>
          <a-card-grid :hoverable="false" class="cards">
            <span class="tit1">{{ Headline.tit4 }}</span
            ><span>{{ ResultsOf.to_addresses }}</span>
          </a-card-grid>
          <a-card-grid :hoverable="false" class="cards">
            <span class="tit1">{{ Headline.tit6 }}</span
            ><span>{{ ResultsOf.fee }}</span>
          </a-card-grid>
          <a-card-grid :hoverable="false" class="cards">
            <span class="tit1">{{ Headline.tit7 }}</span
            ><span>{{ ResultsOf.status == "SUCCESS" ? "成功" : "失败" }}</span>
          </a-card-grid>
          <a-card-grid :hoverable="false" class="cards">
            <span class="tit1">{{ Headline.tit8 }}</span
            ><span
              >{{ ResultsOf.miner }}
              <a-icon
                class="copy"
                id="copy_text"
                :data-clipboard-text="ResultsOf.miner"
                @click="handleCopyFun"
                type="copy"
            /></span>
          </a-card-grid>
          <a-card-grid :hoverable="false" class="cards">
            <span class="tit1">{{ Headline.tit9 }}</span
            ><span>{{ ResultsOf.block_timestamp | formatDate }}</span>
          </a-card-grid>
        </a-card>
        <h1>原始数据</h1>
        <a-card class="card">
          <a-card-grid
            :hoverable="false"
            style="width: 100%; text-align: left; background-color: #fafafa"
          >
            <json-viewer :value="jsonData" :expand-depth="5" copyable>
            </json-viewer>
          </a-card-grid>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getSearch } from "@/utils/api.js";
import Clipboard from "clipboard";
import InputSearch from "../components/inputSearch.vue";

export default {
  components: {
    InputSearch,
  },
  data() {
    return {
      jsonData: {
        /* json data*/
      },
      Switch: 1,
      value: "",
      Headline: {
        tit: "交易哈希 :",
        tit1: "区块高度 :",
        tit2: "交易发起时间 :",
        tit3: "发起方：",
        tit4: "接收方：",
        tit5: "交易额：",
        tit6: "交易手续费：",
        tit7: "交易状态：",
        tit8: "验证人：",
        tit9: "出块时间：",
        tit10: "区块哈希",
      },
      ResultsOf: {},
    };
  },
  methods: {
    // 复制
    handleCopyFun() {
      let clipboard = new Clipboard("#copy_text");
      clipboard.on("success", () => {
        this.$message.success("复制成功");
        clipboard.destroy(); // 释放内存
      });
      clipboard.on("error", () => {
        // 不支持复制
        alert("该浏览器不支持自动复制");
        clipboard.destroy(); // 释放内存
      });
    },
    //搜索
    async getSearchList(data) {
      let res = await getSearch(data);
      this.jsonData = res;
      this.ResultsOf = res.data;
    },
  },
  mounted() {
    this.getSearchList(this.$route.query.id);
  },
};
</script>

<style lang="less" scoped>
.copy{
  color: #8f9bb3ff;
}
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
.bottom {
  padding: 30px 50px 50px 50px;
  margin: 10px 90px;
  // height: 1228px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  /deep/ .ant-input-affix-wrapper .ant-input {
    width: 100%;
    height: 48px;
  }
  .inpu {
    margin-bottom: 30px;
  }
}
.solid {
  border: 1px solid #e8e8e8;
  margin: 30px 0;
}
.cards {
  width: 100%;
  text-align: left;
}
.card {
  margin: 15px 0;
  span {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}
.tit1 {
  display: inline-block;
  width: 110px;
}

/deep/.jv-container .jv-code {
  background-color: #fafafa;
}
</style>