<template>
  <div class="webpackVueSFCAnalyzerPluginWithoutStyle">
    {{ welcome }}
  </div>
</template>

<script lang="ts">
  import Vue from "vue";

  export default class TestComponentWithoutStyle extends Vue {
    data () {
      return {
        welcome: "hello without style"
      };
    }
  }
</script>
