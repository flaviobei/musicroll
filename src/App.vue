<script setup>
import { ref, onMounted, nextTick, onUnmounted, watch } from "vue";
import { supabase } from "./lib/supabase";
import AuthForm from "./components/AuthForm.vue";
import SongForm from "./components/SongForm.vue";
import SongList from "./components/SongList.vue";
import SetlistManager from "./components/SetlistManager.vue";
import Dashboard from "./components/Dashboard.vue";
import AboutModal from "./components/AboutModal.vue";
import EasterEggModal from "./components/EasterEggModal.vue";
import ProfileModal from "./components/ProfileModal.vue";
import SpotlightSearch from "./components/SpotlightSearch.vue";
import PublicSongView from "./components/PublicSongView.vue";
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
  X,
  Globe,
} from "@lucide/vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const changeLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem("musicroll_lang", lang);
};

const cycleLanguage = () => {
  const langs = ["pt", "en", "es"];
  const currentIndex = langs.indexOf(locale.value);
  const nextLang = langs[(currentIndex + 1) % langs.length];
  changeLanguage(nextLang);
};

const user = ref(null);
const showAboutModal = ref(false);
const showNerdModal = ref(false);
const showProfileModal = ref(false);
const currentView = ref("menu"); // views: menu, songs_list, song_create, setlists

const getAvatarStyle = (usr) => {
  const avatar = usr?.user_metadata?.avatar_url || "";
  if (avatar.startsWith("preset:")) {
    const presets = {
      "preset:vocalist": { emoji: "🎤", gradient: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)" },
      "preset:guitarist": { emoji: "🎸", gradient: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)" },
      "preset:bassist": { emoji: "🎸", gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" },
      "preset:drummer": { emoji: "🥁", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
      "preset:keyboardist": { emoji: "🎹", gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" },
      "preset:producer": { emoji: "🎧", gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" },
      "preset:notegirl": { emoji: "🎵", gradient: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)" },
      "preset:cool": { emoji: "🕶️", gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }
    };
    return presets[avatar] || null;
  }
  return null;
};
const songToEdit = ref(null);
const songListRef = ref(null);
const showSpotlight = ref(false);
const allSongs = ref([]);
const publicSongId = ref(null);

const handleGlobalKey = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    showSpotlight.value = true;
  }
};

const checkSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes("seu-projeto-supabase");
};

watch(user, async (newUser) => {
  if (newUser) {
    const isDemo = checkSupabaseConfigured() === false;
    if (isDemo) {
      allSongs.value = JSON.parse(localStorage.getItem("musicroll_songs") || "[]");
    } else {
      const { data } = await supabase.from("songs").select("id, title, artist, bpm, tone").eq("user_id", newUser.id);
      if (data) allSongs.value = data;
    }
  } else {
    allSongs.value = [];
  }
}, { immediate: true });

// PWA Install State
const deferredPrompt = ref(null);
const showInstallBanner = ref(false);
const isIOS = ref(false);

// Global Error Catcher for Debugging
const fatalError = ref(null);
import { onErrorCaptured } from "vue";
onErrorCaptured((err, instance, info) => {
  console.error("Vue Error Captured:", err, info);
  fatalError.value = {
    message: err.message || String(err),
    info,
    stack: err.stack,
  };
  return false; // stop propagation
});

const isDev = import.meta.env.DEV;

onMounted(() => {
  // Detectar rota de compartilhamento: /#/song/UUID
  const hash = window.location.hash;
  const match = hash.match(/^#\/song\/([a-f0-9-]{36})$/);
  if (match) {
    publicSongId.value = match[1];
  }

  // Verificar se é iOS
  const userAgent = window.navigator.userAgent.toLowerCase();
  isIOS.value = /iphone|ipad|ipod/.test(userAgent);

  // Verificar se já está instalado (standalone)
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone;

  // No iOS, se não estiver instalado, podemos mostrar uma dica manual
  if (!isStandalone && isIOS.value) {
    showInstallBanner.value = true;
  }

  // Capturar evento de instalação nativa no Android/Chrome
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallBanner.value = true;
  });

  // Check session on mount or load demo profile
  const isDemoMode = checkSupabaseConfigured() === false;
  if (isDemoMode) {
    const savedDemoUser = localStorage.getItem("musicroll_demo_user");
    if (savedDemoUser) {
      user.value = JSON.parse(savedDemoUser);
    } else {
      user.value = {
        id: "demo-user-id",
        email: "musico@musicroll.com",
        user_metadata: {
          display_name: "Flavio",
          musical_role: "bassist",
          avatar_url: "preset:bassist",
          accept_emails: true
        }
      };
      localStorage.setItem("musicroll_demo_user", JSON.stringify(user.value));
    }
  } else {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        user.value = session?.user || null;
      })
      .catch((error) => {
        console.warn("Erro ao verificar sessão:", error);
      });
  }

  // Escutar mudanças de autenticação
  supabase.auth.onAuthStateChange((_event, session) => {
    if (checkSupabaseConfigured() === true) {
      user.value = session?.user || null;
    }
  });

  window.addEventListener("keydown", handleGlobalKey);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKey);
});

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

