<script setup>
import { X } from "@lucide/vue";

defineEmits(["close"]);
</script>

<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content glass-panel" @click.stop>
      <div class="modal-header">
        <h3 class="gradient-text-primary">{{ $t("updates.title") }}</h3>
        <button
          @click="$emit('close')"
          class="btn-icon"
          :title="$t('app.close')"
        >
          <X :size="20" />
        </button>
      </div>
      <div class="modal-body" v-html="$t('updates.content')"></div>
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
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #0f172a;
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

:deep(.updates-list) {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

:deep(.updates-list li) {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-muted);
  position: relative;
  padding-left: 1.5rem;
}

:deep(.updates-list li::before) {
  content: "✨";
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.9rem;
}

:deep(.updates-list li strong) {
  color: var(--text-main);
}
</style>
