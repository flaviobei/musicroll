import { createI18n } from "vue-i18n";

const messages = {
  pt: {
    app: {
      logout: "Sair",
      loading: "Carregando...",
      close: "Fechar",
      install: "Instalar",
      installTitle: "Instale o MusicRoll",
      installAndroid: "Tenha o aplicativo na tela inicial do seu celular.",
      installIOS:
        'Para instalar no iPhone, clique no ícone Compartilhar do Safari e em "Adicionar à Tela de Início".',
    },
    about: {
      title: "Sobre o MusicRoll",
      content: `
        <p>O MusicRoll é o seu organizador inteligente de setlists e cifras.</p>
        <p>Foi criado para músicos que precisam de uma forma fácil de rolar suas cifras automaticamente enquanto tocam, sem interrupções e com controle total da velocidade.</p>
        <p>Desenvolvido com carinho para facilitar a vida no palco e nos ensaios!</p>
        <p>
          <b>E os meus dados? 🕵️‍♂️</b><br />
          Relaxa, a gente não guarda nada de esquisito. Tudo fica criptografado e seguro no Supabase. Não usamos seus dados pra nada, seu e-mail só serve para você conseguir salvar e organizar suas próprias cifras e setlists.
        </p>
        <p>
          <b>O app é de graça? 💸</b><br />
          Atualmente o app é free e pretendo manter assim, alguns recursos podem vir a ser pagos via assinatura, mas a ideia é que seja sempre acessível na forma gratuíta!
        </p>
        <p>
          <b>Sobre o criador</b><br />
          Flavio Bei é luthier, baixista e programador. <br />Conheça mais do meu trabalho <br /><br />
          <a href="https://www.instagram.com/flaviobei/" target="_blank" class="link-social link-instagram">Instagram</a>
          /
          <a href="https://www.youtube.com/@flaviobei?sub_confirmation=1" target="_blank" class="link-social link-youtube">Youtube</a>
        </p>
      `,
    },
    updates: {
      title: "Últimas Atualizações",
      content: `
        <ul class="updates-list">
          <li><strong>Clicar e arrastar:</strong> Agora você pode clicar e arrastar as cifras para reordenar a ordem so seu setlist. Inclusive no gráfico de BPM</li>
          <li><strong>Tap Tempo:</strong> Adicionado botão para descobrir BPM facilmente nas cifras.</li>
          <li><strong>Download Setlist:</strong> Opção de baixar setlist completo como arquivo de texto para uso offline.</li>
          <li><strong>Ordenação de Cifras:</strong> Nova opção de ordenar por Nome, Artista ou Mais Recentes.</li>
        </ul>
      `,
    },
    auth: {
      subtitle: "Seu organizador inteligente de setlists e cifras",
      signInTitle: "Entrar no MusicRoll",
      signUpTitle: "Criar Nova Conta",
      email: "E-mail",
      emailPlaceholder: "exemplo{'@'}email.com",
      password: "Senha",
      passwordPlaceholder: "Sua senha secreta",
      signInBtn: "Entrar",
      signUpBtn: "Cadastrar",
      hasAccount: "Já possui uma conta?",
      newHere: "Novo por aqui?",
      clickLogin: "Faça login",
      clickSignup: "Crie uma conta",
    },
    dashboard: {
      welcome: "Bem-vindo, {name}!",
      subtitle: "Aqui está um resumo do seu acervo musical.",
      newSong: "Nova Cifra",
      allSongs: "Cifras",
      mySetlists: "Setlists",
      latestSongs: "Últimas Cifras Adicionadas",
      latestSetlists: "Setlists Recentes",
      emptySongs: "Nenhuma música cadastrada ainda.",
      emptySetlists: "Nenhum setlist criado ainda.",
    },
    songs: {
      title: "Cifras",
      search: "Buscar cifra ou artista...",
      sortTitle: "Título",
      sortArtist: "Artista",
      sortRecent: "Mais Recentes",
      empty: "Nenhuma música encontrada.",
      delete: "Excluir",
      edit: "Editar",
      back: "Voltar",
      confirmDelete: "Tem certeza que deseja excluir esta cifra?",
    },
    songForm: {
      newTitle: "Adicionar Nova Cifra",
      editTitle: "Editar Cifra",
      songName: "Título da Música",
      artist: "Artista",
      tone: "Tom",
      duration: "Duração (min)",
      bpm: "BPM (Velocidade)",
      content: "Conteúdo (Cifra/Letra)",
      notes: "Observações / Convenção",
      helper:
        "Use acordes no formato Am, G7, C#m. Cole a cifra completa com letra.",
      save: "Salvar Cifra",
      cancel: "Cancelar",
      loadSample: "Carregar Exemplo",
      tempo: {
        slow: "Lento",
        medium: "Médio",
        fast: "Rápido",
      },
    },
    setlists: {
      title: "Meus Setlists",
      create: "Criar Setlist",
      namePlaceholder: "Nome do Show/Setlist",
      save: "Salvar",
      cancel: "Cancelar",
      empty: "Nenhum setlist. Crie o seu primeiro show!",
      addSong: "Adicionar Música",
      emptySongs: "Este setlist está vazio. Adicione músicas!",
      closeShow: "Sair do Show",
      playShow: "Iniciar Show",
      availableSongs: "Músicas Disponíveis",
    },
  },
  en: {
    app: {
      logout: "Logout",
      loading: "Loading...",
      close: "Close",
      install: "Install",
      installTitle: "Install MusicRoll",
      installAndroid: "Get the app on your home screen.",
      installIOS:
        'To install on iPhone, tap the Share icon in Safari and select "Add to Home Screen".',
    },
    about: {
      title: "About MusicRoll",
      content: `
        <p>MusicRoll is your smart setlist and chord organizer.</p>
        <p>It was created for musicians who need an easy way to auto-scroll their chords while playing, without interruptions and with full speed control.</p>
        <p>Developed with love to make life easier on stage and in rehearsals!</p>
        <p>
          <b>What about my data? 🕵️‍♂️</b><br />
          Relax, we don't keep anything weird. Everything is encrypted and securely stored in Supabase. We don't use your data for anything; your email is only needed so you can save and organize your own chords and setlists.
        </p>
        <p>
          <b>Is the app free? 💸</b><br />
          Currently the app is free and I intend to keep it that way, some features might become paid via subscription, but the idea is for it to always be accessible for free!
        </p>
        <p>
          <b>About the creator</b><br />
          Flavio Bei is a luthier, bassist, and programmer. <br />Check out more of my work <br /><br />
          <a href="https://www.instagram.com/flaviobei/" target="_blank" class="link-social link-instagram">Instagram</a>
          /
          <a href="https://www.youtube.com/@flaviobei?sub_confirmation=1" target="_blank" class="link-social link-youtube">Youtube</a>
        </p>
      `,
    },
    updates: {
      title: "Latest Updates",
      content: `
        <ul class="updates-list">
          <li><strong>Drag and drop:</strong> Now you can click and drag chords to reorder your setlist. Including in the BPM graph.</li>
          <li><strong>Tap Tempo:</strong> Added button to easily find BPM in chords.</li>
          <li><strong>Download Setlist:</strong> Option to download the full setlist as a text file for offline use.</li>
          <li><strong>Chord Sorting:</strong> New option to sort by Name, Artist, or Most Recent.</li>
        </ul>
      `,
    },
    auth: {
      subtitle: "Your smart setlist and chord organizer",
      signInTitle: "Sign In to MusicRoll",
      signUpTitle: "Create New Account",
      email: "Email",
      emailPlaceholder: "example{'@'}email.com",
      password: "Password",
      passwordPlaceholder: "Your secret password",
      signInBtn: "Sign In",
      signUpBtn: "Sign Up",
      hasAccount: "Already have an account?",
      newHere: "New here?",
      clickLogin: "Log In",
      clickSignup: "Create an account",
    },
    dashboard: {
      welcome: "Welcome, {name}!",
      subtitle: "Here is a summary of your musical library.",
      newSong: "New Chord",
      allSongs: "All Chords",
      mySetlists: "My Setlists",
      latestSongs: "Latest Added Chords",
      latestSetlists: "Recent Setlists",
      emptySongs: "No songs added yet.",
      emptySetlists: "No setlists created yet.",
    },
    songs: {
      title: "My Chords",
      search: "Search song or artist...",
      sortTitle: "Title",
      sortArtist: "Artist",
      sortRecent: "Most Recent",
      empty: "No songs found.",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      confirmDelete: "Are you sure you want to delete this song?",
    },
    songForm: {
      newTitle: "Add New Song",
      editTitle: "Edit Song",
      songName: "Song Title",
      artist: "Artist",
      tone: "Key / Tone",
      duration: "Duration (min)",
      bpm: "BPM (Tempo)",
      content: "Content (Chords/Lyrics)",
      notes: "Notes / Convention",
      helper:
        "Use chords in Am, G7, C#m format. Paste the full chord chart with lyrics.",
      save: "Save Song",
      cancel: "Cancel",
      loadSample: "Load Sample",
      tempo: {
        slow: "Slow",
        medium: "Medium",
        fast: "Fast",
      },
    },
    setlists: {
      title: "My Setlists",
      create: "Create Setlist",
      namePlaceholder: "Show/Setlist Name",
      save: "Save",
      cancel: "Cancel",
      empty: "No setlists. Create your first show!",
      addSong: "Add Song",
      emptySongs: "This setlist is empty. Add some songs!",
      closeShow: "Exit Show",
      playShow: "Start Show",
      availableSongs: "Available Songs",
    },
  },
  es: {
    app: {
      logout: "Cerrar Sesión",
      loading: "Cargando...",
      close: "Cerrar",
      install: "Instalar",
      installTitle: "Instala MusicRoll",
      installAndroid: "Obtén la aplicación en tu pantalla de inicio.",
      installIOS:
        'Para instalar en iPhone, toca el ícono Compartir en Safari y selecciona "Agregar a Inicio".',
    },
    about: {
      title: "Sobre MusicRoll",
      content: `
        <p>MusicRoll es tu organizador inteligente de setlists y acordes.</p>
        <p>Fue creado para músicos que necesitan una forma fácil de desplazar automáticamente sus acordes mientras tocan, sin interrupciones y con control total de la velocidad.</p>
        <p>¡Desarrollado con cariño para facilitar la vida en el escenario y en los ensayos!</p>
        <p>
          <b>¿Y mis datos? 🕵️‍♂️</b><br />
          Relájate, no guardamos nada raro. Todo está encriptado y seguro en Supabase. No usamos tus datos para nada, tu correo solo sirve para que puedas guardar y organizar tus propios acordes y setlists.
        </p>
        <p>
          <b>¿La app es gratis? 💸</b><br />
          Actualmente la app es gratis y pretendo mantenerla así, algunas funciones podrían volverse de pago mediante suscripción, ¡pero la idea es que siempre sea accesible de forma gratuita!
        </p>
        <p>
          <b>Sobre el creador</b><br />
          Flavio Bei es luthier, bajista y programador. <br />Conoce más de mi trabajo <br /><br />
          <a href="https://www.instagram.com/flaviobei/" target="_blank" class="link-social link-instagram">Instagram</a>
          /
          <a href="https://www.youtube.com/@flaviobei?sub_confirmation=1" target="_blank" class="link-social link-youtube">Youtube</a>
        </p>
      `,
    },
    updates: {
      title: "Últimas Actualizaciones",
      content: `
        <ul class="updates-list">
          <li><strong>Arrastrar y soltar:</strong> Ahora puedes hacer clic y arrastrar los acordes para reordenar tu setlist. Incluso en el gráfico de BPM.</li>
          <li><strong>Tap Tempo:</strong> Se agregó un botón para descubrir fácilmente el BPM en los acordes.</li>
          <li><strong>Descargar Setlist:</strong> Opción de descargar el setlist completo como archivo de texto para uso sin conexión.</li>
          <li><strong>Orden de Acordes:</strong> Nueva opción para ordenar por Nombre, Artista o Más Recientes.</li>
        </ul>
      `,
    },
    auth: {
      subtitle: "Tu organizador inteligente de setlists y acordes",
      signInTitle: "Entrar en MusicRoll",
      signUpTitle: "Crear Nueva Cuenta",
      email: "Correo",
      emailPlaceholder: "ejemplo{'@'}correo.com",
      password: "Contraseña",
      passwordPlaceholder: "Tu contraseña secreta",
      signInBtn: "Entrar",
      signUpBtn: "Registrarse",
      hasAccount: "¿Ya tienes una cuenta?",
      newHere: "¿Nuevo por aquí?",
      clickLogin: "Inicia sesión",
      clickSignup: "Crea una cuenta",
    },
    dashboard: {
      welcome: "¡Bienvenido, {name}!",
      subtitle: "Aquí tienes un resumen de tu repertorio musical.",
      newSong: "Nuevo Acorde",
      allSongs: "Todos los Acordes",
      mySetlists: "Mis Setlists",
      latestSongs: "Últimos Acordes Añadidos",
      latestSetlists: "Setlists Recientes",
      emptySongs: "Aún no has añadido canciones.",
      emptySetlists: "Aún no has creado setlists.",
    },
    songs: {
      title: "Mis Acordes",
      search: "Buscar canción o artista...",
      sortTitle: "Título",
      sortArtist: "Artista",
      sortRecent: "Más Recientes",
      empty: "No se encontraron canciones.",
      delete: "Eliminar",
      edit: "Editar",
      back: "Volver",
      confirmDelete: "¿Estás seguro de que quieres eliminar esta canción?",
    },
    songForm: {
      newTitle: "Añadir Nueva Canción",
      editTitle: "Editar Canción",
      songName: "Título de la Canción",
      artist: "Artista",
      tone: "Tonalidad",
      duration: "Duración (min)",
      bpm: "BPM (Tempo)",
      content: "Contenido (Acordes/Letra)",
      notes: "Notas / Convención",
      helper:
        "Usa acordes en formato Am, G7, C#m. Pega la cifra completa con letra.",
      save: "Guardar Canción",
      cancel: "Cancelar",
      loadSample: "Cargar Ejemplo",
      tempo: {
        slow: "Lento",
        medium: "Medio",
        fast: "Rápido",
      },
    },
    setlists: {
      title: "Mis Setlists",
      create: "Crear Setlist",
      namePlaceholder: "Nombre del Show/Setlist",
      save: "Guardar",
      cancel: "Cancelar",
      empty: "Sin setlists. ¡Crea tu primer show!",
      addSong: "Añadir Canción",
      emptySongs: "Este setlist está vacío. ¡Añade algunas canciones!",
      closeShow: "Salir del Show",
      playShow: "Iniciar Show",
      availableSongs: "Canciones Disponibles",
    },
  },
};

// Get saved language or fallback to browser language, or 'pt'
const savedLocale = localStorage.getItem("musicroll_lang");
const navLang = navigator.language.split("-")[0];
const defaultLocale =
  savedLocale || (["pt", "en", "es"].includes(navLang) ? navLang : "pt");

const i18n = createI18n({
  legacy: false, // use Composition API
  globalInjection: true,
  locale: defaultLocale,
  fallbackLocale: "pt",
  messages,
});

export default i18n;
