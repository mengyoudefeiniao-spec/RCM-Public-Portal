<template>
  <div class="login-page">
    <div class="login-shell">
      <aside class="login-brand">
        <div class="brand-top">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 21V9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              <path d="M12 12c-3.6 0-6-2.3-6-6 3.7 0 6 2.3 6 6Z" fill="currentColor" opacity=".85" />
              <path d="M12 9c3.6 0 6-2.3 6-6-3.7 0-6 2.3-6 6Z" fill="currentColor" opacity=".6" />
              <path d="M12 15c3.2 0 5.2-2 5.2-5.2-3.3 0-5.2 2-5.2 5.2Z" fill="currentColor" opacity=".4" />
            </svg>
          </span>
          <span class="brand-copy">
            <strong>{{ $t('common.appName') }}</strong>
            <small>{{ $t('common.adminConsole') }}</small>
          </span>
        </div>

        <div class="brand-body">
          <span class="eyebrow">{{ $t('admin.badge') }}</span>
          <h1>{{ $t('auth.loginTitle') }}</h1>
          <p>{{ $t('auth.loginSubtitle') }}</p>
          <ul class="brand-points">
            <li><el-icon><Lock /></el-icon>{{ $t('auth.featureSecurity') }}</li>
            <li><el-icon><Rank /></el-icon>{{ $t('auth.featureLayout') }}</li>
            <li><el-icon><UserFilled /></el-icon>{{ $t('auth.featureUsers') }}</li>
          </ul>
        </div>

        <p class="brand-foot">{{ $t('portal.footerRights') }}</p>
      </aside>

      <main class="login-panel">
        <div class="panel-top">
          <LanguageSwitcher />
          <el-button link @click="goPortal">
            <el-icon><Back /></el-icon>
            {{ $t('common.backPortal') }}
          </el-button>
        </div>

        <div class="panel-card">
          <h2>{{ $t('auth.loginTitle') }}</h2>
          <p class="panel-sub">{{ $t('auth.loginSubtitle') }}</p>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
            class="login-form"
            @submit.prevent="submit"
          >
            <el-form-item :label="$t('common.username')" prop="username">
              <el-input
                v-model="form.username"
                size="large"
                autocomplete="username"
                :prefix-icon="User"
                :placeholder="$t('common.username')"
              />
            </el-form-item>
            <el-form-item :label="$t('common.password')" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                size="large"
                show-password
                autocomplete="current-password"
                :prefix-icon="Lock"
                :placeholder="$t('common.password')"
                @keyup.enter="submit"
              />
            </el-form-item>

            <el-button
              type="primary"
              size="large"
              class="submit-button"
              :loading="state.loading"
              @click="submit"
            >
              {{ state.loading ? $t('auth.loggingIn') : $t('auth.loginButton') }}
            </el-button>
          </el-form>

          <div class="demo-card">
            <div class="demo-head">
              <strong>{{ $t('auth.demoHint') }}</strong>
              <span class="num-ltr">admin / Admin@123</span>
              <el-button link type="primary" @click="fillDemo">{{ $t('auth.demoFill') }}</el-button>
            </div>
            <p>{{ $t('auth.demoNote') }}</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Back, Lock, Rank, User, UserFilled } from '@element-plus/icons-vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useAccount } from '@/stores/account.js'
import { errorKey, errorParams } from '@/services/errors.js'
import { resolveRedirect } from '@/router/index.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { state, login } = useAccount()

const formRef = ref(null)
const form = reactive({ username: '', password: '' })

const rules = computed(() => ({
  username: [{ required: true, message: t('auth.usernameRequired'), trigger: 'blur' }],
  password: [{ required: true, message: t('auth.passwordRequired'), trigger: 'blur' }]
}))

function fillDemo() {
  form.username = 'admin'
  form.password = 'Admin@123'
}

function goPortal() {
  router.push('/portal')
}

async function submit() {
  if (state.loading) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  try {
    await login(form.username, form.password)
    ElMessage.success(t('auth.signedIn'))
    router.replace(resolveRedirect(route.query.redirect))
  } catch (error) {
    ElMessage.error(t(errorKey(error, 'auth.invalidCredentials'), errorParams(error)))
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background:
    radial-gradient(circle at 12% 18%, var(--portal-primary-soft), transparent 55%),
    radial-gradient(circle at 88% 82%, var(--portal-gold-soft), transparent 50%),
    var(--portal-canvas);
}

.login-shell {
  width: min(1040px, 100%);
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  border: 1px solid var(--portal-border);
  border-radius: 20px;
  overflow: hidden;
  background: var(--portal-canvas);
  box-shadow: 0 30px 70px -50px rgba(31, 51, 38, 0.55);
}

.login-brand {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 38px 40px;
  background: linear-gradient(155deg, #2c5a3d 0%, #326445 45%, #21452f 100%);
  color: #f2f7f3;
}

.brand-top { display: flex; align-items: center; gap: 10px; }
.brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}
.brand-mark svg { width: 24px; height: 24px; }
.brand-copy { display: flex; flex-direction: column; line-height: 1.25; }
.brand-copy strong { font-size: 14px; }
.brand-copy small { color: rgba(255, 255, 255, 0.66); font-size: 11px; }

.brand-body { margin-block: auto; max-width: 30rem; }
.brand-body .eyebrow { color: var(--portal-gold); }
.brand-body .eyebrow::before { background: var(--portal-gold); }
.brand-body h1 { margin: 14px 0 10px; font-size: clamp(26px, 3.2vw, 34px); line-height: 1.3; }
.brand-body p { margin: 0; color: rgba(255, 255, 255, 0.78); font-size: 14px; line-height: 1.8; }

.brand-points { list-style: none; margin: 26px 0 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.brand-points li { display: flex; align-items: center; gap: 10px; font-size: 13px; color: rgba(255, 255, 255, 0.92); }
.brand-points .el-icon { color: var(--portal-gold); }

.brand-foot { margin: 0; font-size: 11px; color: rgba(255, 255, 255, 0.5); }

.login-panel { display: flex; flex-direction: column; padding: 26px 40px 40px; }
.panel-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.panel-card { margin-block: auto; }

.panel-card h2 { margin: 0 0 6px; font-size: 22px; }
.panel-sub { margin: 0 0 24px; color: var(--portal-muted); font-size: 13px; line-height: 1.7; }

.login-form :deep(.el-form-item__label) { font-weight: 600; }
.submit-button { width: 100%; margin-top: 6px; border-radius: 999px; }

.demo-card {
  margin-top: 26px;
  padding: 14px 16px;
  border: 1px dashed var(--portal-border);
  border-radius: 10px;
  background: var(--portal-panel);
  font-size: 12px;
  color: var(--portal-muted);
}
.demo-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.demo-head strong { color: var(--portal-text); font-size: 12px; }
.demo-head .num-ltr {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--portal-primary-soft);
  color: var(--portal-primary);
  font-size: 11px;
}
.demo-card p { margin: 8px 0 0; line-height: 1.6; }

@media (max-width: 880px) {
  .login-shell { grid-template-columns: 1fr; }
  .login-brand { padding: 28px; gap: 22px; }
  .brand-points { margin-top: 18px; }
  .login-panel { padding: 22px 24px 28px; }
}
</style>
