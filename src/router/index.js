import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/portal' },
  { path: '/portal', name: 'portal', component: () => import('@/views/PortalView.vue') },
  { path: '/admin', name: 'admin', component: () => import('@/views/AdminView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/portal' }
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
