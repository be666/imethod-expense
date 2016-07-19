<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-panel i-grew-h">
    <div class="i-panel-header">
      account list
    </div>
    <div class="i-panel-body">
      <template v-for="account of accountList">
        <div
          class="i-row i-border-b"
          v-on:click='accountTicket'
        >
          <span class="i-col-6">
            {{account.name}}
          </span>
          <span class="i-col-6 i-text-al-r">
            {{account.money}}
          </span>
        </div>
      </template>
    </div>
    <div class="i-panel-footer i-text-al-c">
      <div class="i-row i-btn-g">
        <button class="i-col-12"
                v-on:click='newAccount'
        >
          + new account
        </button>
      </div>
    </div>
  </div>
</template>
<style>
  .i-border-b {
    border-bottom: 1px solid #ececec;
  }
</style>
<script>
  export default{
    data(){
      return {
        accountList: []
      }
    },
    events: {
      refresh() {
        let $this = this;
        this.$http.get(this.$tools.resolveUrl("/Accounts"), function (res, ste, req) {
          $this.accountList = res;
        }).error(function (res) {

        })
      }
    },
    ready(){
      this.$dispatch('refresh');
    },
    methods: {
      newAccount(){
        this.$dispatch('link', 'account-insert');
      },
      accountTicket(){
        this.$dispatch('link', 'account-ticket');
      }
    }
  }
</script>
