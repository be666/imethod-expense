<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-panel i-grew-h">
    <div class="i-panel-header">
      消费
    </div>
    <div class="i-panel-body">
      <form class="i-form"
            v-on:submit.prevent="submitForm"
            v-on:reset.prevent="reset">
        <div class="i-row">
          <label class="i-col-4">类别</label>
          <input v-model="ticketInfo.elementName" class="i-col-12">
        </div>
        <div class="i-row">
          <label class="i-col-4">收入</label>
          <i_select_single
            text="name"
            v-bind:item-list="innerAccountList"
            v-bind:un-selected="unSelected"
            v-bind:selected.sync="ticketInfo.innerAccount"
          >
          </i_select_single>
        </div>
        <div class="i-row">
          <input v-model="ticketInfo.inner" type="number" class="i-col-12">
        </div>
        <div class="i-row">
          <label class="i-col-4">支出</label>
          <i_select_single
            text="name"
            v-bind:item-list="outerAccountList"
            v-bind:un-selected="unSelected"
            v-bind:selected.sync="ticketInfo.outerAccount"
          >
          </i_select_single>
        </div>
        <div class="i-row">
          <input v-model="ticketInfo.outer" type="number" class="i-col-12">
        </div>
        <div class="i-row">
          <label class="i-col-4">tips</label>
          <textarea v-model="ticketInfo.tips" class="i-col-12">
            </textarea>
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
  let unSelected = [{
    id: 0,
    name: "无"
  }];
  export default{
    data(){
      return {
        accountId: this.$route.params.accountId,
        ticketInfo: {
          inner: 0,
          outer: 0,
          innerAccount: {
            id: 0,
            name: "无"
          },
          outerAccount: {
            id: 0,
            name: "无"
          },
        },
        innerAccountList: [],
        outerAccountList: [],
      }
    },
    ready(){
      this.$dispatch('refreshAccount')
    },
    events: {
      refreshAccount(){
        let $this = this;
        this.$http.get(this.$tools.resolveUrl("/Accounts"), function (res, ste, req) {
          let outerList = [];
          for (let ass of res) {
            if (ass.money > 0 || ass.signed) {
              outerList.push(ass);
            }
          }
          res = unSelected.concat(res);
          let isFind = res.find(function (x) {
            return x.id == $this.accountId;
          });
          $this.innerAccountList = res;
          $this.outerAccountList = outerList;
          if (isFind) {
            $this.ticketInfo.innerAccount = isFind;
          }
        }).error(function (res) {
          this.$dialog.error(res.error.message)
        })
      }
    },
    methods: {
      submitForm(){
        let $this=this;
        this.$http.post(this.$tools.resolveUrl("/Tickets"), {
          inner: this.ticketInfo.inner,
          innerAccountId: this.ticketInfo.innerAccount.id,
          outer: this.ticketInfo.outer,
          outerAccountId: this.ticketInfo.outerAccount.id,
          elementName: this.ticketInfo.elementName,
          tips: this.ticketInfo.tips
        }, function (res, ste, req) {
          $this.$dispatch("link", 'account')
        }).error(function (res) {
          $this.$dialog.error(res.error.message)
        });
        return false
      },
      reset(){
        this.$dispatch("link", 'account-ticket', {
          accountId: this.accountId
        })
      }
    }
  }
</script>
