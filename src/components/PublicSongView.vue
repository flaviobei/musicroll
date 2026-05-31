<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { parseAndTranspose } from '../lib/chordParser'
import DOMPurify from 'dompurify'

const props = defineProps({ songId: String })

const song = ref(null)
const loading = ref(true)
const notFound = ref(false)

onMounted(async () => {
  const { data, error } = await supabase
    .from('songs')
    .select('title, artist, tone, bpm, content, notes')
    .eq('id', props.songId)
    .eq('is_public', true)
    .single()

  if (error || !data) {
    notFound.value = true
  } else {
    song.value = data
  }
  loading.value = false
})

const parsedContent = (content) => {
  const sanitized = DOMPurify.sanitize(content, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  return parseAndTranspose(sanitized, 0)
}
</script>

<template>
  <div class="public-view glass-panel">
    <div v-if="loading" class="loading-state">
      <span class="spinner"></span> Carregando cifra...
    </div>

    <div v-else-if="notFound" class="empty-state">
      <p>🔒 Esta cifra não existe ou não está pública.</p>
      <a href="/" class="btn btn-primary" style="margin-top: 1rem;">Abrir MusicRoll</a>
    </div>

    <div v-else>
      <div style="margin-bottom: 1.5rem;">
        <h2 class="gradient-text-primary">{{ song.title }}</h2>
        <p class="text-muted">{{ song.artist }}
          <span v-if="song.tone"> · Tom: {{ song.tone }}</span>
          <span> · {{ song.bpm }} BPM</span>
        </p>
        <p v-if="song.notes" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
          {{ song.notes }}
        </p>
      </div>

      <pre class="chord-pre" v-html="parsedContent(song.content)"></pre>

      <div style="margin-top: 2rem; text-align: center; font-size: 0.8rem; color: var(--text-muted);">
        Compartilhado via <a href="/" style="color: #c084fc;">MusicRoll</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.public-view {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: var(--radius-lg);
}
.chord-pre {
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  line-height: 1.6;
}
</style>
