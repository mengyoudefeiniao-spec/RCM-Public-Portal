<template>
  <section id="home" class="hero">
    <div class="section-shell hero-grid">
      <div class="hero-copy">
        <span class="hero-badge">{{ badge }}</span>
        <p class="hero-eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p class="hero-desc">{{ description }}</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" round @click="scrollTo('apps')">
            {{ primaryCta }}
            <el-icon class="btn-icon"><ArrowRight /></el-icon>
          </el-button>
          <el-button size="large" round @click="scrollTo('guide')">
            {{ secondaryCta }}
          </el-button>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <strong class="num-ltr">{{ about.statHouseholds }}</strong>
            <span>{{ $t('portal.statHouseholds') }}</span>
          </div>
          <div class="stat">
            <strong class="num-ltr">{{ about.statAgencies }}</strong>
            <span>{{ $t('portal.statAgencies') }}</span>
          </div>
          <div class="stat">
            <strong class="num-ltr">{{ about.statCoverage }}</strong>
            <span>{{ $t('portal.statCoverage') }}</span>
          </div>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="blob"></div>
        <div class="mock-browser">
          <div class="browser-bar">
            <i></i><i></i><i></i>
            <span class="num-ltr">ration.gov.iq</span>
          </div>
          <div class="browser-body">
            <div class="skeleton-line wide"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-block">
              <span></span><span></span><span></span>
            </div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
        <div class="mock-phone">
          <div class="phone-notch"></div>
          <div class="phone-head">
            <span class="phone-logo">✦</span>
            <span class="num-ltr">RCM</span>
          </div>
          <div class="phone-title">{{ $t('portal.heroBadge') }}</div>
          <div class="phone-card">
            <span class="phone-card-line"></span>
            <span class="phone-card-line short"></span>
            <strong class="num-ltr">•••• 4821</strong>
          </div>
          <div class="phone-button">{{ primaryCta }}</div>
          <div class="phone-dots"><i></i><i></i><i></i></div>
        </div>
        <div class="floating-chip">
          <span class="chip-dot"></span>
          {{ authority }}
        </div>
      </div>
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
const hero = computed(() => get('rcm_portal_hero_v1'))
const about = computed(() => get('rcm_portal_about_v1'))
const site = computed(() => get('rcm_portal_site_v1'))

const badge = computed(() => pickLocalized(hero.value.badge, currentLang.value))
const eyebrow = computed(() => pickLocalized(hero.value.eyebrow, currentLang.value))
const title = computed(() => pickLocalized(hero.value.title, currentLang.value))
const description = computed(() => pickLocalized(hero.value.description, currentLang.value))
const primaryCta = computed(() => pickLocalized(hero.value.primaryCta, currentLang.value))
const secondaryCta = computed(() => pickLocalized(hero.value.secondaryCta, currentLang.value))
const authority = computed(() => pickLocalized(site.value.authority, currentLang.value))

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(ensureLoaded)
</script>

<style scoped>
.hero {
  padding: clamp(48px, 7vw, 96px) 0 clamp(40px, 6vw, 80px);
  overflow: hidden;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: clamp(32px, 6vw, 80px);
}

.hero-badge {
  display: inline-flex;
  padding: 6px 14px;
  border: 1px solid var(--portal-gold);
  border-radius: 999px;
  background: var(--portal-gold-soft);
  color: var(--portal-primary);
  font-size: 12px;
  font-weight: 700;
}

.hero-eyebrow {
  margin: 22px 0 0;
  color: var(--portal-primary);
  font-size: 14px;
  font-weight: 600;
}

h1 {
  margin: 10px 0 18px;
  font-size: clamp(32px, 4.6vw, 56px);
  line-height: 1.18;
  letter-spacing: -0.02em;
}

.hero-desc {
  max-width: 540px;
  margin: 0;
  color: var(--portal-muted);
  font-size: 16px;
  line-height: 1.85;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.btn-icon { margin-inline-start: 6px; }

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 34px;
  margin-top: 42px;
  padding-top: 24px;
  border-top: 1px solid var(--portal-border);
}

