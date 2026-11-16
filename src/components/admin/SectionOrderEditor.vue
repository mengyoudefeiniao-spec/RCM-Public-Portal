<template>
  <section class="order-editor">
    <div class="order-head">
      <div class="order-copy">
        <h2>{{ $t('admin.sectionsTitle') }}</h2>
        <p>{{ $t('admin.sectionsHint') }}</p>
      </div>
      <el-button @click="$emit('reset')">
        <el-icon><RefreshLeft /></el-icon>
        {{ $t('admin.resetOrder') }}
      </el-button>
    </div>

    <ul class="order-list">
      <li
        v-for="(sectionId, index) in order"
        :key="sectionId"
        class="order-item"
        :class="{ 'is-dragging': dragIndex === index, 'is-hidden': hidden.includes(sectionId) }"
        draggable="true"
        @dragstart="onDragStart(index, $event)"
        @dragover.prevent="onDragOver(index)"
        @dragend="dragIndex = null"
        @drop.prevent="dragIndex = null"
      >
        <span class="drag-handle" :title="$t('admin.dragHint')" :aria-label="$t('admin.dragHint')">
          <el-icon><Rank /></el-icon>
        </span>

        <span class="order-index num-ltr">{{ index + 1 }}</span>

        <span class="order-copy">
          <strong>{{ $t(SECTION_LABEL_KEYS[sectionId]) }}</strong>
          <small class="num-ltr">{{ sectionId }}</small>
        </span>

        <div class="order-actions">
          <el-button
            circle
            size="small"
            :disabled="index === 0"
            :aria-label="$t('admin.moveUp')"
            :title="$t('admin.moveUp')"
            @click="move(index, -1)"
          >
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button
            circle
            size="small"
            :disabled="index === order.length - 1"
            :aria-label="$t('admin.moveDown')"
            :title="$t('admin.moveDown')"
            @click="move(index, 1)"
          >
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <span
            class="visibility-label"
            :class="{ 'is-off': hidden.includes(sectionId) }"
            aria-hidden="true"
          >
            {{ hidden.includes(sectionId) ? $t('common.hidden') : $t('common.visible') }}
          </span>
          <el-switch
            :model-value="!hidden.includes(sectionId)"
            :aria-label="$t('common.visible')"
            @change="(value) => toggle(sectionId, value)"
          />
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowDown, ArrowUp, Rank, RefreshLeft } from '@element-plus/icons-vue'
import { SECTION_LABEL_KEYS } from '@/utils/layout.js'

const props = defineProps({
  order: { type: Array, required: true },
  hidden: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:order', 'update:hidden', 'reset'])

const dragIndex = ref(null)

function emitOrder(nextOrder) {
  emit('update:order', nextOrder)
}

function move(index, delta) {
  const target = index + delta
  if (target < 0 || target >= props.order.length) return
  const next = [...props.order]
  const [moved] = next.splice(index, 1)
  next.splice(target, 0, moved)
  emitOrder(next)
}

function toggle(sectionId, visible) {
  const next = visible
    ? props.hidden.filter((id) => id !== sectionId)
    : [...new Set([...props.hidden, sectionId])]
  emit('update:hidden', next)
}

function onDragStart(index, event) {
  dragIndex.value = index
  if (event?.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

function onDragOver(index) {
  if (dragIndex.value === null || dragIndex.value === index) return
  const next = [...props.order]
  const [moved] = next.splice(dragIndex.value, 1)
  next.splice(index, 0, moved)
  dragIndex.value = index
  emitOrder(next)
}
</script>

<style scoped>
.order-editor { display: flex; flex-direction: column; gap: 18px; }
.order-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.order-head h2 { margin: 0 0 6px; font-size: 17px; }
.order-head p { margin: 0; color: var(--portal-muted); font-size: 13px; line-height: 1.7; }

.order-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }

.order-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border: 1px solid var(--portal-border);
  border-radius: 10px;
  background: var(--portal-canvas);
  transition: border-color 0.2s, box-shadow 0.2s, opacity 0.2s;
}

.order-item:hover { border-color: var(--portal-primary); }
.order-item.is-dragging { opacity: 0.55; border-style: dashed; }
.order-item.is-hidden { background: var(--portal-panel); }

.drag-handle {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  color: var(--portal-muted);
  cursor: grab;
  flex-shrink: 0;
}
.drag-handle:active { cursor: grabbing; }
.drag-handle:hover { background: var(--portal-primary-soft); color: var(--portal-primary); }

.order-index {
  width: 22px;
  color: var(--portal-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.order-item .order-copy { display: flex; flex-direction: column; gap: 2px; margin-inline-end: auto; }
.order-item .order-copy strong { font-size: 14px; }
.order-item .order-copy small { color: var(--portal-muted); font-size: 11px; }

.order-actions { display: flex; align-items: center; gap: 8px; }
.visibility-label {
  min-width: 3em;
  color: var(--portal-primary);
  font-size: 11px;
  font-weight: 600;
  text-align: end;
}
.visibility-label.is-off { color: var(--portal-muted); }

@media (max-width: 720px) {
  .order-head { flex-direction: column; }
  .order-item { flex-wrap: wrap; }
  .order-actions { width: 100%; justify-content: flex-end; }
}
</style>
