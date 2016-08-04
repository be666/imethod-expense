<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-panel-body">
    <div
      class="i-row"
    >
      <div class="i-col-12 i-text-al-c">
        {{year}}年{{month}}月
      </div>
    </div>
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
        ticketList: []
      }
    },
    ready(){
      this.$dispatch('refresh');
    },
    events: {
      refresh(){
        if (!this.userId) {
          return false;
        }

        let $this = this;
        this.$http.get(this.$tools.resolveUrl(`/Tickets`), {
          filter: {
            where: {
              year: $this.year,
              month: $this.month,
              userId: this.userId
            },
            include: ['innerAccount', 'outerAccount'],
            order: ['year DESC', 'month DESC', 'day DESC']
          }
        }, function (res, ste, req) {
          $this.ticketList = res;
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
      }
    }
  }
</script>
