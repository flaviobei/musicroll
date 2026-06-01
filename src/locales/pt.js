export default {
  app: {
    logout: "Sair",
    loading: "Carregando...",
    close: "Fechar",
    cancel: "Cancelar",
    sending: "Enviando...",
    install: "Instalar",
    installTitle: "Instale o MusicRoll",
    installAndroid: "Tenha o aplicativo na tela inicial do seu celular.",
    installIOS:
      'Para instalar no iPhone, clique no ícone Compartilhar do Safari e em "Adicionar à Tela de Início".',
    demoMode: "Modo Demo Local",
    backToMenu: "Voltar ao Menu Principal",
    footer: "© 2026 MusicRoll. Desenvolvido por FLB.",
    aboutApp: "Sobre o App",
    errorTitle: "🚨 Erro Crítico (Debug)",
    errorMsg: "Mensagem:",
    errorCtx: "Contexto:",
    changeLanguage: "Mudar Idioma",
    envWarning: "Configure o arquivo .env para salvar em nuvem",
    whatIsThis: "O que é isso?",
    sharedVia: "Compartilhado via",
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
        Flavio Bei é luthier, baixista e programador (nessa ordem!!!) <br />Conheça mais do meu trabalho <br /><br />
        <a href="https://www.instagram.com/flaviobei/" target="_blank" class="link-social link-instagram">Instagram</a>
        /
        <a href="https://www.youtube.com/{'@'}flaviobei?sub_confirmation=1" target="_blank" class="link-social link-youtube">Youtube</a>
        /
        <a href="https://github.com/flaviobei" target="_blank" class="link-social link-github">GitHub</a>
      </p>
    `,
  },
  updates: {
    title: "Últimas Atualizações",
    button: "Novidades",
    content: `
      <ul class="updates-list">
        <li><strong>Drag and drop:</strong> Agora você pode clicar e arrastar as cifras para reordenar seu setlist. Inclusive no gráfico de BPM.</li>
        <li><strong>Tap Tempo:</strong> Adicionado botão pra descobrir o BPM facilmente nas cifras.</li>
        <li><strong>Baixar Setlist:</strong> Opção de baixar o setlist completo num arquivo de texto pro uso offline.</li>
      </ul>
    `,
  },
  feedback: {
    title: "Sugestões e Erros",
    button: "Sugestões",
    description:
      "Encontrou um erro ou tem uma ideia legal pro MusicRoll? Manda pra gente!",
    typeLabel: "Sobre o que você quer falar?",
    typeBug: "Reportar Erro",
    typeIdea: "Ideia / Sugestão",
    typeOther: "Outros",
    messageLabel: "Sua mensagem",
    messagePlaceholder: "Descreva em detalhes o erro ou sua ideia...",
    submit: "Enviar Mensagem",
    error: "Ocorreu um erro ao enviar. Tente novamente mais tarde.",
    successTitle: "Mensagem Enviada!",
    successMessage:
      "Obrigado pelo seu feedback! Ele nos ajuda a melhorar o app.",
  },
  nerd: {
    title: "Easter Egg Encontrado!",
    content: `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <img src="https://campuscode-site.s3.sa-east-1.amazonaws.com/newsletter/187_evolu%C3%A7%C3%A3o.gif" style="max-width: 100%; border-radius: 8px;" alt="Nerd typing fast">
      </div>
      <p><b>O que você veio buscar aqui, seu nerd? 🤓</b></p>
      <p>Acha que só porque clicou na versão do app ia achar algum segredo super confidencial?</p>
      <p>Bom... já que você está aqui, saiba que o MusicRoll é um projeto open-source construído inteiramente com <strong>Vue 3</strong>, <strong>Vite</strong> e <strong>Supabase</strong> (pro backend).</p>
      <p>A estilização foi feita no braço usando CSS Vanilla moderno (variáveis e Glassmorphism) e tudo roda direto no navegador, inclusive podendo ser instalado como um PWA.</p>
      <p style="text-align: center; margin-top: 1.5rem;">
        Quer ver o código fonte, dar pitaco ou fazer um fork?<br><br>
        <a href="https://github.com/flaviobei/musicroll" target="_blank" class="btn btn-primary" style="display: inline-block; text-decoration: none;">Acessar Repositório no GitHub</a>
      </p>
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
    emptyWelcomeTitle: "Dê o play na sua jornada musical! 🎸",
    emptyWelcomeDesc: "O MusicRoll está pronto, mas seu acervo ainda está vazio. Cadastre sua primeira cifra para liberar o rolador automático e montar seus setlists!",
    createFirstSong: "Cadastrar Minha Primeira Cifra",
    playNow: "Tocar Agora",
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
    viewAndScroll: "Ver & Rolar",
    nextInSetlist: "Próxima da Setlist",
    nextSongIn: "Próxima música em",
    nextSong: "Próxima Música ➔",
    slowDown: "Diminuir Velocidade",
    speedUp: "Aumentar Velocidade",
    playPause: "Play/Pause",
    transposeBadge: "Tom",
    decreaseFont: "Diminuir Fonte",
    increaseFont: "Aumentar Fonte",
    scrollTop: "Voltar ao Início",
    prevSong: "Música Anterior",
    nextSongTooltip: "Próxima Música",
    copyPublicLink: "Copiar link público",
    over180Bpm: "Acima de 180 BPM",
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
    transposeDown: "Diminuir Tom",
    transposeUp: "Aumentar Tom",
    tapTempoTooltip: "Clique no ritmo para descobrir o BPM",
    makePublic: "Tornar esta cifra pública (acessível por link)",
    transposePermanent: "Transpor (Definitivo)",
  },
  setlists: {
    title: "Meus Setlists",
    create: "Criar Setlist",
    namePlaceholder: "Nome do Show/Setlist",
    setlistPlaceholder: "Ex: Show de Sexta",
    newSetlist: "Novo Setlist",
    mySetlists: "Meus Setlists",
    noSetlists: "Nenhum setlist criado.",
    save: "Salvar",
    cancel: "Cancelar",
    empty: "Nenhum setlist. Crie o seu primeiro show!",
    addSong: "Adicionar Música",
    emptySongs: "Este setlist está vazio. Adicione músicas!",
    closeShow: "Sair do Show",
    playShow: "Iniciar Show",
    availableSongs: "Músicas Disponíveis",
    songOrder: "Ordem das Músicas",
    library: "Acervo",
    searchLibrary: "Buscar música...",
    noSongsSearch: "Nenhuma música encontrada na busca.",
    noSongsLibrary: "Nenhuma música cadastrada no acervo.",
    loginTitle: "Faça login para criar setlists",
    loginDesc:
      "As setlists são associadas à sua conta na nuvem para manter a segurança do banco.",
    noSongsWarningTitle: "Nenhuma música cadastrada",
    noSongsWarningDesc: "Para criar e montar um setlist completo, você precisa primeiro ter músicas cadastradas no seu acervo.",
    registerFirstSong: "Cadastrar Cifra",
    downloadTxt: "Baixar .txt",
    startPresentation: "Iniciar Apresentação",
    downloadTitle: "Baixar Setlist em Texto",
    songCount: "{count} música(s)",
    energyFlow: "Fluxo de Energia (BPM)",
    estimatedDuration: "Duração Estimada: {time} min",
    dragToReorder: "Arraste para reordenar",
    addSongTooltip: "Adicionar à Setlist",
    alreadyAddedTooltip: "Já adicionada",
    deleteSetlist: "Excluir Setlist",
    renameSetlist: "Renomear Setlist",
    moveUp: "Subir",
    moveDown: "Descer",
    remove: "Remover",
    newSongTooltip: "Cadastrar Nova Cifra",
  },
  public: {
    loading: "Carregando cifra...",
    notFound: "🔒 Esta cifra não existe ou não está pública.",
    openApp: "Abrir MusicRoll",
  },
  profile: {
    title: "Meu Perfil",
    email: "E-mail (Login)",
    displayName: "Nome de Exibição",
    displayNamePlaceholder: "Seu nome ou apelido",
    musicalRole: "Função Principal",
    selectAvatar: "Escolha seu Avatar",
    customAvatarUrl: "URL de Avatar Customizada (Opcional)",
    customAvatarUrlPlaceholder: "https://exemplo.com/foto.jpg",
    emailSubscription: "Aceito receber e-mails sobre novidades e dicas do MusicRoll",
    changePassword: "Alterar Senha",
    newPassword: "Nova Senha",
    newPasswordPlaceholder: "Mínimo de 6 caracteres",
    confirmPassword: "Confirmar Nova Senha",
    confirmPasswordPlaceholder: "Digite a senha novamente",
    saveBtn: "Salvar Alterações",
    successUpdate: "Perfil atualizado com sucesso!",
    passwordMismatch: "As senhas não coincidem!",
    passwordShort: "A senha deve ter pelo menos 6 caracteres!",
    errorUpdate: "Erro ao atualizar perfil.",
    errorPassword: "Erro ao alterar a senha.",
    roles: {
      vocalist: "🎤 Vocalista",
      guitarist: "🎸 Guitarrista",
      bassist: "🎸 Baixista",
      drummer: "🥁 Baterista",
      keyboardist: "🎹 Tecladista",
      producer: "🎚️ Produtor / Som",
      other: "🎵 Outro",
    },
  },
};
