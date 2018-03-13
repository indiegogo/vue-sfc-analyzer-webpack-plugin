<template>
  <div class="webpackVueSFCAnalyzerPlugin">
    {{ welcome }}
  </div>
</template>

<script lang="ts">
  import Vue from "vue";

  export default class TestComponent extends Vue {
    data () {
      return {
        welcome: "hello"
      };
    }
  }
</script>

<style scoped>
  .webpackVueSFCAnalyzerPlugin {
    font-size: 12px;
  }
</style>
