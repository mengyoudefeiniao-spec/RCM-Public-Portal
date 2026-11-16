<template>
  <div class="user-manager">
    <div class="user-toolbar">
      <el-button type="primary" @click="openCreate">
        <el-icon><Plus /></el-icon>
        {{ $t('admin.addUser') }}
      </el-button>
      <el-input
        v-model="keyword"
        class="user-search"
        clearable
        :placeholder="$t('admin.searchUser')"
        :prefix-icon="Search"
      />
      <span class="user-count num-ltr">{{ filtered.length }} / {{ state.users.length }}</span>
    </div>

    <el-alert
      class="user-alert"
      type="warning"
      :closable="false"
      show-icon
      :title="$t('admin.userHint')"
    />

    <el-table :data="filtered" border class="user-table" row-key="username">
      <el-table-column :label="$t('common.username')" min-width="170">
        <template #default="{ row }">
          <div class="user-cell">
            <el-avatar :size="28" class="user-avatar">{{ initialOf(row) }}</el-avatar>
            <div class="user-identity">
              <strong class="num-ltr">{{ row.username }}</strong>
              <small v-if="isSelfRow(row)">{{ $t('auth.signedInAs') }}</small>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="displayName" :label="$t('common.displayName')" min-width="150" />

      <el-table-column :label="$t('common.role')" width="130">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'success' : 'info'" effect="plain" size="small">
            {{ row.role === 'admin' ? $t('auth.roleAdmin') : $t('auth.roleEditor') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.active')" width="110" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.active"
            :disabled="isSelfRow(row)"
            @change="(value) => toggleActive(row, value)"
          />
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.lastLogin')" width="190">
        <template #default="{ row }">
          <span class="last-login" :class="{ muted: !row.lastLoginAt }">
            {{ row.lastLoginAt ? formatDate(row.lastLoginAt) : $t('admin.lastLoginNever') }}
          </span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.actions')" width="240" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">{{ $t('common.edit') }}</el-button>
          <el-button link type="primary" @click="openReset(row)">{{ $t('admin.resetUserPassword') }}</el-button>
          <el-button
            link
            type="danger"
            :disabled="isSelfRow(row)"
            @click="removeUser(row)"
          >
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!filtered.length" :description="$t('common.noData')" />

    <!-- 新增 / 编辑 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.mode === 'create' ? $t('admin.addUser') : $t('admin.editUser')"
      width="min(520px, 94vw)"
      destroy-on-close
    >
      <el-form ref="formRef" :model="dialog.form" :rules="rules" label-position="top">
        <el-form-item :label="$t('common.username')" prop="username">
          <el-input
            v-model="dialog.form.username"
            :disabled="dialog.mode === 'edit'"
            :placeholder="$t('auth.usernameInvalid')"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item :label="$t('common.displayName')" prop="displayName">
          <el-input v-model="dialog.form.displayName" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t('common.role')" prop="role">
          <el-select v-model="dialog.form.role" class="full-width">
            <el-option :label="$t('auth.roleAdmin')" value="admin" />
            <el-option :label="$t('auth.roleEditor')" value="editor" />
          </el-select>
          <p class="field-tip">{{ $t('admin.roleTip') }}</p>
        </el-form-item>
        <el-form-item v-if="dialog.mode === 'create'" :label="$t('common.password')" prop="password">
          <el-input
            v-model="dialog.form.password"
            type="password"
            show-password
            autocomplete="new-password"
            :placeholder="$t('auth.passwordHint')"
          />
        </el-form-item>
        <el-form-item v-if="dialog.mode === 'create'" :label="$t('auth.confirmPassword')" prop="confirm">
          <el-input
            v-model="dialog.form.confirm"
            type="password"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item :label="$t('common.active')">
          <div class="switch-row">
            <el-switch v-model="dialog.form.active" :disabled="dialog.mode === 'edit' && isSelf" />
            <span class="field-tip inline">{{ $t('admin.activeTip') }}</span>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="submit">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>

    <!-- 重置密码 -->
    <el-dialog
      v-model="resetDialog.visible"
      :title="$t('admin.resetUserPassword')"
      width="min(480px, 94vw)"
      destroy-on-close
    >
      <p class="reset-target num-ltr">{{ resetDialog.username }}</p>
      <el-form ref="resetFormRef" :model="resetDialog" :rules="resetRules" label-position="top">
        <el-form-item :label="$t('auth.newPassword')" prop="password">
          <el-input
            v-model="resetDialog.password"
            type="password"
            show-password
            autocomplete="new-password"
            :placeholder="$t('auth.passwordHint')"
          />
        </el-form-item>
        <el-form-item :label="$t('auth.confirmPassword')" prop="confirm">
          <el-input
            v-model="resetDialog.confirm"
            type="password"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
      </el-form>
      <p class="field-tip">{{ $t('admin.resetPasswordHint') }}</p>
      <template #footer>
        <el-button @click="resetDialog.visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="submitReset">
          {{ $t('common.save') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { useAccount } from '@/stores/account.js'
import { PASSWORD_MIN_LENGTH, USERNAME_PATTERN } from '@/services/users.js'
import { errorKey, errorParams } from '@/services/errors.js'
import { currentLang } from '@/locales/index.js'

const { t } = useI18n()
const { state, ensureUsersLoaded, createUser, updateUser, deleteUser } = useAccount()

const keyword = ref('')
const saving = ref(false)
const formRef = ref(null)
const resetFormRef = ref(null)
const sessionName = computed(() => String(state.session?.username || '').toLowerCase())

const dialog = reactive({
  visible: false,
  mode: 'create',
  form: { username: '', displayName: '', role: 'editor', active: true, password: '', confirm: '' }
})

const resetDialog = reactive({ visible: false, username: '', password: '', confirm: '' })

const isSelf = computed(
  () => dialog.mode === 'edit' && dialog.form.username.toLowerCase() === sessionName.value
)

function isSelfRow(row) {
  return String(row?.username || '').toLowerCase() === sessionName.value
}

const filtered = computed(() => {
  const term = keyword.value.trim().toLowerCase()
  if (!term) return state.users
  return state.users.filter(
    (user) =>
      user.username.toLowerCase().includes(term) ||
      String(user.displayName || '').toLowerCase().includes(term)
  )
})

const rules = computed(() => ({
  username: [
    { required: true, message: t('auth.usernameRequired'), trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (!USERNAME_PATTERN.test(String(value || '').trim())) callback(new Error(t('auth.usernameInvalid')))
        else callback()
      },
      trigger: 'blur'
    }
  ],
  role: [{ required: true, message: t('auth.roleInvalid'), trigger: 'change' }],
  password: [
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
        if (value !== dialog.form.password) callback(new Error(t('auth.passwordMismatch')))
        else callback()
      },
      trigger: 'blur'
    }
  ]
}))

const resetRules = computed(() => ({
  password: rules.value.password,
  confirm: [
    {
      validator: (_rule, value, callback) => {
        if (value !== resetDialog.password) callback(new Error(t('auth.passwordMismatch')))
        else callback()
      },
      trigger: 'blur'
    }
  ]
}))

function toMessage(error) {
  ElMessage.error(t(errorKey(error), errorParams(error)))
}

function initialOf(user) {
  return String(user.displayName || user.username || '?').trim().charAt(0).toUpperCase()
}

function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  try {
    return new Intl.DateTimeFormat(currentLang.value, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date)
  } catch {
    return date.toLocaleString()
  }
}

