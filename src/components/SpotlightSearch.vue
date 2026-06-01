<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Search, X } from '@lucide/vue'

const props = defineProps({
  songs: { type: Array, default: () => [] }
})

const emit = defineEmits(['play', 'close'])

const query = ref('')
const inputRef = ref(null)

const filtered = computed(() => {
  if (!query.value.trim()) return props.songs.slice(0, 8)
  const q = query.value.toLowerCase()
  return props.songs
    .filter(s => s.title?.toLowerCase().includes(q) || s.artist?.toLowerCase().includes(q))
    .slice(0, 8)
})

const select = (song) => {
  emit('play', song)
  emit('close')
}

const handleKey = (e) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  inputRef.value?.focus()
  window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
})
</script>

<template>
  <div class="spotlight-backdrop" @click.self="$emit('close')">
    <div class="spotlight-panel glass-panel">
      <div class="spotlight-input-row">
        <Search :size="18" class="spotlight-icon" />
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          :placeholder="$t('songs.search')"
          class="spotlight-input"
        />
        <button @click="$emit('close')" class="btn-icon-only">
          <X :size="16" />
        </button>
      </div>

      <div class="spotlight-results">
        <div
          v-for="song in filtered"
          :key="song.id"
          class="spotlight-item"
          @click="select(song)"
        >
          <div>
            <p class="spotlight-title">{{ song.title }}</p>
            <p class="spotlight-artist">{{ song.artist }} · {{ song.bpm }} BPM<span v-if="song.tone"> · {{ song.tone }}</span></p>
          </div>
          <span class="spotlight-enter">↵</span>
        </div>

        <div v-if="filtered.length === 0" class="spotlight-empty">
          {{ $t('songs.empty') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spotlight-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  z-index: 1000;
}

.spotlight-panel {
  width: 100%;
  max-width: 560px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  padding: 0;
}

.spotlight-input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.spotlight-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.spotlight-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.05rem;
  color: var(--text-main);
  font-family: inherit;
}

.spotlight-input::placeholder {
  color: var(--text-muted);
}

.spotlight-results {
  max-height: 360px;
  overflow-y: auto;
}

.spotlight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.25rem;
  cursor: pointer;
  transition: background 0.15s;
}

.spotlight-item:hover {
  background: rgba(168, 85, 247, 0.1);
}

.spotlight-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 0.15rem;
}

.spotlight-artist {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: 0;
}

.spotlight-enter {
  font-size: 0.85rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.spotlight-empty {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>
