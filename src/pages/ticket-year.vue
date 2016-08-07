<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-panel-body">
    <div
      class="i-row"
    >
      <div class="i-col-12 i-text-al-c">
        <button v-on:click='pre()'>&lt;</button>
        {{year}}年
        <button v-on:click='next()'>&gt;</button>
        <a v-on:click='stat()'>刷新</a>
        <button v-on:click='list()' style="float:right">明细</button>
        <button v-on:click='stat()' style="float:right">总计</button>
      </div>
    </div>
    <div class="i-row">
      <template v-if="showType == 'list'">
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
      </template>
      <template v-if="showType == 'stat'">
        <div
          class="i-row i-border-b"
        >
          <span class="i-col-4">
            account
          </span>
          <span class="i-col-8 i-text-al-r">
            总计
          </span>
        </div>
        <template v-for="account of accountList">
          <div
            v-if='account.inner - account.outer'
            class="i-row i-border-b"
          >
          <span class="i-col-4">
            {{account.account.name}}
          </span>
            <span class="i-col-8 i-text-al-r">
            {{showMoney(account)}}
          </span>
          </div>
        </template>
      </template>
    </div>
  </div>
  <div class="i-panel-body">
    <div class="i-row">
      <template v-if="showType == 'list'">
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
        </div>
        <template v-for="element of elementList">
          <div
            v-if='element.inner - element.outer'
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
      </template>
      <template v-if="showType == 'stat'">
        <div
          class="i-row i-border-b"
        >
          <span class="i-col-4">
            element
          </span>
          <span class="i-col-8 i-text-al-r">
            总计
          </span>
        </div>
        <template v-for="element of elementList">
          <div
            v-if='element.inner - element.outer'
            class="i-row i-border-b"
          >
          <span class="i-col-4">
            {{element.element.name}}
          </span>
            <span class="i-col-8 i-text-al-r">
          {{showMoney(element)}}
          </span>
          </div>
        </template>
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
        elementList: [],
        accountList: [],
        showType: "list"
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
        this.$http.get(this.$tools.resolveUrl(`/ElementYearStatistics`), {
          filter: {
            where: {
              year: $this.year,
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
        this.$http.get(this.$tools.resolveUrl(`/AccountYearStatistics`), {
          filter: {
            where: {
              year: $this.year,
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
        this.$http.post(this.$tools.resolveUrl(`/ElementYearStatistics/refresh`), {
          year: $this.year,
          userId: $this.userId
        }, function (res, ste, req) {
          this.$dispatch('refreshE');
        }).error(function (res) {
          $this.$dialog.error(res.error.message)
        })
      },
      statA(){
        if (!this.userId) {
          return false;
        }
        let $this = this;
        this.$http.post(this.$tools.resolveUrl(`/AccountYearStatistics/refresh`), {
          year: $this.year,
          userId: $this.userId
        }, function (res, ste, req) {
          this.$dispatch('refreshA');
        }).error(function (res) {
          $this.$dialog.error(res.error.message)
        })
      }
    },
    methods: {
      showMoney(element){
        let money = element.inner - element.outer;
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
      },
      pre(){
        this.year = this.year - 1;
        this.$dispatch('refreshE');
        this.$dispatch('refreshA');
      },
      next(){
        this.year = this.year + 1;
        this.$dispatch('refreshE');
        this.$dispatch('refreshA');
      },
      list(){
        this.showType = 'list';
      },
      stat(){
        this.showType = 'stat';
      }
    }
  }
</script>
