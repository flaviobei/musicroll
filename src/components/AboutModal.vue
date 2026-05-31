<script setup>
import { X } from '@lucide/vue'

defineEmits(['close'])
</script>

<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content glass-panel" @click.stop>
      <div class="modal-header">
        <h3 class="gradient-text">{{ $t('about.title') }}</h3>
        <button @click="$emit('close')" class="btn-icon" :title="$t('app.close')">
          <X :size="20" />
        </button>
      </div>
      <div class="modal-body" v-html="$t('about.content')"></div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--text-muted);
  line-height: 1.6;
}
</style>
