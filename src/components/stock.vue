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
      currentIndex: 0,
      timerId: null, //定时器
    };
  },
  created() {},
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timerId);
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
      const initOption = {
        title: {
          text: "▎库存和销量分析",
          left: 20,
          top: 20,
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInteval();
      });
    },
    //获取服务器的数据
    async getData() {
      const { data: res } = await this.$http.get("data-view/stock");
      console.log(res);
      this.allData = res;
      this.undataChart();
      this.startInteval();
    },
    //更新图表
    undataChart() {
      const start = this.currentIndex * 5;
      const end = (this.currentIndex + 1) * 5;
      const showData = this.allData.slice(start, end);
      const colorArr = [
        ["#4FF778", "#0BA82C"],
        ["#E5DD45", "#E8B11C"],
        ["#E8821C", "#E55445"],
        ["#5052EE", "#AB6EE5"],
        ["#23E5E5", "#2E72BF"],
      ];
      let centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      const seriesArr = showData.map((item, index) => {
        return {
          type: "pie",
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: {
            show: false,
          },
          label: {
            position: "center",
            color: colorArr[index][0],
          },
          data: [
            {
              name: item.name + "\n\n" + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0],
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1],
                  },
                ]),
              },
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#333843",
              },
            },
          ],
        };
      });
      const dataOption = {
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    startInteval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex > 1) {
          this.currentIndex = 0;
        }
        this.undataChart();
      }, 5000);
    },
    //浏览器变化适配
    screenAdapter() {
      const titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      //分辨率大小相关的配置
      const innerRadius = titleFontSize * 2.8;
      const outterRadius = innerRadius * 1.125;
      const adapterOptino = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series:[
          {
            type:'pie',
            radius:[outterRadius,innerRadius],
            label:{
              fontSize:titleFontSize/2
            }
          },
          {
            type:'pie',
            radius:[outterRadius,innerRadius],
            label:{
              fontSize:titleFontSize/2
            }
          },
          {
            type:'pie',
            radius:[outterRadius,innerRadius],
            label:{
              fontSize:titleFontSize/2
            }
          },
          {
            type:'pie',
            radius:[outterRadius,innerRadius],
            label:{
              fontSize:titleFontSize/2
            }
          },
          {
            type:'pie',
            radius:[outterRadius,innerRadius],
            label:{
              fontSize:titleFontSize/2
            }
          },
        ]
      };
      this.chartInstance.setOption(adapterOptino);
      //调用图表resize方法
      this.chartInstance.resize();
    },
  },
};
</script>
<style lang="scss" scoped></style>
