<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { Play, Music, Layers, PlusCircle, Clock, Info, X } from "@lucide/vue";

const props = defineProps({
  user: Object,
});

const emit = defineEmits(["navigate", "play-song", "play-setlist"]);

const recentSongs = ref([]);
const recentSetlists = ref([]);
const loading = ref(true);
const showUpdatesModal = ref(false);

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
      <div class="dashboard-header-top">
        <div>
          <h2 class="gradient-text-primary" style="margin-bottom: 0.25rem">
            {{
              $t("dashboard.welcome", {
                name: user?.email?.split("@")[0] || "Músico",
              })
            }}
          </h2>
          <p class="text-muted">{{ $t("dashboard.subtitle") }}</p>
          <br />
        </div>

        <button @click="showUpdatesModal = true" class="btn-updates">
          <Info :size="16" /> Novidades
        </button>
      </div>
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

    <!-- Modal Últimas Atualizações -->
    <div
      v-if="showUpdatesModal"
      class="modal-overlay"
      @click="showUpdatesModal = false"
    >
      <div class="modal-content glass-panel" @click.stop>
        <div class="modal-header">
          <h3 class="gradient-text-primary">Últimas Atualizações</h3>
          <button @click="showUpdatesModal = false" class="btn-icon">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <ul class="updates-list">
            <li>
              <strong>Tap Tempo:</strong> Adicionado botão para descobrir BPM
              facilmente nas cifras.
            </li>
            <li>
              <strong>Download Setlist:</strong> Opção de baixar setlist
              completo como arquivo de texto para uso offline.
            </li>
            <li>
              <strong>Ordenação de Cifras:</strong> Nova opção de ordenar por
              Nome, Artista ou Mais Recentes.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-panel {
  padding: 2rem;
}

.dashboard-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-updates {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(236, 72, 153, 0.15);
  border: 1px solid rgba(236, 72, 153, 0.4);
  color: #f472b6;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-updates:hover {
  background: rgba(236, 72, 153, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
}

.dashboard-header p {
  margin-top: 0;
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

/* Modal Styles */
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

.updates-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.updates-list li {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-muted);
  position: relative;
  padding-left: 1.5rem;
}

.updates-list li::before {
  content: "✨";
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.9rem;
}

.updates-list li strong {
  color: var(--text-main);
}
</style>
