<template>
  <div class="top">
    <div class="logo-top">
      <div @click="getBackHome" class="log-img">
        <img src="../assets/image/logo.png" alt="" />
      </div>
      <div class="log-tit" @click="showModal">
        {{ valuetit }}
        <a-icon type="down" />
      </div>
    </div>
    <a-modal v-model="visibles" title="添加链" :width="800">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          hideRequiredMark="true"
          ref="name"
          label="网络名称"
          prop="name"
        >
          <a-input v-model="form.name" />
        </a-form-model-item>

        <a-form-model-item ref="add" label="地址" prop="add">
          <a-input v-model="form.add" />
        </a-form-model-item>
      </a-form-model>
      <div class="" slot="footer">
        <button class="ModelAgree" @click="onSubmit">确定</button>
        <button class="RefusedTo" @click="resetForm">取消</button>
      </div>
    </a-modal>

    <!-- //抽屉 -->
    <a-drawer
      placement="right"
      :closable="false"
      :visible="visible"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
      :width="450"
    >
      <div slot="title" class="modal-title">
        <a-icon type="close" @click="cancelModal" />
        <span class="Switch" @click="getSwitchChain(value)">
          <a-icon type="swap" />切换链
        </span>
      </div>

      <a-radio-group v-model="value" @change="onChange($event)">
        <a-radio
          v-for="item in lists"
          :key="item.id"
          :style="radioStyle"
          :value="item.value"
        >
          {{ item.Content }}
        </a-radio>

        <a-radio
          @mouseenter="enter"
          @mouseleave="leave"
          v-for="item in listAdditionals"
          :key="item.id"
          :style="radioStyle"
          :value="item.value"
        >
          <a-icon type="close" v-show="seen" @click="getDelete(item)" />
          {{ item.Content }}
        </a-radio>
      </a-radio-group>

      <button class="add" @click="onSubmitAdd">添加链</button>
    </a-drawer>
  </div>
</template>  

