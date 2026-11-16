<template>
  <section id="videos" class="video-section">
    <div class="section-shell">
      <div class="section-head">
        <div>
          <span class="eyebrow">{{ $t('portal.videoEyebrow') }}</span>
          <h2 class="section-title">{{ $t('portal.videoTitle') }}</h2>
          <p class="section-subtitle">{{ $t('portal.videoSubtitle') }}</p>
        </div>
      </div>

      <div class="video-grid">
        <button v-for="item in videos" :key="item.key" type="button" class="video-card" @click="openVideo(item.value)">
          <div class="video-cover">
            <img v-if="item.value.cover" :src="item.value.cover" :alt="localized(item.value.title)" />
            <div v-else class="video-placeholder">
              <el-icon><VideoCamera /></el-icon>
            </div>
            <span class="play-button"><el-icon><CaretRight /></el-icon></span>
            <span class="duration num-ltr">{{ item.value.duration }}</span>
          </div>
          <div class="video-info">
            <h3>{{ localized(item.value.title) }}</h3>
            <p>{{ localized(item.value.description) }}</p>
          </div>
        </button>
      </div>

      <el-empty v-if="!videos.length" :description="$t('common.noData')" />
    </div>

    <el-dialog v-model="dialogVisible" :title="localized(activeVideo.title)" width="min(720px, 92vw)">
      <video v-if="activeVideo.url" :src="activeVideo.url" controls class="video-player"></video>
      <el-empty v-else :description="$t('portal.videoUnavailable')">
        <el-icon :size="42"><VideoCamera /></el-icon>
      </el-empty>
    </el-dialog>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { CaretRight, VideoCamera } from '@element-plus/icons-vue'
import { usePortalContent } from '@/stores/portalContent.js'
import { currentLang } from '@/locales/index.js'
import { pickLocalized } from '@/utils/localized.js'

const { ensureLoaded, list } = usePortalContent()
const videos = computed(() => list('video'))
const dialogVisible = ref(false)
const activeVideo = ref({})

function localized(value) {
  return pickLocalized(value, currentLang.value)
}

function openVideo(value) {
  activeVideo.value = value
  dialogVisible.value = true
}

onMounted(ensureLoaded)
</script>

<style scoped>
.video-section { padding-block: 40px 80px; background: var(--portal-panel); border-block: 1px solid var(--portal-border); }
.section-head { margin-bottom: 28px; }
.video-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.video-card {
  padding: 0;
  border: 1px solid var(--portal-border);
  border-radius: var(--portal-radius);
  background: var(--portal-canvas);
  overflow: hidden;
  text-align: start;
  color: inherit;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.video-card:hover { transform: translateY(-3px); box-shadow: var(--portal-shadow); }
.video-cover { position: relative; height: 180px; display: grid; place-items: center; }
.video-cover img { width: 100%; height: 100%; object-fit: cover; }
.video-placeholder { position: absolute; inset: 0; display: grid; place-items: center; background: linear-gradient(135deg, var(--portal-primary-soft), var(--portal-gold-soft)); color: var(--portal-primary); font-size: 40px; }
.play-button {
  position: absolute;
  inset-inline-start: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--portal-primary);
  color: #fff;
  font-size: 20px;
  box-shadow: 0 10px 24px -10px rgba(38, 72, 51, 0.7);
}
.duration { position: absolute; bottom: 10px; inset-inline-end: 10px; padding: 3px 8px; border-radius: 6px; background: rgba(20, 35, 26, 0.72); color: #fff; font-size: 11px; }
.video-info { padding: 18px 20px 22px; }
.video-info h3 { margin: 0 0 8px; font-size: 16px; line-height: 1.5; }
.video-info p { margin: 0; color: var(--portal-muted); font-size: 13px; line-height: 1.7; }
.video-player { width: 100%; border-radius: 8px; }

@media (max-width: 900px) { .video-grid { grid-template-columns: 1fr; } }
</style>