.stat { display: flex; flex-direction: column; gap: 2px; }
.stat strong { font-size: 24px; color: var(--portal-primary); }
.stat span { font-size: 12px; color: var(--portal-muted); }

.hero-visual {
  position: relative;
  min-height: 400px;
  display: grid;
  place-items: center;
}

.blob {
  position: absolute;
  width: 88%;
  aspect-ratio: 1;
  border-radius: 48% 52% 58% 42% / 42% 46% 54% 58%;
  background: var(--portal-gold-soft);
  opacity: 0.85;
}

.mock-browser {
  position: relative;
  width: 86%;
  max-width: 420px;
  aspect-ratio: 1.42;
  border-radius: 14px;
  background: var(--portal-canvas);
  border: 1px solid var(--portal-border);
  box-shadow: var(--portal-shadow);
  transform: rotate(-4deg);
  overflow: hidden;
  padding: 12px;
}

.browser-bar {
  height: 22px;
  display: flex;
  align-items: center;
  gap: 5px;
  border-bottom: 1px solid var(--portal-border);
  padding-bottom: 8px;
  color: var(--portal-muted);
  font-size: 10px;
}

.browser-bar i { width: 6px; height: 6px; border-radius: 50%; background: var(--portal-border); }
.browser-bar span { margin-inline: auto; }

.browser-body { padding: 18px 10px; display: flex; flex-direction: column; gap: 12px; }
.skeleton-line { height: 8px; width: 62%; border-radius: 8px; background: var(--portal-panel); }
.skeleton-line.wide { width: 82%; height: 12px; background: var(--portal-primary-soft); }
.skeleton-line.short { width: 40%; }
.skeleton-block { display: flex; gap: 8px; }
.skeleton-block span { flex: 1; height: 68px; border-radius: 8px; background: var(--portal-panel); border: 1px solid var(--portal-border); }

.mock-phone {
  position: absolute;
  width: 172px;
  min-height: 300px;
  border-radius: 26px;
  background: var(--portal-canvas);
  border: 7px solid #243128;
  box-shadow: 0 26px 44px -18px rgba(25, 48, 34, 0.45);
  padding: 18px 14px;
  transform: rotate(5deg) translate(28%, 12%);
}

.phone-notch {
  position: absolute;
  top: 6px;
  inset-inline: 50%;
  transform: translateX(50%);
  width: 48px;
  height: 6px;
  border-radius: 0 0 8px 8px;
  background: #243128;
}

.phone-head { display: flex; align-items: center; justify-content: space-between; color: var(--portal-primary); font-size: 11px; font-weight: 700; }
.phone-logo { font-size: 18px; }
.phone-title { margin: 18px 0 12px; font-size: 14px; font-weight: 700; line-height: 1.5; }
.phone-card { padding: 12px; border-radius: 10px; background: var(--portal-primary-soft); display: flex; flex-direction: column; gap: 6px; }
.phone-card-line { height: 6px; width: 80%; border-radius: 6px; background: var(--portal-primary); opacity: 0.25; }
.phone-card-line.short { width: 50%; }
.phone-card strong { font-size: 11px; color: var(--portal-primary); }
.phone-button { margin-top: 16px; padding: 9px; border-radius: 20px; background: var(--portal-primary); color: #fff; text-align: center; font-size: 10px; }
.phone-dots { display: flex; justify-content: center; gap: 4px; margin-top: 14px; }
.phone-dots i { width: 4px; height: 4px; border-radius: 50%; background: var(--portal-border); }
.phone-dots i:first-child { background: var(--portal-primary); }

.floating-chip {
  position: absolute;
  bottom: 18px;
  inset-inline-start: 4%;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--portal-canvas);
  border: 1px solid var(--portal-border);
  box-shadow: var(--portal-shadow);
  font-size: 12px;
  color: var(--portal-muted);
}

.chip-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--portal-primary); }

@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; }
  .hero-visual { min-height: 340px; }
  .mock-phone { transform: rotate(5deg) translate(14%, 8%); }
}
</style>
