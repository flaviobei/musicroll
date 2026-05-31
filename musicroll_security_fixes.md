# MusicRoll — Correções de Segurança

Passos para aplicar as correções identificadas na auditoria. Execute na ordem indicada.

---

## 1. Instalar DOMPurify para sanitização de XSS

**Arquivo:** `package.json` / terminal

```bash
npm install dompurify
```

Se o projeto usar TypeScript futuramente:
```bash
npm install --save-dev @types/dompurify
```

---

## 2. Sanitizar conteúdo antes de renderizar via v-html

**Arquivo:** `src/components/SongList.vue`

Localizar o computed `parsedSongContent` e adicionar a sanitização:

```diff
- import { parseAndTranspose } from "../lib/chordParser";
+ import { parseAndTranspose } from "../lib/chordParser";
+ import DOMPurify from "dompurify";

  const parsedSongContent = computed(() => {
-   return parseAndTranspose(activeSong.value?.content || '', transposeLevel.value);
+   const raw = activeSong.value?.content || '';
+   const sanitized = DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
+   return parseAndTranspose(sanitized, transposeLevel.value);
  });
```

> O `ALLOWED_TAGS: []` garante que nenhuma tag HTML do input do usuário sobreviva antes de entrar no parser. O parser então adiciona apenas os `<span>` controlados por ele.

---

## 3. Remover stack trace da interface de produção

**Arquivo:** `src/App.vue`

Localizar o bloco `v-if="fatalError"` no template e substituir pelo trecho abaixo:

```diff
  <div v-if="fatalError" ...>
    <h3>🚨 Erro Crítico (Debug)</h3>
    <p><strong>Mensagem:</strong> {{ fatalError.message }}</p>
    <p><strong>Contexto:</strong> {{ fatalError.info }}</p>
-   <pre>{{ fatalError.stack }}</pre>
+   <pre v-if="isDev">{{ fatalError.stack }}</pre>
  </div>
```

Adicionar a variável no `<script setup>`:

```diff
+ const isDev = import.meta.env.DEV;
```

> Em build de produção (`vite build`) `import.meta.env.DEV` é `false`, escondendo o stack trace automaticamente.

---

## 4. Adicionar validação de senha no cadastro

**Arquivo:** `src/components/AuthForm.vue`

Localizar a função `handleAuth` e adicionar a validação antes do `try`:

```diff
  const handleAuth = async () => {
    if (!email.value || !password.value) {
      errorMessage.value = 'Por favor, preencha todos os campos.'
      return
    }

+   if (isSignUp.value && password.value.length < 8) {
+     errorMessage.value = 'A senha deve ter no mínimo 8 caracteres.'
+     return
+   }

    loading.value = true
    ...
  }
```

Também adicionar `minlength` no input do HTML:

```diff
  <input
    id="password"
    type="password"
    v-model="password"
+   :minlength="isSignUp ? 8 : undefined"
    class="form-input"
    required
  />
```

---

## 5. Adicionar Content-Security-Policy no Vercel

**Arquivo:** `vercel.json`

Substituir o array de headers existente:

```diff
  {
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-XSS-Protection", "value": "1; mode=block" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
-         { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
+         { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
+         { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
+         { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.vercel-insights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com; font-src 'self' data:;" }
        ]
      }
    ]
  }
```

> O `unsafe-inline` em `script-src` e `style-src` é necessário pelo modo como o Vite injeta estilos em produção. Para remover futuramente, é preciso configurar nonces via plugin do Vite.

---

## 6. Verificar e aplicar o patch de RLS no Supabase

**Ação no painel do Supabase** (não é código de aplicação)

1. Acessar o projeto em [supabase.com](https://supabase.com) → **SQL Editor**
2. Verificar as policies ativas:
   ```sql
   SELECT policyname, cmd, qual
   FROM pg_policies
   WHERE tablename = 'songs';
   ```
3. Se a policy `"Qualquer um pode ler músicas"` ainda existir, executar o script já presente no repositório:

   ```bash
   # O arquivo já existe no repo:
   # secure_rls_patch.sql
   ```

   Ou colar diretamente no SQL Editor:
   ```sql
   DROP POLICY IF EXISTS "Qualquer um pode ler músicas" ON public.songs;

   CREATE POLICY "Usuários podem ver apenas suas próprias músicas"
   ON public.songs FOR SELECT
   USING (auth.uid() = user_id);
   ```

4. Confirmar que apenas as seguintes policies existem em `songs`:
   - `SELECT` → `auth.uid() = user_id`
   - `INSERT` → `auth.role() = 'authenticated'`
   - `UPDATE` → `auth.uid() = user_id`
   - `DELETE` → `auth.uid() = user_id`

---

## 7. Remover user-scalable=no do viewport (acessibilidade)

**Arquivo:** `index.html`

```diff
  <meta
    name="viewport"
-   content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no"
+   content="width=device-width, initial-scale=1.0, viewport-fit=cover"
  />
```

> Bloquear zoom viola WCAG 1.4.4 e pode impactar usuários com baixa visão. O app de cifras em particular é usado em performances ao vivo — zoom rápido pode ser essencial.

---

## Checklist final

| # | Correção | Arquivo | Status |
|---|----------|---------|--------|
| 1 | Instalar DOMPurify | `package.json` | ☐ |
| 2 | Sanitizar antes do v-html | `SongList.vue` | ☐ |
| 3 | Ocultar stack trace em produção | `App.vue` | ☐ |
| 4 | Validação de senha mínima | `AuthForm.vue` | ☐ |
| 5 | CSP + HSTS no Vercel | `vercel.json` | ☐ |
| 6 | Aplicar patch de RLS no Supabase | SQL Editor | ☐ |
| 7 | Remover user-scalable=no | `index.html` | ☐ |
