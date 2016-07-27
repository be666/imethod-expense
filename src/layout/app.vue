<template>
  <div class="i-flex i-scope i-row-keep">
    <router-view>

    </router-view>
  </div>
</template>
<style>

</style>
<script>
  export default {
    compiled () {
    },
    data () {
      return {
        moduleName: this.moduleName
      }
    },
    route: {
      data (transition) {
        var to = transition.to;
        if (to.matched && to.matched[1]) {
          this.moduleName = transition.to.matched[1].handler.name;
        }
      }
    }
  }
</script>
