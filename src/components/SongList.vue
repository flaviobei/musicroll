<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { supabase } from '../lib/supabase'
import { 
  Play, Pause, RotateCcw, ChevronRight, Music, User, 
  ChevronLeft, Trash2, ArrowUp, ArrowDown, Eye, Sliders,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Edit3, SkipBack, SkipForward
} from '@lucide/vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['show-notification', 'edit-song'])

const songs = ref([])
const loading = ref(false)
const activeSong = ref(null)

// Auto-Scroll State
const isScrolling = ref(false)
const activeSpeed = ref(1.0)
const readerPanel = ref(null)
let animationId = null
let lastTime = 0

// Immersive & Font Size Mobile Controls
const isImmersive = ref(false)
const fontSize = ref(1.0)
const isDemo = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('seu-projeto-supabase')

const toggleImmersive = () => {
  isImmersive.value = !isImmersive.value
  emit('show-notification', { 
    type: 'info', 
    message: isImmersive.value ? 'Modo Imersivo Ativo (Tela Cheia)' : 'Modo Padrão Ativo' 
  })
}

const adjustFontSize = (amount) => {
  fontSize.value = Math.max(0.5, Math.min(2.2, Number((fontSize.value + amount).toFixed(1))))
}

// Fetch songs from Supabase or LocalStorage fallback
const fetchSongs = async () => {
  loading.value = true
  try {
    if (isDemo.value || isDemo) throw new Error('Modo Demo ativo')

    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    songs.value = data
  } catch (error) {
    console.warn('Buscando músicas localmente:', error.message)
    const local = localStorage.getItem('musicroll_songs')
    songs.value = local ? JSON.parse(local) : []
  } finally {
    loading.value = false
  }
}

// Delete a song from Supabase or LocalStorage
const deleteSong = async (id, songUserId) => {
  if (!isDemo && !props.user) {
    emit('show-notification', { type: 'error', message: 'Você precisa estar logado para excluir músicas.' })
    return
  }
  if (!isDemo && songUserId && songUserId !== props.user.id) {
    emit('show-notification', { type: 'error', message: 'Você só pode excluir músicas que você mesmo cadastrou.' })
    return
  }

  if (!confirm('Deseja realmente excluir esta música?')) return

  try {
    if (isDemo) {
      const local = localStorage.getItem('musicroll_songs')
      let localSongs = local ? JSON.parse(local) : []
      localSongs = localSongs.filter(s => s.id !== id)
      localStorage.setItem('musicroll_songs', JSON.stringify(localSongs))
      songs.value = localSongs
    } else {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id)

      if (error) throw error
      songs.value = songs.value.filter(s => s.id !== id)
    }

    if (activeSong.value?.id === id) {
      closePlayer()
    }
    emit('show-notification', { type: 'success', message: 'Música excluída com sucesso.' })
  } catch (error) {
    console.error('Erro ao excluir música:', error)
    emit('show-notification', { type: 'error', message: error.message || 'Erro ao excluir no banco de dados.' })
  }
}

// Open Player Mode with Fullscreen and Setlist context
const playlistSongs = ref([])
const isSetlistMode = computed(() => playlistSongs.value.length > 0)

const openPlayer = (song, playlist = []) => {
  activeSong.value = song
  activeSpeed.value = 1.0 // Multiplicador dinâmico de refinamento (1.0x)
  isScrolling.value = false
  playlistSongs.value = playlist
  
  // Ativa automaticamente o Modo Imersivo para performance
  isImmersive.value = true
  
  // Reset scrolling position
  setTimeout(() => {
    if (readerPanel.value) {
      readerPanel.value.scrollTop = 0
    }
  }, 50)
}

const closePlayer = () => {
  stopScroll()
  activeSong.value = null
  isImmersive.value = false
  fontSize.value = 1.0
  playlistSongs.value = []
}

// Helpers para transição de Setlist (Próxima Música e Anterior)
const getNextSong = () => {
  if (!activeSong.value || playlistSongs.value.length === 0) return null
  const currentIndex = playlistSongs.value.findIndex(s => s.song_id === activeSong.value.id || s.id === activeSong.value.id)
  if (currentIndex !== -1 && currentIndex < playlistSongs.value.length - 1) {
    return playlistSongs.value[currentIndex + 1]
  }
  return null
}

const playNextSong = () => {
  const next = getNextSong()
  if (next) {
    openPlayer(next, playlistSongs.value)
  }
}

const getPrevSong = () => {
  if (!activeSong.value || playlistSongs.value.length === 0) return null
  const currentIndex = playlistSongs.value.findIndex(s => s.song_id === activeSong.value.id || s.id === activeSong.value.id)
  if (currentIndex > 0) {
    return playlistSongs.value[currentIndex - 1]
  }
  return null
}

const playPrevSong = () => {
  const prev = getPrevSong()
  if (prev) {
    openPlayer(prev, playlistSongs.value)
  }
}

