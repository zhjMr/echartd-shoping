<template>
  <div class="home">
    <div
      id="myChart"
      ref="seller_ref"
      :style="{ width: '100%', height: '100%' }"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据
      currentPage: 1, //当前显示的页数
      totalPage: 0, //一共有多少页
      timerId: null,
    };
  },
  created() {},
  destroyed() {
    clearInterval(this.timerId);
    window.removeEventListener("resize", this.screenAdapter)
  },
  mounted() {
    this.initChat();
    this.getData();
    //监听图表resize
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter()
  },
  methods: {
    //初始化chartInstance对象
    initChat() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, "chalk");
      //对图表初始化配置进行控制
      const initOption = {
        title: {
          text: "▎商家销售统计图",
          left: 20,
          top: 20,
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              color: "#2D3443",
            },
          },
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#5052EE",
                },
                {
                  offset: 1,
                  color: "#AB6EE5",
                },
              ]),
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      //对图表事件进行监听
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    //获取服务器的数据
    async getData() {
      const { data: res } = await this.$http.get("data-view/seller");
      console.log(res);
      this.allData = res;
      this.allData.sort((a, b) => {
        return a.value - b.value;
      });
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.this.allData.length / 5 + 1;
      this.startInterval();
      this.undataChart();
    },
    //更新图表
    undataChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);
      const sellerName = showData.map((item) => {
        return item.name;
      });
      const sellerValues = showData.map((item) => {
        return item.value;
      });
      const dataOption = {
        yAxis: {
          data: sellerName,
        },

        series: [
          {
            data: sellerValues,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    //定时器启动方法
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.undataChart();
      }, 3000);
    },
    //浏览器变化适配
    screenAdapter() {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      //分辨率大小相关的配置
      const adapterOptino = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOptino);
      //调用图表resize方法
      this.chartInstance.resize()
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
}
</style>
