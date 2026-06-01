export default {
  app: {
    logout: "Cerrar Sesión",
    loading: "Cargando...",
    close: "Cerrar",
    cancel: "Cancelar",
    sending: "Enviando...",
    install: "Instalar",
    installTitle: "Instala MusicRoll",
    installAndroid: "Obtén la aplicación en tu pantalla de inicio.",
    installIOS:
      'Para instalar en iPhone, toca el ícono Compartir en Safari y selecciona "Agregar a Inicio".',
    demoMode: "Modo Demo Local",
    backToMenu: "Voltar al Menú Principal",
    footer: "© 2026 MusicRoll. Desarrollado por FLB.",
    aboutApp: "Sobre la App",
    errorTitle: "🚨 Error Crítico (Debug)",
    errorMsg: "Mensaje:",
    errorCtx: "Contexto:",
    changeLanguage: "Cambiar Idioma",
    envWarning: "Configure el archivo .env para guardar en la nube",
    whatIsThis: "¿Qué es esto?",
    sharedVia: "Compartido a través de",
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
        Flavio Bei es luthier, bajista y programador. (en ese orden!)<br />Conoce más de mi trabajo <br /><br />
        <a href="https://www.instagram.com/flaviobei/" target="_blank" class="link-social link-instagram">Instagram</a>
        /
        <a href="https://www.youtube.com/{'@'}flaviobei?sub_confirmation=1" target="_blank" class="link-social link-youtube">Youtube</a>
        /
        <a href="https://github.com/flaviobei" target="_blank" class="link-social link-github">GitHub</a>
      </p>
    `,
  },
  updates: {
    title: "Últimas Actualizaciones",
    button: "Novedades",
    content: `
      <ul class="updates-list">
        <li><strong>Drag and drop:</strong> Ahora puedes hacer clic y arrastrar para reordenar tu setlist. Incluso en el gráfico de BPM.</li>
        <li><strong>Tap Tempo:</strong> Botón añadido para encontrar fácilmente el BPM.</li>
        <li><strong>Descargar Setlist:</strong> Opción para descargar el setlist completo como archivo de texto para uso offline.</li>
      </ul>
    `,
  },
  feedback: {
    title: "Sugerencias y Errores",
    button: "Sugerencias",
    description:
      "¿Encontraste un error o tienes una buena idea para MusicRoll? ¡Envíanosla!",
    typeLabel: "¿Sobre qué quieres hablar?",
    typeBug: "Reportar Error",
    typeIdea: "Idea / Sugerencia",
    typeOther: "Otros",
    messageLabel: "Tu mensaje",
    messagePlaceholder: "Describe el error o tu idea en detalle...",
    submit: "Enviar Mensaje",
    error:
      "Ocurrió un error al enviar. Por favor, inténtalo de nuevo más tarde.",
    successTitle: "¡Mensaje Enviado!",
    successMessage:
      "¡Gracias por tu feedback! Nos ayuda a mejorar la aplicación.",
  },
  nerd: {
    title: "¡Easter Egg Encontrado!",
    content: `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <img src="https://campuscode-site.s3.sa-east-1.amazonaws.com/newsletter/187_evolu%C3%A7%C3%A3o.gif" style="max-width: 100%; border-radius: 8px;" alt="Nerd typing fast">
      </div>
      <p><b>¿Qué viniste a buscar aquí, nerd? 🤓</b></p>
      <p>¿Pensaste que solo por hacer clic en la versión de la app encontrarías algún secreto súper confidencial?</p>
      <p>Bueno... ya que estás aquí, ten en cuenta que MusicRoll es un proyecto open-source construido completamente con <strong>Vue 3</strong>, <strong>Vite</strong> y <strong>Supabase</strong> (para el backend).</p>
      <p>El estilo se hizo a mano utilizando Vanilla CSS moderno (variables y Glassmorphism) y todo se ejecuta directamente en el navegador, e incluso se puede instalar como una PWA.</p>
      <p style="text-align: center; margin-top: 1.5rem;">
        ¿Quieres ver el código fuente, opinar o hacer un fork?<br><br>
        <a href="https://github.com/flaviobei/musicroll" target="_blank" class="btn btn-primary" style="display: inline-block; text-decoration: none;">Acceder al Repositorio en GitHub</a>
      </p>
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
    emptyWelcomeTitle: "¡Inicia tu viaje musical! 🎸",
    emptyWelcomeDesc: "¡MusicRoll está listo, mas tu repertorio está vacío. Registra tu primera canción para activar el desplazamiento automático y armar tus setlists!",
    createFirstSong: "Registrar Mi Primera Canción",
    playNow: "Tocar Ahora",
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
    viewAndScroll: "Ver & Desplazar",
    nextInSetlist: "Siguiente en Setlist",
    nextSongIn: "Siguiente canción en",
    nextSong: "Siguiente Canción ➔",
    slowDown: "Disminuir Velocidad",
    speedUp: "Aumentar Velocidad",
    playPause: "Play/Pause",
    transposeBadge: "Tono",
    decreaseFont: "Disminuir Fuente",
    increaseFont: "Aumentar Fuente",
    scrollTop: "Volver al Inicio",
    prevSong: "Canción Anterior",
    nextSongTooltip: "Siguiente Canción",
    copyPublicLink: "Copiar enlace público",
    over180Bpm: "Por encima de 180 BPM",
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
    transposeDown: "Disminuir Tono",
    transposeUp: "Aumentar Tono",
    tapTempoTooltip: "Haz clic en el ritmo para descubrir el BPM",
    makePublic: "Hacer este acorde público (accesible por enlace)",
    transposePermanent: "Trasponer (Definitivo)",
  },
  setlists: {
    title: "Mis Setlists",
    create: "Crear Setlist",
    namePlaceholder: "Nombre del Show/Setlist",
    setlistPlaceholder: "Ej: Show del Viernes",
    newSetlist: "Nueva Setlist",
    mySetlists: "Mis Setlists",
    noSetlists: "No hay setlists creadas.",
    save: "Guardar",
    cancel: "Cancelar",
    empty: "Sin setlists. ¡Crea tu primer show!",
    addSong: "Añadir Canción",
    emptySongs: "Este setlist está vacío. ¡Añade algunas canciones!",
    closeShow: "Salir del Show",
    playShow: "Iniciar Show",
    availableSongs: "Canciones Disponibles",
    songOrder: "Orden de Canciones",
    library: "Repertorio",
    searchLibrary: "Buscar canción...",
    noSongsSearch: "No se encontraron canciones en la búsqueda.",
    noSongsLibrary: "No hay canciones en el repertorio aún.",
    loginTitle: "Inicia sesión para crear setlists",
    loginDesc:
      "Los setlists están asociados a tu cuenta en la nube para mantener la seguridad.",
    noSongsWarningTitle: "No hay canciones registradas",
    noSongsWarningDesc: "Para crear y armar un setlist completo, primero necesitas tener canciones registradas en tu repertorio.",
    registerFirstSong: "Registrar Canción",
    downloadTxt: "Descargar .txt",
    startPresentation: "Iniciar Presentación",
    downloadTitle: "Descargar Setlist en Texto",
    songCount: "{count} canción(es)",
    energyFlow: "Flujo de Energía (BPM)",
    estimatedDuration: "Duración Estimada: {time} min",
    dragToReorder: "Arrastra para reordenar",
    addSongTooltip: "Agregar a la lista",
    alreadyAddedTooltip: "Ya agregada",
    deleteSetlist: "Eliminar lista",
    renameSetlist: "Renombrar lista",
    moveUp: "Mover Arriba",
    moveDown: "Mover Abajo",
    remove: "Eliminar",
    newSongTooltip: "Registrar nueva cifra",
  },
  public: {
    loading: "Cargando acorde...",
    notFound: "🔒 Este acorde no existe o no es público.",
    openApp: "Abrir MusicRoll",
  },
  profile: {
    title: "Mi Perfil",
    email: "Correo electrónico (Login)",
    displayName: "Nombre de Mostrar",
    displayNamePlaceholder: "Tu nombre o apodo",
    musicalRole: "Rol Principal",
    selectAvatar: "Elige tu Avatar",
    customAvatarUrl: "URL de Avatar Personalizada (Opcional)",
    customAvatarUrlPlaceholder: "https://ejemplo.com/foto.jpg",
    emailSubscription: "Acepto recibir correos sobre novedades y consejos de MusicRoll",
    changePassword: "Cambiar Contraseña",
    newPassword: "Nueva Contraseña",
    newPasswordPlaceholder: "Mínimo 6 caracteres",
    confirmPassword: "Confirmar Nueva Contraseña",
    confirmPasswordPlaceholder: "Escribe la contraseña de nuevo",
    saveBtn: "Guardar Cambios",
    successUpdate: "¡Perfil actualizado con éxito!",
    passwordMismatch: "¡Las contraseñas no coinciden!",
    passwordShort: "¡La contraseña debe tener al menos 6 caracteres!",
    errorUpdate: "Error al actualizar el perfil.",
    errorPassword: "Error al cambiar la contraseña.",
    roles: {
      vocalist: "🎤 Vocalista",
      guitarist: "🎸 Guitarrista",
      bassist: "🎸 Bajista",
      drummer: "🥁 Baterista",
      keyboardist: "🎹 Tecladista",
      producer: "🎚️ Productor / Sonido",
      other: "🎵 Otro",
    },
  },
};
