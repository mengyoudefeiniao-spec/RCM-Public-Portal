<template>
  <div class="portal-page">
    <PortalHeader />
    <main>
      <HeroSection />
      <AboutSection />
      <NewsSection />
      <VideoSection />
      <GuideSection />
      <FaqSection />
      <AppSection />
    </main>
    <PortalFooter />
  </div>
</template>

<script setup>
import PortalHeader from '@/components/portal/PortalHeader.vue'
import HeroSection from '@/components/portal/HeroSection.vue'
import AboutSection from '@/components/portal/AboutSection.vue'
import NewsSection from '@/components/portal/NewsSection.vue'
import VideoSection from '@/components/portal/VideoSection.vue'
import GuideSection from '@/components/portal/GuideSection.vue'
import FaqSection from '@/components/portal/FaqSection.vue'
import AppSection from '@/components/portal/AppSection.vue'
import PortalFooter from '@/components/portal/PortalFooter.vue'
</script>
