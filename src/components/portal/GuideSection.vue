<template>
  <section id="guide" class="section-shell guide-section">
    <div class="section-head">
      <div>
        <span class="eyebrow">{{ $t('portal.guideEyebrow') }}</span>
        <h2 class="section-title">{{ $t('portal.guideTitle') }}</h2>
        <p class="section-subtitle">{{ $t('portal.guideSubtitle') }}</p>
      </div>
    </div>

    <div class="guide-grid">
      <article v-for="(item, index) in guides" :key="item.key" class="guide-card soft-panel">
        <span class="guide-icon"><component :is="iconMap[item.value.icon] || Document" /></span>
        <span class="guide-index num-ltr">0{{ index + 1 }}</span>
        <h3>{{ localized(item.value.title) }}</h3>
        <p>{{ localized(item.value.description) }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Bell, Document, Iphone, Postcard } from '@element-plus/icons-vue'
import { usePortalContent } from '@/stores/portalContent.js'
import { currentLang } from '@/locales/index.js'
import { pickLocalized } from '@/utils/localized.js'

const { ensureLoaded, list } = usePortalContent()
const guides = computed(() => list('guide'))
const iconMap = { Postcard, Iphone, Document, Bell }

function localized(value) {
  return pickLocalized(value, currentLang.value)
}

onMounted(ensureLoaded)
</script>

<style scoped>
.guide-section { padding-block: 80px; }
.section-head { margin-bottom: 30px; }
.guide-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
.guide-card { padding: 26px 22px; min-height: 220px; }
.guide-icon { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 10px; background: var(--portal-primary-soft); color: var(--portal-primary); font-size: 20px; }
.guide-index { display: block; margin-top: 20px; color: var(--portal-gold); font-size: 12px; font-weight: 700; }
.guide-card h3 { margin: 8px 0 10px; font-size: 16px; line-height: 1.5; }
.guide-card p { margin: 0; color: var(--portal-muted); font-size: 13px; line-height: 1.8; }

@media (max-width: 900px) { .guide-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .guide-grid { grid-template-columns: 1fr; } }
</style>
