<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-panel i-grew-h">
    <div class="i-panel-header">
      account info
    </div>
    <div class="i-panel-body">
      <form class="i-form"
            v-on:submit.prevent="submitForm"
            v-on:reset.prevent="reset">
        <div class="i-row">
          <label class="i-col-4">name</label>
          <input v-model="accountInfo.name" class="i-col-12">
        </div>
        <div class="i-text-al-c">
          <div class="i-btn-g i-in-flex">
            <button type="submit">提交</button>
            <button type="reset">取消</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<style>
</style>
<script>
  export default{
    data(){
      return {
        accountInfo: {}
      }
    },
    methods: {
      submitForm(){
        this.$http.post(this.$tools.resolveUrl("/Accounts"),{
          name:this.accountInfo.name
        },function (res, ste, req) {
          this.$dispatch("link",'account')
        }).error(function (res) {

        })
        return false
      },
      reset(){

      }
    }
  }
</script>
