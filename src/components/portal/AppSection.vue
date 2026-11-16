<template>
  <section id="apps" class="app-section">
    <div class="section-shell">
      <div class="section-head text-center">
        <span class="eyebrow">{{ $t('portal.appEyebrow') }}</span>
        <h2 class="section-title">{{ $t('portal.appTitle') }}</h2>
        <p class="section-subtitle">{{ $t('portal.appSubtitle') }}</p>
      </div>
      <div class="app-grid">
        <article v-for="item in apps" :key="item.key" class="app-card soft-panel">
          <span class="app-icon"><el-icon><Iphone /></el-icon></span>
          <div>
            <span class="platform num-ltr">{{ item.value.platform }}</span>
            <h3>{{ localized(item.value.title) }}</h3>
            <p>{{ localized(item.value.description) }}</p>
          </div>
          <el-button type="primary" round @click="openApp(item.value.href)">
            {{ $t('portal.download') }}
          </el-button>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Iphone } from '@element-plus/icons-vue'
import { usePortalContent } from '@/stores/portalContent.js'
import { currentLang } from '@/locales/index.js'
import { pickLocalized } from '@/utils/localized.js'

const { ensureLoaded, list } = usePortalContent()
const apps = computed(() => list('app'))

function localized(value) {
  return pickLocalized(value, currentLang.value)
}

function openApp(href) {
  if (!href) return
  window.open(href, '_blank', 'noopener')
}

onMounted(ensureLoaded)
</script>

<style scoped>
.app-section { padding-block: 70px; background: var(--portal-panel); border-top: 1px solid var(--portal-border); }
.text-center { text-align: center; }
.text-center .eyebrow::before { display: none; }
.section-head { margin-bottom: 32px; }
.app-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.app-card { display: flex; align-items: center; gap: 18px; padding: 24px; }
.app-icon { width: 52px; height: 52px; flex-shrink: 0; display: grid; place-items: center; border-radius: 12px; background: var(--portal-primary-soft); color: var(--portal-primary); font-size: 24px; }
.app-card > div { flex: 1; }
.platform { color: var(--portal-gold); font-size: 11px; font-weight: 700; }
.app-card h3 { margin: 4px 0 6px; font-size: 17px; }
.app-card p { margin: 0; color: var(--portal-muted); font-size: 13px; line-height: 1.7; }

@media (max-width: 760px) { .app-grid { grid-template-columns: 1fr; } .app-card { flex-wrap: wrap; } }
</style>
