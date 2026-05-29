<script setup>
import { ref, onMounted, nextTick } from "vue";
import { supabase } from "./lib/supabase";
import AuthForm from "./components/AuthForm.vue";
import SongForm from "./components/SongForm.vue";
import SongList from "./components/SongList.vue";
import SetlistManager from "./components/SetlistManager.vue";
import Dashboard from "./components/Dashboard.vue";
import {
  LogOut,
  User,
  Music,
  Sparkles,
  BookOpen,
  AlertCircle,
  PlusCircle,
  Layers,
  PlayCircle,
  ArrowLeft,
} from "@lucide/vue";

const user = ref(null);
const authView = ref(false); // Toggle para ver tela de login/cadastro
const songListRef = ref(null);

// Roteador Interno por Cards: 'menu', 'songs_list', 'song_create', 'setlists'
const currentView = ref("menu");

// Toast State
const toasts = ref([]);

const addToast = (toast) => {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.value.push({ id, ...toast });
  setTimeout(() => {
    removeToast(id);
  }, 4000);
};

const removeToast = (id) => {
  toasts.value = toasts.value.filter((t) => t.id !== id);
};

const handleNotification = (payload) => {
  addToast({
    type: payload.type,
    message: payload.message,
  });
};

// Check session on mount
onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  user.value = session?.user || null;

  // Escutar mudanças de autenticação
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null;
  });
});

const handleAuthSuccess = (authUser) => {
  user.value = authUser;
  currentView.value = 'menu';
  addToast({ type: "success", message: `Bem-vindo, ${authUser.email}!` });
  if (songListRef.value) {
    songListRef.value.refresh();
  }
};

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
    addToast({ type: "info", message: "Sessão encerrada com sucesso." });
    currentView.value = "menu";
    if (songListRef.value) {
      songListRef.value.refresh();
    }
  } catch (error) {
    addToast({ type: "error", message: "Erro ao deslogar." });
  }
};

const songToEdit = ref(null);

const onSongCreated = () => {
  addToast({
    type: "success",
    message: songToEdit.value
      ? "Cifra atualizada com sucesso!"
      : "Música adicionada ao acervo!",
  });
  songToEdit.value = null;
  currentView.value = "songs_list";
};

const handleEditSong = (song) => {
  songToEdit.value = song;
  currentView.value = "song_create";
};

const handlePlaySong = async (song) => {
  currentView.value = "songs_list";
  await nextTick();
  if (songListRef.value) {
    songListRef.value.openPlayer(song);
  } else {
    setTimeout(() => {
      if (songListRef.value) songListRef.value.openPlayer(song);
    }, 300);
  }
};

const handleCancelEdit = () => {
  songToEdit.value = null;
  currentView.value = "songs_list";
};

// Orquestrador da Apresentação de Setlist (Tela Cheia + Próxima Música)
const handleOpenPresentation = (payload) => {
  currentView.value = "songs_list";
  addToast({
    type: "info",
    message: `Iniciando setlist: ${payload.setlist.name}`,
  });

  setTimeout(() => {
    if (songListRef.value) {
      // Abre a primeira música passando todo o array do setlist para ativar o avanço automático
      songListRef.value.openPlayer(payload.songs[0], payload.songs);
    } else {
      // Fallback
      setTimeout(() => {
        if (songListRef.value) songListRef.value.openPlayer(payload.songs[0], payload.songs);
      }, 300);
    }
  }, 400);
};

const checkSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes("seu-projeto-supabase");
};
</script>

