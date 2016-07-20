<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-panel i-grew-h">
    <div class="i-panel-header" v-on:click="pathTo('account')">
      账户纪录-{{accountInfo.name}}
    </div>
    <div class="i-panel-header i-row">
      <div class="i-col-6">

      </div>
      <div class="i-col-6 i-text-al-r">
        {{accountInfo.money}}
      </div>
    </div>
    <div class="i-panel-body">
      <div class="i-row i-btn-g">
        <button class="i-col-12"
                v-on:click='addTicket'
        >
          + 新增
        </button>
      </div>
      <div class="i-row">
        <div class="i-col-6">{{accountInfo.inner}}</div>
        <div class="i-col-6">{{accountInfo.outer}}</div>
      </div>
      <template v-for="accountTicket of accountTicketList">
        <div
          class="i-row i-border-b"
          v-on:click='ticketInfo(accountTicket.tickedId)'
        >
          <span class="i-col-6">
            {{accountTicket.ticket.elementName}}
          </span>
          <span class="i-col-6 i-text-al-r">
            {{showMoney(accountTicket)}}
          </span>
        </div>
      </template>
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
        accountId: this.$route.params.accountId,
        accountTicketList: [],
        accountInfo: {}
      }
    },
    events: {
      refreshInfo() {
        let $this = this;
        if (!this.accountId) {
          return
        }
        this.$http.get(this.$tools.resolveUrl(`/Accounts/${this.accountId}`), function (res, ste, req) {
          $this.accountInfo = res;
        }).error(function (res) {

        })
      },
      refreshList() {
        let $this = this;
        if (!this.accountId) {
          return
        }
        this.$http.get(this.$tools.resolveUrl(`/Accounts/${this.accountId}/accountTicket`), {
          filter: {
            include: "ticket",
            order: ['createdAt DESC']
          }
        }, function (res, ste, req) {
          $this.accountTicketList = res;
        }).error(function (res) {

        })
      }
    },
    ready(){
      this.$dispatch('refreshInfo');
      this.$dispatch('refreshList');
    },
    methods: {
      pathTo(name, params){
        this.$dispatch('link', name, params);
      },
      ticketInfo(ticketId){
//        this.$dispatch('link', 'account-ticket-info', {
//          accountId: this.accountId,
//          ticketId: ticketId
//        });
      },
      addTicket(ticket){
        this.$dispatch('link', 'account-ticket-insert', {
          accountId: this.accountId
        });
      },
      showMoney(accountTicket){
        if (accountTicket.inner) {
          return `+ ${accountTicket.inner}`
        } else {
          return `- ${accountTicket.outer}`
        }
      }
    }
  }
</script>
