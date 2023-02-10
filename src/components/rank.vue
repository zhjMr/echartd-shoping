<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据
      startValue: 0,
      endValue: 9,
      timer: null,
    };
  },
  created() {},
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timer);
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
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, "chalk");
      //对图表初始化配置进行控制
      const initOption = {
        title: {
          text: "▎地区销售排行",
          left: 20,
          top: 20,
        },
        grid: {
          top: "40%",
          left: "5%",
          right: "5%",
          bottom: "10%",
          containLable: true,
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterVal();
      });
    },
    //获取服务器的数据
    async getData() {
      const { data: res } = await this.$http.get("data-view/rank");
      console.log(res);
      this.allData = res;
      //对数据排序，从大到小
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
      this.undataChart();
      this.startInterVal();
    },
    //更新图表
    undataChart() {
      const clolorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];
      //省份数组
      const provinceArr = this.allData.map((item) => {
        return item.name;
      });
      //省份金额
      const valueArr = this.allData.map((item) => {
        return item.value;
      });
      const dataOption = {
        xAxis: {
          data: provinceArr,
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null;
                if (arg.value > 300) {
                  targetColorArr = clolorArr[0];
                } else if (arg.value > 200) {
                  targetColorArr = clolorArr[1];
                } else {
                  targetColorArr = clolorArr[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0],
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1],
                  },
                ]);
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },

    //浏览器变化适配
    screenAdapter() {
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;
      //分辨率大小相关的配置
      const adapterOptino = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius:[titleFontSize/2,titleFontSize/2,0,0],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOptino);
      //调用图表resize方法
      this.chartInstance.resize();
    },
    startInterVal() {
      if (!this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.undataChart();
      }, 2000);
    },
  },
};
</script>
<style scoped lang="scss"></style>
