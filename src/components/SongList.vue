<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { supabase } from "../lib/supabase";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Music,
  User,
  ChevronLeft,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Sliders,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Edit3,
  SkipBack,
  SkipForward,
  Search,
  Filter,
  Plus,
  Minus,
  Link
} from "@lucide/vue";
import { parseAndTranspose } from "../lib/chordParser";
import DOMPurify from "dompurify";
import { useDemo } from "../composables/useDemo";

const { isDemo } = useDemo();

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["show-notification", "edit-song"]);

const songs = ref([]);
const loading = ref(false);
const activeSong = ref(null);
const countdownActive = ref(false);
const countdownValue = ref(5);
let countdownInterval = null;

// Search & Sort State
const searchQuery = ref("");
const sortBy = ref("recent");

const filteredSongs = computed(() => {
  let result = [...songs.value];
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.artist?.toLowerCase().includes(q),
    );
  }
  if (sortBy.value === "title") {
    result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  } else if (sortBy.value === "artist") {
    result.sort((a, b) => (a.artist || "").localeCompare(b.artist || ""));
  }
  return result;
});

// Auto-Scroll State
const isScrolling = ref(false);
const activeSpeed = ref(1.0);
const readerPanel = ref(null);
let animationId = null;
let lastTime = 0;
let exactScrollTop = 0;

// Immersive & Font Size Mobile Controls
const isImmersive = ref(false);
const fontSize = ref(1.0);
const transposeLevel = ref(0);

const parsedSongContent = computed(() => {
  const raw = activeSong.value?.content || '';
  const sanitized = DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return parseAndTranspose(sanitized, transposeLevel.value);
});

const toggleImmersive = () => {
  isImmersive.value = !isImmersive.value;
  emit("show-notification", {
    type: "info",
    message: isImmersive.value
      ? "Modo Imersivo Ativo (Tela Cheia)"
      : "Modo Padrão Ativo",
  });
};

const adjustFontSize = (amount) => {
  fontSize.value = Math.max(
    0.5,
    Math.min(2.2, Number((fontSize.value + amount).toFixed(1))),
  );
};

