# MusicRoll — Melhorias e Refactoring

Sugestões de melhoria identificadas após análise do código. Ordenadas por prioridade de impacto.

---

## 1. Extrair `isDemo` para um composable reutilizável

**Problema:** A mesma lógica está duplicada em 4 arquivos (`SongList.vue`, `SongForm.vue`, `Dashboard.vue`, `SetlistManager.vue`).

**Arquivo novo:** `src/composables/useDemo.js`

```js
// src/composables/useDemo.js
export function useDemo() {
  const isDemo =
    !import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL.includes('seu-projeto-supabase')

  return { isDemo }
}
```

**Em cada componente que usava a lógica inline**, substituir:

```diff
- const isDemo =
-   !import.meta.env.VITE_SUPABASE_URL ||
-   import.meta.env.VITE_SUPABASE_URL.includes('seu-projeto-supabase')
+ import { useDemo } from '../composables/useDemo'
+ const { isDemo } = useDemo()
```

Arquivos a atualizar:
- `src/components/SongList.vue`
- `src/components/SongForm.vue`
- `src/components/Dashboard.vue`
- `src/components/SetlistManager.vue`

---

## 2. Fade-out no fim do scroll + contagem regressiva no modo setlist

**Arquivo:** `src/components/SongList.vue`

### 2a. Adicionar estado de contagem regressiva

No `<script setup>`, adicionar após as refs existentes:

```diff
+ const countdownActive = ref(false)
+ const countdownValue = ref(5)
+ let countdownInterval = null
```

### 2b. Modificar `scrollStep` para iniciar countdown no modo setlist

Localizar o trecho onde o scroll para ao chegar no fim:

```diff
  if (readerPanel.value.scrollTop >= maxScroll - 1) {
    stopScroll()
-   emit('show-notification', { type: 'info', message: 'Fim da música alcançado.' })
+   if (isSetlistMode.value && getNextSong()) {
+     startCountdown()
+   } else {
+     emit('show-notification', { type: 'info', message: 'Fim da música alcançado.' })
+   }
  } else {
```

### 2c. Adicionar função `startCountdown`

```js
const startCountdown = () => {
  countdownActive.value = true
  countdownValue.value = 5
  countdownInterval = setInterval(() => {
    countdownValue.value--
    if (countdownValue.value <= 0) {
      clearInterval(countdownInterval)
      countdownActive.value = false
      playNextSong()
    }
  }, 1000)
}

const cancelCountdown = () => {
  clearInterval(countdownInterval)
  countdownActive.value = false
  countdownValue.value = 5
}
```

### 2d. Adicionar overlay de countdown no template

Localizar o `<div class="pre-container">` e adicionar o overlay logo antes do fechamento:

```diff
  <div class="pre-container" ref="readerPanel">
    <pre class="chord-pre" ...></pre>

+   <!-- Countdown para próxima música -->
+   <div v-if="countdownActive" class="countdown-overlay">
+     <p class="countdown-label">Próxima música em</p>
+     <span class="countdown-number">{{ countdownValue }}</span>
+     <p class="countdown-next-title">{{ getNextSong()?.title }}</p>
+     <button @click="cancelCountdown" class="btn btn-secondary btn-sm">Cancelar</button>
+   </div>
  </div>
```

### 2e. Adicionar estilos no `<style scoped>`

```css
.countdown-overlay {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10, 15, 30, 0.92);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(192, 132, 252, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  text-align: center;
}

.countdown-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.countdown-number {
  font-size: 3rem;
  font-weight: 700;
  color: #c084fc;
  line-height: 1;
}

.countdown-next-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
}
```

### 2f. Limpar interval ao desmontar

```diff
  onUnmounted(() => {
    stopScroll()
+   cancelCountdown()
    document.body.classList.remove('immersive-active')
  })
```

---

## 3. Busca global com atalho de teclado (Cmd/Ctrl + K)

**Arquivo novo:** `src/components/SpotlightSearch.vue`

```vue
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
          placeholder="Buscar música ou artista..."
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
          Nenhuma música encontrada
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
```

**Arquivo:** `src/App.vue`

Registrar o componente e o atalho de teclado:

