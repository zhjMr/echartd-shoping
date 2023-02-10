<template>
  <div class="com-page">
    <Trend></Trend>
  </div>
</template>
<script>
export default {
  components: {
    Trend: () => import("@/components/Trend.vue"),
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
