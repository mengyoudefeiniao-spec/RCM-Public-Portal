<template>
  <section id="faq" class="section-shell faq-section">
    <div class="faq-layout">
      <div class="faq-intro">
        <span class="eyebrow">{{ $t('portal.faqEyebrow') }}</span>
        <h2 class="section-title">{{ $t('portal.faqTitle') }}</h2>
        <p class="section-subtitle">{{ $t('portal.faqSubtitle') }}</p>
      </div>
      <div class="faq-list">
        <el-collapse v-model="active" accordion>
          <el-collapse-item v-for="item in faqs" :key="item.key" :name="item.key">
            <template #title>
              <span class="faq-question">{{ localized(item.value.question) }}</span>
            </template>
            <p class="faq-answer">{{ localized(item.value.answer) }}</p>
          </el-collapse-item>
        </el-collapse>
        <el-empty v-if="!faqs.length" :description="$t('common.noData')" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { usePortalContent } from '@/stores/portalContent.js'
import { currentLang } from '@/locales/index.js'
import { pickLocalized } from '@/utils/localized.js'

const { ensureLoaded, list } = usePortalContent()
const faqs = computed(() => list('faq'))
const active = ref('')

function localized(value) {
  return pickLocalized(value, currentLang.value)
}

onMounted(ensureLoaded)
</script>

<style scoped>
.faq-section { padding-block: 40px 80px; }
.faq-layout { display: grid; grid-template-columns: 0.75fr 1.25fr; gap: 60px; align-items: start; }
.faq-list { border-top: 1px solid var(--portal-border); }
.faq-question { font-size: 15px; font-weight: 600; line-height: 1.6; }
.faq-answer { margin: 0; color: var(--portal-muted); font-size: 14px; line-height: 1.9; }
:deep(.el-collapse-item__header) { height: auto; min-height: 62px; padding-block: 12px; background: transparent; border-bottom: 1px solid var(--portal-border); }
:deep(.el-collapse-item__wrap) { border-bottom: 1px solid var(--portal-border); }
:deep(.el-collapse-item__content) { padding-block: 16px; }

@media (max-width: 900px) { .faq-layout { grid-template-columns: 1fr; gap: 28px; } }
</style>
