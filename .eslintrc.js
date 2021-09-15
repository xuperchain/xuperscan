module.exports = {
  root: true, //此项是用来告诉eslint找当前配置文件不能往父级查找
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/essential"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "process": true
    },
  parserOptions: {
    parser: "babel-eslint"
  },
  "plugins": [
    "vue"
  ],
rules: {
/*这里是eslint规则*/
"no-console":"off",
"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
}
}