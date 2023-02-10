<template>
  <div class="com-container">
    <hot></hot>
  </div>
</template>
<script>
export default {
  components: {
    hot: () => import("@/components/hot.vue"),
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
