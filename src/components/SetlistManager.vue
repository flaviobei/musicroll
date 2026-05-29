<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { 
  Plus, Trash2, FolderPlus, Music, ChevronUp, ChevronDown, 
  X, Check, Layers, AlertCircle, PlayCircle
} from '@lucide/vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['show-notification', 'open-presentation'])

const setlists = ref([])
const availableSongs = ref([])
const activeSetlist = ref(null)
const activeSetlistSongs = ref([])

const newSetName = ref('')
const loading = ref(false)
const loadingSongs = ref(false)

const totalDuration = computed(() => {
  return activeSetlistSongs.value.reduce((acc, song) => acc + Number(song.duration || 4), 0)
})

const isDemo = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('seu-projeto-supabase')

// Fetch all setlists
const fetchSetlists = async () => {
  loading.value = true
  try {
    if (isDemo) {
      const local = localStorage.getItem('musicroll_setlists')
      setlists.value = local ? JSON.parse(local) : []
    } else {
      if (!props.user) {
        setlists.value = []
        return
      }
      const { data, error } = await supabase
        .from('setlists')
        .select('*')
        .eq('user_id', props.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setlists.value = data
    }
  } catch (error) {
    console.error('Erro ao buscar setlists:', error)
  } finally {
    loading.value = false
  }
}

// Fetch all available songs to add to setlist
const fetchSongs = async () => {
  try {
    if (isDemo) {
      const local = localStorage.getItem('musicroll_songs')
      availableSongs.value = local ? JSON.parse(local) : []
    } else {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', props.user.id)
        .order('title', { ascending: true })

      if (error) throw error
      availableSongs.value = data
    }
  } catch (error) {
    console.error('Erro ao buscar músicas:', error)
  }
}

// Fetch songs within active setlist
const fetchSetlistSongs = async (setlistId) => {
  loadingSongs.value = true
  try {
    if (isDemo) {
      const local = localStorage.getItem(`musicroll_setlist_songs_${setlistId}`)
      activeSetlistSongs.value = local ? JSON.parse(local) : []
    } else {
      // Supabase query joining setlist_songs with songs
      const { data, error } = await supabase
        .from('setlist_songs')
        .select(`
          id,
          order_index,
          custom_scroll_speed,
          song:songs(*)
        `)
        .eq('setlist_id', setlistId)
        .order('order_index', { ascending: true })

      if (error) throw error
      
      // Map to keep schema identical
      activeSetlistSongs.value = data.map(item => ({
        ...item.song, // title, artist, content, bpm, etc.
        id: item.id, // Relation ID OVERWRITES song.id!
        song_id: item.song.id, // Explicitly keep song id for reference
        order_index: item.order_index,
        custom_scroll_speed: item.custom_scroll_speed
      })).filter(song => song.title) // remove any null songs
    }
  } catch (error) {
    console.error('Erro ao carregar músicas da setlist:', error)
  } finally {
    loadingSongs.value = false
  }
}

// Create a new setlist
const createSetlist = async () => {
  if (!newSetName.value.trim()) return

  try {
    const newSet = {
      name: newSetName.value.trim(),
      user_id: props.user ? props.user.id : null
    }

    if (isDemo) {
      const local = localStorage.getItem('musicroll_setlists')
      const localSetlists = local ? JSON.parse(local) : []
      const newLocalSet = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now(),
        ...newSet,
        created_at: new Date().toISOString()
      }
      localSetlists.unshift(newLocalSet)
      localStorage.setItem('musicroll_setlists', JSON.stringify(localSetlists))
      setlists.value = localSetlists
      selectSetlist(newLocalSet)
    } else {
      if (!props.user) {
        emit('show-notification', { type: 'error', message: 'Faça login para criar setlists em nuvem.' })
        return
      }
      const { data, error } = await supabase
        .from('setlists')
        .insert([newSet])
        .select()

      if (error) throw error
      setlists.value.unshift(data[0])
      selectSetlist(data[0])
    }

    newSetName.value = ''
    emit('show-notification', { type: 'success', message: 'Setlist criada com sucesso!' })
  } catch (error) {
    emit('show-notification', { type: 'error', message: 'Erro ao criar setlist.' })
  }
}

