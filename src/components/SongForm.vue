<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../lib/supabase'
import { PlusCircle, Music, User, Sliders, FileText, Plus, Minus } from '@lucide/vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  songToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['song-created', 'show-notification', 'cancel-edit'])

const title = ref('')
const artist = ref('')
const content = ref('')
const bpm = ref(120)
const duration = ref(4) // minutos
const tone = ref('')
const notes = ref('')
const loading = ref(false)

const fillForm = () => {
  if (props.songToEdit) {
    title.value = props.songToEdit.title || ''
    artist.value = props.songToEdit.artist || ''
    content.value = props.songToEdit.content || ''
    bpm.value = Number(props.songToEdit.bpm || 120)
    duration.value = Number(props.songToEdit.duration || 4)
    tone.value = props.songToEdit.tone || ''
    notes.value = props.songToEdit.notes || ''
  } else {
    title.value = ''
    artist.value = ''
    content.value = ''
    bpm.value = 120
    duration.value = 4
    tone.value = ''
    notes.value = ''
  }
}

onMounted(() => {
  fillForm()
})

watch(() => props.songToEdit, () => {
  fillForm()
}, { deep: true })

const loadSample = () => {
  title.value = 'Chove Chuva'
  artist.value = 'Jorge Ben Jor'
  content.value = `[Intro]
Em7  A7  Em7  A7

[Refrão]
Em7            A7
Chove chuva, chove sem parar
Em7            A7
Chove chuva, chove sem parar

[Primeira Parte]
Em7                   A7
Pois eu vou fazer uma prece
Em7               A7
Para a chuva de prata parar
Em7                     A7
Porque o meu amor está chegando
Em7                 A7
E ela não gosta de se molhar
Em7                      A7
E eu quero encontrar o meu amor
Em7                   A7
Sem nenhum respingo de chuva`
  bpm.value = 112
}