<template>
  <div class="app-container">
    <!-- Navbar -->
    <header class="navbar glass-panel">
      <div
        class="nav-brand"
        @click="currentView = 'menu'"
      >
        <span class="nav-logo">🎵</span>
        <h1 class="gradient-text">MusicRoll</h1>
        <span class="version-tag">v1.0</span>
      </div>

      <nav class="nav-actions">
        <!-- Status de Conexão com Supabase -->
        <div
          v-if="!checkSupabaseConfigured()"
          class="status-warning"
          title="Configure o arquivo .env para salvar em nuvem"
        >
          <AlertCircle :size="14" />
          <span>Modo Demo Local</span>
        </div>

        <template v-if="user">
          <div class="main-nav-links">
            <button @click="currentView = 'songs_list'" :class="{ 'text-primary': currentView === 'songs_list' }" class="btn-nav-link">
              <BookOpen :size="16" /> Cifras
            </button>
            <button @click="currentView = 'setlists'" :class="{ 'text-primary': currentView === 'setlists' }" class="btn-nav-link">
              <Layers :size="16" /> Setlists
            </button>
            <button @click="currentView = 'song_create'; songToEdit = null" :class="{ 'text-primary': currentView === 'song_create' }" class="btn-nav-link">
              <PlusCircle :size="16" /> Nova Cifra
            </button>
          </div>

          <div class="user-profile">
            <User :size="16" class="profile-icon" />
            <span class="user-email">{{ user.email }}</span>
          </div>
          <button @click="handleLogout" class="btn btn-secondary btn-nav">
            <LogOut :size="16" />
            <span>Sair</span>
          </button>
        </template>
      </nav>
    </header>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- MODO DE AUTENTICAÇÃO -->
      <transition name="fade" mode="out-in">
        <div v-if="!user">
          <AuthForm @auth-success="handleAuthSuccess" />
        </div>

        <!-- DASHBOARD (PÁGINA PRINCIPAL APÓS LOGIN) -->
        <div v-else-if="currentView === 'menu'">
          <Dashboard 
            :user="user" 
            @navigate="v => currentView = v" 
            @edit-song="handleEditSong" 
            @play-song="handlePlaySong"
            @play-setlist="handleOpenPresentation"
          />
        </div>

        <!-- MODO DE CADASTRO DE MÚSICAS -->
        <div v-else-if="currentView === 'song_create'">
          <div class="back-bar mb-4">
            <button @click="handleCancelEdit" class="btn btn-secondary btn-sm">
              <ArrowLeft :size="16" />
              <span>Voltar ao Menu Principal</span>
            </button>
          </div>
          <SongForm
            :user="user"
            :songToEdit="songToEdit"
            @song-created="onSongCreated"
            @cancel-edit="handleCancelEdit"
            @show-notification="handleNotification"
          />
        </div>

        <!-- MODO DE ACERVO / PLAYER DE CIFRAS -->
        <div v-else-if="currentView === 'songs_list'">
          <div class="back-bar mb-4" v-if="!songListRef?.activeSong">
            <button
              @click="currentView = 'menu'"
              class="btn btn-secondary btn-sm"
            >
              <ArrowLeft :size="16" />
              <span>Voltar ao Menu Principal</span>
            </button>
          </div>
          <SongList
            ref="songListRef"
            :user="user"
            @edit-song="handleEditSong"
            @show-notification="handleNotification"
          />
        </div>

        <!-- MODO DE GERENCIADOR DE SETLISTS -->
        <div v-else-if="currentView === 'setlists'">
          <div class="back-bar mb-4">
            <button
              @click="currentView = 'menu'"
              class="btn btn-secondary btn-sm"
            >
              <ArrowLeft :size="16" />
              <span>Voltar ao Menu Principal</span>
            </button>
          </div>
          <SetlistManager
            :user="user"
            @show-notification="handleNotification"
            @open-presentation="handleOpenPresentation"
          />
        </div>
      </transition>
    </main>

    <!-- Floating Toast Notifications System -->
    <div class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
      >
        <span class="toast-indicator">✓</span>
        <span class="toast-message">{{ toast.message }}</span>
        <button @click="removeToast(toast.id)" class="btn-close-toast">
          ×
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="app-footer">
      <p>© 2026 MusicRoll. Desenvolvido por Flavio Bei.</p>
    </footer>
  </div>
</template>

<style>
/* Global Layout Adjustments */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  padding: 1rem 2rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.nav-logo {
  font-size: 1.6rem;
}

.version-tag {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  color: var(--text-muted);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.status-warning {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.04);
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.profile-icon {
  color: var(--text-muted);
}

.user-email {
  font-size: 0.85rem;
  color: var(--text-main);
}

.btn-nav {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.main-content {
  flex: 1;
}

/* Dashboard Grid Layout */
.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.config-banner {
  border-radius: var(--radius-md);
  background: linear-gradient(
    135deg,
    rgba(168, 85, 247, 0.08) 0%,
    rgba(236, 72, 153, 0.08) 100%
  );
  border: 1px solid rgba(168, 85, 247, 0.15);
}

.banner-content {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.banner-icon {
  color: #c084fc;
  animation: float 3s ease-in-out infinite;
}

.config-banner h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

.config-banner p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.config-banner code {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  color: #f472b6;
  font-family: var(--font-mono);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.app-footer {
  text-align: center;
  padding: 2.5rem 1rem 1rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  margin-top: 3rem;
}

.btn-close-toast {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: auto;
  padding-left: 0.5rem;
}

.btn-close-toast:hover {
  color: var(--text-main);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
