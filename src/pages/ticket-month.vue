<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-panel-body">
    <div
      class="i-row"
    >
      <div class="i-col-12 i-text-al-c">
        {{year}}年{{month}}月 <a v-on:click='stat()'>刷新</a>
      </div>
    </div>
    <div class="i-row">
      <div
        class="i-row i-border-b"
      >
          <span class="i-col-4">
            account
          </span>
        <span class="i-col-4 i-text-al-r">
            收入
          </span>
        <span class="i-col-4 i-text-al-r">
            支出
          </span>
      </div>
      <template v-for="account of accountList">
        <div
          class="i-row i-border-b"
        >
          <span class="i-col-4">
            {{account.account.name}}
          </span>
          <span class="i-col-4 i-text-al-r">
            {{account.inner}}
          </span>
          <span class="i-col-4 i-text-al-r">
            {{account.outer}}
          </span>
        </div>
      </template>
    </div>
    <div class="i-row">
      <div
        class="i-row i-border-b"
      >
          <span class="i-col-4">
            element
          </span>
        <span class="i-col-4 i-text-al-r">
            收入
          </span>
        <span class="i-col-4 i-text-al-r">
            支出
          </span>
      </div>
      <template v-for="element of elementList">
        <div
          class="i-row i-border-b"
        >
          <span class="i-col-4">
            {{element.element.name}}
          </span>
          <span class="i-col-4 i-text-al-r">
            {{element.inner}}
          </span>
          <span class="i-col-4 i-text-al-r">
            {{element.outer}}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
<style>
</style>
<script>
  export default{
    data(){
      let currentDate = new Date();
      return {
        userId: this.$tools.getUserInfo().id,
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        elementList: [],
        accountList: []
      }
    },
    ready(){
      this.$dispatch('refreshE');
      this.$dispatch('refreshA');
    },
    events: {
      refreshE(){
        if (!this.userId) {
          return false;
        }

        let $this = this;
        this.$http.get(this.$tools.resolveUrl(`/ElementMonthStatistics`), {
          filter: {
            where: {
              year: $this.year,
              month: $this.month,
              userId: $this.userId
            },
            include: 'element'
          }
        }, function (res, ste, req) {
          $this.elementList = res;
        }).error(function (res) {
          $this.$dialog.error(res.error.message)
        })
      },
      refreshA(){
        if (!this.userId) {
          return false;
        }
        let $this = this;
        this.$http.get(this.$tools.resolveUrl(`/AccountMonthStatistics`), {
          filter: {
            where: {
              year: $this.year,
              month: $this.month,
              userId: $this.userId
            },
            include: 'account'
          }
        }, function (res, ste, req) {
          $this.accountList = res;
        }).error(function (res) {
          $this.$dialog.error(res.error.message)
        })
      },
      statE(){
        if (!this.userId) {
          return false;
        }
        let $this = this;
        this.$http.post(this.$tools.resolveUrl(`/ElementMonthStatistics/refresh`), {
          year: $this.year,
          month: $this.month,
          userId: $this.userId
        }, function (res, ste, req) {

        }).error(function (res) {
          $this.$dialog.error(res.error.message)
        })
      },
      statA(){
        if (!this.userId) {
          return false;
        }
        let $this = this;
        this.$http.post(this.$tools.resolveUrl(`/AccountMonthStatistics/refresh`), {
          year: $this.year,
          month: $this.month,
          userId: $this.userId
        }, function (res, ste, req) {

        }).error(function (res) {
          $this.$dialog.error(res.error.message)
        })
      }
    },
    methods: {
      showMoney(accountTicket){
        let money = accountTicket.inner - accountTicket.outer;
        if (money >= 0) {
          return `+ ${money}`
        } else {
          return `- ${Math.abs(money)}`
        }
      },
      accountName(ticket){
        let name = [];
        if (ticket.innerAccount && ticket.innerAccount.name) {
          name.push(`i:${ticket.innerAccount.name}`)
        }
        if (ticket.outerAccount && ticket.outerAccount.name) {
          name.push(`o:${ticket.outerAccount.name}`)
        }
        if (name.length > 1) {
          return name.join("/")
        }
        return name[0]
      },
      stat(){
        this.$dispatch('statA');
        this.$dispatch('statE');
      }
    }
  }
</script>
