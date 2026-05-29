-- ==========================================
-- SCRIPT DE CORREÇÃO DE SEGURANÇA (RLS)
-- Execute este script no SQL Editor do Supabase
-- ==========================================

-- 1. Deletar a política pública insegura antiga
DROP POLICY IF EXISTS "Qualquer um pode ler músicas" ON public.songs;

-- 2. Criar a nova política isolada que permite apenas ao dono ler suas próprias músicas
CREATE POLICY "Usuários podem ver apenas suas próprias músicas" 
ON public.songs FOR SELECT 
USING (auth.uid() = user_id);

-- Confirmação: A partir de agora, mesmo que alguém descubra sua Anon Key, 
-- não poderá ler nenhuma cifra a menos que esteja logado com o usuário dono dela.
