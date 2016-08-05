<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="i-panel-body">
    <div
      class="i-row"
    >
      <div class="i-col-12 i-text-al-c">
        <button v-on:click='pre()'><</button>
        {{year}}年{{month}}月{{day}}日
        <button v-on:click='next()'>></button>
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
        day: currentDate.getDate(),
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
              day: $this.day,
              userId: $this.userId
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
      },
      pre(){
        let $this = this;
        let thisDate = new Date(`${$this.year}/${$this.month}/${$this.day}`);
        let preDate = new Date(thisDate.getTime() - 1000 * 60 * 60 * 24);
        $this.year = preDate.getFullYear();
        $this.month = preDate.getMonth() + 1;
        $this.day = preDate.getDate();
        this.$dispatch('refresh');
      },
      next(){
        let $this = this;
        let thisDate = new Date(`${$this.year}/${$this.month}/${$this.day}`);
        let preDate = new Date(thisDate.getTime() + 1000 * 60 * 60 * 24);
        $this.year = preDate.getFullYear();
        $this.month = preDate.getMonth() + 1;
        $this.day = preDate.getDate();
        this.$dispatch('refresh');
      }
    }
  }
</script>