// Delete a setlist
const deleteSetlist = async (id) => {
  if (!confirm('Deseja realmente excluir esta setlist?')) return

  try {
    if (isDemo) {
      const local = localStorage.getItem('musicroll_setlists')
      let localSetlists = local ? JSON.parse(local) : []
      localSetlists = localSetlists.filter(s => s.id !== id)
      localStorage.setItem('musicroll_setlists', JSON.stringify(localSetlists))
      setlists.value = localSetlists
      
      // Clean up relations
      localStorage.removeItem(`musicroll_setlist_songs_${id}`)
    } else {
      const { error } = await supabase
        .from('setlists')
        .delete()
        .eq('id', id)

      if (error) throw error
      setlists.value = setlists.value.filter(s => s.id !== id)
    }

    if (activeSetlist.value?.id === id) {
      activeSetlist.value = null
      activeSetlistSongs.value = []
    }
    emit('show-notification', { type: 'success', message: 'Setlist excluída.' })
  } catch (error) {
    emit('show-notification', { type: 'error', message: 'Erro ao excluir setlist.' })
  }
}

// Select a setlist to view details
const selectSetlist = (setlist) => {
  activeSetlist.value = setlist
  fetchSetlistSongs(setlist.id)
}

// Add song to active setlist
const addSongToSetlist = async (song) => {
  if (!activeSetlist.value) return

  // Check if already in setlist
  if (activeSetlistSongs.value.some(s => s.song_id === song.id || s.id === song.id)) {
    emit('show-notification', { type: 'info', message: 'Esta música já faz parte desta setlist.' })
    return
  }

  try {
    const orderIndex = activeSetlistSongs.value.length
    
    if (isDemo) {
      const localKey = `musicroll_setlist_songs_${activeSetlist.value.id}`
      const local = localStorage.getItem(localKey)
      const list = local ? JSON.parse(local) : []
      
      const newRelation = {
        id: song.id, // local relation uses the song id
        song_id: song.id,
        order_index: orderIndex,
        ...song
      }
      list.push(newRelation)
      localStorage.setItem(localKey, JSON.stringify(list))
      activeSetlistSongs.value.push(newRelation)
    } else {
      const newRelation = {
        setlist_id: activeSetlist.value.id,
        song_id: song.id,
        order_index: orderIndex
      }
      const { data, error } = await supabase
        .from('setlist_songs')
        .insert([newRelation])
        .select()

      if (error) throw error
      
      // Reload
      fetchSetlistSongs(activeSetlist.value.id)
    }
    
    emit('show-notification', { type: 'success', message: `${song.title} adicionada à setlist.` })
  } catch (error) {
    emit('show-notification', { type: 'error', message: 'Erro ao adicionar música.' })
  }
}

// Remove song from setlist
const removeSongFromSetlist = async (relationId) => {
  if (!activeSetlist.value) return

  try {
    if (isDemo) {
      const localKey = `musicroll_setlist_songs_${activeSetlist.value.id}`
      const local = localStorage.getItem(localKey)
      let list = local ? JSON.parse(local) : []
      list = list.filter(s => s.id !== relationId)
      
      // Re-index remaining songs
      list.forEach((s, idx) => s.order_index = idx)
      
      localStorage.setItem(localKey, JSON.stringify(list))
      activeSetlistSongs.value = list
    } else {
      const { error } = await supabase
        .from('setlist_songs')
        .delete()
        .eq('id', relationId)

      if (error) throw error
      
      // Reload
      fetchSetlistSongs(activeSetlist.value.id)
    }

    emit('show-notification', { type: 'info', message: 'Música removida da setlist.' })
  } catch (error) {
    emit('show-notification', { type: 'error', message: 'Erro ao remover música.' })
  }
}

// Move song up/down (Reorder)
const moveSong = async (index, direction) => {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= activeSetlistSongs.value.length) return

  // Swap locally
  const list = [...activeSetlistSongs.value]
  const temp = list[index]
  list[index] = list[targetIndex]
  list[targetIndex] = temp

  // Reassign order_index
  list.forEach((item, idx) => {
    item.order_index = idx
  })

  activeSetlistSongs.value = list

  // Save changes
  try {
    if (isDemo) {
      const localKey = `musicroll_setlist_songs_${activeSetlist.value.id}`
      localStorage.setItem(localKey, JSON.stringify(list))
    } else {
      // In Supabase, update both relations
      // A quick transaction or parallel updates
      const updates = list.map(item => {
        return supabase
          .from('setlist_songs')
          .update({ order_index: item.order_index })
          .eq('id', item.id)
      })
      await Promise.all(updates)
    }
  } catch (error) {
    console.error('Erro ao salvar nova ordem:', error)
  }
}

