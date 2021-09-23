<template>
  <div class="wrapper">
    <div class="solid"></div>
    <div class="gutter-example">
      <a-row :gutter="50">
        <a-col class="gutter-row" :span="12">
          <a-row type="flex" class="type">
            <a-col :flex="2.5">
              <div class="tit">区块高度</div>
              <div class="num">{{ blocksHeight }}</div>
            </a-col>
            <a-col :flex="2.5">
              <div class="tit">交易总数</div>
              <div class="num">{{ TotalNumberTransactions }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col class="gutter-rows" :span="12">
              <div class="gutter-boxs">
                <div class="title">合约总数</div>
                <div class="clearfix all">
                  <div class="fl">
                    <span class="lf">{{
                      BlockHeightDetails.TotalNumberContracts
                    }}</span
                    ><span class="sm">个</span>
                  </div>
                  <div class="fr">
                    <img src="../assets/image/one.png" alt="" />
                  </div>
                </div>
              </div>
            </a-col>
            <a-col class="gutter-rows" :span="12">
              <div class="gutter-boxs">
                <div class="title">矿工地址</div>
                <div class="clearfix all">
                  <div class="fl copyminer">
                    <span class="copy">{{ BlockHeightDetails.miner }}</span>
                  </div>
                  <div class="fr">
                    <img
                      id="copy_text"
                      :data-clipboard-text="BlockHeightDetails.minercopy"
                      @click="handleCopyFun"
                      src="../assets/image/copy.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col class="gutter-rows" :span="12">
              <div class="gutter-boxs">
                <div class="title">最新出块</div>
                <div class="clearfix all">
                  <div class="fl">
                    <span class="lf NumberNodes">{{ num.toFixed(1) }}</span
                    ><span class="sm">秒前</span>
                  </div>
                  <div class="fr">
                    <img src="../assets/image/time.png" alt="" />
                  </div>
                </div>
              </div>
            </a-col>
            <a-col class="gutter-rows" :span="12">
              <div class="gutter-boxs">
                <div class="title">历史并发峰值</div>
                <div class="clearfix all">
                  <div class="fl">
                    <span class="lf">{{
                      BlockHeightDetails.TotalNumberNodes
                    }}</span
                    ><span class="sm">笔/秒</span>
                  </div>
                  <div class="fr">
                    <img src="../assets/image/Peak.png" alt="" />
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-col>
        <a-col
          class="gutter-row"
          style="box-shadow: 0px 1px 1.59722vw 0px rgb(0 0 0 / 5%)"
          :span="12"
        >
          <div class="gutter-box">
            <div id="myChart"></div>
          </div>
        </a-col>
      </a-row>
    </div>

    <div class="bottom">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="最新区块">
          <a-table
            :rowKey="
              (record, index) => {
                return index;
              }
            "
            :columns="columns"
            :data-source="dataone"
            :pagination="pagination"
          >
            <span
              @click="getGoblockheight(text, 1)"
              class="name"
              slot="block_height"
              slot-scope="text"
              >{{ text }}</span
            >
            <span
              class="name"
              @click="getGoblockheight(text, 1)"
              slot="block_id"
              slot-scope="text"
              >{{ getSubStr(text) }}</span
            >
            <span slot="miner" slot-scope="text">{{ getSubStr(text) }}</span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="最新交易" force-render>
          <a-table
            :rowKey="
              (record, index) => {
                return index;
              }
            "
            :columns="columnsTwo"
            :data-source="dataTwo"
            :pagination="pagination"
          >
            <span
              class="name"
              slot="tx_id"
              @click="getGoblockheight(text, 2)"
              slot-scope="text"
              >{{ getSubStr(text) }}</span
            >
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import {
  getTransActions,
  getBlocks,
  getStatus,
  getTransaction_stats,
} from "@/utils/api.js";
import { formatDate } from "@/utils/util.js";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { SVGRenderer } from "echarts/renderers";
import { number } from "echarts/core";
import Clipboard from "clipboard";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  SVGRenderer,
]);
export default {
  components: {},
  props: {
    type: number,
  },
  data() {
    return {
      DealsList: "",
      //区块高度列表数据
      BlockHeightDetails: {
        TotalNumberContracts: "",
        TotalNumberNodes: "",
        SynchronizationBlock: "",
        HistoricalPeakConcurrent: "",
      },
      //表格分页设置
      pagination: {
        pageSize: 10, // 默认每页显示数量
        hideOnSinglePage: true,
      },
      //最新区块表格
      columns: [
        {
          title: "区块高度",
          dataIndex: "block_height",
          scopedSlots: { customRender: "block_height" },
          width: "14%",
        },
        {
          title: "交易量",
          dataIndex: "tx_number",
          width: "10%",
        },
        {
          title: "区块哈希",
          scopedSlots: { customRender: "block_id" },
          dataIndex: "block_id",
          ellipsis: true,
          width: "28%",
        },
        {
          title: "验证人",
          dataIndex: "miner",
          scopedSlots: { customRender: "miner" },
          ellipsis: true,
          width: "28%",
        },
        {
          title: "提交时间",
          dataIndex: "timestamp",
          ellipsis: true,
          width: "20%",
        },
      ],
      dataone: [{}],
      //最新交易表格
      columnsTwo: [
        {
          title: "交易哈希",
          dataIndex: "tx_id",
          scopedSlots: { customRender: "tx_id" },
          width: "25%",
          ellipsis: true,
        },
        {
          title: "交易额",
          dataIndex: "to_total",
          width: "10%",
        },
        {
          title: "手续费",
          scopedSlots: { customRender: "address" },
          dataIndex: "address",
          ellipsis: true,
          width: "10%",
        },
        {
          title: "接收方",
          dataIndex: "to_addresses",
          ellipsis: true,
          width: "25%",
        },
        {
          title: "发起方",
          dataIndex: "from_address",
          ellipsis: true,
          width: "10%",
        },
        {
          title: "时间",
          dataIndex: "timestamp",
          ellipsis: true,
          width: "20%",
        },
      ],
      dataTwo: [{}],
      key: "",
      obj: [],
      objValue: [],
      blocksHeight: "",
      TotalNumberTransactions: "",
      num: 0.1,
    };
  },

  methods: {
    //截取字符串中间用省略号显示
    getSubStr(str) {
      if (str) {
        let subStr1 = str.substr(0, 15);
        let subStr2 = str.substr(str.length - 8, 8);
        let subStr = subStr1 + "..." + subStr2;
        return subStr;
      }
    },
    // // 复制
    handleCopyFun() {
      let clipboard = new Clipboard("#copy_text");
      clipboard.on("success", () => {
        this.$message.success("复制成功");
        this.$message.destroy();
        clipboard.destroy(); // 释放内存
      });
      clipboard.on("error", () => {
        // 不支持复制
        alert("该浏览器不支持自动复制");
        clipboard.destroy(); // 释放内存
      });
    },
    //切换
    callback(key) {
      this.key = key;
    },
    getGoblockheight(record, id) {
      console.log(record, record);
      if (id == 1) {
        this.$router.push({
          path: "/blockDetails",
          query: { id: record },
        });
      } else {
        this.$router.push({
          path: "/transaction",
          query: { id: record },
        });
      }
    },

    //最新区块
    async getgetBlocksList() {
      let res = await getBlocks();
      this.TotalNumberTransactions = res.data.blocks[0].total_tx;
      this.blocksHeight = res.data.blocks[0].ID;
      this.BlockHeightDetails.miner = this.getSubStr(res.data.blocks[0].miner);
      this.BlockHeightDetails.minercopy = res.data.blocks[0].miner;
      if (res.data.blocks[0].ID !== this.dataone[0].ID) {
        this.num = 0.1;
      }
      this.dataone = res.data.blocks.map((item) => {
        return {
          ID: item.ID,
          block_height: item.block_height,
          tx_number: item.tx_number,
          block_id: item.block_id,
          miner: item.miner,
          from_address: item.from_address,
          timestamp: formatDate(item.timestamp),
        };
      });
    },

    //最新交易
    async getTransActionslist() {
      let res = await getTransActions();
      this.dataTwo = res.data.txs.map((item) => {
        return {
          ID: item.ID,
          tx_id: item.tx_id,
          to_total: item.to_total,
          next_hash: item.next_hash,
          address: item.fee,
          to_addresses: item.to_addresses,
          from_address: item.from_address,
          timestamp: formatDate(item.timestamp),
        };
      });
    },

    //折线图数据
    async getLineChart() {
      let res = await getTransaction_stats({});
      let datatime = [];
      let datavValue = [];
      Object.keys(res.data).forEach((v) => {
        let dataTimeValue = Number(v.substring(10, 13)) + 1;
        datatime.push(
          `${dataTimeValue < 10 ? "0" + dataTimeValue : dataTimeValue}:00`
        );
        this.obj = datatime;
        datavValue.push(res.data[v]);
        this.objValue = datavValue;
      });
      this.$nextTick(() => {
        this.drawLine();
      });
    },
    //折线图
    drawLine() {
      var chartDom = document.getElementById("myChart");
      var myChart = echarts.init(chartDom);
      var option;

      var date = this.obj;

      var data = this.objValue;

      option = {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        title: {
          left: "left",
          text: "交易总数",
        },

        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date,
          axisLabel: {
            interval: 0, //横轴信息全部显示
            rotate: -60, //60度角倾斜显示
          },
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        series: [
          {
            name: "交易量",
            type: "line",
            symbol: "none",
            sampling: "lttb",
            itemStyle: {
              color: "rgb(31, 183, 196)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(193, 235, 239",
                },
                {
                  offset: 1,
                  color: "rgb(31, 183, 196)",
                },
              ]),
            },
            data: data,
          },
        ],
      };

      option && myChart.setOption(option);
      //跟随屏幕自适应
      setTimeout(function () {
        window.onresize = function () {
          myChart.resize();
        };
      });
    },
    //首页数据
    async getStatusList() {
      let res = await getStatus({});
      //历史并发峰值
      this.BlockHeightDetails.TotalNumberNodes = res.data.tx_peak;
      //合约总数
      this.BlockHeightDetails.TotalNumberContracts = res.data.contracts;
    },
    //初始加载
    init() {
      this.getTransActionslist();
      this.getgetBlocksList();
      this.getStatusList();
      this.drawLine();
    },
  },

  mounted() {
    this.getLineChart();
    this.init();
    this.timer2 = setInterval(() => {
      this.num = this.num + 0.1;
    }, 100);

    this.timer = setInterval(() => {
      try {
        this.init();
      } catch (error) {
        console.log(error);
      }
    }, 3000);
  },
  computed: {
    count() {
      return this.$store.state.ListeningToThe;
    },
  },
  watch: {
    count(newval) {
      console.log(newval, "119.28.23.192:8088");
      this.getLineChart();
    },
  },
  destroyed() {
    clearInterval(this.timer, this.timer2);
    this.timer = null;
    this.timer2 = null;
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-table-tbody {
  & {
    cursor: default;
  }
}
.solid {
  border: 1px solid #e8e8e8;
  margin: 30px 0;
}

.gutter-example /deep/ .ant-row > div {
  background: transparent;
  border: 0;
}
.gutter-box {
  height: 350px;

  padding: 5px 0;
}
#myChart {
  width: 100%;
  height: 100%;
  padding: 5px 0;
}
.type {
  padding: 25px 50px;
  text-align: left;
  background: #ffffff;
  box-shadow: 0px 1px 23px 0px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  font-family: PingFangSC-Medium, PingFang SC;
  .tit {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
  }
  .num {
    font-size: 24px;
    font-weight: 500;
    color: #07afbe;
  }
}
.gutter-boxs {
  background: #ffffff;
  box-shadow: 0px 1px 23px 0px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-top: 30px;
  height: 93px;
  padding: 20px 20px;
  .title {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
  }
  .copy {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    display: inline-block;
  }
  .copyminer {
    width: calc(100% - 24px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lf {
    font-size: 24px;
    font-weight: 500;
    color: #333333;
  }
  .sm {
    font-size: 12px;
    font-weight: 400;
    color: #666666;
  }
  .NumberNodes {
    padding-right: 30px;
  }
  .all {
    line-height: 30px;
  }
}
.bottom {
  margin-top: 30px;
}
/deep/ .ant-tabs-ink-bar {
  background-color: #323234ff;
}
/deep/.ant-tabs-nav .ant-tabs-tab-active {
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #323234;
}
/deep/.ant-tabs-nav .ant-tabs-tab:hover {
  color: #999999;
}
/deep/.ant-table-body {
  margin-top: 20px;
  // border: 1px solid #eeeeee;
}
.name {
  color: #07afbeff;
  & {
    cursor: pointer;
  }
}
</style>