// Fetch songs from Supabase or LocalStorage fallback
const fetchSongs = async () => {
  loading.value = true;
  try {
    if (isDemo.value || isDemo) throw new Error("Modo Demo ativo");

    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .eq("user_id", props.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    songs.value = data;
  } catch (error) {
    console.warn("Buscando músicas localmente:", error.message);
    const local = localStorage.getItem("musicroll_songs");
    songs.value = local ? JSON.parse(local) : [];
  } finally {
    loading.value = false;
  }
};

// Delete a song from Supabase or LocalStorage
const deleteSong = async (id, songUserId) => {
  if (!isDemo && !props.user) {
    emit("show-notification", {
      type: "error",
      message: "Você precisa estar logado para excluir músicas.",
    });
    return;
  }
  if (!isDemo && songUserId && songUserId !== props.user.id) {
    emit("show-notification", {
      type: "error",
      message: "Você só pode excluir músicas que você mesmo cadastrou.",
    });
    return;
  }

  if (!confirm("Deseja realmente excluir esta música?")) return;

  try {
    if (isDemo) {
      const local = localStorage.getItem("musicroll_songs");
      let localSongs = local ? JSON.parse(local) : [];
      localSongs = localSongs.filter((s) => s.id !== id);
      localStorage.setItem("musicroll_songs", JSON.stringify(localSongs));
      songs.value = localSongs;
    } else {
      const { error } = await supabase.from("songs").delete().eq("id", id);

      if (error) throw error;
      songs.value = songs.value.filter((s) => s.id !== id);
    }

    if (activeSong.value?.id === id) {
      closePlayer();
    }
    emit("show-notification", {
      type: "success",
      message: "Música excluída com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir música:", error);
    emit("show-notification", {
      type: "error",
      message: error.message || "Erro ao excluir no banco de dados.",
    });
  }
};

// Open Player Mode with Fullscreen and Setlist context
const playlistSongs = ref([]);
const isSetlistMode = computed(() => playlistSongs.value.length > 0);

const openPlayer = (song, playlist = []) => {
  activeSong.value = song;
  activeSpeed.value = 1.0; // Multiplicador dinâmico de refinamento (1.0x)
  isScrolling.value = false;
  playlistSongs.value = playlist;
  transposeLevel.value = 0;

  // Ativa automaticamente o Modo Imersivo para performance
  isImmersive.value = true;

  // Reset scrolling position
  setTimeout(() => {
    if (readerPanel.value) {
      readerPanel.value.scrollTop = 0;
    }
  }, 50);
};

const closePlayer = () => {
  stopScroll();
  activeSong.value = null;
  isImmersive.value = false;
  fontSize.value = 1.0;
  playlistSongs.value = [];
};

// Helpers para transição de Setlist (Próxima Música e Anterior)
const getNextSong = () => {
  if (!activeSong.value || playlistSongs.value.length === 0) return null;
  const currentIndex = playlistSongs.value.findIndex(
    (s) => s.song_id === activeSong.value.id || s.id === activeSong.value.id,
  );
  if (currentIndex !== -1 && currentIndex < playlistSongs.value.length - 1) {
    return playlistSongs.value[currentIndex + 1];
  }
  return null;
};

const playNextSong = () => {
  const next = getNextSong();
  if (next) {
    openPlayer(next, playlistSongs.value);
  }
};

const getPrevSong = () => {
  if (!activeSong.value || playlistSongs.value.length === 0) return null;
  const currentIndex = playlistSongs.value.findIndex(
    (s) => s.song_id === activeSong.value.id || s.id === activeSong.value.id,
  );
  if (currentIndex > 0) {
    return playlistSongs.value[currentIndex - 1];
  }
  return null;
};

const playPrevSong = () => {
  const prev = getPrevSong();
  if (prev) {
    openPlayer(prev, playlistSongs.value);
  }
};

const copyShareLink = (song) => {
  const url = `${window.location.origin}/#/song/${song.id}`;
  navigator.clipboard.writeText(url);
  emit("show-notification", { type: "success", message: "Link copiado!" });
};

const startCountdown = () => {
  countdownActive.value = true;
  countdownValue.value = 5;
  countdownInterval = setInterval(() => {
    countdownValue.value--;
    if (countdownValue.value <= 0) {
      clearInterval(countdownInterval);
      countdownActive.value = false;
      playNextSong();
    }
  }, 1000);
};

const cancelCountdown = () => {
  clearInterval(countdownInterval);
  countdownActive.value = false;
  countdownValue.value = 5;
};

// Auto-Scroll Core using requestAnimationFrame (Calculado pelo BPM da Música!)
const scrollStep = (timestamp) => {
  if (!isScrolling.value || !readerPanel.value) return;

  if (!lastTime) lastTime = timestamp;
  const elapsed = timestamp - lastTime;

  // Cálculo de velocidade proporcional ao BPM:
  // Base: 120 BPM com multiplicador 1.0x consome ~0.018 pixels por frame (metade da velocidade anterior)
  const songBpm = Number(activeSong.value.bpm || 120);
  const pixelsToScroll =
    (songBpm / 120) * activeSpeed.value * (elapsed * 0.018);

  // Sincroniza o acumulador caso o usuário tenha rolado a tela manualmente com o dedo/mouse
  if (Math.abs(readerPanel.value.scrollTop - exactScrollTop) > 2) {
    exactScrollTop = readerPanel.value.scrollTop;
  }

  exactScrollTop += pixelsToScroll;
  readerPanel.value.scrollTop = exactScrollTop;

  // Stop if we reach the bottom of the container
  const maxScroll =
    readerPanel.value.scrollHeight - readerPanel.value.clientHeight;
  if (readerPanel.value.scrollTop >= maxScroll - 1) {
    stopScroll();
    if (isSetlistMode.value && getNextSong()) {
      startCountdown();
    } else {
      emit("show-notification", {
        type: "info",
        message: "Fim da música alcançado.",
      });
    }
  } else {
    lastTime = timestamp;
    animationId = requestAnimationFrame(scrollStep);
  }
};

const startScroll = () => {
  if (isScrolling.value) return;
  isScrolling.value = true;
  lastTime = 0;
  exactScrollTop = readerPanel.value ? readerPanel.value.scrollTop : 0;
  animationId = requestAnimationFrame(scrollStep);
};

const stopScroll = () => {
  isScrolling.value = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};

const toggleScroll = () => {
  if (isScrolling.value) {
    stopScroll();
  } else {
    startScroll();
  }
};

const resetScroll = () => {
  stopScroll();
  if (readerPanel.value) {
    readerPanel.value.scrollTop = 0;
    exactScrollTop = 0;
  }
};

const adjustSpeed = (amount) => {
  activeSpeed.value = Math.max(
    0.1,
    Math.min(3.0, Number((activeSpeed.value + amount).toFixed(1))),
  );
};

// Listen for updates from external sources (e.g. new song created)
defineExpose({
  refresh: fetchSongs,
  openPlayer,
  activeSong,
});

watch(activeSong, (newVal) => {
  if (newVal) {
    document.body.classList.add("immersive-active");
    document.documentElement.classList.add("immersive-active");
  } else {
    document.body.classList.remove("immersive-active");
    document.documentElement.classList.remove("immersive-active");
  }
});

onMounted(() => {
  fetchSongs();
});

onUnmounted(() => {
  stopScroll();
  cancelCountdown();
  document.body.classList.remove("immersive-active");
  document.documentElement.classList.remove("immersive-active");
});
</script>

<template>
  <div class="song-list-container">
    <!-- 1. ACTIVE PLAYER VIEW -->
    <div
      v-if="activeSong"
      class="glass-panel player-panel"
      :class="{ 'setlist-mode': isSetlistMode }"
    >
      <!-- Scroll Action Bar (NOW AT TOP) -->
      <div class="player-controls mini-controls">
        <div class="control-group">
          <button
            @click="adjustSpeed(-0.1)"
            class="btn btn-secondary btn-icon-only"
            :title="$t('songs.slowDown')"
          >
            <ArrowDown :size="16" />
          </button>
          <button
            @click="toggleScroll"
            :class="['btn', isScrolling ? 'btn-danger' : 'btn-primary']"
            :title="$t('songs.playPause')"
          >
            <Pause v-if="isScrolling" :size="20" />
            <Play v-else :size="20" />
          </button>
          <button
            @click="adjustSpeed(0.1)"
            class="btn btn-secondary btn-icon-only"
            :title="$t('songs.speedUp')"
          >
            <ArrowUp :size="16" />
          </button>
        </div>

        <div class="control-group transpose-group">
          <button
            @click="transposeLevel--"
            class="btn btn-secondary btn-icon-only"
            :title="$t('songForm.transposeDown')"
          >
            <Minus :size="16" />
          </button>
          <div class="transpose-badge" :title="$t('songs.transposeBadge')">
            {{ transposeLevel > 0 ? '+' : '' }}{{ transposeLevel }}
          </div>
          <button
            @click="transposeLevel++"
            class="btn btn-secondary btn-icon-only"
            :title="$t('songForm.transposeUp')"
          >
            <Plus :size="16" />
          </button>
        </div>

        <div class="control-group">
          <button
            @click="fontSize = Math.max(0.8, fontSize - 0.1)"
            class="btn btn-secondary btn-icon-only"
            :title="$t('songs.decreaseFont')"
          >
            <ZoomOut :size="16" />
          </button>
          <button
            @click="fontSize = Math.min(2.5, fontSize + 0.1)"
            class="btn btn-secondary btn-icon-only"
            :title="$t('songs.increaseFont')"
          >
            <ZoomIn :size="16" />
          </button>
          <button
            @click="resetScroll"
            class="btn btn-secondary btn-icon-only"
            :title="$t('songs.scrollTop')"
          >
            <RotateCcw :size="16" />
          </button>
        </div>
      </div>

      <!-- PRE CONTAINER -->
      <div class="pre-container" ref="readerPanel">
        <pre class="chord-pre" :style="{ fontSize: `${fontSize}rem` }" v-html="parsedSongContent"></pre>

        <!-- Próxima Música da Setlist (Se houver playlist ativa) -->
        <div v-if="getNextSong() && !isSetlistMode" class="next-song-footer">
          <div class="next-song-info">
            <span class="next-song-label">{{ $t('songs.nextInSetlist') }}</span>
            <span class="next-song-title">{{ getNextSong().title }}</span>
            <span class="song-artist">{{ getNextSong().artist }}</span>
          </div>
          <button @click="playNextSong" class="btn btn-next-song">
            {{ $t('songs.nextSong') }}
          </button>
        </div>

        <!-- Countdown para próxima música -->
        <div v-if="countdownActive" class="countdown-overlay">
          <p class="countdown-label">{{ $t('songs.nextSongIn') }}</p>
          <span class="countdown-number">{{ countdownValue }}</span>
          <p class="countdown-next-title">{{ getNextSong()?.title }}</p>
          <button @click="cancelCountdown" class="btn btn-secondary btn-sm">{{ $t('app.cancel') }}</button>
        </div>
      </div>

      <!-- HEADERS (NOW AT BOTTOM) -->
      <div
        v-if="!isSetlistMode"
        class="player-header compact-header footer-header"
      >
        <div class="header-main-row">
          <button @click="closePlayer" class="btn-back-small">
            <ChevronLeft :size="16" /> Voltar
          </button>
          <div class="song-meta-small">
            <strong>{{ activeSong.title }}</strong>
            <span v-if="activeSong.tone" class="badge-tone">{{
              activeSong.tone
            }}</span>
            <span class="text-muted">| {{ activeSong.artist }}</span>
          </div>
          <div class="speed-badge-small">{{ activeSpeed.toFixed(1) }}x</div>
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
            <span v-if="activeSong.tone" class="badge-tone">{{
              activeSong.tone
            }}</span>
          </div>
          <div v-if="activeSong.notes" class="song-notes-banner setlist-notes">
            {{ activeSong.notes }}
          </div>
        </div>

        <div class="setlist-nav-buttons">
          <button
            :disabled="!getPrevSong()"
            @click="playPrevSong"
            class="btn btn-secondary btn-icon-only btn-sm"
            :title="$t('songs.prevSong')"
          >
            <SkipBack :size="18" />
          </button>
          <button
            :disabled="!getNextSong()"
            @click="playNextSong"
            class="btn btn-primary btn-icon-only btn-sm"
            :title="$t('songs.nextSongTooltip')"
          >
            <SkipForward :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- 2. DEFAULT LIST VIEW -->
    <div v-else class="glass-panel list-panel">
      <h3 class="gradient-text-primary mb-4">{{ $t("songs.title") }}</h3>

      <div class="filters-row">
        <div class="search-bar">
          <Search class="search-icon" :size="16" />
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="$t('songs.search')"
            class="search-input"
          />
        </div>
        <div class="sort-wrapper">
          <Filter class="sort-icon" :size="16" />
          <select v-model="sortBy" class="sort-select">
            <option value="artist">{{ $t('songs.sortArtist') }}</option>
            <option value="recent">{{ $t('songs.sortRecent') }}</option>
            <option value="title">{{ $t('songs.sortTitle') }}</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <span class="spinner"></span>
        <span>{{ $t("app.loading") }}</span>
      </div>

      <div v-else-if="filteredSongs.length === 0" class="empty-state">
        <div class="empty-icon">🎵</div>
        <p>{{ $t("songs.empty") }}</p>
      </div>

      <div v-else class="songs-grid">
        <div
          v-for="song in filteredSongs"
          :key="song.id"
          class="song-item-card"
          :class="{
            'bpm-azul': Number(song.bpm || 120) < 50,
            'bpm-verde':
              Number(song.bpm || 120) >= 50 && Number(song.bpm || 120) < 90,
            'bpm-laranja':
              Number(song.bpm || 120) >= 90 && Number(song.bpm || 120) <= 120,
            'bpm-vermelho': Number(song.bpm || 120) > 120,
          }"
        >
          <button
            v-if="song.is_public"
            @click.stop="copyShareLink(song)"
            class="btn-share-icon"
            :title="$t('songs.copyPublicLink')"
          >
            <Link :size="14" />
          </button>
          
          <div class="song-info">
            <h4 class="song-title">{{ song.title }}</h4>
            <p class="song-artist">
              <User
                :size="14"
                style="
                  vertical-align: middle;
                  margin-right: 4px;
                  display: inline-block;
                "
              />
              {{ song.artist }}
            </p>
            <div class="badge-row">
              <span class="badge speed-badge"
                >🥁 {{ song.bpm || 120 }} BPM
                <span v-if="Number(song.bpm || 120) > 180">🌶️</span></span
              >
            </div>
          </div>

          <div class="song-actions">
            <button
              @click="openPlayer(song)"
              class="btn btn-primary btn-play-song"
            >
              <Eye :size="16" />
              <span>{{ $t('songs.viewAndScroll') }}</span>
            </button>
            <button
              v-if="isDemo || (user && song.user_id === user.id)"
              @click="emit('edit-song', song)"
              class="btn btn-secondary btn-icon-only"
              :title="$t('songs.edit')"
              style="
                background: rgba(168, 85, 247, 0.15);
                border-color: rgba(168, 85, 247, 0.3);
                color: #c084fc;
              "
            >
              <Edit3 :size="16" />
            </button>
            <button
              v-if="isDemo || (user && song.user_id === user.id)"
              @click="deleteSong(song.id, song.user_id)"
              class="btn btn-danger btn-icon-only"
              :title="$t('songs.delete')"
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

.mb-4 {
  margin-bottom: 1.5rem;
}

.filters-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  color: var(--text-muted);
  pointer-events: none;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.9rem;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-primary-glow);
  background: rgba(15, 23, 42, 0.6);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.sort-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.sort-icon {
  position: absolute;
  left: 0.85rem;
  color: var(--text-muted);
  pointer-events: none;
  flex-shrink: 0;
}

