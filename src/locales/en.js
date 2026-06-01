export default {
  app: {
    logout: "Logout",
    loading: "Loading...",
    close: "Close",
    cancel: "Cancel",
    sending: "Sending...",
    install: "Install",
    installTitle: "Install MusicRoll",
    installAndroid: "Get the app on your home screen.",
    installIOS:
      'To install on iPhone, tap the Share icon in Safari and select "Add to Home Screen".',
    demoMode: "Local Demo Mode",
    backToMenu: "Back to Main Menu",
    footer: "© 2026 MusicRoll. Developed by FLB.",
    aboutApp: "About the App",
    errorTitle: "🚨 Critical Error (Debug)",
    errorMsg: "Message:",
    errorCtx: "Context:",
    changeLanguage: "Change Language",
    envWarning: "Configure the .env file to save in the cloud",
    whatIsThis: "What is this?",
    sharedVia: "Shared via",
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
        Flavio Bei is a luthier, bassist, and programmer. (in that order!!!) <br />Check out more of my work <br /><br />
        <a href="https://www.instagram.com/flaviobei/" target="_blank" class="link-social link-instagram">Instagram</a>
        /
        <a href="https://www.youtube.com/{'@'}flaviobei?sub_confirmation=1" target="_blank" class="link-social link-youtube">Youtube</a>
        /
        <a href="https://github.com/flaviobei" target="_blank" class="link-social link-github">GitHub</a>
      </p>
    `,
  },
  updates: {
    title: "Latest Updates",
    button: "Updates",
    content: `
      <ul class="updates-list">
        <li><strong>Drag and drop:</strong> Now you can click and drag chords to reorder your setlist. Including in the BPM graph.</li>
        <li><strong>Tap Tempo:</strong> Added button to easily find BPM in chords.</li>
        <li><strong>Download Setlist:</strong> Option to download the full setlist as a text file for offline use.</li>
      </ul>
    `,
  },
  feedback: {
    title: "Feedback & Bugs",
    button: "Feedback",
    description:
      "Found a bug or have a cool idea for MusicRoll? Let us know!",
    typeLabel: "What is this about?",
    typeBug: "Report Bug",
    typeIdea: "Idea / Suggestion",
    typeOther: "Other",
    messageLabel: "Your message",
    messagePlaceholder: "Describe the bug or your idea in detail...",
    submit: "Send Message",
    error: "An error occurred while sending. Please try again later.",
    successTitle: "Message Sent!",
    successMessage:
      "Thank you for your feedback! It helps us improve the app.",
  },
  nerd: {
    title: "Easter Egg Found!",
    content: `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <img src="https://campuscode-site.s3.sa-east-1.amazonaws.com/newsletter/187_evolu%C3%A7%C3%A3o.gif" style="max-width: 100%; border-radius: 8px;" alt="Nerd typing fast">
      </div>
      <p><b>What did you come looking for here, you nerd? 🤓</b></p>
      <p>Did you think just because you clicked on the app version you would find some top secret stuff?</p>
      <p>Well... since you are here, you should know that MusicRoll is an open-source project built entirely with <strong>Vue 3</strong>, <strong>Vite</strong> and <strong>Supabase</strong> (for backend).</p>
      <p>The styling was done from scratch using modern Vanilla CSS (variables and Glassmorphism) and everything runs straight in the browser, and can even be installed as a PWA.</p>
      <p style="text-align: center; margin-top: 1.5rem;">
        Want to see the source code, give some feedback or fork it?<br><br>
        <a href="https://github.com/flaviobei/musicroll" target="_blank" class="btn btn-primary" style="display: inline-block; text-decoration: none;">Go to GitHub Repository</a>
      </p>
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
    emptyWelcomeTitle: "Start your musical journey! 🎸",
    emptyWelcomeDesc: "MusicRoll is ready, but your library is empty. Register your first song to unlock the automatic scroll and build your setlists!",
    createFirstSong: "Register My First Song",
    playNow: "Play Now",
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
    viewAndScroll: "View & Scroll",
    nextInSetlist: "Next in Setlist",
    nextSongIn: "Next song in",
    nextSong: "Next Song ➔",
    slowDown: "Slow Down",
    speedUp: "Speed Up",
    playPause: "Play/Pause",
    transposeBadge: "Key / Tone",
    decreaseFont: "Decrease Font Size",
    increaseFont: "Increase Font Size",
    scrollTop: "Back to Top",
    prevSong: "Previous Song",
    nextSongTooltip: "Next Song",
    copyPublicLink: "Copy public link",
    over180Bpm: "Above 180 BPM",
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
    transposeDown: "Transpose Down",
    transposeUp: "Transpose Up",
    tapTempoTooltip: "Click in rhythm to discover BPM",
    makePublic: "Make this chord public (accessible via link)",
    transposePermanent: "Transpose (Permanent)",
  },
  setlists: {
    title: "My Setlists",
    create: "Create Setlist",
    namePlaceholder: "Show/Setlist Name",
    setlistPlaceholder: "E.g.: Friday Night Show",
    newSetlist: "New Setlist",
    mySetlists: "My Setlists",
    noSetlists: "No setlists created yet.",
    save: "Save",
    cancel: "Cancel",
    empty: "No setlists. Create your first show!",
    addSong: "Add Song",
    emptySongs: "This setlist is empty. Add some songs!",
    closeShow: "Exit Show",
    playShow: "Start Show",
    availableSongs: "Available Songs",
    songOrder: "Song Order",
    library: "Library",
    searchLibrary: "Search song...",
    noSongsSearch: "No songs found for this search.",
    noSongsLibrary: "No songs in the library yet.",
    loginTitle: "Log in to create setlists",
    loginDesc:
      "Setlists are linked to your cloud account to keep your data safe.",
    noSongsWarningTitle: "No songs registered yet",
    noSongsWarningDesc: "To create and build a complete setlist, you first need to have songs registered in your library.",
    registerFirstSong: "Register Song",
    downloadTxt: "Download .txt",
    startPresentation: "Start Presentation",
    downloadTitle: "Download Setlist in Text",
    songCount: "{count} song(s)",
    energyFlow: "Energy Flow (BPM)",
    estimatedDuration: "Estimated Duration: {time} min",
    dragToReorder: "Drag to reorder",
    addSongTooltip: "Add to Setlist",
    alreadyAddedTooltip: "Already added",
    deleteSetlist: "Delete Setlist",
    renameSetlist: "Rename Setlist",
    moveUp: "Move Up",
    moveDown: "Move Down",
    remove: "Remove",
    newSongTooltip: "Register New Chord",
  },
  public: {
    loading: "Loading chord...",
    notFound: "🔒 This chord does not exist or is not public.",
    openApp: "Open MusicRoll",
  },
  profile: {
    title: "My Profile",
    email: "Email (Login)",
    displayName: "Display Name",
    displayNamePlaceholder: "Your name or nickname",
    musicalRole: "Primary Role",
    selectAvatar: "Choose your Avatar",
    customAvatarUrl: "Custom Avatar URL (Optional)",
    customAvatarUrlPlaceholder: "https://example.com/photo.jpg",
    emailSubscription: "I agree to receive emails about MusicRoll updates and tips",
    changePassword: "Change Password",
    newPassword: "New Password",
    newPasswordPlaceholder: "Minimum 6 characters",
    confirmPassword: "Confirm New Password",
    confirmPasswordPlaceholder: "Type the password again",
    saveBtn: "Save Changes",
    successUpdate: "Profile updated successfully!",
    passwordMismatch: "Passwords do not match!",
    passwordShort: "Password must be at least 6 characters!",
    errorUpdate: "Error updating profile.",
    errorPassword: "Error changing password.",
    roles: {
      vocalist: "🎤 Vocalist",
      guitarist: "🎸 Guitarist",
      bassist: "🎸 Bassist",
      drummer: "🥁 Drummer",
      keyboardist: "🎹 Keyboardist",
      producer: "🎚️ Producer / Sound",
      other: "🎵 Other",
    },
  },
};
