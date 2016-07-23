<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-panel i-grew-h">
    <div class="i-panel-header">
      账号属性
    </div>
    <div class="i-panel-body">
      <form class="i-form"
            v-on:submit.prevent="submitForm"
            v-on:reset.prevent="reset">
        <div class="i-row">
          <label class="i-col-4">name</label>
          <input v-model="accountInfo.name" class="i-col-12">
        </div>
        <div class="i-row">
          <label class="i-col-4">可透支</label>
          <i_switch_toggle
            open="是"
            close="否"
            v-bind:active.sync="accountInfo.canSigned"
          >
          </i_switch_toggle>
        </div>
        <div class="i-row">
          <label class="i-col-4">固定资产</label>
          <i_switch_toggle
            open="是"
            close="否"
            v-bind:active.sync="accountInfo.isAssets"
          >
          </i_switch_toggle>
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
        accountInfo: {
          canSigned: 0,
          isAssets: 0
        }
      }
    },
    methods: {
      submitForm(){
        let $this = this;
        this.$http.post(this.$tools.resolveUrl("/Accounts"), {
          name: this.accountInfo.name,
          signed: this.accountInfo.canSigned ? 1 : 0,
          assets: this.accountInfo.isAssets ? 1 : 0
        }, function (res, ste, req) {
          $this.$dispatch("link", 'account')
        }).error(function (res) {
          $this.$dialog.error(res.error.message)
        });
        return false
      },
      reset(){
        this.$dispatch("link", 'account')
      }
    }
  }
</script>
