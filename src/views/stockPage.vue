<template>
  <div class="com-page ">
      <stocks></stocks>
  </div>
</template>
<script>
export default {
  components: {
    stocks:()=>import('@/components/stock.vue')
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