function openCreate() {
  dialog.mode = 'create'
  dialog.form = { username: '', displayName: '', role: 'editor', active: true, password: '', confirm: '' }
  dialog.visible = true
}

function openEdit(row) {
  dialog.mode = 'edit'
  dialog.form = {
    username: row.username,
    displayName: row.displayName,
    role: row.role,
    active: row.active,
    password: '',
    confirm: ''
  }
  dialog.visible = true
}

function openReset(row) {
  resetDialog.username = row.username
  resetDialog.password = ''
  resetDialog.confirm = ''
  resetDialog.visible = true
}

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (dialog.mode === 'create') {
      await createUser({
        username: dialog.form.username,
        displayName: dialog.form.displayName,
        role: dialog.form.role,
        active: dialog.form.active,
        password: dialog.form.password
      })
      ElMessage.success(t('admin.userSaved'))
    } else {
      await updateUser(dialog.form.username, {
        displayName: dialog.form.displayName,
        role: dialog.form.role,
        active: dialog.form.active
      })
      ElMessage.success(t('admin.userSaved'))
    }
    dialog.visible = false
  } catch (error) {
    toMessage(error)
  } finally {
    saving.value = false
  }
}

async function submitReset() {
  const valid = await resetFormRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    await updateUser(resetDialog.username, { password: resetDialog.password })
    ElMessage.success(t('auth.passwordChanged'))
    resetDialog.visible = false
  } catch (error) {
    toMessage(error)
  } finally {
    saving.value = false
  }
}

async function toggleActive(row, value) {
  try {
    await updateUser(row.username, { active: value })
    ElMessage.success(t('admin.userSaved'))
  } catch (error) {
    toMessage(error)
  }
}

async function removeUser(row) {
  try {
    await ElMessageBox.confirm(
      t('admin.deleteUserConfirm', { name: row.displayName || row.username }),
      t('common.confirm'),
      { type: 'warning', confirmButtonText: t('common.delete'), cancelButtonText: t('common.cancel') }
    )
  } catch {
    return
  }
  try {
    await deleteUser(row.username)
    ElMessage.success(t('admin.userDeleted'))
  } catch (error) {
    toMessage(error)
  }
}

onMounted(ensureUsersLoaded)
</script>

<style scoped>
.user-manager { display: flex; flex-direction: column; gap: 16px; }
.user-toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.user-search { width: min(320px, 100%); }
.user-count { color: var(--portal-muted); font-size: 12px; margin-inline-start: auto; }
.user-alert { border-radius: 10px; }
.user-table { width: 100%; }

.user-cell { display: flex; align-items: center; gap: 10px; }
.user-avatar { background: var(--portal-primary-soft); color: var(--portal-primary); font-size: 13px; }
.user-identity { display: flex; flex-direction: column; line-height: 1.3; }
.user-identity strong { font-size: 13px; }
.user-identity small { color: var(--portal-primary); font-size: 10px; }
.last-login { font-size: 12px; }
.last-login.muted { color: var(--portal-muted); }

.field-tip { margin: 6px 0 0; color: var(--portal-muted); font-size: 11px; line-height: 1.6; }
.field-tip.inline { margin: 0; }
.switch-row { display: flex; align-items: center; gap: 10px; }
.full-width { width: 100%; }
.reset-target {
  margin: 0 0 16px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--portal-panel);
  font-size: 13px;
  font-weight: 600;
}
</style>
