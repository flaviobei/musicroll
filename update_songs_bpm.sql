-- ==========================================
-- SQL MIGRATION - ADICIONAR BPM ÀS MÚSICAS
-- Execute este script no SQL Editor do Supabase
-- ==========================================

ALTER TABLE public.songs 
ADD COLUMN IF NOT EXISTS bpm INTEGER NOT NULL DEFAULT 120 CHECK (bpm > 0);
