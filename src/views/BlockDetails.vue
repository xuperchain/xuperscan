<template>
  <div class="wrapper">
    <div class="bottom">
      <div class="inpu">
        <InputSearch></InputSearch>
        <div class="solid"></div>

        <h1>摘要</h1>
        <a-card class="card">
          <a-card-grid style="width: 100%; text-align: left" :hoverable="false">
            <div class="lef">
              <span>{{ Headline.tit }}</span>
              <span>{{ ResultsOf.block_height }}</span>
            </div>
            <div class="rig">
              <span>{{ Headline.tit2 }}</span>
              <span>{{ getSubStr(ResultsOf.block_id) }}</span>
              <a-icon
                class="icon"
                id="copy_text"
                :data-clipboard-text="ResultsOf.block_id"
                @click="handleCopyFun"
                type="switcher"
              />
            </div>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: left" :hoverable="false">
            <div class="lef">
              <span>{{ Headline.tit3 }}</span>
              <span>{{ ResultsOf.tx_number }}</span>
            </div>
            <div class="rig">
              <span>{{ Headline.tit4 }}</span>
              <span
                style="cursor: pointer"
                class="Initiator-num"
                @click="getParentBlockHash(ResultsOf.pre_hash)"
                >{{ getSubStr(ResultsOf.pre_hash) }} <span></span> </span
              ><a-icon
                id="copy_text"
                :data-clipboard-text="ResultsOf.pre_hash"
                @click="handleCopyFun"
                class="icon"
                type="switcher"
              />
            </div>
          </a-card-grid>
          <a-card-grid style="width: 100%; text-align: left" :hoverable="false">
            <div class="lef">
              <span>{{ Headline.tit5 }}</span>
              <span>{{ getSubStr(ResultsOf.miner) }}</span
              ><a-icon
                id="copy_text"
                :data-clipboard-text="ResultsOf.miner"
                @click="handleCopyFun"
                class="icon"
                type="switcher"
              />
            </div>
            <div class="rig">
              <!-- <span>{{ Headline.tit6 }}</span>
              <span class="Initiator-num"
                >{{ ResultsOf.next_hash }} <span></span>
              </span>
              <a-icon
                class="icon"
                id="copy_text"
                :data-clipboard-text="ResultsOf.next_hash"
                @click="handleCopyFun"
                type="switcher"
              /> -->
              <div class="lef">
                <span>{{ Headline.tit7 }}</span>
                <span>{{ ResultsOf.timestamp | formatDate }}</span>
              </div>
            </div>
          </a-card-grid>
          <!-- <a-card-grid style="width: 100%; text-align: left" :hoverable="false">
            <div class="lef">
              <span>{{ Headline.tit7 }}</span>
              <span>{{ ResultsOf.timestamp | formatDate }}</span>
            </div>
          </a-card-grid> -->
        </a-card>
        <h1>交易</h1>
        <div class="all">
          <a-card
            v-for="(item, index) in TransactionList"
            :key="index"
            style="width: 100%; height: 100%"
          >
            <div class="top">
              <div class="Title-hash">
                <span>交易哈希:</span>
                <span
                  style="color: #07afbe; cursor: pointer"
                  @click="getTradingHash(item.tx_id)"
                  class="ResultsOf"
                  >{{ item.tx_id }}
                </span>
                <a-icon
                  class="icon"
                  id="copy_text"
                  :data-clipboard-text="item.tx_id"
                  @click="handleCopyFun"
                  type="switcher"
                />
              </div>
              <div>
                <span class="Title-hash">手续费:</span>
                <span class="ResultsOf">{{ item.from_total }}</span>
              </div>
              <div>
                <span class="Title-hash">时间:</span>
                <span class="Title-hash">{{ item.date }}</span>
              </div>
            </div>
            <div class="bottomw">
              <div class="">
                <div class="Title-hash">发起方</div>
                <div>
                  {{ item.from_address }}
                </div>
              </div>
              <a-icon type="right" />
              <div class="left">
                <div class="Title-hash">接收方:</div>
                <div>
                  {{ item.to_addresses }}
                </div>
              </div>
            </div>
          </a-card>

          <a-pagination
            :current="current"
            :defaultPageSize="defaultPageSize"
            :total="total"
            @change="onChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import InputSearch from "../components/inputSearch.vue";
import { getSearch, getTransActions } from "@/utils/api.js";

export default {
  components: {
    InputSearch,
  },
  data() {
    return {
      current: 1,
      defaultPageSize: 10,
      total: 0,
      Headline: {
        tit: "区块高度 :",
        tit2: "区块哈希 :",
        tit3: "交易数 :",
        tit4: "父区块哈希 :",
        tit5: "验证人 :",
        tit7: "时间 :",
      },
      ResultsOf: {},
      TransactionList: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    //截取字符串中间用省略号显示
    getSubStr(str) {
      if (str) {
        var subStr1 = str.substr(0, 30);
        var subStr2 = str.substr(str.length - 10, 10);
        var subStr = subStr1 + "..." + subStr2;
        return subStr;
      }
    },
    getTradingHash(data) {
      this.$router.push({
        path: "/transaction",
        query: { id: data },
      });
    },
    //分页
    onChange(current) {
      this.current = current;
    },
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
      this.ResultsOf = res.data;
      res.data.txs.map(async (item) => {
        //获取交易列表
        let res = await getTransActions(item);
        this.TransactionList.push(...res.txs);
        this.total = this.TransactionList.length;
      });
    },
    //点击父区块哈希
    getParentBlockHash(data) {
      this.getSearchList(data);
      this.$router.push({
        path: "/blockDetails",
        query: { id: data },
      });
    },
    async init() {
      await this.getSearchList(this.$route.query.id);
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
span {
  width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.icon {
  line-height: 25px;
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
/deep/.ant-card-body {
  padding: 0;
  // padding :0 30px
}
/deep/.ant-descriptions-view {
  padding: 0 30px;
}
/deep/ .ant-card-bordered {
  margin-bottom: 20px;
}
/deep/.ant-pagination {
  text-align: right;
}
.icon {
  color: #8f9bb3ff;
}
.Initiator-num {
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #07afbe;
  line-height: 27px;
}

.Initiator {
  font-weight: 500;
  color: #333333;
  line-height: 30px;
}
.ResultsOf {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
}
.Title-hash {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  margin-right: 13px;
}
.all {
  margin: 30px 0px;
}
.bottomw {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  height: 128px;
  background: #fafafa;
  padding: 0 30px;
  .left {
    width: 44.4%;
    text-align: left;
  }
}
.top {
  padding: 0 30px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.solid {
  border: 1px solid #e8e8e8;
  margin: 30px 0;
}
.card {
  margin: 20px 0;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  div {
    display: inline-block;
    display: flex;
  }
  .lef {
    width: 50%;
    span:nth-child(1) {
      width: 120px;
    }
  }
  .rig {
    width: 50%;
    span:nth-child(1) {
      width: 120px;
    }
  }
}
</style>