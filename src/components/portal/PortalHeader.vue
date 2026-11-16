<template>
  <header class="site-header">
    <div class="section-shell header-inner">
      <button class="brand" type="button" @click="scrollTo('home')">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 21V9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            <path d="M12 12c-3.6 0-6-2.3-6-6 3.7 0 6 2.3 6 6Z" fill="currentColor" opacity=".85" />
            <path d="M12 9c3.6 0 6-2.3 6-6-3.7 0-6 2.3-6 6Z" fill="currentColor" opacity=".6" />
            <path d="M12 15c3.2 0 5.2-2 5.2-5.2-3.3 0-5.2 2-5.2 5.2Z" fill="currentColor" opacity=".4" />
          </svg>
        </span>
        <span class="brand-copy">
          <strong>{{ brand }}</strong>
          <small>{{ authority }}</small>
        </span>
      </button>

      <nav class="desktop-nav" aria-label="primary">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="nav-link"
          :class="{ active: activeSection === item.id }"
          @click="scrollTo(item.id)"
        >
          {{ $t(item.label) }}
        </button>
      </nav>

      <div class="header-actions">
        <LanguageSwitcher />
        <button class="icon-button" type="button" :aria-label="$t('common.theme')" @click="toggleTheme">
          <el-icon><Moon v-if="isDark" /><Sunny v-else /></el-icon>
        </button>
        <el-button class="admin-button" size="small" @click="$router.push('/admin')">
          {{ $t('nav.admin') }}
        </el-button>
        <button class="icon-button mobile-menu" type="button" aria-label="menu" @click="menuOpen = true">
          <el-icon><Menu /></el-icon>
        </button>
      </div>
    </div>

    <el-drawer v-model="menuOpen" :title="$t('common.appName')" size="min(320px, 82vw)" append-to-body>
      <div class="drawer-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="drawer-link"
          @click="scrollTo(item.id)"
        >
          {{ $t(item.label) }}
          <el-icon><ArrowRight /></el-icon>
        </button>
      </div>
    </el-drawer>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowRight, Menu, Moon, Sunny } from '@element-plus/icons-vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { usePortalContent } from '@/stores/portalContent.js'
import { currentLang } from '@/locales/index.js'
import { pickLocalized } from '@/utils/localized.js'

const { ensureLoaded, get } = usePortalContent()
const menuOpen = ref(false)
const activeSection = ref('home')
const isDark = ref(localStorage.getItem('rcm_portal_theme') === 'dark')

const navItems = [
  { id: 'home', label: 'nav.home' },
  { id: 'news', label: 'nav.news' },
  { id: 'videos', label: 'nav.videos' },
  { id: 'guide', label: 'nav.guide' },
  { id: 'faq', label: 'nav.faq' },
  { id: 'apps', label: 'nav.apps' }
]

const site = computed(() => get('rcm_portal_site_v1'))
const brand = computed(() => pickLocalized(site.value.brand, currentLang.value))
const authority = computed(() => pickLocalized(site.value.authority, currentLang.value))

function scrollTo(id) {
  activeSection.value = id
  menuOpen.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('rcm_portal_theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  ensureLoaded()
})
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: color-mix(in srgb, var(--portal-canvas) 88%, transparent);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--portal-border);
}

.header-inner {
  min-height: 76px;
  display: flex;
  align-items: center;
  gap: 28px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: start;
  flex-shrink: 0;
}

.brand-mark {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: var(--portal-primary-soft);
  color: var(--portal-primary);
}

.brand-mark svg { width: 24px; height: 24px; }

.brand-copy { display: flex; flex-direction: column; line-height: 1.25; }
.brand-copy strong { font-size: 14px; }
.brand-copy small { color: var(--portal-muted); font-size: 11px; }

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-inline: auto;
}

.nav-link {
  position: relative;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: var(--portal-muted);
  font-size: 13px;
  cursor: pointer;
}

.nav-link:hover, .nav-link.active { color: var(--portal-primary); }

.nav-link.active::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--portal-primary);
}

.header-actions { display: flex; align-items: center; gap: 10px; }

.icon-button {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid var(--portal-border);
  border-radius: 50%;
  background: transparent;
  color: var(--portal-text);
  cursor: pointer;
}

.icon-button:hover { border-color: var(--portal-primary); color: var(--portal-primary); }

.admin-button { border-radius: 999px; }

.mobile-menu { display: none; }

.drawer-nav { display: flex; flex-direction: column; gap: 4px; }

.drawer-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 10px;
  border: 0;
  border-bottom: 1px solid var(--portal-border);
  background: transparent;
  color: var(--portal-text);
  font-size: 15px;
  cursor: pointer;
}

@media (max-width: 980px) {
  .desktop-nav, .admin-button { display: none; }
  .mobile-menu { display: grid; }
  .header-actions { margin-inline-start: auto; }
}
</style>