// Auto-Scroll Core using requestAnimationFrame (Calculado pelo BPM da Música!)
const scrollStep = (timestamp) => {
  if (!isScrolling.value || !readerPanel.value) return

  if (!lastTime) lastTime = timestamp
  const elapsed = timestamp - lastTime
  
  // Cálculo de velocidade proporcional ao BPM:
  // Base: 120 BPM com multiplicador 1.0x consome ~0.35 pixels por frame
  const songBpm = Number(activeSong.value.bpm || 120)
  const pixelsToScroll = (songBpm / 120) * activeSpeed.value * (elapsed * 0.035)
  
  readerPanel.value.scrollTop += pixelsToScroll

  // Stop if we reach the bottom of the container
  const maxScroll = readerPanel.value.scrollHeight - readerPanel.value.clientHeight
  if (readerPanel.value.scrollTop >= maxScroll - 1) {
    stopScroll()
    emit('show-notification', { type: 'info', message: 'Fim da música alcançado.' })
  } else {
    lastTime = timestamp
    animationId = requestAnimationFrame(scrollStep)
  }
}

const startScroll = () => {
  if (isScrolling.value) return
  isScrolling.value = true
  lastTime = 0
  animationId = requestAnimationFrame(scrollStep)
}

const stopScroll = () => {
  isScrolling.value = false
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

const toggleScroll = () => {
  if (isScrolling.value) {
    stopScroll()
  } else {
    startScroll()
  }
}

const resetScroll = () => {
  stopScroll()
  if (readerPanel.value) {
    readerPanel.value.scrollTop = 0
  }
}

const adjustSpeed = (amount) => {
  activeSpeed.value = Math.max(0.1, Math.min(5.0, Number((activeSpeed.value + amount).toFixed(1))))
}

// Listen for updates from external sources (e.g. new song created)
defineExpose({
  refresh: fetchSongs,
  openPlayer
})

watch(activeSong, (newVal) => {
  if (newVal) {
    document.body.classList.add('immersive-active')
  } else {
    document.body.classList.remove('immersive-active')
  }
})

onMounted(() => {
  fetchSongs()
})

onUnmounted(() => {
  stopScroll()
  document.body.classList.remove('immersive-active')
})
</script>

<template>
  <div class="song-list-container">
    <!-- 1. ACTIVE PLAYER VIEW -->
    <div v-if="activeSong" class="glass-panel player-panel" :class="{ 'setlist-mode': isSetlistMode }">
      
      <!-- Scroll Action Bar (NOW AT TOP) -->
      <div class="player-controls mini-controls">
        <div class="control-group">
          <button @click="adjustSpeed(-0.5)" class="btn btn-secondary btn-icon-only" title="Diminuir Velocidade">
            <ArrowDown :size="16" />
          </button>
          <button @click="toggleScroll" :class="['btn', isScrolling ? 'btn-danger' : 'btn-primary']" title="Play/Pause">
            <Pause v-if="isScrolling" :size="20" />
            <Play v-else :size="20" />
          </button>
          <button @click="adjustSpeed(0.5)" class="btn btn-secondary btn-icon-only" title="Aumentar Velocidade">
            <ArrowUp :size="16" />
          </button>
        </div>
        
        <div class="control-group">
          <button @click="fontSize = Math.max(0.8, fontSize - 0.1)" class="btn btn-secondary btn-icon-only" title="Diminuir Fonte">
            <ZoomOut :size="16" />
          </button>
          <button @click="fontSize = Math.min(2.5, fontSize + 0.1)" class="btn btn-secondary btn-icon-only" title="Aumentar Fonte">
            <ZoomIn :size="16" />
          </button>
          <button @click="resetScroll" class="btn btn-secondary btn-icon-only" title="Voltar ao Início">
            <RotateCcw :size="16" />
          </button>
        </div>
      </div>

      <!-- PRE CONTAINER -->
      <div class="pre-container" ref="readerPanel">
        <pre class="chord-pre" :style="{ fontSize: `${fontSize}rem` }">{{ activeSong.content }}</pre>

        <!-- Próxima Música da Setlist (Se houver playlist ativa) -->
        <div v-if="getNextSong() && !isSetlistMode" class="next-song-footer">
          <div class="next-song-info">
            <span class="next-song-label">Próxima da Setlist</span>
            <span class="next-song-title">{{ getNextSong().title }}</span>
            <span class="song-artist">{{ getNextSong().artist }}</span>
          </div>
          <button @click="playNextSong" class="btn btn-next-song">
            Próxima Música ➔
          </button>
        </div>
      </div>

      <!-- HEADERS (NOW AT BOTTOM) -->
      <div v-if="!isSetlistMode" class="player-header compact-header footer-header">
        <div class="header-main-row">
          <button @click="closePlayer" class="btn-back-small">
            <ChevronLeft :size="16" /> Voltar
          </button>
          <div class="song-meta-small">
            <strong>{{ activeSong.title }}</strong>
            <span v-if="activeSong.tone" class="badge-tone">{{ activeSong.tone }}</span>
            <span class="text-muted">| {{ activeSong.artist }}</span>
          </div>
          <div class="speed-badge-small">
            {{ activeSpeed.toFixed(1) }}x
          </div>
        </div>
        <div v-if="activeSong.notes" class="song-notes-banner">
          {{ activeSong.notes }}
        </div>
      </div>
      
      <div v-else class="setlist-top-bar footer-header">
        <button @click="closePlayer" class="btn-back-small">
          <ChevronLeft :size="16" /> Sair do Show
        </button>
        
        <div class="setlist-meta-center">
          <div class="song-title-setlist">
            {{ activeSong.title }} 
            <span v-if="activeSong.tone" class="badge-tone">{{ activeSong.tone }}</span>
          </div>
          <div v-if="activeSong.notes" class="song-notes-banner setlist-notes">
            {{ activeSong.notes }}
          </div>
        </div>

        <div class="setlist-nav-buttons">
          <button :disabled="!getPrevSong()" @click="playPrevSong" class="btn btn-secondary btn-icon-only btn-sm" title="Música Anterior">
            <SkipBack :size="18" />
          </button>
          <button :disabled="!getNextSong()" @click="playNextSong" class="btn btn-primary btn-icon-only btn-sm" title="Próxima Música">
            <SkipForward :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- 2. DEFAULT LIST VIEW -->
    <div v-else class="glass-panel list-panel">
      <h3 class="gradient-text-primary mb-4">Minhas Cifras</h3>

      <div v-if="loading" class="loading-state">
        <span class="spinner"></span>
        <span>Buscando cifras no banco de dados...</span>
      </div>

      <div v-else-if="songs.length === 0" class="empty-state">
        <div class="empty-icon">🎵</div>
        <p>Nenhuma música cadastrada ainda.</p>
        <p class="sub">Utilize o formulário de cadastro acima para registrar sua primeira cifra!</p>
      </div>

      <div v-else class="songs-grid">
        <div 
          v-for="song in songs" 
          :key="song.id" 
          class="song-item-card"
          :class="{
            'bpm-azul': Number(song.bpm || 120) < 50,
            'bpm-verde': Number(song.bpm || 120) >= 50 && Number(song.bpm || 120) < 90,
            'bpm-laranja': Number(song.bpm || 120) >= 90 && Number(song.bpm || 120) <= 120,
            'bpm-vermelho': Number(song.bpm || 120) > 120
          }"
        >
          <div class="song-info">
            <h4 class="song-title">{{ song.title }}</h4>
            <p class="song-artist">
              <User :size="14" style="vertical-align: middle; margin-right: 4px; display: inline-block;" />
              {{ song.artist }}
            </p>
            <div class="badge-row">
              <span class="badge speed-badge">🥁 {{ song.bpm || 120 }} BPM <span v-if="Number(song.bpm || 120) > 180">🌶️</span></span>
              <span v-if="song.user_id && user && song.user_id === user.id" class="badge owner-badge">Minha</span>
            </div>
          </div>

          <div class="song-actions">
            <button @click="openPlayer(song)" class="btn btn-primary btn-play-song">
              <Eye :size="16" />
              <span>Ver & Rolar</span>
            </button>
            <button 
              v-if="isDemo || (user && song.user_id === user.id)"
              @click="emit('edit-song', song)" 
              class="btn btn-secondary btn-icon-only" 
              title="Editar Cifra"
              style="background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.3); color: #c084fc;"
            >
              <Edit3 :size="16" />
            </button>
            <button 
              v-if="isDemo || (user && song.user_id === user.id)"
              @click="deleteSong(song.id, song.user_id)" 
              class="btn btn-danger btn-icon-only" 
              title="Excluir Cifra"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1.5rem;
}

