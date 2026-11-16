<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <button class="lang-trigger" type="button" :aria-label="$t('common.language')">
      <el-icon><Comment /></el-icon>
      <span class="num-ltr">{{ currentLang.toUpperCase() }}</span>
      <el-icon class="chevron"><ArrowDown /></el-icon>
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in SUPPORTED_LANGUAGES"
          :key="lang.code"
          :command="lang.code"
          :disabled="lang.code === currentLang"
        >
          <span class="lang-option">
            <span class="lang-flag">{{ lang.flag }}</span>
            <span>{{ lang.native }}</span>
            <span class="num-ltr lang-code">{{ lang.code.toUpperCase() }}</span>
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ArrowDown, Comment } from '@element-plus/icons-vue'
import { SUPPORTED_LANGUAGES, currentLang, setLanguage } from '@/locales/index.js'

function handleCommand(code) {
  setLanguage(code)
}
</script>

<style scoped>
.lang-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--portal-border);
  border-radius: 999px;
  background: transparent;
  color: var(--portal-text);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.lang-trigger:hover {
  border-color: var(--portal-primary);
  background: var(--portal-primary-soft);
}

.chevron { font-size: 12px; }

.lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 150px;
}

.lang-flag { font-size: 16px; }
.lang-code { margin-inline-start: auto; color: var(--portal-muted); font-size: 11px; }
</style>
