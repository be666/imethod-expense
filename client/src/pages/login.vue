<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-row i-scope">
    <div class="i-col-12 i-text-al-c">
      <button
        class="loginBtn"
        v-on:click="PathToLogin"
      >
        统一身份认证
      </button>
    </div>
  </div>
</template>
<style>
  .loginBtn {
    margin: 0 auto;
    padding: 20px;
  }
</style>
<script>
  export default{
    data(){
      return {
        msg: 'hello vue'
      }
    },
    methods: {
      PathToLogin(){
        this.$http.get(this.$tools.resolveUrl("/AuthAccessUsers/config"), function (res, ste, req) {
          window.location.href = this.$config.authUrl + res;
        }).error(function (res) {

        })
      }
    }
  }
</script>