const startPresentation = () => {
  if (activeSetlistSongs.value.length === 0) {
    emit('show-notification', { type: 'error', message: 'Adicione pelo menos uma música para iniciar a apresentação.' })
    return
  }
  emit('open-presentation', {
    setlist: activeSetlist.value,
    songs: activeSetlistSongs.value
  })
}

const quickStartSetlist = async (setId) => {
  const set = setlists.value.find(s => s.id === setId)
  if (!set) return
  
  if (activeSetlist.value?.id !== setId) {
    selectSetlist(set)
  }
  
  await fetchSetlistSongs(setId)
  
  if (activeSetlistSongs.value.length === 0) {
    emit('show-notification', { type: 'error', message: 'Setlist vazia. Adicione músicas primeiro.' })
    return
  }
  
  emit('open-presentation', {
    setlist: set,
    songs: activeSetlistSongs.value
  })
}

onMounted(() => {
  fetchSetlists()
  fetchSongs()
})
</script>

<template>
  <div class="setlist-container">
    <div class="glass-panel setlist-card">
      <h3 class="gradient-text-primary mb-4">Gerenciador de Setlists</h3>

      <div v-if="!isDemo && !user" class="login-warning">
        <AlertCircle :size="24" class="warning-icon" />
        <div>
          <h5>Faça login para criar setlists</h5>
          <p>As setlists são associadas à sua conta na nuvem para manter a segurança do banco.</p>
        </div>
      </div>

      <!-- Setlists Workspace -->
      <div v-else class="setlist-workspace">
        
        <!-- COLUNA ESQUERDA: LISTA DE SETLISTS & CADASTRO -->
        <div class="setlists-sidebar">
          <form @submit.prevent="createSetlist" class="create-setlist-form">
            <div class="form-group mb-2">
              <label class="form-label" for="new-setlist-name">Nova Setlist</label>
              <div class="input-with-icon">
                <FolderPlus class="input-icon" :size="16" />
                <input 
                  id="new-setlist-name" 
                  type="text" 
                  v-model="newSetName" 
                  placeholder="Ex: Show de Sexta" 
                  class="form-input form-input-sm"
                  required 
                />
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-sm btn-block">
              <Plus :size="14" />
              <span>Criar Setlist</span>
            </button>
          </form>

          <div class="setlists-menu">
            <h4 class="section-title">Minhas Setlists</h4>
            <div v-if="loading" class="sidebar-loading">
              <span class="spinner"></span>
            </div>
            <div v-else-if="setlists.length === 0" class="sidebar-empty">
              Nenhuma setlist criada.
            </div>
            <div v-else class="setlists-list">
              <div 
                v-for="set in setlists" 
                :key="set.id" 
                :class="['setlist-item', { active: activeSetlist?.id === set.id }]"
                @click="selectSetlist(set)"
              >
                <span class="set-name">📁 {{ set.name }}</span>
                <div class="set-actions-sidebar">
                  <button @click.stop="quickStartSetlist(set.id)" class="btn-quick-play" title="Iniciar Apresentação">
                    <PlayCircle :size="16" />
                  </button>
                  <button @click.stop="deleteSetlist(set.id)" class="btn-delete-set" title="Excluir Setlist">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- COLUNA DIREITA: DETALHES DA SETLIST SELECIONADA -->
        <div class="setlist-details">
          <div v-if="activeSetlist" class="active-set-pane">
            <div class="set-header">
              <div>
                <h4>📂 {{ activeSetlist.name }}</h4>
                <span class="song-count">{{ activeSetlistSongs.length }} música(s)</span>
              </div>
              <button 
                @click="startPresentation" 
                class="btn btn-primary pulse-glow" 
                :disabled="activeSetlistSongs.length === 0"
              >
                ⚡ Iniciar Apresentação
              </button>
            </div>

            <!-- GRAFICO BPM E TONS (Fluxo de Energia) -->
            <div v-if="activeSetlistSongs.length > 0" class="bpm-flow-chart">
              <div class="bpm-chart-title">
                Fluxo de Energia (BPM)
                <span class="estimated-time">| Duração Estimada: {{ totalDuration }} min</span>
              </div>
              <div class="bpm-chart-container">
                <div 
                  v-for="song in activeSetlistSongs" 
                  :key="'chart-'+song.id"
                  class="bpm-bar-wrapper"
                  :title="song.title + ' - ' + (song.bpm || 120) + ' BPM'"
                >
                  <div 
                    class="bpm-bar"
                    :class="{
                      'bg-azul': Number(song.bpm || 120) < 50,
                      'bg-verde': Number(song.bpm || 120) >= 50 && Number(song.bpm || 120) < 90,
                      'bg-laranja': Number(song.bpm || 120) >= 90 && Number(song.bpm || 120) <= 120,
                      'bg-vermelho': Number(song.bpm || 120) > 120
                    }"
                    :style="{ height: Math.min(100, Math.max(10, (Number(song.bpm || 120) / 200) * 100)) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="bpm-tone-sequence">
                <div v-for="song in activeSetlistSongs" :key="'tone-'+song.id" class="tone-badge-small">
                  {{ song.tone || '-' }}
                </div>
              </div>
            </div>

            <div class="details-grid">
              <!-- MÚSICAS DA SETLIST -->
              <div class="setlist-songs-pane">
                <h5 class="sub-pane-title">Ordem das Músicas</h5>
                
                <div v-if="loadingSongs" class="pane-loading">
                  <span class="spinner"></span>
                </div>
                <div v-else-if="activeSetlistSongs.length === 0" class="pane-empty">
                  Arraste ou adicione músicas à direita.
                </div>
                <div v-else class="setlist-songs-list">
                  <div 
                    v-for="(song, index) in activeSetlistSongs" 
                    :key="song.id" 
                    class="setlist-song-item"
                    :class="{
                      'bpm-azul': Number(song.bpm || 120) < 50,
                      'bpm-verde': Number(song.bpm || 120) >= 50 && Number(song.bpm || 120) < 90,
                      'bpm-laranja': Number(song.bpm || 120) >= 90 && Number(song.bpm || 120) <= 120,
                      'bpm-vermelho': Number(song.bpm || 120) > 120
                    }"
                  >
                    <div class="song-order-num">{{ index + 1 }}</div>
                    <div class="song-info">
                      <h6>{{ song.title }}</h6>
                      <p>
                        {{ song.artist }} | {{ song.bpm }} BPM
                        <span v-if="song.tone">| Tom: {{ song.tone }}</span>
                        <span v-if="song.duration">| ⏱️ {{ song.duration }}m</span>
                      </p>
                    </div>

                    <!-- Actions: Move Up, Move Down, Delete -->
                    <div class="song-order-actions">
                      <button 
                        @click="moveSong(index, -1)" 
                        :disabled="index === 0" 
                        class="btn-order" 
                        title="Subir"
                      >
                        <ChevronUp :size="14" />
                      </button>
                      <button 
                        @click="moveSong(index, 1)" 
                        :disabled="index === activeSetlistSongs.length - 1" 
                        class="btn-order" 
                        title="Descer"
                      >
                        <ChevronDown :size="14" />
                      </button>
                      <button 
                        @click="removeSongFromSetlist(song.id)" 
                        class="btn-order btn-remove" 
                        title="Remover"
                      >
                        <X :size="14" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- MÚSICAS DISPONÍVEIS PARA ADICIONAR -->
              <div class="available-songs-pane">
                <h5 class="sub-pane-title">Acervo de Músicas</h5>
                <div v-if="availableSongs.length === 0" class="pane-empty">
                  Nenhuma música cadastrada no acervo.
                </div>
                <div v-else class="available-songs-list">
                  <div 
                    v-for="song in availableSongs" 
                    :key="song.id" 
                    class="available-song-item"
                    :class="{
                      'bpm-azul': Number(song.bpm || 120) < 50,
                      'bpm-verde': Number(song.bpm || 120) >= 50 && Number(song.bpm || 120) < 90,
                      'bpm-laranja': Number(song.bpm || 120) >= 90 && Number(song.bpm || 120) <= 120,
                      'bpm-vermelho': Number(song.bpm || 120) > 120
                    }"
                  >
                    <div class="song-info">
                      <h6>{{ song.title }}</h6>
                      <p>{{ song.artist }}</p>
                    </div>
                    <button @click="addSongToSetlist(song)" class="btn-add-song" title="Adicionar à Setlist">
                      <Plus :size="14" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="no-set-selected">
            <Layers :size="48" class="placeholder-icon" />
            <p>Selecione ou crie uma Setlist na barra lateral para começar a organizar seu show!</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.mb-2 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1.5rem; }

