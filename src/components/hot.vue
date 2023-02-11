<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span :style="conStyle" class="iconfont arr-left" @click="toLeft">&#xe6ef;</span>
    <span :style="conStyle" class="iconfont arr-right" @click="toRight">&#xe6ed;</span>
    <span :style="conStyle" class="cat-name">{{ catName }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据
      currentIndex: 0,
      titleFontSize: 0,
    };
  },
  computed: {
    catName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentIndex].name;
      }
    },
    conStyle() {
      return {
        fontSize: this.titleFontSize + "px",
      };
    },
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
    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1;
      }
      this.undataChart();
    },
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0;
      }
      this.undataChart();
    },
    //初始化chartInstance对象
    initChat() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, "chalk");
      //对图表初始化配置进行控制
      const initOption = {
        title: {
          text: "▎热销商品的占比",
          top: 20,
          left: 20,
        },
        legend: {
          top: "15%",
          icon: "circle",
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            const thirdCategory = arg.data.children;
            let total = 0;
            thirdCategory.forEach((item) => {
              total += item.value;
            });
            let retstr = "";
            thirdCategory.forEach((item) => {
              retstr += `
                ${item.name}:${parseInt((item.value / total) * 100) + "%"}
                <br/>
                `;
            });
            return retstr;
          },
        },
        series: [
          {
            type: "pie",
            label: {
              // show: false,
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //   },
            //   labelLine: {
            //     show: false,
            //   },
            // },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    //获取服务器的数据
    async getData() {
      const { data: res } = await this.$http.get("data-view/hotproduct");
      console.log(res);
      this.allData = res;

      this.undataChart();
    },
    //更新图表
    undataChart() {
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => {
          return item.name;
        }
      );
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
          };
        }
      );
      const dataOption = {
        legend: {
          data: legendData,
        },
        series: [
          {
            data: seriesData,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },

    //浏览器变化适配
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      //分辨率大小相关的配置
      const adapterOptino = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize ,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },

        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ["50%", "60%"],
          },
        ],
      };
      this.chartInstance.setOption(adapterOptino);
      //调用图表resize方法
      this.chartInstance.resize();
    },
  },
};
</script>
<style lang="scss" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}
</style>
