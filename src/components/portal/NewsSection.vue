<template>
  <section id="news" class="section-shell news-section">
    <div class="section-head">
      <div>
        <span class="eyebrow">{{ $t('portal.newsEyebrow') }}</span>
        <h2 class="section-title">{{ $t('portal.newsTitle') }}</h2>
        <p class="section-subtitle">{{ $t('portal.newsSubtitle') }}</p>
      </div>
      <el-button text type="primary" @click="showAll = !showAll">
        {{ showAll ? $t('common.close') : $t('portal.viewAllNews') }}
        <el-icon class="btn-icon"><ArrowRight /></el-icon>
      </el-button>
    </div>

    <div class="news-grid">
      <article v-for="item in visibleNews" :key="item.key" class="news-card soft-panel">
        <div class="news-cover" :class="{ 'has-image': item.value.cover }">
          <img v-if="item.value.cover" :src="item.value.cover" :alt="localized(item.value.title)" />
          <el-icon v-else><Picture /></el-icon>
        </div>
        <div class="news-meta">
          <span class="category">{{ localized(item.value.category) }}</span>
          <time class="num-ltr">{{ item.value.date }}</time>
        </div>
        <h3>{{ localized(item.value.title) }}</h3>
        <p>{{ localized(item.value.summary) }}</p>
        <span class="read-more">
          {{ $t('portal.readMore') }}
          <el-icon><ArrowRight /></el-icon>
        </span>
      </article>
    </div>

    <el-empty v-if="!visibleNews.length" :description="$t('common.noData')" />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowRight, Picture } from '@element-plus/icons-vue'
import { usePortalContent } from '@/stores/portalContent.js'
import { currentLang } from '@/locales/index.js'
import { pickLocalized } from '@/utils/localized.js'

const { ensureLoaded, list } = usePortalContent()
const showAll = ref(false)
const news = computed(() => list('news'))
const visibleNews = computed(() => (showAll.value ? news.value : news.value.slice(0, 3)))

function localized(value) {
  return pickLocalized(value, currentLang.value)
}

onMounted(ensureLoaded)
</script>

<style scoped>
.news-section { padding-block: 40px 80px; }
.section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 28px; }
.btn-icon { margin-inline-start: 6px; }
.news-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.news-card { overflow: hidden; padding-bottom: 22px; transition: transform 0.2s, box-shadow 0.2s; }
.news-card:hover { transform: translateY(-3px); box-shadow: 0 18px 36px -24px rgba(38, 72, 51, 0.45); }
.news-cover {
  height: 150px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--portal-primary-soft), var(--portal-gold-soft));
  color: var(--portal-primary);
  font-size: 34px;
}
.news-cover.has-image { background: var(--portal-panel); }
.news-cover img { width: 100%; height: 100%; object-fit: cover; }
.news-meta { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px 0; font-size: 12px; color: var(--portal-muted); }
.category { color: var(--portal-primary); font-weight: 700; }
.news-card h3 { margin: 12px 22px 8px; font-size: 17px; line-height: 1.55; }
.news-card p { margin: 0 22px 16px; color: var(--portal-muted); font-size: 13px; line-height: 1.8; }
.read-more { display: inline-flex; align-items: center; gap: 6px; margin-inline-start: 22px; color: var(--portal-primary); font-size: 13px; font-weight: 600; }

@media (max-width: 900px) {
  .news-grid { grid-template-columns: 1fr; }
  .section-head { align-items: flex-start; flex-direction: column; }
}
</style>
