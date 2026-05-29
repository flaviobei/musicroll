# Escopo do Projeto: App de Cifras e Rolagem

## Stack Tecnológica

- Frontend: Vue.js
- Backend/BaaS: Supabase (Auth e Database)
- Deploy: Vercel

## Funcionalidades Principais

- Autenticação de usuários.
- Cadastro de músicas via colagem de texto bruto (cifra + letra).
- Criação e ordenação de setlists.
- Player de rolagem automática com ajuste de velocidade.

## Modelagem do Banco de Dados

- `users`: Gerenciado nativamente pelo Supabase Auth.
- `songs`: `id`, `title`, `artist`, `content` (text), `default_scroll_speed` (numeric).
- `setlists`: `id`, `user_id`, `name`.
- `setlist_songs`: `setlist_id`, `song_id`, `order_index` (int), `custom_scroll_speed` (numeric, sobrescreve a velocidade padrão para o setlist).

## Regras de Frontend e UI

- **Cadastro:** Utilizar `<textarea>` simples. Não aplicar editores Rich Text (WYSIWYG) para evitar injeção de HTML indesejado.
- **Renderização da Cifra:** Exibir o conteúdo do banco de dados estritamente dentro de uma tag `<pre>` com estilo CSS `font-family: monospace; white-space: pre;`. Isso garante o alinhamento dos acordes usando os espaços em branco originais.
- **Rolagem Automática:** A animação deve ser construída exclusivamente com `requestAnimationFrame` para garantir fluidez.
- **Controle de Velocidade:** O incremento de rolagem deve ser atrelado à variável reativa de velocidade carregada do banco.