.song-list-container {
  margin-top: 2rem;
}

.list-panel, .player-panel {
  border-radius: var(--radius-lg);
  padding: 2.5rem;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  font-weight: 500;
}

.empty-state .sub {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.song-item-card {
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  transition: all var(--transition-normal);
}

.song-item-card:hover {
  transform: translateY(-4px);
  border-color: rgba(168, 85, 247, 0.3);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  background: rgba(15, 23, 42, 0.6);
}

.song-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.song-artist {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.badge-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}

.owner-badge {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
}

.song-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-play-song {
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-icon-only {
  padding: 0.5rem;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* PLAYER SCROLL STYLING */
.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.song-meta h4 {
  font-size: 1.4rem;
  font-weight: 700;
}

.song-meta p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.speed-control-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.speed-control-header .label {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.player-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.btn-play {
  min-width: 180px;
}

.speed-adjusters {
  display: flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-sm);
  padding: 0.25rem;
  gap: 0.5rem;
}

.speed-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  padding: 0 0.5rem;
}

.pre-container {
  overflow-y: auto;
  position: relative;
}

.chord-pre {
  margin: 0;
  border: none;
  font-size: 1.15rem;
  font-weight: 600;
  color: #ffffff;
  padding: 0.5rem 0;
  white-space: pre-wrap;
}

.player-footer {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
}

/* Spinner animation */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .player-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .player-controls {
    width: 100%;
  }
  .btn-play {
    width: 100%;
  }
}
</style>
