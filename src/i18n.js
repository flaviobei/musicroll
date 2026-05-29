import { createI18n } from 'vue-i18n'

const messages = {
  pt: {
    app: {
      logout: 'Sair',
      loading: 'Carregando...',
      close: 'Fechar',
      install: 'Instalar',
      installTitle: 'Instale o MusicRoll',
      installAndroid: 'Tenha o aplicativo na tela inicial do seu celular.',
      installIOS: 'Para instalar no iPhone, clique no ícone Compartilhar do Safari e em "Adicionar à Tela de Início".'
    },
    auth: {
      subtitle: 'Seu organizador inteligente de setlists e cifras',
      signInTitle: 'Entrar no MusicRoll',
      signUpTitle: 'Criar Nova Conta',
      email: 'E-mail',
      emailPlaceholder: 'exemplo{\'@\'}email.com',
      password: 'Senha',
      passwordPlaceholder: 'Sua senha secreta',
      signInBtn: 'Entrar',
      signUpBtn: 'Cadastrar',
      hasAccount: 'Já possui uma conta?',
      newHere: 'Novo por aqui?',
      clickLogin: 'Faça login',
      clickSignup: 'Crie uma conta'
    },
    dashboard: {
      welcome: 'Bem-vindo, {name}!',
      subtitle: 'Aqui está um resumo do seu acervo musical.',
      newSong: 'Nova Cifra',
      allSongs: 'Todas as Cifras',
      mySetlists: 'Meus Setlists',
      latestSongs: 'Últimas Cifras Adicionadas',
      latestSetlists: 'Setlists Recentes',
      emptySongs: 'Nenhuma música cadastrada ainda.',
      emptySetlists: 'Nenhum setlist criado ainda.'
    },
    songs: {
      title: 'Minhas Cifras',
      search: 'Buscar cifra ou artista...',
      sortTitle: 'Título',
      sortArtist: 'Artista',
      sortRecent: 'Mais Recentes',
      empty: 'Nenhuma música encontrada.',
      delete: 'Excluir',
      edit: 'Editar',
      back: 'Voltar',
      confirmDelete: 'Tem certeza que deseja excluir esta cifra?'
    },
    songForm: {
      newTitle: 'Adicionar Nova Cifra',
      editTitle: 'Editar Cifra',
      songName: 'Título da Música',
      artist: 'Artista',
      tone: 'Tom',
      duration: 'Duração (min)',
      bpm: 'BPM (Velocidade)',
      content: 'Conteúdo (Cifra/Letra)',
      notes: 'Observações / Convenção',
      helper: 'Use acordes no formato Am, G7, C#m. Cole a cifra completa com letra.',
      save: 'Salvar Cifra',
      cancel: 'Cancelar',
      loadSample: 'Carregar Exemplo',
      tempo: {
        slow: 'Lento',
        medium: 'Médio',
        fast: 'Rápido'
      }
    },
    setlists: {
      title: 'Meus Setlists',
      create: 'Criar Setlist',
      namePlaceholder: 'Nome do Show/Setlist',
      save: 'Salvar',
      cancel: 'Cancelar',
      empty: 'Nenhum setlist. Crie o seu primeiro show!',
      addSong: 'Adicionar Música',
      emptySongs: 'Este setlist está vazio. Adicione músicas!',
      closeShow: 'Sair do Show',
      playShow: 'Iniciar Show',
      availableSongs: 'Músicas Disponíveis'
    }
  },
  en: {
    app: {
      logout: 'Logout',
      loading: 'Loading...',
      close: 'Close',
      install: 'Install',
      installTitle: 'Install MusicRoll',
      installAndroid: 'Get the app on your home screen.',
      installIOS: 'To install on iPhone, tap the Share icon in Safari and select "Add to Home Screen".'
    },
    auth: {
      subtitle: 'Your smart setlist and chord organizer',
      signInTitle: 'Sign In to MusicRoll',
      signUpTitle: 'Create New Account',
      email: 'Email',
      emailPlaceholder: 'example{\'@\'}email.com',
      password: 'Password',
      passwordPlaceholder: 'Your secret password',
      signInBtn: 'Sign In',
      signUpBtn: 'Sign Up',
      hasAccount: 'Already have an account?',
      newHere: 'New here?',
      clickLogin: 'Log In',
      clickSignup: 'Create an account'
    },
    dashboard: {
      welcome: 'Welcome, {name}!',
      subtitle: 'Here is a summary of your musical library.',
      newSong: 'New Chord',
      allSongs: 'All Chords',
      mySetlists: 'My Setlists',
      latestSongs: 'Latest Added Chords',
      latestSetlists: 'Recent Setlists',
      emptySongs: 'No songs added yet.',
      emptySetlists: 'No setlists created yet.'
    },
    songs: {
      title: 'My Chords',
      search: 'Search song or artist...',
      sortTitle: 'Title',
      sortArtist: 'Artist',
      sortRecent: 'Most Recent',
      empty: 'No songs found.',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      confirmDelete: 'Are you sure you want to delete this song?'
    },
    songForm: {
      newTitle: 'Add New Song',
      editTitle: 'Edit Song',
      songName: 'Song Title',
      artist: 'Artist',
      tone: 'Key / Tone',
      duration: 'Duration (min)',
      bpm: 'BPM (Tempo)',
      content: 'Content (Chords/Lyrics)',
      notes: 'Notes / Convention',
      helper: 'Use chords in Am, G7, C#m format. Paste the full chord chart with lyrics.',
      save: 'Save Song',
      cancel: 'Cancel',
      loadSample: 'Load Sample',
      tempo: {
        slow: 'Slow',
        medium: 'Medium',
        fast: 'Fast'
      }
    },
    setlists: {
      title: 'My Setlists',
      create: 'Create Setlist',
      namePlaceholder: 'Show/Setlist Name',
      save: 'Save',
      cancel: 'Cancel',
      empty: 'No setlists. Create your first show!',
      addSong: 'Add Song',
      emptySongs: 'This setlist is empty. Add some songs!',
      closeShow: 'Exit Show',
      playShow: 'Start Show',
      availableSongs: 'Available Songs'
    }
  },
  es: {
    app: {
      logout: 'Cerrar Sesión',
      loading: 'Cargando...',
      close: 'Cerrar',
      install: 'Instalar',
      installTitle: 'Instala MusicRoll',
      installAndroid: 'Obtén la aplicación en tu pantalla de inicio.',
      installIOS: 'Para instalar en iPhone, toca el ícono Compartir en Safari y selecciona "Agregar a Inicio".'
    },
    auth: {
      subtitle: 'Tu organizador inteligente de setlists y acordes',
      signInTitle: 'Entrar en MusicRoll',
      signUpTitle: 'Crear Nueva Cuenta',
      email: 'Correo',
      emailPlaceholder: 'ejemplo{\'@\'}correo.com',
      password: 'Contraseña',
      passwordPlaceholder: 'Tu contraseña secreta',
      signInBtn: 'Entrar',
      signUpBtn: 'Registrarse',
      hasAccount: '¿Ya tienes una cuenta?',
      newHere: '¿Nuevo por aquí?',
      clickLogin: 'Inicia sesión',
      clickSignup: 'Crea una cuenta'
    },
    dashboard: {
      welcome: '¡Bienvenido, {name}!',
      subtitle: 'Aquí tienes un resumen de tu repertorio musical.',
      newSong: 'Nuevo Acorde',
      allSongs: 'Todos los Acordes',
      mySetlists: 'Mis Setlists',
      latestSongs: 'Últimos Acordes Añadidos',
      latestSetlists: 'Setlists Recientes',
      emptySongs: 'Aún no has añadido canciones.',
      emptySetlists: 'Aún no has creado setlists.'
    },
    songs: {
      title: 'Mis Acordes',
      search: 'Buscar canción o artista...',
      sortTitle: 'Título',
      sortArtist: 'Artista',
      sortRecent: 'Más Recientes',
      empty: 'No se encontraron canciones.',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Volver',
      confirmDelete: '¿Estás seguro de que quieres eliminar esta canción?'
    },
    songForm: {
      newTitle: 'Añadir Nueva Canción',
      editTitle: 'Editar Canción',
      songName: 'Título de la Canción',
      artist: 'Artista',
      tone: 'Tonalidad',
      duration: 'Duración (min)',
      bpm: 'BPM (Tempo)',
      content: 'Contenido (Acordes/Letra)',
      notes: 'Notas / Convención',
      helper: 'Usa acordes en formato Am, G7, C#m. Pega la cifra completa con letra.',
      save: 'Guardar Canción',
      cancel: 'Cancelar',
      loadSample: 'Cargar Ejemplo',
      tempo: {
        slow: 'Lento',
        medium: 'Medio',
        fast: 'Rápido'
      }
    },
    setlists: {
      title: 'Mis Setlists',
      create: 'Crear Setlist',
      namePlaceholder: 'Nombre del Show/Setlist',
      save: 'Guardar',
      cancel: 'Cancelar',
      empty: 'Sin setlists. ¡Crea tu primer show!',
      addSong: 'Añadir Canción',
      emptySongs: 'Este setlist está vacío. ¡Añade algunas canciones!',
      closeShow: 'Salir del Show',
      playShow: 'Iniciar Show',
      availableSongs: 'Canciones Disponibles'
    }
  }
}

// Get saved language or fallback to browser language, or 'pt'
const savedLocale = localStorage.getItem('musicroll_lang')
const navLang = navigator.language.split('-')[0]
const defaultLocale = savedLocale || (['pt', 'en', 'es'].includes(navLang) ? navLang : 'pt')

const i18n = createI18n({
  legacy: false, // use Composition API
  globalInjection: true,
  locale: defaultLocale,
  fallbackLocale: 'pt',
  messages
})

export default i18n