<script>
import { getStatus } from "@/utils/api.js";
export default {
  data() {
    let validateIP = (rule, value, callback) => {
      if (value == "" || value == undefined || value == null) {
        callback(new Error("地址不能为空"));
      } else {

        let arr = ["127.0.0.1:8088"];
        if (
          (this.listAdditionals &&
            this.listAdditionals.filter((v) => v.url == value).length > 0) ||
          arr.indexOf(value) > -1
        ) {
          callback(new Error("请勿输入重复IP"));
        } else {
          callback();
        }
      }
    };
    let validatename = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("网络名称不能为空"));
      } else {
        let arr = ["超级链", "超级链测试网"];
        if (
          (this.listAdditionals &&
            this.listAdditionals.filter((v) => v.value == value).length > 0) ||
          arr.indexOf(value) > -1
        ) {
          callback(new Error("请勿输入重复网络名称"));
        } else {
          callback();
        }
      }
    };
    return {
      seen: false,
      valuetit: "超级链",
      value: "超级链",
      radioStyle: {
        height: "80px",
        lineHeight: "30px",
        display: "flex",
        alignItems: "center",
        flexDirection: "row-reverse",
        // width: "200%",
        fontSize: "15px",
        justifyContent: "space-between",
        borderBottom: "1px solid #F1F1F1",
      },
      visibles: false,
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: "",
      form: {
        name: "",
        add: "",
      },

      rules: {
        name: [
          { validator: validatename, trigger: ["blur", "change"] },
          { min: 1, max: 20, message: "请输入20个以内的字符", trigger: "blur" },
        ],
        add: [
          { validator: validateIP, trigger: ["blur", "change"] },
          { min: 1, max: 1000000, message: "输入合法范围", trigger: "blur" },
        ],
      },
      listAdditionals: [],
      lists: [
        {
          value: "超级链",
          id: "1",
          Content: "超级链",
          url: "http://127.0.0.1:8088",
        }
      ],

      store: "",
      value_url_data: "",
      maxLimit_out: false,
    };
  },
  methods: {
    //删除
    getDelete(item) {
      var _arr = JSON.parse(localStorage.getItem("From-Value"));
      var len = _arr.length;
      for (var i = 0; i < len; i++) {
        if (_arr[i].value == item.value) {
          _arr.splice(i, 1);
        }
      }
      this.listAdditionals = _arr;
      this.value = "超级链";
      this.valuetit = "超级链";
      this.getChange(this.value);
      localStorage.setItem("From-Value", JSON.stringify(_arr));
      if (!localStorage.setItem("From-Value", JSON.stringify(_arr))) {
        localStorage.removeItem("From-Value");
      }
    },
    //点击logo回首页
    getBackHome() {
      this.$router.push({ path: "/" });
    },
    //切换链
    getSwitchChain(value) {
      this.getChange(value);
    },
    getChange(value) {
      let value_url = [];
      let arr = this.lists.filter((v) => v.Content == value);
      if (arr.length == 0) {
        this.listAdditionals.map((i) => {
          if (i.Content == value) {
            this.valuetit = i.value;
            value_url.push({ name: i.value, url: `${i.url}` });
            this.$store.commit("BASEURL_LIST_VALUE", value_url);
            window.localStorage.setItem("value_url", JSON.stringify(value_url));
          }
        });
      } else {
        this.valuetit = arr[0].value;
        value_url.push({ name: arr[0].value, url: arr[0].url });
        window.localStorage.setItem("value_url", JSON.stringify(value_url));
        this.$store.commit("BASEURL_LIST_VALUE", value_url);
      }
      this.$store.commit("LISTENING_TO_THE", Math.random());

      this.$router.push({ path: "/" });
      this.visible = false;
    },
    enter() {
      this.seen = true;
    },
    leave() {
      this.seen = false;
    },
    //单选框的值
    onChange(e) {
      this.value = e.target.value;
    },

    cancelModal() {
      this.visible = false;
      this.value = "1";
    },

    //第一个弹框
    onSubmitAdd() {
      this.visibles = true;
    },
    //第一个的点击超级链
    showModal() {
      this.getLostore();
      this.listAdditionals = this.store;
      this.visible = true;
    },
    //添加的弹框
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          try {
            let user_url = `${this.form.add}`;
            let res = await getStatus(user_url);
            console.log(res);
            if (this.listAdditionals == null) this.listAdditionals = [];
            this.listAdditionals.push({
              Content: this.form.name,
              url: user_url,
              value: this.form.name,
              id: Date.parse(new Date()),
            });
            this.value = this.form.name;
            let value_url = [];
            value_url.push({ name: this.form.name, url: user_url });
            this.$store.commit("BASEURL_LIST_VALUE", value_url);
            window.localStorage.setItem(
              "From-Value",
              JSON.stringify(this.listAdditionals)
            );
            this.getChange(this.form.name);
            this.form = {};
            this.visibles = false;
            this.getLostore();
          } catch (err) {
            if (this.maxLimit_out) {
              return;
            }
            this.maxLimit_out = true;
            this.$message.error("构建地址失败：无效的地址");
            setTimeout(() => {
              this.maxLimit_out = false;
            }, 3300);
            return;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取出
    getLostore() {
      let from = window.localStorage.getItem("From-Value");
      this.store = JSON.parse(from);
    },
    resetForm() {
      this.visibles = false;
      this.form = {};
      this.$refs.ruleForm.resetFields();
    },

    afterVisibleChange(val) {
      // this.value=this.value_url_data.name[0].name
      console.log("visible", val);
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
      this.value = this.value_url_data[0].name;
    },
  },
  mounted() {
    this.value_url_data = JSON.parse(
      window.localStorage.getItem("value_url")
    ) || [{ name: "超级链", url: "http://127.0.0.1:8088" }];
    this.valuetit = this.value_url_data[0].name;

    //获取vuex里面的value值
    this.value = this.$store.state.baseURL_list_value[0].name;
    //修改浏览器默认颜色
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#FAFAFA;");
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-radio-checked .ant-radio-inner {
  // background-color: red;
  border-color: #07afbeff;
}
/deep/.ant-radio-inner::after {
  background-color: #07afbeff;
}

/deep/.ant-input {
  width: 120%;
  margin-left: 20px;
}
/deep/.ant-modal-header {
  border: none;
}
/deep/.ant-radio-checked .ant-radio-inner {
  border-color: none;
}
/deep/.ant-radio-group {
  width: 96%;
}

.log-img {
  img {
    width: 138px;
    height: 63px;
  }
  & {
    cursor: pointer;
  }
}
.Switch {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #07afbe;
}

.modal-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.add {
  position: absolute;
  bottom: 30px;
  left: 20px;
  border-radius: 3px;
  background: #ffffff;
  border: 1px solid #07afbe;
  line-height: 30px;
  width: 88%;
  color: #07afbeff;
  text-align: center;
  outline: none; //消除默认点击蓝色边框效果
}
.ModelAgree {
  border-radius: 3px;
  border: 1px solid #08c3c8ff;
  line-height: 30px;
  width: 110px;
  color: #fff;
  background-color: #08c3c8ff;
  outline: none; //消除默认点击蓝色边框效果
}
.RefusedTo {
  border-radius: 3px;
  margin-left: 10px;
  border: 1px solid #8f9bb3;
  line-height: 30px;
  width: 110px;
  color: #666666ff;
  background-color: transparent;
  outline: none; //消除默认点击蓝色边框效果
}
.logo-top {
  padding: 0 40px 0px 40px;
  line-height: 70px;
  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 30px;
  .log-tit {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}
</style>

