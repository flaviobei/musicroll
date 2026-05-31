-- supabase_schema_final.sql
-- Schema completo e atualizado. Execute do zero em novos projetos.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABELA: songs
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL CHECK (char_length(title) > 0),
    artist TEXT NOT NULL CHECK (char_length(artist) > 0),
    content TEXT NOT NULL,
    tone TEXT,
    notes TEXT,
    bpm INTEGER NOT NULL DEFAULT 120 CHECK (bpm > 0),
    duration INTEGER NOT NULL DEFAULT 4 CHECK (duration > 0),
    default_scroll_speed NUMERIC NOT NULL DEFAULT 1.0 CHECK (default_scroll_speed > 0),
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- RLS: songs (isolado por usuário e leitura pública)
CREATE POLICY "Músicas públicas são visíveis para todos"
ON public.songs FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Usuários autenticados podem inserir músicas"
ON public.songs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem atualizar suas próprias músicas"
ON public.songs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias músicas"
ON public.songs FOR DELETE USING (auth.uid() = user_id);


-- TABELA: setlists
CREATE TABLE IF NOT EXISTS public.setlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL CHECK (char_length(name) > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.setlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias setlists"
ON public.setlists FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias setlists"
ON public.setlists FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias setlists"
ON public.setlists FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias setlists"
ON public.setlists FOR DELETE USING (auth.uid() = user_id);


-- TABELA: setlist_songs
CREATE TABLE IF NOT EXISTS public.setlist_songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setlist_id UUID REFERENCES public.setlists(id) ON DELETE CASCADE NOT NULL,
    song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE NOT NULL,
    order_index INTEGER NOT NULL CHECK (order_index >= 0),
    custom_scroll_speed NUMERIC CHECK (custom_scroll_speed > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (setlist_id, song_id)
);

ALTER TABLE public.setlist_songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar músicas de suas setlists"
ON public.setlist_songs FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.setlists
        WHERE public.setlists.id = public.setlist_songs.setlist_id
        AND public.setlists.user_id = auth.uid()
    )
);