```diff
+ import SpotlightSearch from './components/SpotlightSearch.vue'

+ const showSpotlight = ref(false)
+ const allSongs = ref([])

+ const handleGlobalKey = (e) => {
+   if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
+     e.preventDefault()
+     showSpotlight.value = true
+   }
+ }

  onMounted(() => {
    // ... código existente ...
+   window.addEventListener('keydown', handleGlobalKey)
+
+   // Carregar todas as músicas para o spotlight
+   supabase.from('songs').select('id, title, artist, bpm, tone')
+     .eq('user_id', /* user.value?.id */ '')
+     .then(({ data }) => { if (data) allSongs.value = data })
  })

+ onUnmounted(() => {
+   window.removeEventListener('keydown', handleGlobalKey)
+ })
```

No template, antes do `</div>` final do `app-container`:

```diff
+ <SpotlightSearch
+   v-if="showSpotlight && user"
+   :songs="allSongs"
+   @play="handlePlaySong"
+   @close="showSpotlight = false"
+ />
```

> Depois que o usuário logar e `allSongs` for populado, o atalho funciona de qualquer view do app.

---

## 4. Consolidar schema SQL em arquivo único

**Problema:** O schema está espalhado em 3 arquivos (`supabase_schema.sql`, `update_songs_bpm.sql`, `secure_rls_patch.sql`), com políticas conflitantes entre si.

**Ação:** Criar `supabase_schema_final.sql` consolidando tudo e deletar os três arquivos antigos.

```sql
-- supabase_schema_final.sql
-- Schema completo e atualizado. Execute do zero em novos projetos.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABELA: songs
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL CHECK (char_length(title) > 0),
    artist TEXT NOT NULL CHECK (char_length(artist) > 0),
    content TEXT NOT NULL,
    tone TEXT,
    notes TEXT,
    bpm INTEGER NOT NULL DEFAULT 120 CHECK (bpm > 0),
    duration INTEGER NOT NULL DEFAULT 4 CHECK (duration > 0),
    default_scroll_speed NUMERIC NOT NULL DEFAULT 1.0 CHECK (default_scroll_speed > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- RLS: songs (isolado por usuário)
CREATE POLICY "Usuários podem ver apenas suas próprias músicas"
ON public.songs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários autenticados podem inserir músicas"
ON public.songs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem atualizar suas próprias músicas"
ON public.songs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias músicas"
ON public.songs FOR DELETE USING (auth.uid() = user_id);


-- TABELA: setlists
CREATE TABLE IF NOT EXISTS public.setlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL CHECK (char_length(name) > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.setlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias setlists"
ON public.setlists FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias setlists"
ON public.setlists FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias setlists"
ON public.setlists FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias setlists"
ON public.setlists FOR DELETE USING (auth.uid() = user_id);


-- TABELA: setlist_songs
CREATE TABLE IF NOT EXISTS public.setlist_songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setlist_id UUID REFERENCES public.setlists(id) ON DELETE CASCADE NOT NULL,
    song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE NOT NULL,
    order_index INTEGER NOT NULL CHECK (order_index >= 0),
    custom_scroll_speed NUMERIC CHECK (custom_scroll_speed > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (setlist_id, song_id)
);

ALTER TABLE public.setlist_songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar músicas de suas setlists"
ON public.setlist_songs FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.setlists
        WHERE public.setlists.id = public.setlist_songs.setlist_id
        AND public.setlists.user_id = auth.uid()
    )
);
```

Arquivos a deletar do repositório:
```bash
git rm supabase_schema.sql update_songs_bpm.sql secure_rls_patch.sql
git add supabase_schema_final.sql
git commit -m "chore: consolidar schema SQL em arquivo único"
```

---

## Checklist

| # | Melhoria | Arquivos | Status |
|---|----------|----------|--------|
| 1 | Extrair `isDemo` para composable | `composables/useDemo.js` + 4 componentes | ☐ |
| 2 | Countdown entre músicas no modo setlist | `SongList.vue` | ☐ |
| 3 | Spotlight de busca com Cmd+K | `SpotlightSearch.vue` + `App.vue` | ☐ |
| 4 | Consolidar schema SQL | `supabase_schema_final.sql` | ☐ |
