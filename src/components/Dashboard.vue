<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { Play, Music, Layers, PlusCircle, Clock } from "@lucide/vue";

const props = defineProps({
  user: Object,
});

const emit = defineEmits(["navigate", "play-song", "play-setlist"]);

const recentSongs = ref([]);
const recentSetlists = ref([]);
const loading = ref(true);

const fetchRecentData = async () => {
  if (!props.user) return;
  loading.value = true;

  try {
    // Buscar últimas 4 músicas (simulado com mock se demo, ou real via Supabase)
    const isDemo =
      !import.meta.env.VITE_SUPABASE_URL ||
      import.meta.env.VITE_SUPABASE_URL.includes("seu-projeto-supabase");

    if (!isDemo) {
      const { data: songsData } = await supabase
        .from("songs")
        .select("*")
        .eq("user_id", props.user.id)
        .order("created_at", { ascending: false })
        .limit(4);

      if (songsData) recentSongs.value = songsData;

      const { data: setlistsData } = await supabase
        .from("setlists")
        .select("*")
        .eq("user_id", props.user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (setlistsData) recentSetlists.value = setlistsData;
    } else {
      // Demo mode
      const localSongs = JSON.parse(
        localStorage.getItem("musicroll_songs") || "[]",
      );
      recentSongs.value = localSongs.slice(0, 4);

      const localSetlists = JSON.parse(
        localStorage.getItem("musicroll_setlists") || "[]",
      );
      recentSetlists.value = localSetlists.slice(0, 3);
    }
  } catch (err) {
    console.error("Erro ao buscar dados recentes:", err);
  } finally {
    loading.value = false;
  }
};

const playSetlist = async (setlist) => {
  const isDemo =
    !import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL.includes("seu-projeto-supabase");

  if (isDemo) {
    const local = localStorage.getItem(`musicroll_setlist_songs_${setlist.id}`);
    const songs = local ? JSON.parse(local) : [];
    emit("play-setlist", { setlist, songs });
  } else {
    const { data, error } = await supabase
      .from("setlist_songs")
      .select(
        `
          id,
          order_index,
          custom_scroll_speed,
          song:songs(*)
      `,
      )
      .eq("setlist_id", setlist.id)
      .order("order_index", { ascending: true });

    if (!error && data) {
      const songs = data.map((item) => ({
        ...item.song,
        id: item.id,
      }));
      emit("play-setlist", { setlist, songs });
    } else {
      console.error("Erro ao carregar setlist", error);
    }
  }
};

onMounted(() => {
  fetchRecentData();
});
</script>

<template>
  <div class="dashboard-panel glass-panel">
    <div class="dashboard-header mb-4">
      <h2 class="gradient-text-primary">
        {{
          $t("dashboard.welcome", {
            name: user?.email?.split("@")[0] || "Músico",
          })
        }}
      </h2>
      <p class="text-muted">{{ $t("dashboard.subtitle") }}</p>
      <br />
    </div>

    <div class="quick-actions-row mb-4">
      <button
        @click="$emit('navigate', 'song_create')"
        class="btn btn-secondary btn-action"
      >
        <PlusCircle :size="18" /> {{ $t("dashboard.newSong") }}
      </button>
      <button
        @click="$emit('navigate', 'songs_list')"
        class="btn btn-secondary btn-action"
      >
        <Music :size="18" /> {{ $t("dashboard.allSongs") }}
      </button>
      <button
        @click="$emit('navigate', 'setlists')"
        class="btn btn-secondary btn-action"
      >
        <Layers :size="18" /> {{ $t("dashboard.mySetlists") }}
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      <span>{{ $t("app.loading") }}</span>
    </div>

    <div v-else class="dashboard-content-grid">
      <!-- Ultimas Musicas -->
      <div class="dashboard-card">
        <h3 class="dashboard-card-title">
          <Clock :size="18" /> {{ $t("dashboard.latestSongs") }}
        </h3>

        <div v-if="recentSongs.length === 0" class="empty-state-mini">
          {{ $t("dashboard.emptySongs") }}
        </div>

        <div v-else class="recent-list">
          <div
            v-for="song in recentSongs"
            :key="song.id"
            class="recent-item song-item"
            :class="{
              'bpm-azul': Number(song.bpm || 120) < 50,
              'bpm-verde':
                Number(song.bpm || 120) >= 50 && Number(song.bpm || 120) < 90,
              'bpm-laranja':
                Number(song.bpm || 120) >= 90 && Number(song.bpm || 120) <= 120,
              'bpm-vermelho': Number(song.bpm || 120) > 120,
            }"
            @click="$emit('play-song', song)"
          >
            <div class="recent-meta">
              <span class="recent-title">
                {{ song.title }}
                <span
                  v-if="Number(song.bpm || 120) > 180"
                  title="Acima de 180 BPM"
                  >🌶️</span
                >
              </span>
              <span class="recent-subtitle">
                {{ song.artist }} | {{ song.bpm }} BPM
                <span v-if="song.tone">| Tom: {{ song.tone }}</span>
              </span>
            </div>
            <button class="btn-icon-only text-primary" title="Tocar Agora">
              <Play :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Ultimos Setlists -->
      <div class="dashboard-card">
        <h3 class="dashboard-card-title">
          <Clock :size="18" /> {{ $t("dashboard.latestSetlists") }}
        </h3>

        <div v-if="recentSetlists.length === 0" class="empty-state-mini">
          {{ $t("dashboard.emptySetlists") }}
        </div>

        <div v-else class="recent-list">
          <div
            v-for="setlist in recentSetlists"
            :key="setlist.id"
            class="recent-item setlist-item"
            @click="playSetlist(setlist)"
          >
            <div class="recent-meta">
              <span class="recent-title">{{ setlist.name }}</span>
              <span class="recent-subtitle">{{
                new Date(setlist.created_at || Date.now()).toLocaleDateString(
                  "pt-BR",
                )
              }}</span>
            </div>
            <button class="btn-icon-only text-primary" title="Iniciar Show">
              <Play :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-panel {
  padding: 2rem;
}

.dashboard-header p {
  margin-top: 0.5rem;
}

.quick-actions-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-action {
  flex: 1;
  min-width: 150px;
  transition: all 0.2s ease;
}

.btn-action:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.4);
  color: #a78bfa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

.dashboard-content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.dashboard-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.dashboard-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.recent-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.recent-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.recent-title {
  font-weight: 600;
  color: var(--text-main);
}

.recent-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.empty-state-mini {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-sm);
}
</style>