const handleSubmit = async () => {
  if (!title.value || !artist.value || !content.value) {
    emit('show-notification', { type: 'error', message: 'Por favor, preencha todos os campos obrigatórios.' })
    return
  }

  loading.value = true
  const isEditing = !!props.songToEdit
  
  try {
    const newSong = {
      title: title.value,
      artist: artist.value,
      content: content.value,
      default_scroll_speed: Number((bpm.value / 120).toFixed(2)),
      bpm: Number(bpm.value),
      duration: Number(duration.value),
      tone: tone.value,
      notes: notes.value,
      user_id: isEditing ? props.songToEdit.user_id : (props.user ? props.user.id : null)
    }

    const isDemo = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('seu-projeto-supabase')
    let savedSong = null

    if (isDemo) {
      const local = localStorage.getItem('musicroll_songs')
      let localSongs = local ? JSON.parse(local) : []
      
      if (isEditing) {
        const idx = localSongs.findIndex(s => s.id === props.songToEdit.id)
        if (idx !== -1) {
          localSongs[idx] = {
            ...localSongs[idx],
            ...newSong,
            id: props.songToEdit.id
          }
          localStorage.setItem('musicroll_songs', JSON.stringify(localSongs))
          savedSong = localSongs[idx]
        } else {
          throw new Error('Música não encontrada localmente.')
        }
      } else {
        const newLocalSong = {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now(),
          ...newSong,
          created_at: new Date().toISOString()
        }
        localSongs.unshift(newLocalSong)
        localStorage.setItem('musicroll_songs', JSON.stringify(localSongs))
        savedSong = newLocalSong
      }
    } else {
      if (isEditing) {
        const { data, error } = await supabase
          .from('songs')
          .update(newSong)
          .eq('id', props.songToEdit.id)
          .select()

        if (error) throw error
        savedSong = data[0]
      } else {
        const { data, error } = await supabase
          .from('songs')
          .insert([newSong])
          .select()

        if (error) throw error
        savedSong = data[0]
      }
    }

    // Clear form
    title.value = ''
    artist.value = ''
    content.value = ''
    bpm.value = 120

    emit('show-notification', { 
      type: 'success', 
      message: isEditing 
        ? (isDemo ? 'Música atualizada localmente!' : 'Música atualizada com sucesso!')
        : (isDemo ? 'Música cadastrada localmente!' : 'Música cadastrada com sucesso!') 
    })
    emit('song-created', savedSong)
  } catch (error) {
    console.error('Erro ao salvar música:', error)
    emit('show-notification', { 
      type: 'error', 
      message: error.message || 'Erro ao salvar música no banco de dados.' 
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="glass-panel form-card">
    <div class="form-header">
      <h3 class="gradient-text-primary">{{ songToEdit ? $t('songForm.editTitle') : $t('songForm.newTitle') }}</h3>
      <button v-if="!songToEdit" @click="loadSample" type="button" class="btn btn-secondary btn-sm">
        💡 {{ $t('songForm.loadSample') }}
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="song-form">
      <div class="row">
        <!-- Title Field -->
        <div class="form-group col-6">
          <label class="form-label" for="song-title">{{ $t('songForm.songName') }}</label>
          <div class="input-with-icon">
            <Music class="input-icon" :size="16" />
            <input 
              id="song-title" 
              type="text" 
              v-model="title" 
              placeholder="Ex: Hotel California" 
              class="form-input"
              required 
            />
          </div>
        </div>

        <!-- Artist Field -->
        <div class="form-group col-6">
          <label class="form-label" for="song-artist">{{ $t('songForm.artist') }}</label>
          <div class="input-with-icon">
            <User class="input-icon" :size="16" />
            <input 
              id="song-artist" 
              type="text" 
              v-model="artist" 
              placeholder="Ex: Eagles" 
              class="form-input"
              required 
            />
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Tone Field -->
        <div class="form-group col-6">
          <label class="form-label" for="song-tone">{{ $t('songForm.tone') }}</label>
          <div class="input-with-icon">
            <Music class="input-icon" :size="16" />
            <input 
              id="song-tone" 
              type="text" 
              v-model="tone" 
              placeholder="Ex: C, F#m" 
              class="form-input"
            />
          </div>
        </div>

        <!-- Duration Field -->
        <div class="form-group col-6">
          <label class="form-label" for="song-duration">{{ $t('songForm.duration') }}</label>
          <div class="input-with-icon">
            <Sliders class="input-icon" :size="16" />
            <input 
              id="song-duration" 
              type="number" 
              min="1" 
              v-model="duration" 
              placeholder="Ex: 4" 
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- BPM Input -->
      <div class="form-group">
        <div class="label-with-value">
          <label class="form-label" for="song-bpm">
            <Sliders :size="14" style="vertical-align: middle; margin-right: 4px;" />
            {{ $t('songForm.bpm') }}
          </label>
          <span class="speed-badge">{{ bpm }} BPM</span>
        </div>
        <div class="bpm-input-wrapper">
          <button type="button" @click="bpm = Math.max(40, bpm - 5)" class="btn btn-secondary btn-bpm-adjust">
            <Minus :size="16" />
          </button>
          <input 
            id="song-bpm" 
            type="number" 
            min="40" 
            max="300" 
            v-model="bpm"
            class="form-input bpm-number-input"
          />
          <button type="button" @click="bpm = Math.min(300, bpm + 5)" class="btn btn-secondary btn-bpm-adjust">
            <Plus :size="16" />
          </button>
          
          <div class="bpm-indicator">
            <span v-if="bpm < 80" class="badge-dot dot-slow">🔵 {{ $t('songForm.tempo.slow') }}</span>
            <span v-else-if="bpm <= 120" class="badge-dot dot-medium">🟣 {{ $t('songForm.tempo.medium') }}</span>
            <span v-else class="badge-dot dot-fast">💗 {{ $t('songForm.tempo.fast') }}</span>
          </div>
        </div>
      </div>

      <!-- Cifra Content Textarea -->
      <div class="form-group">
        <label class="form-label" for="song-content">
          <FileText :size="14" style="vertical-align: middle; margin-right: 4px;" />
          {{ $t('songForm.content') }}
        </label>
        <textarea 
          id="song-content" 
          v-model="content" 
          placeholder="Cole aqui a cifra e letra..." 
          class="form-textarea chord-textarea"
          required
        ></textarea>
        <span class="helper-text">
          {{ $t('songForm.helper') }}
        </span>
      </div>

      <!-- Notes Field -->
      <div class="form-group">
        <label class="form-label" for="song-notes">
          <FileText :size="14" style="vertical-align: middle; margin-right: 4px;" />
          {{ $t('songForm.notes') }}
        </label>
        <textarea 
          id="song-notes" 
          v-model="notes" 
          placeholder="Ex: Convenção no refrão..." 
          class="form-input" 
          rows="2"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn btn-secondary" style="margin-right: 10px;">
          {{ $t('songForm.cancel') }}
        </button>
        <button type="submit" class="btn btn-primary pulse-glow" :disabled="loading">
          <template v-if="loading">
            <span class="spinner"></span> {{ $t('app.loading') }}
          </template>
          <template v-else>
            <Save :size="16" /> {{ $t('songForm.save') }}
          </template>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-card {
  border-radius: var(--radius-lg);
  padding: 2.5rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.form-header h3 {
  font-size: 1.4rem;
  font-weight: 700;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  border-radius: var(--radius-sm);
}

.row {
  display: flex;
  gap: 1.5rem;
}

.col-6 {
  flex: 1;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-muted);
  pointer-events: none;
}

.form-input {
  padding-left: 2.5rem;
}

.label-with-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.bpm-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  padding: 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.05);
  flex-wrap: wrap;
  width: 100%;
}

.bpm-number-input {
  max-width: 90px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.5rem;
}

.btn-bpm-adjust {
  width: 42px;
  height: 42px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
}

.bpm-indicator {
  margin-left: auto;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge-dot {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
}

.dot-slow {
  background: rgba(6, 182, 212, 0.15);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: #22d3ee;
}

.dot-medium {
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #c084fc;
}

.dot-fast {
  background: rgba(236, 72, 153, 0.15);
  border: 1px solid rgba(236, 72, 153, 0.3);
  color: #f472b6;
}

.helper-text {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

/* Responsive Row */
@media (max-width: 640px) {
  .row {
    flex-direction: column;
    gap: 0;
  }
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
</style>
