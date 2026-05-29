<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { Mail, Lock, LogIn, UserPlus, Info } from '@lucide/vue'

const emit = defineEmits(['auth-success'])

const isSignUp = ref(false)
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleAuth = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, preencha todos os campos.'
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    if (isSignUp.value) {
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      
      // Se a confirmação de e-mail estiver ativada no Supabase, o usuário precisa confirmar
      if (data?.user && data?.session === null) {
        successMessage.value = 'Cadastro realizado! Verifique seu e-mail para confirmação.'
      } else {
        successMessage.value = 'Cadastro realizado com sucesso!'
        emit('auth-success', data.session?.user || data.user)
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      
      successMessage.value = 'Login efetuado com sucesso!'
      emit('auth-success', data.user)
    }
  } catch (error) {
    errorMessage.value = error.message || 'Ocorreu um erro ao processar a autenticação.'
  } finally {
    loading.value = false
  }
}

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  errorMessage.value = ''
  successMessage.value = ''
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="glass-panel auth-card">
      <div class="brand-section">
        <div class="logo-glow">
          <span class="music-icon">🎵</span>
        </div>
        <h2 class="gradient-text">MusicRoll</h2>
        <p class="subtitle">Seu organizador inteligente de setlists e cifras</p>
      </div>

      <h3 class="form-title">{{ isSignUp ? 'Criar Nova Conta' : 'Entrar no MusicRoll' }}</h3>

      <form @submit.prevent="handleAuth" class="auth-form">
        <!-- Feedback Messages -->
        <div v-if="errorMessage" class="alert alert-danger-custom">
          <span class="alert-icon">⚠️</span>
          <span>{{ errorMessage }}</span>
        </div>
        <div v-if="successMessage" class="alert alert-success-custom">
          <span class="alert-icon">✓</span>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <label class="form-label" for="email">E-mail</label>
          <div class="input-with-icon">
            <Mail class="input-icon" :size="18" />
            <input 
              id="email" 
              type="email" 
              v-model="email" 
              placeholder="exemplo@email.com" 
              class="form-input"
              required 
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label class="form-label" for="password">Senha</label>
          <div class="input-with-icon">
            <Lock class="input-icon" :size="18" />
            <input 
              id="password" 
              type="password" 
              v-model="password" 
              placeholder="Sua senha secreta" 
              class="form-input"
              required 
            />
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          <template v-if="loading">
            <span class="spinner"></span>
            Carregando...
          </template>
          <template v-else>
            <component :is="isSignUp ? UserPlus : LogIn" :size="18" />
            {{ isSignUp ? 'Cadastrar' : 'Entrar' }}
          </template>
        </button>
      </form>

      <!-- Toggle Link -->
      <div class="auth-toggle">
        <span>{{ isSignUp ? 'Já possui uma conta?' : 'Novo por aqui?' }}</span>
        <button @click="toggleMode" class="btn-toggle">
          {{ isSignUp ? 'Faça login' : 'Crie uma conta' }}
        </button>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 1.5rem;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  border-radius: var(--radius-lg);
  padding: 3rem 2.5rem;
  position: relative;
  overflow: hidden;
}

.brand-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-glow {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 0 20px 5px rgba(139, 92, 246, 0.3);
}

.music-icon {
  font-size: 1.8rem;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.form-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-muted);
  pointer-events: none;
}

.form-input {
  padding-left: 2.75rem;
}

.btn-block {
  width: 100%;
  margin-top: 1rem;
}

.auth-toggle {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 1.5rem;
}

.btn-toggle {
  background: none;
  border: none;
  color: #c084fc;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}

.btn-toggle:hover {
  text-decoration: underline;
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.alert-danger-custom {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.alert-success-custom {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.alert-icon {
  font-size: 1rem;
  font-weight: bold;
}



/* Spinner animation */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
