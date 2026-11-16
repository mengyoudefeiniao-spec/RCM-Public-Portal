<template>
  <div class="portal-page">
    <PortalHeader />
    <main>
      <component
        :is="SECTION_COMPONENTS[sectionId]"
        v-for="sectionId in visibleSections"
        :key="sectionId"
      />
    </main>
    <PortalFooter />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import PortalHeader from '@/components/portal/PortalHeader.vue'
import HeroSection from '@/components/portal/HeroSection.vue'
import AboutSection from '@/components/portal/AboutSection.vue'
import NewsSection from '@/components/portal/NewsSection.vue'
import VideoSection from '@/components/portal/VideoSection.vue'
import GuideSection from '@/components/portal/GuideSection.vue'
import FaqSection from '@/components/portal/FaqSection.vue'
import AppSection from '@/components/portal/AppSection.vue'
import PortalFooter from '@/components/portal/PortalFooter.vue'
import { usePortalContent } from '@/stores/portalContent.js'
import { PORTAL_LAYOUT_KEY, normalizePortalLayout, visibleSectionIds } from '@/utils/layout.js'

/** 区块 id → 组件映射；顺序与显隐由后台「页面布局」配置决定。 */
const SECTION_COMPONENTS = {
  home: HeroSection,
  about: AboutSection,
  news: NewsSection,
  videos: VideoSection,
  guide: GuideSection,
  faq: FaqSection,
  apps: AppSection
}

const { get, ensureLoaded } = usePortalContent()

const visibleSections = computed(() =>
  visibleSectionIds(normalizePortalLayout(get(PORTAL_LAYOUT_KEY))).filter(
    (sectionId) => SECTION_COMPONENTS[sectionId]
  )
)

onMounted(ensureLoaded)
</script>
