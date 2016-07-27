<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-panel i-grew-h">
    <div class="i-panel-header" v-on:click="pathTo('account')">
      消费纪录
    </div>
    <div class="i-panel-body">
      <template v-for="ticket of ticketList">
        <div
          class="i-row i-border-b"
          v-on:click='ticketInfo(ticket.id)'
        >
          <span class="i-col-4">
            {{ticket.elementName}}
          </span>
          <span class="i-col-8  i-text-al-r">
            {{ticket.year}}/{{ticket.month}}/{{ticket.day}}
          </span>
          <span class="i-col-6">
            {{accountName(ticket)}}
          </span>
          <span class="i-col-6 i-text-al-r">
            {{showMoney(ticket)}}
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
        userId: this.$tools.getUserInfo().id,
        ticketList: []
      }
    },
    events: {
      refreshList() {
        if (!this.userId) {
          return false;
        }

        let $this = this;
        this.$http.get(this.$tools.resolveUrl(`/Tickets`), {
          filter: {
            where: {
              userId: this.userId
            },
            include: ['innerAccount', 'outerAccount'],
            order: ['createdAt DESC'],
            limit:20
          }
        }, function (res, ste, req) {
          $this.ticketList = res;
        }).error(function (res) {
          $this.$dialog.error(res.error.message)
        })
      }
    },
    ready(){
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
      }
    }
  }
</script>
