// src/composables/useDemo.js
export function useDemo() {
  const isDemo =
    !import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL.includes('seu-projeto-supabase')

  return { isDemo }
}
