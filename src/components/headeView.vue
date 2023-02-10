<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据
    };
  },
  created() {},
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  mounted() {
    this.initChat();
    this.getData();
    //监听图表resize
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  methods: {
    //初始化chartInstance对象
    initChat() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, "chalk");
      //对图表初始化配置进行控制
      const initOption = {};
      this.chartInstance.setOption(initOption);
    },
    //获取服务器的数据
    async getData() {
      const { data: res } = await this.$http.get("data-view/seller");
      console.log(res);
      this.allData = res;
    },
    //更新图表
    undataChart() {
      const dataOption = {};
      this.chartInstance.setOption(dataOption);
    },

    //浏览器变化适配
    screenAdapter() {
      const titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      //分辨率大小相关的配置
      const adapterOptino = {};
      this.chartInstance.setOption(adapterOptino);
      //调用图表resize方法
      this.chartInstance.resize();
    },
  },
};
</script>
<style lang="scss" scoped></style>
