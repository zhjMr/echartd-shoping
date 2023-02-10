<template>
  <div class="echarts-content">
    <sellerPage></sellerPage>
  </div>
</template>
<script>
export default {
  components: {
    sellerPage: () => import("@/components/seller.vue"),
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.echarts-content {
  width: 98%;
  height: 100%;
  margin: auto;
  
}
</style>
