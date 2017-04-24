import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import monitor from '@/components/monitor'
import suggest from '@/components/suggest'
import history from '@/components/history'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: monitor,
    },
    {
      path: '/suggest',
      name: 'suggest',
      component: suggest
    },
    {
      path: '/history',
      name: 'history',
      component: history
    }
  ]
})
