<template>
  <div class="admin-page">
    <header class="admin-header section-shell">
      <div class="header-copy">
        <span class="eyebrow">{{ $t('admin.badge') }}</span>
        <h1>{{ $t('admin.title') }}</h1>
        <p>{{ $t('admin.subtitle') }}</p>
      </div>
      <div class="header-actions">
        <LanguageSwitcher />
        <el-tag :type="state.source === 'mock' ? 'warning' : 'success'" effect="plain" class="num-ltr">
          {{ state.source === 'mock' ? $t('common.mockMode') : $t('common.pbMode') }}
        </el-tag>
        <el-dropdown trigger="click" @command="onAccountCommand">
          <button class="account-chip" type="button">
            <el-avatar :size="26" class="account-avatar">{{ accountInitial }}</el-avatar>
            <span class="account-copy">
              <strong>{{ accountDisplayName }}</strong>
              <small>{{ accountRoleLabel }}</small>
            </span>
            <el-icon class="account-caret"><ArrowDown /></el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="password">
                <el-icon><Key /></el-icon>
                {{ $t('auth.changePassword') }}
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><SwitchButton /></el-icon>
                {{ $t('auth.logout') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button @click="$router.push('/portal')">{{ $t('common.backPortal') }}</el-button>
        <el-button type="primary" @click="previewVisible = true">
          <el-icon><View /></el-icon>
          {{ $t('common.preview') }}
        </el-button>
      </div>
    </header>

    <div class="section-shell admin-tip">
      <el-icon><InfoFilled /></el-icon>
      <span>{{ $t('common.liveTip') }}</span>
      <span v-if="state.error" class="tip-error">{{ state.error }}</span>
    </div>

    <div class="section-shell admin-content">
      <el-tabs v-model="activeTab" class="admin-tabs">
        <el-tab-pane :label="$t('admin.tabSections')" name="sections">
          <div class="soft-panel panel-pad">
            <SectionOrderEditor
              :order="sectionsDraft.order"
              :hidden="sectionsDraft.hidden"
              @update:order="(value) => (sectionsDraft.order = value)"
              @update:hidden="(value) => (sectionsDraft.hidden = value)"
              @reset="resetSections"
            />
            <div class="save-row">
              <el-button type="primary" :loading="saving" @click="saveSections">
                {{ $t('admin.saveSections') }}
              </el-button>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="$t('admin.tabLayout')" name="layout">
          <div v-if="layoutReady" class="layout-editor">
            <section v-for="section in layoutSections" :key="section.key" class="layout-section soft-panel">
              <div class="section-heading">
                <h2>{{ $t(section.title) }}</h2>
                <span class="num-ltr">{{ section.key }}</span>
              </div>

              <div v-if="plainFields(section).length" class="field-grid">
                <el-form-item v-for="field in plainFields(section)" :key="field.key" :label="$t(field.label)">
                  <el-input v-model="layoutDraft[section.key][field.key]" />
                </el-form-item>
              </div>

              <el-tabs v-model="layoutLang" class="lang-tabs">
                <el-tab-pane v-for="lang in LANG_OPTIONS" :key="lang.code" :label="lang.native" :name="lang.code">
                  <div class="field-grid">
                    <el-form-item
                      v-for="field in i18nFields(section)"
                      :key="field.key"
                      :label="$t(field.label)"
                    >
                      <el-input
                        v-model="layoutDraft[section.key][field.key][lang.code]"
                        :type="field.multiline ? 'textarea' : 'text'"
                        :rows="field.multiline ? 4 : 1"
                      />
                    </el-form-item>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </section>
            <div class="save-row">
              <el-button type="primary" :loading="saving" @click="saveLayout">
                {{ $t('admin.saveLayout') }}
              </el-button>
            </div>
          </div>
          <el-skeleton v-else :rows="8" animated />
        </el-tab-pane>

        <el-tab-pane
          v-for="config in editorConfigs"
          :key="config.type"
          :label="$t(config.tabLabel)"
          :name="config.type"
        >
          <div class="list-toolbar">
            <el-button type="primary" @click="openAdd(config.type)">
              <el-icon><Plus /></el-icon>
              {{ $t(config.addLabel) }}
            </el-button>
            <el-button @click="resetAll">{{ $t('admin.resetData') }}</el-button>
          </div>

          <el-table :data="rows[config.type]" border class="content-table">
            <el-table-column :label="$t('common.title')" min-width="220">
              <template #default="{ row }">
                <span class="cell-title">{{ localized(row.value, config.displayField) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="config.metaColumn" :label="$t(config.metaColumn.label)" width="140">
              <template #default="{ row }">
                <span class="num-ltr">{{ row.value[config.metaColumn.key] }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.sort')" width="90" align="center">
              <template #default="{ row }"><span class="num-ltr">{{ row.value.sort || 0 }}</span></template>
            </el-table-column>
            <el-table-column :label="$t('common.status')" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.value.visible === false ? 'info' : 'success'" effect="plain" size="small">
                  {{ row.value.visible === false ? $t('common.hidden') : $t('common.visible') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.actions')" width="150" align="center">
              <template #default="{ row }">
                <el-button link type="primary" @click="openEdit(config.type, row)">{{ $t('common.edit') }}</el-button>
                <el-button link type="danger" @click="removeItem(row)">{{ $t('common.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="!rows[config.type].length" :description="$t('common.noData')" />
        </el-tab-pane>

        <el-tab-pane v-if="isAdmin" :label="$t('admin.tabUsers')" name="users">
          <UserManager />
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.mode === 'add' ? $t(currentConfig.addLabel) : $t(currentConfig.editLabel)"
      width="min(760px, 94vw)"
      destroy-on-close
    >
      <el-form label-position="top">
        <div class="meta-grid">
          <el-form-item v-for="field in currentConfig.metaFields" :key="field.key" :label="$t(field.label)">
            <el-switch v-if="field.type === 'switch'" v-model="dialog.form[field.key]" />
            <el-input-number
              v-else-if="field.type === 'number'"
              v-model="dialog.form[field.key]"
              :min="0"
              controls-position="right"
            />
            <el-date-picker
              v-else-if="field.type === 'date'"
              v-model="dialog.form[field.key]"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
            />
            <el-input v-else v-model="dialog.form[field.key]" :placeholder="$t(field.tip || 'common.description')" />
          </el-form-item>
        </div>

        <el-divider content-position="left">{{ $t('admin.langFieldsHint') }}</el-divider>
        <el-tabs v-model="dialog.lang">
          <el-tab-pane v-for="lang in LANG_OPTIONS" :key="lang.code" :label="lang.native" :name="lang.code">
            <el-form-item v-for="field in currentConfig.i18nFields" :key="field.key" :label="$t(field.label)">
              <el-input
                v-model="dialog.form[field.key][lang.code]"
                :type="field.multiline ? 'textarea' : 'text'"
                :rows="field.multiline ? 3 : 1"
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="saveItem">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="passwordDialog.visible"
      :title="$t('auth.changePassword')"
      width="min(460px, 94vw)"
      destroy-on-close
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordDialog.form"
        :rules="passwordRules"
        label-position="top"
      >
        <el-form-item :label="$t('auth.currentPassword')" prop="current">
          <el-input v-model="passwordDialog.form.current" type="password" show-password autocomplete="current-password" />
        </el-form-item>
        <el-form-item :label="$t('auth.newPassword')" prop="next">
          <el-input v-model="passwordDialog.form.next" type="password" show-password autocomplete="new-password" />
        </el-form-item>
        <el-form-item :label="$t('auth.confirmPassword')" prop="confirm">
          <el-input v-model="passwordDialog.form.confirm" type="password" show-password autocomplete="new-password" />
        </el-form-item>
      </el-form>
      <p class="field-tip">{{ $t('admin.changePasswordHint') }}</p>
      <template #footer>
        <el-button @click="passwordDialog.visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="passwordDialog.saving" @click="submitPassword">
          {{ $t('common.save') }}
        </el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="previewVisible" :title="$t('admin.previewTitle')" size="min(960px, 95vw)">
      <div class="preview-toolbar">
        <span>{{ $t('admin.previewHint') }}</span>
        <div>
          <el-button size="small" @click="refreshPreview">{{ $t('common.refresh') }}</el-button>
          <el-button size="small" type="primary" @click="openPortal">{{ $t('admin.openPortal') }}</el-button>
        </div>
      </div>
      <iframe :key="previewKey" class="preview-frame" src="/#/portal" title="portal preview"></iframe>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, InfoFilled, Key, Plus, SwitchButton, View } from '@element-plus/icons-vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import SectionOrderEditor from '@/components/admin/SectionOrderEditor.vue'
import UserManager from '@/components/admin/UserManager.vue'
import { usePortalContent } from '@/stores/portalContent.js'
import { useAccount } from '@/stores/account.js'
import { SUPPORTED_LANGUAGES as LANG_OPTIONS, currentLang } from '@/locales/index.js'
import { emptyLocalized, pickLocalized } from '@/utils/localized.js'
import { PASSWORD_MIN_LENGTH } from '@/services/users.js'
import { errorKey, errorParams } from '@/services/errors.js'
import { PORTAL_KEY_PREFIX } from '@/mock/portalContent.js'
import { PORTAL_LAYOUT_KEY, defaultPortalLayout, normalizePortalLayout } from '@/utils/layout.js'

const { t } = useI18n()
const router = useRouter()
const { state, ensureLoaded, get, list, upsert, remove, reset } = usePortalContent()
const { state: account, isAdmin, logout, changePassword } = useAccount()

const activeTab = ref('sections')
const layoutLang = ref('zh')
const layoutReady = ref(false)
const saving = ref(false)
const previewVisible = ref(false)
const previewKey = ref(0)
const passwordFormRef = ref(null)

const sectionsDraft = reactive({ order: [...defaultPortalLayout().order], hidden: [] })

const passwordDialog = reactive({
  visible: false,
  saving: false,
  form: { current: '', next: '', confirm: '' }
})

const accountDisplayName = computed(() => account.session?.displayName || account.session?.username || '')
const accountInitial = computed(() => String(accountDisplayName.value).trim().charAt(0).toUpperCase() || '?')
const accountRoleLabel = computed(() =>
  account.session?.role === 'admin' ? t('auth.roleAdmin') : t('auth.roleEditor')
)

const passwordRules = computed(() => ({
  current: [{ required: true, message: t('auth.passwordRequired'), trigger: 'blur' }],
  next: [
    {
      validator: (_rule, value, callback) => {
        if (String(value || '').length < PASSWORD_MIN_LENGTH) {
          callback(new Error(t('auth.passwordTooShort', { min: PASSWORD_MIN_LENGTH })))
        } else callback()
      },
      trigger: 'blur'
    }
  ],
  confirm: [
    {
      validator: (_rule, value, callback) => {
        if (value !== passwordDialog.form.next) callback(new Error(t('auth.passwordMismatch')))
        else callback()
      },
      trigger: 'blur'
    }
  ]
}))

const layoutSections = [
  {
    key: 'rcm_portal_site_v1',
    title: 'admin.layoutSectionSite',
    fields: [
      { key: 'brand', label: 'admin.fieldBrand' },
      { key: 'authority', label: 'admin.fieldDepartment' },
      { key: 'footerNote', label: 'admin.fieldFooter', multiline: true },
      { key: 'contact', label: 'admin.fieldContact' }
    ]
  },
  {
    key: 'rcm_portal_hero_v1',
    title: 'admin.layoutSectionHero',
    fields: [
      { key: 'badge', label: 'admin.fieldBadge' },
      { key: 'eyebrow', label: 'admin.fieldEyebrow' },
      { key: 'title', label: 'admin.fieldTitle', multiline: true },
      { key: 'description', label: 'admin.fieldDescription', multiline: true },
      { key: 'primaryCta', label: 'admin.fieldPrimaryCta' },
      { key: 'secondaryCta', label: 'admin.fieldSecondaryCta' }
    ]
  },
  {
    key: 'rcm_portal_about_v1',
    title: 'admin.layoutSectionAbout',
    fields: [
      { key: 'title', label: 'admin.fieldTitle' },
      { key: 'body', label: 'admin.fieldBody', multiline: true },
      { key: 'statHouseholds', label: 'admin.fieldStatHouseholds', plain: true },
      { key: 'statAgencies', label: 'admin.fieldStatAgencies', plain: true },
      { key: 'statCoverage', label: 'admin.fieldStatCoverage', plain: true }
    ]
  }
]

const editorConfigs = [
  {
    type: 'news',
    tabLabel: 'admin.tabNews',
    addLabel: 'admin.addNews',
    editLabel: 'admin.editNews',
    displayField: 'title',
    metaColumn: { key: 'date', label: 'common.date' },
    metaFields: [
      { key: 'date', label: 'common.date', type: 'date' },
      { key: 'sort', label: 'common.sort', type: 'number' },
      { key: 'visible', label: 'common.visible', type: 'switch' },
      { key: 'cover', label: 'common.url', tip: 'admin.imageUrlTip' }
    ],
    i18nFields: [
      { key: 'category', label: 'common.category' },
      { key: 'title', label: 'common.title' },
      { key: 'summary', label: 'common.description', multiline: true }
    ]
  },
  {
    type: 'video',
    tabLabel: 'admin.tabVideo',
    addLabel: 'admin.addVideo',
    editLabel: 'admin.editVideo',
    displayField: 'title',
    metaColumn: { key: 'duration', label: 'common.duration' },
    metaFields: [
      { key: 'duration', label: 'common.duration' },
      { key: 'sort', label: 'common.sort', type: 'number' },
      { key: 'visible', label: 'common.visible', type: 'switch' },
      { key: 'cover', label: 'common.url', tip: 'admin.imageUrlTip' },
      { key: 'url', label: 'admin.videoUrlTip', tip: 'admin.videoUrlTip' }
    ],
    i18nFields: [
      { key: 'title', label: 'common.title' },
      { key: 'description', label: 'common.description', multiline: true }
    ]
  },
  {
    type: 'faq',
    tabLabel: 'admin.tabFaq',
    addLabel: 'admin.addFaq',
    editLabel: 'admin.editFaq',
    displayField: 'question',
    metaFields: [
      { key: 'sort', label: 'common.sort', type: 'number' },
      { key: 'visible', label: 'common.visible', type: 'switch' }
    ],
    i18nFields: [
      { key: 'question', label: 'common.question' },
      { key: 'answer', label: 'common.answer', multiline: true }
    ]
  },
  {
    type: 'app',
    tabLabel: 'admin.tabApps',
    addLabel: 'common.add',
    editLabel: 'common.edit',
    displayField: 'title',
    metaColumn: { key: 'platform', label: 'common.platform' },
    metaFields: [
      { key: 'platform', label: 'common.platform' },
      { key: 'href', label: 'common.url' },
      { key: 'sort', label: 'common.sort', type: 'number' },
      { key: 'visible', label: 'common.visible', type: 'switch' }
    ],
    i18nFields: [
      { key: 'title', label: 'common.title' },
      { key: 'description', label: 'common.description', multiline: true }
    ]
  }
]

const layoutDraft = reactive({})
const rows = computed(() => Object.fromEntries(editorConfigs.map((config) => [config.type, list(config.type)])))
const dialog = reactive({ visible: false, mode: 'add', type: 'news', key: '', lang: 'zh', form: {} })
const currentConfig = computed(() => editorConfigs.find((config) => config.type === dialog.type) || editorConfigs[0])

function i18nFields(section) {
  return section.fields.filter((field) => !field.plain)
}

function plainFields(section) {
  return section.fields.filter((field) => field.plain)
}

function loadSections() {
  const layout = normalizePortalLayout(get(PORTAL_LAYOUT_KEY))
  sectionsDraft.order = [...layout.order]
  sectionsDraft.hidden = [...layout.hidden]
}

function resetSections() {
  const fallback = defaultPortalLayout()
  sectionsDraft.order = [...fallback.order]
  sectionsDraft.hidden = []
}

async function saveSections() {
  saving.value = true
  try {
    await upsert(PORTAL_LAYOUT_KEY, {
      order: [...sectionsDraft.order],
      hidden: [...sectionsDraft.hidden],
      updatedAt: new Date().toISOString()
    })
    ElMessage.success(t('admin.sectionsSaved'))
    refreshPreview()
  } finally {
    saving.value = false
  }
}

function loadLayout() {
  for (const section of layoutSections) {
    const value = get(section.key)
    const draft = {}
    for (const field of section.fields) {
      draft[field.key] = field.plain
        ? String(value[field.key] ?? '')
        : { ...emptyLocalized(), ...(value[field.key] || {}) }
    }
    layoutDraft[section.key] = draft
  }
  layoutReady.value = true
}

async function saveLayout() {
  saving.value = true
  try {
    for (const section of layoutSections) {
      const next = { ...get(section.key) }
      for (const field of section.fields) {
        next[field.key] = field.plain
          ? layoutDraft[section.key][field.key]
          : { ...layoutDraft[section.key][field.key] }
      }
      await upsert(section.key, next)
    }
    ElMessage.success(t('common.saved'))
    refreshPreview()
  } finally {
    saving.value = false
  }
}

function localized(value, field) {
  return pickLocalized(value?.[field], currentLang.value)
}

function blankForm(config) {
  const form = {}
  for (const field of config.i18nFields) form[field.key] = emptyLocalized()
  for (const field of config.metaFields) {
    if (field.type === 'switch') form[field.key] = true
    else if (field.type === 'number') form[field.key] = list(config.type).length + 1
    else form[field.key] = ''
  }
  return form
}

function openAdd(type) {
  const config = editorConfigs.find((item) => item.type === type)
  dialog.type = type
  dialog.mode = 'add'
  dialog.key = `${PORTAL_KEY_PREFIX}${type}_${Date.now().toString(36)}`
  dialog.lang = 'zh'
  dialog.form = blankForm(config)
  dialog.visible = true
}

function openEdit(type, row) {
  const config = editorConfigs.find((item) => item.type === type)
  const form = JSON.parse(JSON.stringify(row.value))
  for (const field of config.i18nFields) form[field.key] = { ...emptyLocalized(), ...(form[field.key] || {}) }
  for (const field of config.metaFields) {
    if (form[field.key] == null) form[field.key] = field.type === 'switch' ? true : field.type === 'number' ? 0 : ''
  }
  dialog.type = type
  dialog.mode = 'edit'
  dialog.key = row.key
  dialog.lang = 'zh'
  dialog.form = form
  dialog.visible = true
}

async function saveItem() {
  saving.value = true
  try {
    await upsert(dialog.key, dialog.form)
    dialog.visible = false
    ElMessage.success(t('common.saved'))
    refreshPreview()
  } finally {
    saving.value = false
  }
}

async function removeItem(row) {
  await ElMessageBox.confirm(t('common.confirmDelete'), t('common.confirm'), {
    type: 'warning',
    confirmButtonText: t('common.delete'),
    cancelButtonText: t('common.cancel')
  })
  await remove(row.key)
  ElMessage.success(t('common.deleted'))
  refreshPreview()
}

async function resetAll() {
  await ElMessageBox.confirm(t('admin.resetConfirm'), t('common.confirm'), {
    type: 'warning',
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel')
  })
  await reset()
  loadLayout()
  loadSections()
  ElMessage.success(t('admin.resetDone'))
  refreshPreview()
}

function refreshPreview() {
  previewKey.value += 1
}

function openPortal() {
  window.open('/#/portal', '_blank', 'noopener')
}

function onAccountCommand(command) {
  if (command === 'password') {
    passwordDialog.form = { current: '', next: '', confirm: '' }
    passwordDialog.visible = true
    return
  }
  if (command === 'logout') {
    logout()
    ElMessage.success(t('auth.logoutDone'))
    router.replace('/login')
  }
}

async function submitPassword() {
  const valid = await passwordFormRef.value?.validate().catch(() => false)
  if (!valid) return
  passwordDialog.saving = true
  try {
    await changePassword(passwordDialog.form.current, passwordDialog.form.next)
    ElMessage.success(t('auth.passwordChanged'))
    passwordDialog.visible = false
  } catch (error) {
    ElMessage.error(t(errorKey(error), errorParams(error)))
  } finally {
    passwordDialog.saving = false
  }
}

onMounted(async () => {
  await ensureLoaded()
  loadSections()
  loadLayout()
})
</script>

<style scoped>
.admin-page { min-height: 100vh; padding-bottom: 60px; }
.admin-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; padding-block: 44px 24px; }
.header-copy h1 { margin: 10px 0 6px; font-size: clamp(26px, 3vw, 36px); }
.header-copy p { margin: 0; color: var(--portal-muted); font-size: 14px; }
.header-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }

.account-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border: 1px solid var(--portal-border);
  border-radius: 999px;
  background: var(--portal-canvas);
  color: var(--portal-text);
  cursor: pointer;
}
.account-chip:hover { border-color: var(--portal-primary); }
.account-avatar { background: var(--portal-primary-soft); color: var(--portal-primary); font-size: 12px; }
.account-copy { display: flex; flex-direction: column; line-height: 1.2; text-align: start; }
.account-copy strong { font-size: 12px; }
.account-copy small { color: var(--portal-muted); font-size: 10px; }
.account-caret { color: var(--portal-muted); font-size: 12px; }

.admin-tip { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; padding: 12px 16px; border-radius: 8px; background: var(--portal-primary-soft); color: var(--portal-primary); font-size: 13px; }
.tip-error { margin-inline-start: auto; color: #b44; }
.admin-content { padding: 24px; border: 1px solid var(--portal-border); border-radius: var(--portal-radius); background: var(--portal-canvas); }
.panel-pad { padding: 22px; }
.layout-editor { display: flex; flex-direction: column; gap: 20px; }
.layout-section { padding: 22px; }
.section-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.section-heading h2 { margin: 0; font-size: 17px; }
.section-heading span { color: var(--portal-muted); font-size: 11px; }
.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.lang-tabs { margin-top: 10px; }
.save-row { display: flex; justify-content: flex-end; margin-top: 18px; }
.list-toolbar { display: flex; gap: 10px; margin-bottom: 16px; }
.content-table { width: 100%; }
.cell-title { font-weight: 600; }
.meta-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.preview-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 12px; color: var(--portal-muted); font-size: 12px; }
.preview-toolbar > div { display: flex; gap: 8px; }
.preview-frame { width: 100%; height: calc(100vh - 150px); border: 1px solid var(--portal-border); border-radius: 8px; background: #fff; }
.field-tip { margin: 6px 0 0; color: var(--portal-muted); font-size: 11px; line-height: 1.6; }

@media (max-width: 900px) {
  .admin-header { flex-direction: column; align-items: flex-start; }
  .field-grid, .meta-grid { grid-template-columns: 1fr; }
}
</style>