.setlist-card {
  border-radius: var(--radius-lg);
  padding: 2.5rem;
}

.login-warning {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  background: rgba(239, 68, 68, 0.05);
  border: 1px dashed rgba(239, 68, 68, 0.25);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  align-items: center;
}

.warning-icon {
  color: var(--accent-danger);
  flex-shrink: 0;
}

.login-warning h5 {
  color: var(--text-main);
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.login-warning p {
  font-size: 0.85rem;
}

.setlist-workspace {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.setlists-sidebar {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding-right: 2rem;
}

.form-input-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--text-muted);
}

.form-input-sm {
  padding-left: 2.25rem;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.setlists-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setlist-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  padding: 0.6rem 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.setlist-item:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.1);
}

.setlist-item.active {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.4);
  color: #c084fc;
}

.set-name {
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.set-actions-sidebar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-quick-play {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 4px;
}

.btn-quick-play:hover {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.btn-delete-set {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 4px;
}

.btn-delete-set:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

/* Gráfico de BPM */
.bpm-flow-chart {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: 1.25rem;
}

.bpm-chart-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
  display: flex;
  justify-content: space-between;
}

.estimated-time {
  color: #fcd34d;
}

.bpm-chart-container {
  display: flex;
  align-items: flex-end;
  height: 60px;
  gap: 4px;
}

.bpm-tone-sequence {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 0.5rem;
}

.tone-badge-small {
  flex: 1;
  text-align: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: #c084fc;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 4px;
  padding: 0.1rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bpm-bar-wrapper {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px 4px 0 0;
  position: relative;
}

.bpm-bar-wrapper:hover {
  background: rgba(255, 255, 255, 0.1);
}

.bpm-bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease-out;
}

.bg-azul { background-color: #3b82f6; }
.bg-verde { background-color: #10b981; }
.bg-laranja { background-color: #f97316; }
.bg-vermelho { background-color: #ef4444; }

.setlist-details {
  flex: 1;
  min-height: 450px;
}

.no-set-selected {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  text-align: center;
  padding: 3rem;
  background: rgba(15, 23, 42, 0.2);
  border-radius: var(--radius-md);
  border: 1px dashed rgba(255, 255, 255, 0.05);
}

.placeholder-icon {
  margin-bottom: 1rem;
  color: rgba(139, 92, 246, 0.3);
}

.no-set-selected p {
  font-size: 0.95rem;
  max-width: 320px;
  line-height: 1.5;
}

.active-set-pane {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.set-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 1rem;
}

.set-header h4 {
  font-size: 1.3rem;
  font-weight: 700;
}

.song-count {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.details-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1.5rem;
  height: 100%;
}

.setlist-songs-pane, .available-songs-pane {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  max-height: 480px;
}

.sub-pane-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pane-empty {
  text-align: center;
  padding: 3rem 1rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.setlist-songs-list, .available-songs-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  overflow-y: auto;
  flex: 1;
  padding-right: 0.25rem;
}

.setlist-song-item, .available-song-item {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-sm);
  padding: 0.6rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: border-color var(--transition-fast);
}

.setlist-song-item:hover, .available-song-item:hover {
  border-color: rgba(255, 255, 255, 0.08);
}

.bpm-azul { border-left: 3px solid #3b82f6 !important; }
.bpm-verde { border-left: 3px solid #10b981 !important; }
.bpm-laranja { border-left: 3px solid #f97316 !important; }
.bpm-vermelho { border-left: 3px solid #ef4444 !important; }

.song-order-num {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.2);
  color: #c084fc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.song-info {
  flex: 1;
}

.song-info h6 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

.song-info p {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.song-order-actions {
  display: flex;
  gap: 0.25rem;
}

.btn-order {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-order:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-main);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-order:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.btn-order.btn-remove:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}

.btn-add-song {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #34d399;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.btn-add-song:hover {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.4);
  transform: scale(1.05);
}

/* Spinner for loading state */
.sidebar-loading, .pane-loading {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.sidebar-empty {
  font-size: 0.8rem;
  color: var(--text-muted);
  padding: 1rem 0;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 800px) {
  .setlist-workspace {
    flex-direction: column;
  }
  .setlists-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding-right: 0;
    padding-bottom: 2rem;
  }
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
