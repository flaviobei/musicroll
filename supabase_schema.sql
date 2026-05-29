-- ==========================================
-- SQL SCHEMA - APP DE CIFRAS E ROLAGEM
-- Execute este script no SQL Editor do Supabase
-- ==========================================

-- Habilitar a extensão UUID se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE MÚSICAS (songs)
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Criador da música
    title TEXT NOT NULL CHECK (char_length(title) > 0),
    artist TEXT NOT NULL CHECK (char_length(artist) > 0),
    content TEXT NOT NULL, -- Cifra + Letra cruas
    default_scroll_speed NUMERIC NOT NULL DEFAULT 1.0 CHECK (default_scroll_speed > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para songs
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para songs
-- Qualquer um (mesmo deslogado) pode ler as músicas
CREATE POLICY "Qualquer um pode ler músicas" 
ON public.songs FOR SELECT 
USING (true);

-- Apenas usuários autenticados podem inserir músicas
CREATE POLICY "Usuários autenticados podem inserir músicas" 
ON public.songs FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- O usuário só pode alterar ou deletar as músicas que ele mesmo criou
CREATE POLICY "Usuários podem atualizar suas próprias músicas" 
ON public.songs FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias músicas" 
ON public.songs FOR DELETE 
USING (auth.uid() = user_id);


-- 2. TABELA DE SETLISTS (setlists)
CREATE TABLE IF NOT EXISTS public.setlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL CHECK (char_length(name) > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para setlists
ALTER TABLE public.setlists ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para setlists (apenas o próprio dono gerencia)
CREATE POLICY "Usuários podem ver suas próprias setlists" 
ON public.setlists FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias setlists" 
ON public.setlists FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias setlists" 
ON public.setlists FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias setlists" 
ON public.setlists FOR DELETE 
USING (auth.uid() = user_id);


-- 3. TABELA DE RELACIONAMENTO (setlist_songs)
CREATE TABLE IF NOT EXISTS public.setlist_songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setlist_id UUID REFERENCES public.setlists(id) ON DELETE CASCADE NOT NULL,
    song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE NOT NULL,
    order_index INTEGER NOT NULL CHECK (order_index >= 0),
    custom_scroll_speed NUMERIC CHECK (custom_scroll_speed > 0), -- Sobrescreve a velocidade padrão
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (setlist_id, song_id) -- Garante que uma música não se repita na mesma setlist
);

-- Habilitar RLS para setlist_songs
ALTER TABLE public.setlist_songs ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para setlist_songs (acesso atrelado ao dono da setlist)
CREATE POLICY "Usuários podem gerenciar músicas de suas setlists" 
ON public.setlist_songs FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.setlists 
        WHERE public.setlists.id = public.setlist_songs.setlist_id 
        AND public.setlists.user_id = auth.uid()
    )
);
