<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>
<script>
import axios from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils";
export default {
  data() {
    return {
      chaetInstance: null,
      allData: null,
      mapData: {}, //省份数据缓存
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
  computed: {},
  methods: {
    async initChart() {
      this.chaetInstance = this.$echarts.init(this.$refs.map_ref, "chalk");
      const initOptin = {
        title: {
          text: "▎商家分布",
          left: 20,
          top: 20,
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: "#2172BF",
            borderColor: "#333",
          },
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
      };
      const res = await axios.get(
        "http://localhost:8080/static/map/china.json"
      );
      console.log(res);
      this.$echarts.registerMap("china", res.data);
      this.chaetInstance.setOption(initOptin);
      this.chaetInstance.on("click", async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name);
        if (!this.mapData[provinceInfo.key]) {
          const ret = await axios.get(
            "http://localhost:8080" + provinceInfo.path
          );
          this.$echarts.registerMap(provinceInfo.key, ret.data);
          this.mapData[provinceInfo.key] = res.data;
        }

        const changeOption = {
          geo: {
            map: provinceInfo.key,
          },
        };
        this.chaetInstance.setOption(changeOption);
      });
    },
    async getData() {
      const { data: res } = await this.$http.get("data-view/map");
      console.log(res);
      this.allData = res;
      this.updateChart();
    },
    updateChart() {
      const legendArr = this.allData.map((item) => {
        return item.name;
      });
      const seriesArr = this.allData.map((item) => {
        //在地图显示散点数据
        return {
          type: "effectScatter",
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
        };
      });
      const dataOption = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chaetInstance.setOption(dataOption);
    },
    //屏幕自适应
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
      };
      this.chaetInstance.setOption(adapterOption);
      this.chaetInstance.resize();
    },
    revertMap() {
      const revertOption = {
        geo: {
          map: "china",
        },
      };
      this.chaetInstance.setOption(revertOption);
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
  .select_con {
    background-color: #222733;
  }
}
</style>
