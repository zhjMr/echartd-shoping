<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span> ▎ {{ showTitle }}</span>
      <span
        class="iconfont title-icon"
        :style="comStyle"
        @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div class="select_con" v-show="showChoice" :style="marginStyle">
        <div
          class="select_item"
          v-for="item in seletTypes"
          :key="item.key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chaetInstance: null,
      allData: null,
      showChoice: false, //是否可选项
      choiceType: "map", //显示数据类型
      titleFontSize: 0, //标题主题大小
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  computed: {
    seletTypes() {
      if (!this.allData) {
        return [];
      } else {
        return this.allData.type.filter((item) => {
          return item.key !== this.choiceType;
        });
      }
    },
    showTitle() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.choiceType].title;
      }
    },
    //设置标题
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
      };
    },
    marginStyle(){
      return{
        marginLeft: this.titleFontSize + "px"
      }
    }
  },
  methods: {
    handleSelect(currentType) {
      this.choiceType = currentType;
      this.updateChart();
      this.showChoice = false;
    },
    initChart() {
      this.chaetInstance = this.$echarts.init(this.$refs.trend_ref, "chalk");
      const initOptin = {
        grid: {
          left: "3%",
          top: "35%",
          right: "4%",
          bottom: "1%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          left: 20,
          top: "15%",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
      };
      this.chaetInstance.setOption(initOptin);
    },
    async getData() {
      const { data: res } = await this.$http.get("data-view/trend");
      console.log(res);
      this.allData = res;
      this.updateChart();
    },
    updateChart() {
      // 半透明的颜色值
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];
      //处理数据
      //类目主数据
      const timeArr = this.allData.common.month;
      // y周的数据
      const valueArr = this.allData[this.choiceType].data;
      const serirsArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });
      //图例的数据
      const legendArr = valueArr.map((item) => {
        return item.name;
      });
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        legend: {
          data: legendArr,
        },
        series: serirsArr,
      };
      this.chaetInstance.setOption(dataOption);
    },
    //屏幕自适应
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        legend:{
          itemWidth:this.titleFontSize,
          itemHeight:this.titleFontSize,
          itemGap:this.titleFontSize,
          textStyle:{
fontSize:this.titleFontSize/2
          }
        }
      };
      this.chaetInstance.setOption(adapterOption);
      this.chaetInstance.resize();
    },
  },
};
</script>
<style scoped lang="scss">
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select_con{
    background-color: #222733;
  }
}
</style>