.sort-select {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.9rem;
  padding: 0.6rem 2.5rem 0.6rem 2.5rem;
  transition: all 0.2s ease;
  appearance: none;
  cursor: pointer;
}

.sort-select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-primary-glow);
  background: rgba(15, 23, 42, 0.6);
}

.sort-select option {
  background: #0f172a;
  color: #fff;
}

@media (max-width: 640px) {
  .filters-row {
    flex-direction: column;
    gap: 0.5rem;
  }
}

.song-list-container {
  margin-top: 2rem;
}

.list-panel,
.player-panel {
  border-radius: var(--radius-lg);
  padding: 2.5rem;
}

@media (max-width: 640px) {
  .player-panel,
  .list-panel {
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0.5rem;
  }
}

.loading-state,
.empty-state {
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
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.song-item-card {
  background: rgba(15, 23, 42, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-sm);
  padding: 0.75rem 0.85rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  transition: all var(--transition-normal);
  position: relative;
}

.btn-share-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 2;
}

.btn-share-icon:hover {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border-color: rgba(168, 85, 247, 0.4);
}

.song-item-card:hover {
  transform: translateY(-4px);
  border-color: rgba(168, 85, 247, 0.3);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  background: rgba(15, 23, 42, 0.6);
}

.song-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.1rem;
  padding-right: 1.5rem;
}

.song-artist {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
}

.badge-row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
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
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
}

.btn-icon-only {
  padding: 0.35rem;
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
  border: 1px solid rgba(255, 255, 255, 0.08);
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
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE e Edge */
  scrollbar-width: none; /* Firefox */
}

.pre-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari e Opera */
}

.chord-pre {
  margin: 0;
  border: none;
  padding: 0.5rem 0;
  white-space: pre-wrap;
  font-family: "Courier New", Courier, monospace;
  line-height: 1.5;
  font-size: 1.15rem;
  font-weight: 600;
  color: #ffffff;
  transition: font-size 0.2s ease-out;
}

:deep(.chord-line) {
  color: #c084fc;
}

:deep(.chord) {
  background: rgba(192, 132, 252, 0.1);
  padding: 0 0.15rem;
  border-radius: 4px;
}

.transpose-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  font-weight: 700;
  font-size: 0.9rem;
  color: #c084fc;
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
  to {
    transform: rotate(360deg);
  }
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
