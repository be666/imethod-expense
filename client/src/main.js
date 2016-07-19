'use strict';
let {Vue} = require("./common");
let VueRouter = require('vue-router');
//main

Vue.use(VueRouter);

let App = Vue.extend({
  events: {
    link: function (pathName, params) {
      router.go({
        name: pathName,
        params: params || {}
      })
    }
  }
});

let router = new VueRouter();
//main
router.map({
  '/': {
    name: "root",
    component: require("./layout/root.vue"),
    subRoutes: {
      "login": {
        name: "login",
        component: require("./pages/login.vue")
      },
      "account": {
        name: "account",
        component: require("./pages/account.vue")
      },
      "account/insert": {
        name: "account-insert",
        component: require("./pages/account_info.vue")
      },
      "account/:accountId/ticket": {
        name: "account-ticket",
        component: require("./pages/account_ticket.vue")
      },
      "ticket": {
        name: "ticket",
        component: require("./pages/ticket.vue")
      }
    }
  }
});

router.redirect({
  "/": "/account"
});

router.beforeEach(function (transition) {
  let $this = transition.to.router.app;
  if ($this.$tools.inArray($this.$config.auth.ignore, transition.to.path)) {
    transition.next()
  } else {
    $this.$auth.valid($this, function () {
      transition.next();
    }, function () {
      transition.redirect("/login")
    });
  }
});


router.start(App, 'body');
