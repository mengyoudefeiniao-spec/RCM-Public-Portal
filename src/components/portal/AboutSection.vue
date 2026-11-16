<template>
  <section id="about" class="about section-shell">
    <div class="about-panel soft-panel">
      <div class="about-head">
        <span class="eyebrow">{{ $t('portal.aboutEyebrow') }}</span>
        <h2 class="section-title">{{ title }}</h2>
      </div>
      <p class="about-body">{{ body }}</p>
      <el-button text type="primary" @click="scrollTo('news')">
        {{ $t('portal.aboutMore') }}
        <el-icon class="btn-icon"><ArrowRight /></el-icon>
      </el-button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { usePortalContent } from '@/stores/portalContent.js'
import { currentLang } from '@/locales/index.js'
import { pickLocalized } from '@/utils/localized.js'

const { ensureLoaded, get } = usePortalContent()
const about = computed(() => get('rcm_portal_about_v1'))
const title = computed(() => pickLocalized(about.value.title, currentLang.value))
const body = computed(() => pickLocalized(about.value.body, currentLang.value))

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(ensureLoaded)
</script>

<style scoped>
.about { padding-block: 30px 70px; }
.about-panel { padding: clamp(28px, 5vw, 56px); }
.about-head { max-width: 640px; }
.about-body {
  max-width: 900px;
  margin: 18px 0 8px;
  color: var(--portal-muted);
  font-size: 15px;
  line-height: 2;
}
.btn-icon { margin-inline-start: 6px; }
</style>
