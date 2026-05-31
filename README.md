<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/music.svg" alt="MusicRoll Logo" width="120" height="120">
  <h1>🎸 MusicRoll</h1>
  <p><strong>O seu organizador inteligente de setlists e cifras, feito de músico para músico!</strong></p>
</div>

<br />

O **MusicRoll** é uma aplicação web focada em resolver o problema clássico de quem toca ao vivo ou ensaia: gerenciar o repertório de forma rápida, sem depender de pastas pesadas ou telas estáticas. Com foco total na experiência no palco, o app traz controle de velocidade de rolagem, análise visual de energia do show (BPM e Tons) e transposição de acordes em tempo real.

## ✨ Funcionalidades Principais

* **📜 Rolagem Automática Inteligente (Auto-scroll):** A tela rola sozinha na velocidade exata que você precisa. O cálculo de rolagem é influenciado pelo BPM da música!
* **📝 Editor com Inteligência de Cifras:** Cole cifras de qualquer lugar da internet. O sistema detecta magicamente onde estão os acordes e formata tudo com destaque visual (roxo) na tela.
* **🎛 Transposição em Tempo Real (Transpose):** Suba ou desça o tom da música com um clique. O algoritmo recalcula os acordes (incluindo baixos invertidos e extensões) na hora!
* **📊 Gráfico de Energia (Fluxo de BPM):** Crie um setlist e veja um gráfico de barras indicando a energia do seu show (Músicas lentas em azul, agitadas em vermelho).
* **🖱 Drag and Drop:** Reordene seu setlist arrastando as músicas com o mouse, ou arraste direto as barras do gráfico de BPM para equilibrar a vibe do show.
* **🌍 Multilíngue:** Suporte nativo para Português, Inglês e Espanhol (i18n).
* **📱 PWA Ready:** Instale direto no seu celular (iOS/Android) como um aplicativo nativo para acesso rápido.
* **☁️ Sincronização em Nuvem:** Seus dados salvos e seguros com Supabase. (Com suporte a fallback local/offline no Modo Demo).

## 🛠 Tecnologias Utilizadas

* **Frontend:** Vue 3 (Composition API) + Vite
* **Estilização:** CSS3 Vanilla moderno (Glassmorphism, CSS Variables, Flexbox/Grid)
* **Backend / Auth / DB:** Supabase
* **Ícones:** Lucide Vue
* **Internacionalização:** Vue-i18n

## 🚀 Como rodar o projeto localmente

1. Clone este repositório:
   ```bash
   git clone https://github.com/flaviobei/musicroll.git
   ```
2. Entre na pasta do projeto:
   ```bash
   cd musicroll
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=sua_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_key_aqui
   ```
5. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 👨‍💻 Sobre o Criador

Desenvolvido com carinho por **Flavio Bei** — Luthier, Baixista e Programador.  
Conheça mais do meu trabalho:
- [Instagram - @flaviobei](https://www.instagram.com/flaviobei/)
- [YouTube - Flavio Bei](https://www.youtube.com/@flaviobei?sub_confirmation=1)

---
<div align="center">
  <i>Que a música não pare! 🎵</i>
</div>
