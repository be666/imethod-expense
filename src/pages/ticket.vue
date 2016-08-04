<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="i-panel i-grew-h">
    <div class="i-panel-header" v-on:click="pathTo('account')">
      消费纪录
    </div>
    <div class="i-row">
      <div class="i-col-4 i-text-al-c" v-on:click="toggle('year')"
           v-bind:class="[activeToggle('year')?'i-active':'']">年
      </div>
      <div class="i-col-4 i-text-al-c" v-on:click="toggle('month')"
           v-bind:class="[activeToggle('month')?'i-active':'']">月
      </div>
      <div class="i-col-4 i-text-al-c" v-on:click="toggle('day')"
           v-bind:class="[activeToggle('day')?'i-active':'']">日
      </div>
    </div>
    <component :is="activeView"></component>
  </div>
</template>
<style>
  .i-border-b {
    border-bottom: 1px solid #ececec;
  }
</style>
<script>
  export default{
    components: {
      day: require('./ticket-day.vue'),
      month: require('./ticket-month.vue'),
      year: require('./ticket-year.vue')
    },
    data(){
      return {
        activeView: 'day'
      }
    },
    events: {},
    ready(){
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
      },
      toggle(type){
        this.activeView = type;
      },
      activeToggle(type){
        return this.activeView == type;
      }
    }
  }
</script>
