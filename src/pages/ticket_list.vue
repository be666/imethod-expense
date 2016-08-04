<template xmlns:v-on="http://www.w3.org/1999/xhtml">
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
</template>
<style>
</style>
<script>
  export default{
    props: {
      ticketList: {
        default(){
          return [];
        }
      }
    },
    methods: {
      ticketInfo(ticketId){
//        this.$dispatch('link', 'account-ticket-info', {
//          accountId: this.accountId,
//          ticketId: ticketId
//        });
      }
    }
  }
</script>
