<template>
  <footer class="site-footer">
    <div class="section-shell footer-grid">
      <div class="footer-brand">
        <strong>{{ brand }}</strong>
        <p>{{ footerNote }}</p>
        <span class="num-ltr">{{ contact }}</span>
      </div>
      <div class="footer-links">
        <h3>{{ $t('portal.followUs') }}</h3>
        <div class="social-row">
          <el-button circle aria-label="Social"><el-icon><ChatDotRound /></el-icon></el-button>
          <el-button circle aria-label="X"><el-icon><Promotion /></el-icon></el-button>
        </div>
      </div>
      <div class="footer-links">
        <h3>{{ $t('portal.downloadApp') }}</h3>
        <div class="badge-row">
          <span class="store-badge num-ltr">App Store</span>
          <span class="store-badge num-ltr">Google Play</span>
        </div>
      </div>
    </div>
    <div class="section-shell footer-bottom">
      <span>{{ $t('portal.footerRights') }}</span>
      <span>{{ $t('portal.footerNote') }}</span>
    </div>
  </footer>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { ChatDotRound, Promotion } from '@element-plus/icons-vue'
import { usePortalContent } from '@/stores/portalContent.js'
import { currentLang } from '@/locales/index.js'
import { pickLocalized } from '@/utils/localized.js'

const { ensureLoaded, get } = usePortalContent()
const site = computed(() => get('rcm_portal_site_v1'))
const brand = computed(() => pickLocalized(site.value.brand, currentLang.value))
const footerNote = computed(() => pickLocalized(site.value.footerNote, currentLang.value))
const contact = computed(() => pickLocalized(site.value.contact, currentLang.value))

onMounted(ensureLoaded)
</script>

<style scoped>
.site-footer { background: var(--portal-panel); border-top: 1px solid var(--portal-border); padding-block: 48px 20px; }
.footer-grid { display: grid; grid-template-columns: 1.4fr 0.8fr 0.8fr; gap: 40px; }
.footer-brand strong { font-size: 16px; }
.footer-brand p { margin: 12px 0 8px; color: var(--portal-muted); font-size: 13px; line-height: 1.8; }
.footer-brand span { color: var(--portal-primary); font-size: 12px; }
.footer-links h3 { margin: 0 0 14px; font-size: 14px; }
.social-row, .badge-row { display: flex; flex-wrap: wrap; gap: 10px; }
.store-badge { padding: 8px 12px; border: 1px solid var(--portal-border); border-radius: 8px; background: var(--portal-canvas); font-size: 11px; color: var(--portal-muted); }
.footer-bottom { display: flex; justify-content: space-between; gap: 16px; margin-top: 40px; padding-top: 18px; border-top: 1px solid var(--portal-border); color: var(--portal-muted); font-size: 11px; }

@media (max-width: 760px) {
  .footer-grid { grid-template-columns: 1fr; gap: 28px; }
  .footer-bottom { flex-direction: column; }
}
</style>
