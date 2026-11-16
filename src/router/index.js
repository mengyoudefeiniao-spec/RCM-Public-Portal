import { createRouter, createWebHashHistory } from 'vue-router'
import { useAccount } from '@/stores/account.js'

const routes = [
  { path: '/', redirect: '/portal' },
  { path: '/portal', name: 'portal', component: () => import('@/views/PortalView.vue') },
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { public: true } },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { requiresAuth: true }
  },
  { path: '/:pathMatch(.*)*', redirect: '/portal' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

/** 只接受站内路径，避免 ?redirect= 被用作跳板。 */
export function resolveRedirect(value) {
  const target = Array.isArray(value) ? value[0] : value
  if (typeof target === 'string' && target.startsWith('/') && !target.startsWith('//')) return target
  return '/admin'
}

router.beforeEach(async (to) => {
  const { ensureSession, isAuthenticated } = useAccount()

  if (to.name === 'login') {
    await ensureSession()
    return isAuthenticated.value ? { name: 'admin' } : true
  }

  if (!to.meta.requiresAuth) return true

  await ensureSession()
  if (isAuthenticated.value) return true
  return { name: 'login', query: { redirect: to.fullPath } }
})

export default router
