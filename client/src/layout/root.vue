<template>
  <i_header></i_header>
  <section class="i-row i-scope i-section">
    <router-view></router-view>
  </section>
</template>
<script>
  export default  {
    components: {
      i_header: require("./header.vue")
    },
    data () {
      return {}
    },
    route: {
      data (transition) {
        this.userInfo = this.$tools.getUserInfo();
      }
    }
  }
</script>
