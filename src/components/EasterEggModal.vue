<script setup>
import { X } from "@lucide/vue";

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close"]);
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <h3 class="gradient-text-primary">{{ $t("nerd.title") }}</h3>
        <button
          @click="$emit('close')"
          class="btn-icon-only text-muted"
          :title="$t('app.close')"
        >
          <X :size="20" />
        </button>
      </div>
      <div class="modal-body custom-scrollbar" v-html="$t('nerd.content')"></div>
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
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  max-height: min(85vh, 600px);
  display: flex;
  flex-direction: column;
  padding: 2rem;
  overflow: hidden;
  animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.modal-body {
  overflow-y: auto;
  padding-right: 0.5rem;
  color: var(--text-secondary);
  line-height: 1.6;
  flex-grow: 1;
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  .modal-content {
    padding: 1.25rem;
    max-height: min(90vh, 600px);
  }
  .modal-header {
    margin-bottom: 1rem;
  }
}

:deep(p) {
  margin-bottom: 1rem;
}

:deep(.updates-list) {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

:deep(.updates-list li) {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

:deep(.updates-list li::before) {
  content: "•";
  color: #a855f7;
  font-size: 1.5rem;
  position: absolute;
  left: 0;
  top: -4px;
}

:deep(strong) {
  color: var(--text-main);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
