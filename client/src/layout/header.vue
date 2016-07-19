<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml">
  <header>
    <div class="i-row i-scope i-text-al-c ">
      <div class="i-col-12 app-title">
        {{titleName}}
      </div>
    </div>
  </header>
</template>
<style>
  .app-title {
    font-size: 2rem;
    line-height: 2.5rem;
  }
</style>
<script>
  export default {
    data () {
      return {
        titleName: this.$route.name,
        siteName: this.$config.siteName
      }
    },
    props: ["userInfo"],
    methods: {
      logout () {
        this.$http.post(this.$tools.resolveUrl("/Users/logout"), function (data, status, request) {
          this.$auth.loginOut();
          this.$dispatch('link', "login");
        })
      },
      isAdmin: function (userInfo) {
        userInfo = userInfo || {};
        let rule = userInfo.rule || [];
        return rule.findIndex(function (a) {
            return a == 'admin'
          }) > -1;
      }
    },
    route: {
      data(){
        this.titleName = this.$route.name;
        console.log(this.$route.name)
      }
    }
  }
</script>