const handleAuthSuccess = (authUser) => {
  user.value = authUser;
  currentView.value = "menu";
  addToast({ type: "success", message: `Bem-vindo, ${authUser.email}!` });
  if (songListRef.value) {
    songListRef.value.refresh();
  }
};

const handleLogout = async () => {
  try {
    if (checkSupabaseConfigured() === true) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      localStorage.removeItem("musicroll_demo_user");
    }
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
  // Aguarda a transição de 250ms completar antes de chamar openPlayer
  setTimeout(() => {
    if (songListRef.value) {
      songListRef.value.openPlayer(song);
    }
  }, 350);
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
        if (songListRef.value)
          songListRef.value.openPlayer(payload.songs[0], payload.songs);
      }, 300);
    }
  }, 400);
};

const installApp = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    if (outcome === "accepted") {
      showInstallBanner.value = false;
    }
    deferredPrompt.value = null;
  }
};
</script>

<template>
  <div class="app-container">
    <!-- PWA INSTALL BANNER -->
    <div v-if="showInstallBanner" class="pwa-install-banner glass-panel">
      <div class="pwa-banner-content">
        <span class="pwa-icon">📱</span>
        <div class="pwa-text">
          <strong>{{ $t("app.installTitle") }}</strong>
          <span v-if="!isIOS">{{ $t("app.installAndroid") }}</span>
          <span v-else>{{ $t("app.installIOS") }}</span>
        </div>
      </div>
      <div class="pwa-actions">
        <button
          v-if="!isIOS"
          @click="installApp"
          class="btn btn-primary"
          style="padding: 0.4rem 0.8rem; font-size: 0.8rem"
        >
          {{ $t("app.install") }}
        </button>
        <button
          @click="showInstallBanner = false"
          class="btn-icon-only text-muted"
          :title="$t('app.close')"
        >
          <X :size="18" />
        </button>
      </div>
    </div>

    <!-- Navbar -->
    <header class="navbar glass-panel">
      <div class="nav-brand" @click="currentView = 'menu'">
        <h1 class="gradient-text">MusicRoll</h1>
        <span class="version-tag" @click.stop="showNerdModal = true" style="cursor: pointer;" :title="$t('app.whatIsThis')">v1.0 beta</span>
      </div>

      <nav class="nav-actions">
        <!-- Status de Conexão com Supabase -->
        <div
          v-if="!checkSupabaseConfigured()"
          class="status-warning"
          :title="$t('app.envWarning')"
        >
          <AlertCircle :size="14" />
          <span>{{ $t('app.demoMode') }}</span>
        </div>

        <template v-if="user">
          <div class="main-nav-links">
            <button
              @click="currentView = 'songs_list'"
              :class="{ 'text-primary': currentView === 'songs_list' }"
              class="btn-nav-link"
              :title="$t('dashboard.allSongs')"
            >
              <BookOpen :size="16" />
              <span class="nav-text">{{ $t("dashboard.allSongs") }}</span>
            </button>
            <button
              @click="currentView = 'setlists'"
              :class="{ 'text-primary': currentView === 'setlists' }"
              class="btn-nav-link"
              :title="$t('dashboard.mySetlists')"
            >
              <Layers :size="16" />
              <span class="nav-text">{{ $t("dashboard.mySetlists") }}</span>
            </button>
            <button
              @click="
                currentView = 'song_create';
                songToEdit = null;
              "
              :class="{ 'text-primary': currentView === 'song_create' }"
              class="btn-nav-link"
              :title="$t('dashboard.newSong')"
            >
              <PlusCircle :size="16" />
              <span class="nav-text">{{ $t("dashboard.newSong") }}</span>
            </button>
          </div>

          <div class="lang-switcher">
            <button
              @click="cycleLanguage"
              class="lang-btn"
              :title="$t('app.changeLanguage')"
            >
              <span
                class="fi"
                :class="
                  locale === 'pt'
                    ? 'fi-br'
                    : locale === 'en'
                      ? 'fi-us'
                      : 'fi-es'
                "
              ></span>
            </button>
          </div>

          <div class="user-menu">
            <div
              class="user-avatar-clickable"
              :title="user.email"
              @click="showProfileModal = true"
            >
              <div
                class="user-avatar"
                :style="getAvatarStyle(user) ? { background: getAvatarStyle(user).gradient, border: 'none' } : {}"
              >
                <span v-if="getAvatarStyle(user)" class="avatar-emoji">
                  {{ getAvatarStyle(user).emoji }}
                </span>
                <img
                  v-else-if="user?.user_metadata?.avatar_url && user.user_metadata.avatar_url.startsWith('http')"
                  :src="user.user_metadata.avatar_url"
                  class="avatar-image"
                  alt="Avatar"
                />
                <User v-else :size="14" />
              </div>
              <span class="user-nav-name">
                {{ user?.user_metadata?.display_name || user?.email?.split('@')[0] }}
              </span>
            </div>
            <button
              @click="handleLogout"
              class="btn-icon btn-logout"
              :title="$t('app.logout')"
            >
              <LogOut :size="18" />
            </button>
          </div>
        </template>
      </nav>
    </header>

    <!-- Main Content Area -->
    <main class="main-content">
      <PublicSongView v-if="publicSongId" :songId="publicSongId" />

      <div
        v-else-if="fatalError"
        class="alert alert-danger-custom m-4"
        style="
          text-align: left;
          background: #331111;
          color: #ffaaaa;
          border: 1px solid red;
          padding: 20px;
        "
      >
        <h3 style="color: white; margin-bottom: 10px">
          {{ $t('app.errorTitle') }}
        </h3>
        <p><strong>{{ $t('app.errorMsg') }}</strong> {{ fatalError.message }}</p>
        <p><strong>{{ $t('app.errorCtx') }}</strong> {{ fatalError.info }}</p>
        <pre
          v-if="isDev"
          style="
            margin-top: 10px;
            font-size: 11px;
            white-space: pre-wrap;
            overflow-x: auto;
          "
          >{{ fatalError.stack }}</pre
        >
      </div>

      <!-- MODO DE AUTENTICAÇÃO -->
      <transition v-else name="fade" mode="out-in">
        <div v-if="!user" key="auth">
          <AuthForm @auth-success="handleAuthSuccess" @open-about="showAboutModal = true" />
        </div>

        <!-- DASHBOARD (PÁGINA PRINCIPAL APÓS LOGIN) -->
        <div v-else-if="currentView === 'menu'" key="menu">
          <Dashboard
            :user="user"
            @navigate="(v) => (currentView = v)"
            @edit-song="handleEditSong"
            @play-song="handlePlaySong"
            @play-setlist="handleOpenPresentation"
          />
        </div>

        <!-- MODO DE CADASTRO DE MÚSICAS -->
        <div v-else-if="currentView === 'song_create'" key="song_create">
          <div class="back-bar mb-4">
            <button @click="handleCancelEdit" class="btn btn-secondary btn-sm">
              <ArrowLeft :size="16" />
              <span>{{ $t('app.backToMenu') }}</span>
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
        <div v-else-if="currentView === 'songs_list'" key="songs_list">
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
        <div v-else-if="currentView === 'setlists'" key="setlists">
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
            @navigate="(v) => (currentView = v)"
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
      <p>{{ $t('app.footer') }}</p>
      <button @click="showAboutModal = true" class="btn-link-footer">
        {{ $t('app.aboutApp') }}
      </button>
    </footer>

    <!-- About Modal -->
    <AboutModal v-if="showAboutModal" @close="showAboutModal = false" />

    <!-- Easter Egg Modal -->
    <EasterEggModal
      :show="showNerdModal"
      @close="showNerdModal = false"
    />

    <!-- Profile Modal -->
    <ProfileModal
      v-if="showProfileModal"
      :user="user"
      @close="showProfileModal = false"
      @show-notification="handleNotification"
    />

    <SpotlightSearch
      v-if="showSpotlight"
      :songs="allSongs"
      @play="handlePlaySong"
      @close="showSpotlight = false"
    />
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
  margin-bottom: 1.25rem;
  padding: 0.6rem 1.5rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.nav-logo {
  font-size: 1.25rem;
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

.user-avatar-clickable {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
  border-radius: 9999px;
  transition: all var(--transition-fast);
}

.user-avatar-clickable:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #c084fc;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-emoji {
  font-size: 0.95rem;
  line-height: 1;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-nav-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

.btn-icon {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.35rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.btn-icon:hover {
  color: var(--accent-danger);
  background: rgba(239, 68, 68, 0.08);
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

.btn-link-footer {
  background: none;
  border: none;
  color: var(--text-main);
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  margin-top: 0.5rem;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.btn-link-footer:hover {
  color: var(--text-muted);
}
</style>
