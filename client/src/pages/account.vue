<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-panel i-grew-h">
    <div class="i-panel-header i-row">
      <div class="i-col-6">
        我的账号
      </div>
      <div class="i-col-6 i-text-al-r i-fs-sm" v-on:click="ticket()">
        纪录
      </div>
    </div>
    <div class="i-panel-body">
      <div
        class="i-row i-border-b"
      >
          <span class="i-col-6">
          剩余
          </span>
        <span class="i-col-6 i-text-al-r">
            {{Money()}}
          </span>
      </div>
      <div
        class="i-row i-border-b"
      >
          <span class="i-col-6">
          负债
          </span>
        <span class="i-col-6 i-text-al-r">
            {{neMoney()}}
          </span>
      </div>
      <div
        class="i-row i-border-b"
      >
          <span class="i-col-6">
          合计
          </span>
        <span class="i-col-6 i-text-al-r">
            {{sumMoney()}}
          </span>
      </div>
      <template v-for="account of accountList">
        <div
          class="i-row i-border-b"
          v-on:click='accountTicket(account)'
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
        userId: this.$tools.getUserInfo().id,
        accountList: []
      }
    },
    events: {
      refresh() {
        if (!this.userId) {
          return
        }
        let $this = this;
        this.$http.get(this.$tools.resolveUrl("/Accounts"), {
          filter: {
            where: {
              userId: this.userId
            }
          }
        }, function (res, ste, req) {
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
      ticket(){
        this.$dispatch('link', 'ticket');
      },
      accountTicket(account){
        this.$dispatch('link', 'account-ticket', {
          accountId: account.id
        });
      },
      sumMoney(){
        let sum = 0;
        for (let acc of this.accountList) {
          sum += acc.money;
        }
        return sum;
      },
      neMoney(){
        let sum = 0;
        for (let acc of this.accountList) {
          if (acc.money < 0) {
            sum += acc.money;
          }
        }
        return sum;
      },
      Money(){
        let sum = 0;
        for (let acc of this.accountList) {
          if (acc.money > 0) {
            sum += acc.money;
          }
        }
        return sum;
      }
    }
  }
</script>
